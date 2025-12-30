<?php
require_once __DIR__ . '/random.class.php';
require_once __DIR__ . '/includes/db.php';

class Fight {
    public $Id;
    public $Brute1;
    public $Brute2;
    public $Winner;
    public $FightLog;
    public $FightSeed;
    public $DurationHits;
    public $WinnerExpGained;
    public $LoserExpGained;
    
    private $lang = 'es';
    private $weapons;
    
    public function __construct(?Brute $brute1 = null, ?Brute $brute2 = null) {
        $this->Brute1 = $brute1;
        $this->Brute2 = $brute2;
        $this->FightLog = [];
        $this->weapons = self::getWeapons();
    }
    
    /**
     * Execute a fight between two brutes
     * @return array Fight result with log and winner
     */
    public function doFight(?Brute $attacker = null, ?Brute $attacked = null): array {
        $attacker = $attacker ?? $this->Brute1;
        $attacked = $attacked ?? $this->Brute2;
        
        if (!$attacker || !$attacked) {
            throw new Exception('Se necesitan dos brutes para pelear.');
        }
        
        $this->Brute1 = $attacker;
        $this->Brute2 = $attacked;
        $this->FightLog = [];
        
        // Clone brutes for the fight (to not modify original health)
        $fighter1 = clone $attacker;
        $fighter2 = clone $attacked;
        
        // Prepare the seed for this fight
        $seed = hash('SHA512', $attacker->Name . $attacker->Experience . $attacked->Name . $attacked->Experience . time());
        $seed = substr($seed, 0, 15);
        $this->FightSeed = intval($seed, 16);
        
        Random::seed($this->FightSeed);
        
        // Determine who strikes first based on initiative
        $fighter1StartsFirst = $fighter1->Initiative >= $fighter2->Initiative;
        if ($fighter1->Initiative == $fighter2->Initiative) {
            $fighter1StartsFirst = Random::num(0, 1) == 0;
        }
        
        $hit = 1;
        $maxHits = 100; // Prevent infinite loops
        
        while ($fighter1->Health > 0 && $fighter2->Health > 0 && $hit <= $maxHits) {
            $rand_key = Random::num(0, count($this->weapons) - 1);
            $weaponKey = array_keys($this->weapons)[$rand_key];
            $weapon = $this->weapons[$weaponKey];
            $weapon_name = $weapon['name'][$this->lang] ?? $weapon['name']['en'] ?? $weaponKey;
            
            // Determine attacker and defender for this hit
            if ($fighter1StartsFirst) {
                $isOddHit = ($hit % 2) != 0;
                $origin = $isOddHit ? $fighter1 : $fighter2;
                $target = $isOddHit ? $fighter2 : $fighter1;
            } else {
                $isOddHit = ($hit % 2) != 0;
                $origin = $isOddHit ? $fighter2 : $fighter1;
                $target = $isOddHit ? $fighter1 : $fighter2;
            }
            
            $armor_bonus = $this->getArmorBonus($target->Armor, $weapon['type']);
            $weapon_damage = Random::num($weapon['damageMin'], $weapon['damageMax']);
            $strength_bonus = intval($origin->Strength * ($origin->Strength / 100));
            $lost_health = max(1, intval($weapon_damage - $armor_bonus + $strength_bonus));
            $lost_health = min($target->MaxReceivableDamages, $lost_health);
            $target->Health -= $lost_health;
            
            // Log this hit
            $logEntry = [
                'hit' => $hit,
                'attacker' => $origin->Name,
                'defender' => $target->Name,
                'weapon' => $weaponKey,
                'weapon_name' => $weapon_name,
                'damage' => $lost_health,
                'weapon_base_damage' => $weapon_damage,
                'armor_reduction' => $armor_bonus,
                'strength_bonus' => $strength_bonus,
                'defender_health_remaining' => max(0, $target->Health),
                'is_knockout' => $target->Health <= 0
            ];
            
            $this->FightLog[] = $logEntry;
            
            $hit++;
        }
        
        $this->DurationHits = $hit - 1;
        
        // Determine winner
        if ($fighter1->Health > 0) {
            $this->Winner = $this->Brute1;
            $loser = $this->Brute2;
        } else {
            $this->Winner = $this->Brute2;
            $loser = $this->Brute1;
        }
        
        // Calculate experience gained
        $this->WinnerExpGained = $this->calculateExpGained($this->Winner, $loser, true);
        $this->LoserExpGained = $this->calculateExpGained($loser, $this->Winner, false);
        
        // Save to database if brutes have IDs
        if ($this->Brute1->Id && $this->Brute2->Id) {
            $this->save();
            
            // Update brute stats
            if ($this->Winner->Id === $this->Brute1->Id) {
                $this->Brute1->recordWin($this->WinnerExpGained);
                $this->Brute2->recordLoss($this->LoserExpGained);
            } else {
                $this->Brute2->recordWin($this->WinnerExpGained);
                $this->Brute1->recordLoss($this->LoserExpGained);
            }
        }
        
        return $this->getResult();
    }
    
