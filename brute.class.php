<?php
	require_once('random.class.php');
	
	class Brute {
		public $Name;
		public $Identifier;
		public $Experience;
		public $Health;
		public $Strength;
		public $Agility;
		public $Speed;
		
		private const LevelExponent = 2.3; //Same of MyBrute v1
		
		public function __construct($name, $identifier = 0, $experience = 1) {
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
			//For the skills, this is levels, not points
			$this->SkillArmor         = false;
			$this->SkillToughenedSkin = false;
			$this->SkillVitality      = false;
			
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
			
			// TODO: temporary values to simulate upgrades levels of these skills.
			// This is the *skill* Armor (bonus), not to be confused with the *stat* Armor (total).
			$this->SkillArmor = true;
			$this->SkillToughenedSkin = true;
			$this->SkillVitality = true;
			
			// The skill Armor increases the stat Armor of +5 (real value, see wiki)
			$this->Armor = $this->Armor + (int)$this->SkillArmor*5;
			// The skill Thoughened Skin increases the stat Armor of +2 (real value, see wiki)
			$this->Armor = $this->Armor + (int)$this->SkillToughenedSkin*2;
			
			//Calculate the endurance *before* calculating health, because endurance affects health!
			$this->Endurance = $this->getEndurance();
			$this->Health = $this->getHealth($this->Health, $level);
			
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
					'• Endurance: '.$this->Endurance.'<br>'.
					"• <abbr title=\"Base armor + skill Armor + skill Toughened Skin\nReduces damages made by contact weapons\nNo effect against thrown weapons (shurikens...)\">Armor (stat)</abbr>: ".$this->Armor." pts<br>" .
					'<strong>Skills levels:</strong><br>'.
					'• Armor (skill): '.$this->SkillArmor.' lvl<br>' .
					'• Toughened skin: '.$this->SkillToughenedSkin.' lvl<br>' .
					'• Vitality: '.$this->SkillVitality.' lvl<br>'.
					'<br>';
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
		 * Calculates the total health points of the brute
		 * @param int $base_health Amount of HP for a rookie brute at level 1
		 * @param int $xp_level The experience level of the brute
		 * @return int
		 */
		private function getHealth($base_health, $xp_level) {
			
			//That's the real formula of the original game (see wiki)
			$standard_health = floor($base_health + ($xp_level - 1) * 1.5);
			//The brute gains +1 health point every 6 Endurance points
			$complementary_health = floor($this->Endurance/6);
			
			return $standard_health + $complementary_health;
		}
		
		
		/**
		 * Calculates the total health points of the brute
		 * @return int
		 */
		private function getEndurance() {
			//The skill Vitality gives +3 Endurance and +50% Endurance
			return $this->Endurance = ($this->SkillVitality === true) ? ($this->Endurance+3)*1.5 : $this->Endurance;
		}
	}
