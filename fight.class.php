<?php
	require_once('random.class.php');
	
	class Fight {
		
		public static function doFight($attacker, $attacked) {
			
			// Choose a language among the available ones in the /config files
			$lang = "es";			
			$weapons = self::getWeapons();			
			//Prepare the seed for this fight, so the replay will give the same result.
			$seed = hash('SHA512', $attacker->Name.$attacker->Experience.$attacked->Name.$attacked->Experience);
			$seed = substr($seed, 0, 15); //More than 16 chars exceed the integer limit on PHP
			$seed = intval($seed, 16);    //Decode the hexadecimal string to a base 16 integer
			
			Random::seed($seed);
			
			$hit = 1;
			
			while ($attacker->Health > 0 && $attacked->Health > 0) {
				
				$rand_key = Random::num(0, count($weapons)-1);
				$weapon = array_keys($weapons)[$rand_key];
				$weapon_name = $weapons[$weapon]["name"][$lang];
				
				//The attacker hit on even and the attacked on odd
				if (($hit % 2) != 0) {
					$origin = $attacker;
					$target = $attacked;
				} else {
					$origin = $attacked;
					$target = $attacker;
				}
				
				$weapon_damage   = Random::num($weapons[$weapon]["damageMin"], $weapons[$weapon]["damageMax"]);
				$lost_health     = intval($weapon_damage + ($origin->Strength * ($origin->Strength / 100)));
				$target->Health -= $lost_health;
				
				echo '"'.$origin->Name.'" dio un/a "'.$weapon_name.'" a "'.$target->Name.'" restandole '.$lost_health.' puntos de vida! (Le quedan '.$target->Health.' puntos de vida)'.'<br>';
				echo '<div style="margin:0 0 0.5em 2em;color:grey">'
					. 'Details: '.$weapon_name.' makes '.$weapon_damage.' damage points '
					. '(randomly taken in the range '.$weapons[$weapon]["damageMin"].'-'.$weapons[$weapon]["damageMax"].')'
					. '</div>';
				
				if ($target->Health <= 0) {
					echo '"'.$origin->Name.'" ha ganado la pelea!'.'<br>';
				}
				
				$hit++;
			}
			
			return true;
		}
		
		
		/**
		 * Get the characteristics of all the weapons of the game (name, damages...)
		 * @return array
		 */
		private static function getWeapons() {
			
			$text_data = file_get_contents('config/weapons.json');
			return json_decode($text_data, JSON_OBJECT_AS_ARRAY)['data'];
		}
	}
?>