    /**
     * Calculate experience gained from fight
     */
    private function calculateExpGained(Brute $brute, Brute $opponent, bool $isWinner): int {
        $levelDiff = $opponent->Level - $brute->Level;
        $baseExp = $isWinner ? 2 : 1;
        
        // Bonus for fighting higher level opponents
        if ($levelDiff > 0) {
            $baseExp += $levelDiff;
        }
        
        return max(1, $baseExp);
    }
    
    /**
     * Save fight to database
     */
    public function save(): bool {
        if (!$this->Brute1->Id || !$this->Brute2->Id) {
            return false;
        }
        
        $brute1Stats = json_encode($this->Brute1->toArray());
        $brute2Stats = json_encode($this->Brute2->toArray());
        $fightLog = json_encode($this->FightLog);
        
        db()->insert(
            'INSERT INTO fights (brute1_id, brute2_id, winner_id, fight_seed, brute1_stats, brute2_stats, fight_log, winner_exp_gained, loser_exp_gained, duration_hits)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $this->Brute1->Id,
                $this->Brute2->Id,
                $this->Winner->Id,
                $this->FightSeed,
                $brute1Stats,
                $brute2Stats,
                $fightLog,
                $this->WinnerExpGained,
                $this->LoserExpGained,
                $this->DurationHits
            ]
        );
        
        // Get the inserted ID
        $fight = db()->queryOne(
            'SELECT id FROM fights WHERE brute1_id = ? AND brute2_id = ? ORDER BY created_at DESC LIMIT 1',
            [$this->Brute1->Id, $this->Brute2->Id]
        );
        
        if ($fight) {
            $this->Id = $fight['id'];
        }
        
