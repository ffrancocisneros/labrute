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
			$this->Health   = 100;
			$this->Strength = 2;
			$this->Agility  = 2;
			$this->Speed    = 2;
			
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
				$this->Health += Random::num(0, 5);
				
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
			
			echo 'Brute: '.$this->Name.'<br>';
			echo 'Level: '.$level.'<br>';
			echo 'Health: '.$this->Health.'<br>';
			echo 'Strength: '.$this->Strength.'<br>';
			echo 'Agility: '.$this->Agility.'<br>';
			echo 'Speed: '.$this->Speed.'<br><br>';
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
	}
?>