<?php
/**
 * Authentication Functions
 * Simple session-based authentication system
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/../config/database.php';

class Auth {
    private static $currentUser = null;
    
    /**
     * Start session if not already started
     */
    public static function startSession(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_name(SESSION_NAME);
            session_start();
        }
    }
    
    /**
     * Register a new user
     * @return array ['success' => bool, 'message' => string, 'user_id' => int|null]
     */
    public static function register(string $username, string $password, ?string $email = null): array {
        // Validate username
        $username = trim($username);
        if (strlen($username) < 3 || strlen($username) > 50) {
            return ['success' => false, 'message' => 'El nombre de usuario debe tener entre 3 y 50 caracteres.'];
        }
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
            return ['success' => false, 'message' => 'El nombre de usuario solo puede contener letras, números y guiones bajos.'];
        }
        
        // Validate password
        if (strlen($password) < 6) {
            return ['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres.'];
        }
        
        // Validate email if provided
        if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'El email no es válido.'];
        }
        
        // Check if username already exists
        $existing = db()->queryOne(
            'SELECT id FROM users WHERE LOWER(username) = LOWER(?)',
            [$username]
        );
        if ($existing) {
            return ['success' => false, 'message' => 'El nombre de usuario ya está en uso.'];
        }
        
        // Check if email already exists (if provided)
        if ($email) {
            $existingEmail = db()->queryOne(
                'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
                [$email]
            );
            if ($existingEmail) {
                return ['success' => false, 'message' => 'El email ya está registrado.'];
            }
        }
        
        // Hash password
        $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => PASSWORD_COST]);
        
        // Insert user
        try {
            $userId = db()->insert(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?) RETURNING id',
                [$username, $email, $passwordHash]
            );
            
            // For PostgreSQL, we need to fetch the ID differently
            $user = db()->queryOne(
                'SELECT id FROM users WHERE username = ?',
                [$username]
            );
            
            return [
                'success' => true,
                'message' => 'Usuario registrado exitosamente.',
                'user_id' => $user['id']
            ];
        } catch (Exception $e) {
            if (APP_DEBUG) {
                return ['success' => false, 'message' => 'Error al registrar: ' . $e->getMessage()];
            }
            return ['success' => false, 'message' => 'Error al registrar el usuario. Por favor intenta de nuevo.'];
        }
    }
    
    /**
     * Login a user
     * @return array ['success' => bool, 'message' => string, 'user' => array|null]
     */
    public static function login(string $username, string $password): array {
        // Find user
        $user = db()->queryOne(
            'SELECT id, username, password_hash, is_active FROM users WHERE LOWER(username) = LOWER(?)',
            [trim($username)]
        );
        
        if (!$user) {
            return ['success' => false, 'message' => 'Usuario o contraseña incorrectos.'];
        }
        
        if (!$user['is_active']) {
            return ['success' => false, 'message' => 'Esta cuenta ha sido desactivada.'];
        }
        
        // Verify password
        if (!password_verify($password, $user['password_hash'])) {
            return ['success' => false, 'message' => 'Usuario o contraseña incorrectos.'];
        }
        
        // Start session and store user data
        self::startSession();
        
        // Generate session token
        $sessionToken = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + SESSION_LIFETIME);
        
        // Store session in database
        db()->insert(
            'INSERT INTO sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
            [
                $user['id'],
                $sessionToken,
                $_SERVER['REMOTE_ADDR'] ?? '',
                $_SERVER['HTTP_USER_AGENT'] ?? '',
                $expiresAt
            ]
        );
        
        // Update last login
        db()->execute(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [$user['id']]
        );
        
        // Store in PHP session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['session_token'] = $sessionToken;
        $_SESSION['logged_in'] = true;
        
        return [
            'success' => true,
            'message' => '¡Bienvenido, ' . $user['username'] . '!',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username']
            ]
        ];
    }
    
    /**
     * Logout current user
     */
    public static function logout(): void {
        self::startSession();
        
        // Invalidate session in database
        if (isset($_SESSION['session_token'])) {
            db()->execute(
                'UPDATE sessions SET is_valid = FALSE WHERE session_token = ?',
                [$_SESSION['session_token']]
            );
        }
        
        // Clear PHP session
        $_SESSION = [];
        
        // Delete session cookie
        if (isset($_COOKIE[SESSION_NAME])) {
            setcookie(SESSION_NAME, '', time() - 3600, '/');
        }
        
        session_destroy();
        
        self::$currentUser = null;
    }
    
    /**
     * Check if user is logged in
     */
    public static function isLoggedIn(): bool {
        self::startSession();
        
        if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
            return false;
        }
        
        if (!isset($_SESSION['session_token'])) {
            return false;
        }
        
        // Verify session in database
        $session = db()->queryOne(
            'SELECT * FROM sessions WHERE session_token = ? AND is_valid = TRUE AND expires_at > CURRENT_TIMESTAMP',
            [$_SESSION['session_token']]
        );
        
        if (!$session) {
            self::logout();
            return false;
        }
        
        return true;
    }
    
    /**
     * Get current logged in user
     */
    public static function getCurrentUser(): ?array {
        if (!self::isLoggedIn()) {
            return null;
        }
        
        if (self::$currentUser === null) {
            self::$currentUser = db()->queryOne(
                'SELECT id, username, email, created_at, last_login FROM users WHERE id = ?',
                [$_SESSION['user_id']]
            );
        }
        
        return self::$currentUser;
    }
    
    /**
     * Get current user ID
     */
    public static function getUserId(): ?int {
        if (!self::isLoggedIn()) {
            return null;
        }
        return (int) $_SESSION['user_id'];
    }
    
    /**
     * Require authentication - redirect to login if not logged in
     */
    public static function requireAuth(): void {
        if (!self::isLoggedIn()) {
            header('Location: /login.php');
            exit;
        }
    }
    
    /**
     * Redirect if already logged in
     */
    public static function redirectIfLoggedIn(string $to = '/dashboard.php'): void {
        if (self::isLoggedIn()) {
            header('Location: ' . $to);
            exit;
        }
    }
    
    /**
     * Clean up expired sessions (can be run periodically)
     */
    public static function cleanupExpiredSessions(): int {
        return db()->execute(
            'DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP'
        );
    }
}

/**
 * Helper function to check if user is logged in
 */
function isLoggedIn(): bool {
    return Auth::isLoggedIn();
}

/**
 * Helper function to get current user
 */
function currentUser(): ?array {
    return Auth::getCurrentUser();
}

/**
 * Helper function to require authentication
 */
function requireAuth(): void {
    Auth::requireAuth();
}

