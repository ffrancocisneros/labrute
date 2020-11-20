<?php

class Skills {
	
	// All the skills existing in the game
	public $AvailableSkills = [
			'armor', // Skill armor, not to be confused with the *stat* Armor
			'firstStrike',
			'immortality',
			'resistant',
			'toughenedSkin',
			'vitality',
			];
	
	
	/**
	 * Checks that a skill we try to bind to a brute is allowed 
	 * @param string $skill_alias The alias of the skill (e.g.: "resistant")
	 * @throws Exception
	 */
	public function checkSkill($skill_alias) {
		
		if (!in_array($skill_alias, $this->AvailableSkills)) {
			throw new Exception('The skill "'.$skill_alias.'" does not exists in the skills list');
		}
	}
}