        return true;
    }
    
    /**
     * Load a fight from database
     */
    public static function loadById(int $id): ?Fight {
        $data = db()->queryOne('SELECT * FROM fights WHERE id = ?', [$id]);
        if (!$data) {
            return null;
        }
        
        $fight = new Fight();
        $fight->Id = (int) $data['id'];
        $fight->FightSeed = (int) $data['fight_seed'];
        $fight->FightLog = json_decode($data['fight_log'], true) ?? [];
        $fight->DurationHits = (int) $data['duration_hits'];
        $fight->WinnerExpGained = (int) $data['winner_exp_gained'];
        $fight->LoserExpGained = (int) $data['loser_exp_gained'];
        
        // Load brutes
        $fight->Brute1 = Brute::loadById((int) $data['brute1_id']);
        $fight->Brute2 = Brute::loadById((int) $data['brute2_id']);
        
        if ($data['winner_id']) {
            $fight->Winner = $data['winner_id'] == $data['brute1_id'] ? $fight->Brute1 : $fight->Brute2;
        }
        
        return $fight;
    }
    
    /**
     * Get recent fights for a brute
     */
    public static function getRecentFights(int $bruteId, int $limit = 10): array {
        return db()->query(
            'SELECT f.*, 
                    b1.name as brute1_name, b2.name as brute2_name,
                    w.name as winner_name
             FROM fights f
             LEFT JOIN brutes b1 ON f.brute1_id = b1.id
             LEFT JOIN brutes b2 ON f.brute2_id = b2.id
             LEFT JOIN brutes w ON f.winner_id = w.id
             WHERE f.brute1_id = ? OR f.brute2_id = ?
             ORDER BY f.created_at DESC
             LIMIT ?',
            [$bruteId, $bruteId, $limit]
        );
    }
    
    /**
     * Get fight result as array
     */
    public function getResult(): array {
        return [
            'id' => $this->Id,
            'winner' => $this->Winner ? [
                'id' => $this->Winner->Id,
                'name' => $this->Winner->Name
            ] : null,
            'loser' => $this->Winner === $this->Brute1 ? [
                'id' => $this->Brute2->Id,
                'name' => $this->Brute2->Name
            ] : [
                'id' => $this->Brute1->Id,
                'name' => $this->Brute1->Name
            ],
            'duration_hits' => $this->DurationHits,
            'winner_exp_gained' => $this->WinnerExpGained,
            'loser_exp_gained' => $this->LoserExpGained,
            'log' => $this->FightLog
        ];
    }
    
    /**
     * Render fight as HTML
     */
    public function renderHtml(): string {
        $html = '<div class="fight-log">';
        
        foreach ($this->FightLog as $entry) {
            $isKnockout = $entry['is_knockout'] ? ' knockout' : '';
            $html .= sprintf(
                '<div class="fight-hit%s">
                    <span class="hit-number">#%d</span>
                    <strong>%s</strong> ataca a <strong>%s</strong> con 
                    <img src="resources/img/%s.png" alt="%s" class="weapon-icon"> 
                    <em>%s</em>
                    <span class="damage">-%d HP</span>
                    <span class="remaining">(%d HP restantes)</span>
                </div>',
                $isKnockout,
                $entry['hit'],
                htmlspecialchars($entry['attacker']),
                htmlspecialchars($entry['defender']),
                htmlspecialchars($entry['weapon']),
                htmlspecialchars($entry['weapon_name']),
                htmlspecialchars($entry['weapon_name']),
                $entry['damage'],
                $entry['defender_health_remaining']
            );
            
            if ($entry['is_knockout']) {
                $html .= sprintf(
                    '<div class="fight-result winner">
                        <strong>¡%s ha ganado la pelea!</strong>
                    </div>',
                    htmlspecialchars($entry['attacker'])
                );
            }
        }
        
        $html .= '</div>';
        
        // Summary
        $html .= sprintf(
            '<div class="fight-summary">
                <p>La pelea duró <strong>%d</strong> golpes.</p>
                <p>%s ganó <strong>+%d XP</strong></p>
                <p>%s ganó <strong>+%d XP</strong></p>
            </div>',
            $this->DurationHits,
            htmlspecialchars($this->Winner->Name),
            $this->WinnerExpGained,
            htmlspecialchars($this->Winner === $this->Brute1 ? $this->Brute2->Name : $this->Brute1->Name),
            $this->LoserExpGained
        );
        
        return $html;
    }
    
    /**
     * Calculates the real armor points for this fight
     */
    private function getArmorBonus(int $total_armor, string $weapon_type): int {
        // The armor is useless against thrown weapons
        if ($weapon_type === 'thrown') {
            return 0;
        }
        return $total_armor;
    }
    
    /**
     * Get the characteristics of all weapons
     */
    private static function getWeapons(): array {
        $text_data = file_get_contents(__DIR__ . '/config/weapons.json');
        return json_decode($text_data, true)['data'] ?? [];
    }
}
