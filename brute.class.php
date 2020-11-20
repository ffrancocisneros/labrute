<?php
	require_once 'random.class.php';
	require_once 'skills.class.php';
	
	class Brute {
		public $Name;
		public $Identifier;
		public $Experience;
		public $Health;
		public $Strength;
		public $Agility;
		public $Speed;
		
		private const LevelExponent = 2.3; //Same of MyBrute v1
		
		public function __construct($name, $brute_skills, $identifier = 0, $experience = 1) {
			$this->Name = $name;
			
			if ($identifier == 0) {
				$this->Identifier = Random::num(1, 999999999);
			} else {
				$this->Identifier = $identifier;
			}
			
			$this->Experience = $experience;
			
			//Set the default points for lvl 1
			$this->Health   = 50; //Real value of the genuine game (see wiki)
			$this->Strength = 2;
			$this->Agility  = 2;
			$this->Speed    = 2;
			$this->Armor    = 2;
			$this->Endurance = 3;
			$this->Initiative = 0;
			$this->MaxReceivableDamages = $this->Health;
			//For the skills, this is levels, not points
			$this->SkillArmor         = false;
			$this->SkillFirstStrike   = false;
			$this->SkillToughenedSkin = false;
			$this->SkillVitality      = false;
			$this->SkillImmortality   = false;
			$this->SkillResistant     = false;
			
			//Prepare the seed for this brute
			$seed = hash('SHA512', $this->Name.$this->Identifier);
			$seed = substr($seed, 0, 15); //More than 16 chars exceed the integer limit on PHP
			$seed = intval($seed, 16);    //Decode the hexadecimal string to a base 16 integer
			
			//Set the seed for this brute
			Random::seed($seed);
			
			//A Brute may be prone to improve one or more skills
			$oddsOfStrength = Random::num(0, 3);
			$oddsOfAgility  = Random::num($oddsOfStrength + 1, $oddsOfStrength + 5);
			$oddsOfSpeed    = Random::num($oddsOfAgility + 1, $oddsOfAgility + 5);
			
			//Get the current level for this Brute
			$level = $this->getLevel();
					
			//Get the Skills for this brute at the current level
			for ($i = 1; $i <= $level; $i++) {
				
				$stat = Random::num(0, $oddsOfSpeed);
				
				switch ($i) {
					case ($stat <= $oddsOfStrength):
						$this->Strength += Random::num(0, 3);
						break;
						
					case ($stat > $oddsOfStrength && $stat <= $oddsOfAgility):
						$this->Agility += Random::num(0, 3);
						break;
					
					case ($stat > $oddsOfAgility && $stat <= $oddsOfSpeed):
						$this->Speed += Random::num(0, 3);
						break;
				}
			}
			
			// Activate the skills owed by the brute
			$this->bindSkills($brute_skills);
			
			//Calculate the endurance *before* calculating health, because endurance affects health!
			$this->setEndurance();
			$this->setHealth($this->Health, $level);
			$this->setArmor();	
			$this->setInitiative();
			//Let this damages ceil after calculating health, because this needs the total health
			$this->setMaxReceivableDamages($this->Health, $this->SkillResistant);
		}
		
		
		public function htmlStats() {
			
			return	'Brute: '.$this->Name.'<br>' .
					'Level: '.$this->getLevel().'<br>' .
					'<strong>Main stats:</strong><br>'.
					'• Health: '.$this->Health.' pts<br>' .
					'• Strength: '.$this->Strength.' pts<br>' .
					'• Agility: '.$this->Agility.' pts<br>' .
					'• Speed: '.$this->Speed.' pts<br>' .
					'<strong>Hidden stats:</strong><br>'.
					'• Endurance: '.$this->Endurance.' pts<br>'.
					'• Inititative: '.$this->Initiative.' pts<br>'.
					"• <abbr title=\"Base armor + skill Armor + skill Toughened Skin\nReduces damages made by contact weapons\nNo effect against thrown weapons (shurikens...)\">Armor (stat)</abbr>: ".$this->Armor." pts<br>" .
					"• <abbr title=\"If the brute owns the skill 'Resistant' (Increvable), he can't lose more than 20% of his total health per received hit\">Max damages per received hit</abbr>: ".$this->MaxReceivableDamages." HP<br>" .
					'<strong>Skills levels:</strong><br>'.
					'• Armor (skill): '.$this->SkillArmor.' lvl<br>' .
					'• Toughened skin: '.$this->SkillToughenedSkin.' lvl<br>' .
					'• First strike: '.$this->SkillFirstStrike.' lvl<br>' .
					'• Immortality: '.$this->SkillImmortality.' lvl<br>'.
					'• Resistant: '.$this->SkillResistant.' lvl<br>'.
					'• Vitality: '.$this->SkillVitality.' lvl<br>'.
					'<br>';
		}
		
		
		/**
		 * Activate the skills owned by the brute
		 * @param type $brute_skills
		 */
		private function bindSkills($brute_skills) {
			
			$Skills = new Skills();
			
			foreach ($brute_skills as $brute_skill) {
				
				$Skills->checkSkill($brute_skill);				
				$property = 'Skill'.ucfirst($brute_skill);
				$this->$property = true;
			}
		}
				
		
		public function getLevel() {
			return $this->experienceToLevel($this->Experience);
		}
		
		private function levelToExperience($level) {
			return intval(pow($level, self::LevelExponent));
		}
		
		private function experienceToLevel($experience) {
			return intval(pow(($experience + 1), (1 / self::LevelExponent)));
		}
		
		
		/**
		 * Calculates the Initiative points (aptitude to start the fight)
		 */
		private function setInitiative() {
			//The skill "First strike" gives +200 initiative (real value)
			$this->Initiative = ($this->SkillFirstStrike === true) ? $this->Initiative+200 : $this->Initiative;
		}
		
				
		/**
		 * Calculates the total Armor (stat, not skill!) of the brute
		 * @return int
		 */
		private function setArmor() {			
			// The skill Armor increases the stat Armor of +5 (real value, see wiki)
			$this->Armor += (int)$this->SkillArmor*5;
			// The skill Thoughened Skin increases the stat Armor of +2 (real value, see wiki)
			$this->Armor += (int)$this->SkillToughenedSkin*2;
		}
		
		
		/**
		 * Calculates the total health points of the brute
		 * @param int $base_health Amount of HP for a rookie brute at level 1
		 * @param int $xp_level The experience level of the brute
		 * @return int
		 */
		private function setHealth($base_health, $xp_level) {			
			//That's the real formula of the original game (see wiki)
			$standard_health = floor($base_health + ($xp_level - 1) * 1.5);
			//The brute gains +1 health point every 6 Endurance points
			$complementary_health = floor($this->Endurance/6);
			
			$this->Health = $standard_health + $complementary_health;
		}
		
		
		/**
		 * Calculates the total health points of the brute
		 * @return int
		 */
		private function setEndurance() {
			//The skill Vitality gives +3 Endurance and +50% Endurance
			$this->Endurance = ($this->SkillVitality === true) ? floor(($this->Endurance+3)*1.5) : $this->Endurance;
			//The skill Immortality gives +250% Endurance
			$this->Endurance = ($this->SkillImmortality === true) ? floor($this->Endurance*2.5) : $this->Endurance;
		}
		
		
		/**
		 * Calculates the maximum damage points the brute can receive in one hit
		 * @param int $total_health The total health of the brute when the fights starts
		 * @param bool $skill_resistant "True" if the brute owns the skill "Resistant"
		 */
		private function setMaxReceivableDamages($total_health, $skill_resistant) {
			//A brute with the skill "Resistant" can't have more than 20% HP damages per hit
			$this->MaxReceivableDamages = ($skill_resistant === true) ? $total_health*0.2 : $total_health;
		}
	}
