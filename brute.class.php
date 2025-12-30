<?php
require_once __DIR__ . '/random.class.php';
require_once __DIR__ . '/skills.class.php';
require_once __DIR__ . '/includes/db.php';

class Brute {
    public $Id;
    public $UserId;
    public $Name;
    public $Identifier;
    public $Experience;
    public $Level;
    public $Health;
    public $Strength;
    public $Agility;
    public $Speed;
    public $Armor;
    public $Endurance;
    public $Initiative;
    public $MaxReceivableDamages;
    public $Skills;
    public $Wins;
    public $Losses;
    
    private const LevelExponent = 2.3; // Same as MyBrute v1
    
    /**
     * Create a new Brute instance
     * @param string $name Brute's name
     * @param array $brute_skills Array of skill aliases
     * @param int $identifier Unique identifier (0 = generate random)
     * @param int $experience Experience points
     * @param int|null $userId Owner user ID (for database storage)
     * @param int|null $id Database ID (if loading from DB)
     */
    public function __construct(
        string $name, 
        array $brute_skills = [], 
        int $identifier = 0, 
        int $experience = 1,
        ?int $userId = null,
        ?int $id = null
    ) {
        $this->Id = $id;
        $this->UserId = $userId;
        $this->Name = $name;
        
        if ($identifier == 0) {
            $this->Identifier = Random::num(1, 999999999);
        } else {
            $this->Identifier = $identifier;
        }
        
        $this->Experience = $experience;
        
        // Set the default points for lvl 1
        $this->Health = 50;
        $this->Strength = 2;
        $this->Agility = 2;
        $this->Speed = 2;
        $this->Armor = 2;
        $this->Endurance = 3;
        $this->Initiative = 0;
        $this->MaxReceivableDamages = $this->Health;
        $this->Wins = 0;
        $this->Losses = 0;
        
        // Prepare the seed for this brute
        $seed = hash('SHA512', $this->Name . $this->Identifier);
        $seed = substr($seed, 0, 15);
        $seed = intval($seed, 16);
        
        Random::seed($seed);
        
        // A Brute may be prone to improve one or more skills
        $oddsOfStrength = Random::num(0, 3);
        $oddsOfAgility = Random::num($oddsOfStrength + 1, $oddsOfStrength + 5);
        $oddsOfSpeed = Random::num($oddsOfAgility + 1, $oddsOfAgility + 5);
        
        // Get the current level for this Brute
        $this->Level = $this->getLevel();
        
        // Get the Skills for this brute at the current level
        for ($i = 1; $i <= $this->Level; $i++) {
            $stat = Random::num(0, $oddsOfSpeed);
            
            switch (true) {
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
        
        // Activate the skills owned by the brute
        $this->Skills = $this->getBruteSkills($brute_skills);
        
        // Calculate stats with skills effects
        $this->setEndurance();
        $this->setHealth($this->Health, $this->Level);
        $this->setArmor();
        $this->setInitiative();
        $this->setMaxReceivableDamages($this->Health, $this->Skills->Resistant);
    }
    
    /**
     * Create a new brute for a user and save to database
     */
    public static function create(int $userId, string $name, array $skills = []): ?Brute {
        // Validate name
        $name = trim($name);
        if (strlen($name) < 2 || strlen($name) > 50) {
            throw new Exception('El nombre del brute debe tener entre 2 y 50 caracteres.');
        }
        
        // Check if user already has a brute with this name
        $existing = db()->queryOne(
            'SELECT id FROM brutes WHERE user_id = ? AND LOWER(name) = LOWER(?)',
            [$userId, $name]
        );
        if ($existing) {
            throw new Exception('Ya tienes un brute con ese nombre.');
        }
        
        // Create the brute
        $identifier = Random::num(1, 999999999);
        $brute = new Brute($name, $skills, $identifier, 1, $userId);
        
        // Save to database
        $id = db()->insert(
            'INSERT INTO brutes (user_id, name, identifier, experience, level, health, strength, agility, speed, armor, endurance, initiative, max_receivable_damages) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $userId,
                $brute->Name,
                $brute->Identifier,
                $brute->Experience,
                $brute->Level,
                $brute->Health,
                $brute->Strength,
                $brute->Agility,
                $brute->Speed,
                $brute->Armor,
                $brute->Endurance,
                $brute->Initiative,
                $brute->MaxReceivableDamages
            ]
        );
        
        // Get the inserted brute
        $bruteData = db()->queryOne('SELECT * FROM brutes WHERE user_id = ? AND name = ?', [$userId, $name]);
        if ($bruteData) {
            $brute->Id = $bruteData['id'];
            
            // Save skills
            foreach ($skills as $skillAlias) {
                $skill = db()->queryOne('SELECT id FROM skills WHERE alias = ?', [$skillAlias]);
                if ($skill) {
                    db()->insert(
                        'INSERT INTO brute_skills (brute_id, skill_id) VALUES (?, ?) ON CONFLICT DO NOTHING',
                        [$brute->Id, $skill['id']]
                    );
                }
            }
        }
        
        return $brute;
    }
    
    /**
     * Load a brute from database by ID
     */
    public static function loadById(int $id): ?Brute {
        $data = db()->queryOne('SELECT * FROM brutes WHERE id = ?', [$id]);
        if (!$data) {
            return null;
        }
        return self::fromDatabaseRow($data);
    }
    
    /**
     * Load a brute from database by name
     */
    public static function loadByName(string $name): ?Brute {
        $data = db()->queryOne('SELECT * FROM brutes WHERE LOWER(name) = LOWER(?)', [trim($name)]);
        if (!$data) {
            return null;
        }
        return self::fromDatabaseRow($data);
    }
    
    /**
     * Load all brutes for a user
     */
    public static function loadByUserId(int $userId): array {
        $rows = db()->query('SELECT * FROM brutes WHERE user_id = ? ORDER BY created_at DESC', [$userId]);
        $brutes = [];
        foreach ($rows as $row) {
            $brutes[] = self::fromDatabaseRow($row);
        }
        return $brutes;
    }
    
    /**
     * Create a Brute instance from a database row
     */
    private static function fromDatabaseRow(array $data): Brute {
        // Load skills for this brute
        $skillRows = db()->query(
            'SELECT s.alias FROM brute_skills bs JOIN skills s ON bs.skill_id = s.id WHERE bs.brute_id = ?',
            [$data['id']]
        );
        $skills = array_column($skillRows, 'alias');
        
        $brute = new Brute(
            $data['name'],
            $skills,
            (int) $data['identifier'],
            (int) $data['experience'],
            (int) $data['user_id'],
            (int) $data['id']
        );
        
        // Override with stored values
        $brute->Wins = (int) $data['wins'];
        $brute->Losses = (int) $data['losses'];
        
        return $brute;
    }
    
    /**
     * Save brute changes to database
     */
    public function save(): bool {
        if (!$this->Id) {
            throw new Exception('Cannot save brute without ID. Use Brute::create() for new brutes.');
        }
        
        return db()->execute(
            'UPDATE brutes SET 
                experience = ?, level = ?, health = ?, strength = ?, agility = ?, 
                speed = ?, armor = ?, endurance = ?, initiative = ?, max_receivable_damages = ?,
                wins = ?, losses = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?',
            [
                $this->Experience,
                $this->Level,
                $this->Health,
                $this->Strength,
                $this->Agility,
                $this->Speed,
                $this->Armor,
                $this->Endurance,
                $this->Initiative,
                $this->MaxReceivableDamages,
                $this->Wins,
                $this->Losses,
                $this->Id
            ]
        ) > 0;
    }
    
    /**
     * Delete brute from database
     */
    public function delete(): bool {
        if (!$this->Id) {
            return false;
        }
        return db()->execute('DELETE FROM brutes WHERE id = ?', [$this->Id]) > 0;
    }
    
    /**
     * Add experience points and level up if needed
     */
    public function addExperience(int $amount): bool {
        $this->Experience += $amount;
        $newLevel = $this->experienceToLevel($this->Experience);
        
        $leveledUp = $newLevel > $this->Level;
        $this->Level = $newLevel;
        
        if ($this->Id) {
            $this->save();
        }
        
        return $leveledUp;
    }
    
    /**
     * Record a win
     */
    public function recordWin(int $expGained = 0): void {
        $this->Wins++;
        if ($expGained > 0) {
            $this->addExperience($expGained);
        } elseif ($this->Id) {
            $this->save();
        }
    }
    
    /**
     * Record a loss
     */
    public function recordLoss(int $expGained = 0): void {
        $this->Losses++;
        if ($expGained > 0) {
            $this->addExperience($expGained);
        } elseif ($this->Id) {
            $this->save();
        }
    }
    
    /**
     * Get random opponents for this brute
     */
    public function getOpponents(int $limit = 5): array {
        if (!$this->Id) {
            return [];
        }
        
        // Find brutes around same level (±2 levels)
        $rows = db()->query(
            'SELECT * FROM brutes 
             WHERE id != ? AND level BETWEEN ? AND ?
             ORDER BY RANDOM() LIMIT ?',
            [$this->Id, max(1, $this->Level - 2), $this->Level + 2, $limit]
        );
        
        $opponents = [];
        foreach ($rows as $row) {
            $opponents[] = self::fromDatabaseRow($row);
        }
        
        return $opponents;
    }
    
    /**
     * Get skill aliases as array
     */
    public function getSkillAliases(): array {
        $skills = [];
        $skillsObj = new Skills();
        foreach ($skillsObj->AvailableSkills as $alias) {
            $property = ucfirst($alias);
            if (isset($this->Skills->$property) && $this->Skills->$property === true) {
                $skills[] = $alias;
            }
        }
        return $skills;
    }
    
    /**
     * Convert brute to array (for JSON serialization)
     */
    public function toArray(): array {
        return [
            'id' => $this->Id,
            'user_id' => $this->UserId,
            'name' => $this->Name,
            'identifier' => $this->Identifier,
            'experience' => $this->Experience,
            'level' => $this->Level,
            'health' => $this->Health,
            'strength' => $this->Strength,
            'agility' => $this->Agility,
            'speed' => $this->Speed,
            'armor' => $this->Armor,
            'endurance' => $this->Endurance,
            'initiative' => $this->Initiative,
            'max_receivable_damages' => $this->MaxReceivableDamages,
            'wins' => $this->Wins,
            'losses' => $this->Losses,
            'skills' => $this->getSkillAliases()
        ];
    }
    
    /**
     * Activate the skills owned by the brute
     */
    private function getBruteSkills(array $brute_skills): object {
        $Skills = new Skills();
        $Result = $Skills->getDefaultSkills();
        
        foreach ($brute_skills as $brute_skill) {
            $Skills->checkSkill($brute_skill);
            $property = ucfirst($brute_skill);
            $Result->$property = true;
        }
        
        return $Result;
    }
    
    public function getLevel(): int {
        return $this->experienceToLevel($this->Experience);
    }
    
    private function levelToExperience(int $level): int {
        return intval(pow($level, self::LevelExponent));
    }
    
    private function experienceToLevel(int $experience): int {
        return intval(pow(($experience + 1), (1 / self::LevelExponent)));
    }
    
    private function setInitiative(): void {
        $this->Initiative = $this->Initiative + (int)$this->Skills->FirstStrike * 200;
    }
    
    private function setArmor(): void {
        $this->Armor += (int)$this->Skills->Armor * 5;
        $this->Armor += (int)$this->Skills->ToughenedSkin * 2;
    }
    
    private function setHealth(int $base_health, int $xp_level): void {
        $standard_health = floor($base_health + ($xp_level - 1) * 1.5);
        $complementary_health = floor($this->Endurance / 6);
        $this->Health = (int) ($standard_health + $complementary_health);
    }
    
    private function setEndurance(): void {
        $this->Endurance = ($this->Skills->Vitality === true) 
            ? (int) floor(($this->Endurance + 3) * 1.5) 
            : $this->Endurance;
        $this->Endurance = ($this->Skills->Immortality === true) 
            ? (int) floor($this->Endurance * 2.5) 
            : $this->Endurance;
    }
    
    private function setMaxReceivableDamages(int $total_health, bool $skill_resistant): void {
        $this->MaxReceivableDamages = ($skill_resistant === true) 
            ? (int) ($total_health * 0.2) 
            : $total_health;
    }
}
