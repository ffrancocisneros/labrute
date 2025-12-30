<?php
/**
 * Database Configuration
 * Uses environment variables for security
 */

// Load from environment or use defaults for local development
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '5432');
define('DB_NAME', getenv('DB_NAME') ?: 'labrute');
define('DB_USER', getenv('DB_USER') ?: 'postgres');
define('DB_PASS', getenv('DB_PASS') ?: '');

// Railway/Render often provide DATABASE_URL
$databaseUrl = getenv('DATABASE_URL');

if ($databaseUrl) {
    // Parse the DATABASE_URL (format: postgres://user:pass@host:port/dbname)
    $dbParts = parse_url($databaseUrl);
    define('DB_DSN', sprintf(
        'pgsql:host=%s;port=%s;dbname=%s',
        $dbParts['host'],
        $dbParts['port'] ?? 5432,
        ltrim($dbParts['path'], '/')
    ));
    define('DB_CONNECTION_USER', $dbParts['user']);
    define('DB_CONNECTION_PASS', $dbParts['pass']);
} else {
    // Use individual environment variables
    define('DB_DSN', sprintf('pgsql:host=%s;port=%s;dbname=%s', DB_HOST, DB_PORT, DB_NAME));
    define('DB_CONNECTION_USER', DB_USER);
    define('DB_CONNECTION_PASS', DB_PASS);
}

// Application settings
define('APP_NAME', 'LaBrute');
define('APP_ENV', getenv('APP_ENV') ?: 'development');
define('APP_DEBUG', getenv('APP_DEBUG') === 'true' || APP_ENV === 'development');
define('APP_URL', getenv('APP_URL') ?: 'http://localhost:8080');

// Session settings
define('SESSION_LIFETIME', 60 * 60 * 24 * 7); // 7 days in seconds
define('SESSION_NAME', 'labrute_session');

// Security
define('PASSWORD_COST', 12); // bcrypt cost factor


