<?php
	require_once('random.class.php');
	
	class Fight {
		private static $Actions = array(
			0 => array('Puñetazo', 5), 
			1 => array('Patada', 10), 
			2 => array('Shuriken', 15), 
			3 => array('Puñalada', 20), 
		);
		
		public static function doFight($attacker, $attacked) {
			//Prepare the seed for this fight
			$seed = hash('SHA512', $attacker->Name.$attacker->Experience.$attacked->Name.$attacked->Experience);
			$seed = substr($seed, 0, 15); //More than 16 chars exceed the integer limit on PHP
			$seed = intval($seed, 16);    //Decode the hexadecimal string to a base 16 integer
			
			Random::seed($seed);
			
			$hit = 1;
			
			while ($attacker->Health > 0 && $attacked->Health > 0) {
				$action = Random::num(0, 3);
				
				//The attacker hit on even and the attacked on odd
				if (($hit % 2) != 0) {
					$attacked->Health -= intval(self::$Actions[$action][1] + ($attacker->Strength * ($attacker->Strength / 100)));
					
					echo '"'.$attacker->Name.'" dio un/a "'.self::$Actions[$action][0].'" a "'.$attacked->Name.'" restandole '.intval(self::$Actions[$action][1] + ($attacker->Strength * ($attacker->Strength / 100))).' puntos de vida! (Le quedan '.$attacked->Health.' puntos de vida)'.'<br>';
					
					if ($attacked->Health <= 0) {
						echo '"'.$attacker->Name.'" ha ganado la pelea!'.'<br>';
					}
				} else {
					$attacker->Health -= intval(self::$Actions[$action][1] + ($attacked->Strength * ($attacked->Strength / 100)));
					
					echo '"'.$attacked->Name.'" dio un/a "'.self::$Actions[$action][0].'" a "'.$attacker->Name.'" restandole '.intval(self::$Actions[$action][1] + ($attacked->Strength * ($attacked->Strength / 100))).' puntos de vida! (Le quedan '.$attacker->Health.' puntos de vida)'.'<br>';
					
					if ($attacker->Health <= 0) {
						echo '"'.$attacked->Name.'" ha ganado la pelea!'.'<br>';
					}
				}
				
				$hit++;
			}
			
			return true;
		}
	}
?>