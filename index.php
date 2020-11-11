<?php
	require_once('brute.class.php');
	require_once('fight.class.php');
	
	$Brute1 = new Brute('Scorpio', 4356246, 39673);
	$Brute2 = new Brute('Destino Planeta', 23452, 39673);
	
	Fight::doFight($Brute1, $Brute2);
?>