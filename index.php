<?php
	require_once 'brute.class.php';
	require_once 'fight.class.php';
	require_once 'view.class.php';
	
	//TODO: temporary. Put here the skills owned by the brute 1.
	$brute1_skills = [
		'armor',
		'firstStrike',
		'immortality',
		'resistant',
		'toughenedSkin',
		'vitality',
		];
	// TODO: temporary. For the tests, the two brutes got the same skills
	$brute2_skills = $brute1_skills;
	
	$Brute1 = new Brute('Scorpio',         $brute1_skills, 4356246, 39673);
	$Brute2 = new Brute('Destino Planeta', $brute2_skills, 23452, 39673);
	$Fight  = new Fight();
	$View   = new View();
	
	echo $View->bruteStats($Brute1);
	echo $View->bruteStats($Brute2);
	
	$Fight->doFight($Brute1, $Brute2);
