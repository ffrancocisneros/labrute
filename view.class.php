<?php

class View {
	
	/**
	 * Displays the stats of a brute
	 * @param object $Brute An object produced by the class Brute()
	 * @return string HTML
	 */
	public function bruteStats($Brute) {

		return	'Brute: '.$Brute->Name.'<br>' .
			'Level: '.$Brute->getLevel().'<br>' .
			'<strong>Main stats:</strong><br>'.
			'• Health: '.$Brute->Health.' pts<br>' .
			'• Strength: '.$Brute->Strength.' pts<br>' .
			'• Agility: '.$Brute->Agility.' pts<br>' .
			'• Speed: '.$Brute->Speed.' pts<br>' .
			'<strong>Hidden stats:</strong><br>'.
			'• Endurance: '.$Brute->Endurance.' pts<br>'.
			'• Inititative: '.$Brute->Initiative.' pts<br>'.
			"• <abbr title=\"Base armor + skill Armor + skill Toughened Skin\nReduces damages made by contact weapons\nNo effect against thrown weapons (shurikens...)\">Armor (stat)</abbr>: ".$Brute->Armor." pts<br>" .
			"• <abbr title=\"If the brute owns the skill 'Resistant' (Increvable), he can't lose more than 20% of his total health per received hit\">Max damages per received hit</abbr>: ".$Brute->MaxReceivableDamages." HP<br>" .
			'<strong>Skills levels:</strong><br>'.
			'• Armor (skill): '.$Brute->Skills->Armor.' lvl<br>' .
			'• Toughened skin: '.$Brute->Skills->ToughenedSkin.' lvl<br>' .
			'• First strike: '.$Brute->Skills->FirstStrike.' lvl<br>' .
			'• Immortality: '.$Brute->Skills->Immortality.' lvl<br>'.
			'• Resistant: '.$Brute->Skills->Resistant.' lvl<br>'.
			'• Vitality: '.$Brute->Skills->Vitality.' lvl<br>'.
			'<br>';
	}
}
