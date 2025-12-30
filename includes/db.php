<?php
/**
 * Database Connection Class
 * Singleton pattern for PDO connection
 */

require_once __DIR__ . '/../config/database.php';

class Database {
    private static $instance = null;
    private $pdo = null;
    
    private function __construct() {
        // Lazy connection - don't connect until needed
    }
    
    /**
     * Get or create PDO connection (lazy loading)
     */
    private function getPDO(): PDO {
        if ($this->pdo === null) {
            try {
                $this->pdo = new PDO(
                    DB_DSN,
                    DB_CONNECTION_USER,
                    DB_CONNECTION_PASS,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]
                );
            } catch (PDOException $e) {
                if (APP_DEBUG) {
                    throw new Exception('Database connection failed: ' . $e->getMessage());
                } else {
                    throw new Exception('Database connection failed. Please try again later.');
                }
            }
        }
        return $this->pdo;
    }
    
    /**
     * Get database instance (singleton)
     */
    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Get PDO connection
     */
    public function getConnection(): PDO {
        return $this->getPDO();
    }
    
    /**
     * Execute a query and return all results
     */
    public function query(string $sql, array $params = []): array {
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    /**
     * Execute a query and return single row
     */
    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetch();
        return $result ?: null;
    }
    
    /**
     * Execute a query and return the last insert ID
     */
    public function insert(string $sql, array $params = []): int {
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute($params);
        return (int) $this->getPDO()->lastInsertId();
    }
    
    /**
     * Execute a query and return affected rows count
     */
    public function execute(string $sql, array $params = []): int {
        $stmt = $this->getPDO()->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }
    
    /**
     * Begin transaction
     */
    public function beginTransaction(): bool {
        return $this->getPDO()->beginTransaction();
    }
    
    /**
     * Commit transaction
     */
    public function commit(): bool {
        return $this->getPDO()->commit();
    }
    
    /**
     * Rollback transaction
     */
    public function rollback(): bool {
        return $this->getPDO()->rollBack();
    }
    
    // Prevent cloning
    private function __clone() {}
    
    // Prevent unserialization
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

/**
 * Helper function to get database instance
 */
function db(): Database {
    return Database::getInstance();
}


