<?php
	require_once('random.class.php');
	
	class Fight {
		
		public function doFight($attacker, $attacked) {
			
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
				$weapon_img  = '<img src="resources/img/'.$weapon.'.png" alt="'.$weapon.'">';
				
				//The attacker hit on even and the attacked on odd
				if (($hit % 2) != 0) {
					$origin = $attacker;
					$target = $attacked;
				} else {
					$origin = $attacked;
					$target = $attacker;
				}
				
				$armor_bonus = $this->getArmorBonus($attacked->Armor, $weapons[$weapon]['type']);
				
				$weapon_damage   = Random::num($weapons[$weapon]["damageMin"], $weapons[$weapon]["damageMax"]);
				$lost_health     = intval($weapon_damage - $armor_bonus + ($origin->Strength * ($origin->Strength / 100)));
				$lost_health     = min($target->MaxReceivableDamages, $lost_health);
				$target->Health -= $lost_health;
				
				echo '"'.$origin->Name.'" dio un/a '.$weapon_img.' <em>'.$weapon_name.'</em> a "'.$target->Name.'" restandole '.$lost_health.' puntos de vida! (Le quedan '.$target->Health.' puntos de vida)'.'<br>';
				echo '<div style="margin:0 0 0.5em 2em;color:grey">'
					. 'Details:<br>'
					. 'Weapon '.$weapon_name.': '.$weapon_damage.' damages '
					. '(randomly taken in the range '.$weapons[$weapon]["damageMin"].'-'.$weapons[$weapon]["damageMax"].')'
					. '<br>Armor bonus: <abbr title="Note: the Armor has no effect against a thrown weapon (shuriken...)">-' . $armor_bonus . ' damages</abbr>'
					. '<br>Resistance bonus: max '.$target->MaxReceivableDamages.' HP lost per received hit'
				    . '</div>';
				
				if ($target->Health <= 0) {
					echo '"'.$origin->Name.'" ha ganado la pelea!'.'<br>';
				}
				
				$hit++;
			}
			
			return true;
		}
		
		
		/**
		 * Calculates the real armor points for this fight (depends on the weapon type)
		 * @param int $total_armor The total stat Armor of the defender (including skills bonuses)
		 * @param int $weapon_type The type of weapon used (thrown, heavy, sharp...)
		 * @return int
		 */
		private function getArmorBonus($total_armor, $weapon_type) {
			
			$armor_bonus = 0;
			
			// The armor is useless against the thrown weapons
			if ($weapon_type !== 'thrown') {
				$armor_bonus = $total_armor;
			}
			
			return $armor_bonus;
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
