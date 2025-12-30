<?php
/**
 * Web-based Migration Runner
 * TEMPORARY FILE - Delete after running migrations!
 * 
 * Access this file via: https://web-production-2dfc5.up.railway.app/run-migrations-web.php
 * 
 * SECURITY WARNING: This file should be deleted after migrations are complete!
 */

// Simple security check - you can add a password or IP check here
$allowed = true; // Change this to false after running migrations

if (!$allowed) {
    die('Access denied. Migrations already run.');
}

require_once __DIR__ . '/config/database.php';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>LaBrute - Database Migrations</title>
    <style>
        body { font-family: monospace; background: #1a1a1a; color: #0f0; padding: 20px; }
        .success { color: #0f0; }
        .error { color: #f00; }
        .info { color: #ff0; }
        pre { background: #000; padding: 10px; border: 1px solid #333; }
    </style>
</head>
<body>
    <h1>LaBrute Database Migrations</h1>
    <pre>
<?php
echo "=== LaBrute Database Migration ===\n\n";

try {
    // Connect to database
    $pdo = new PDO(
        DB_DSN,
        DB_CONNECTION_USER,
        DB_CONNECTION_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    
    echo "<span class='success'>✓ Connected to database</span>\n";
    
    // Read migration file
    $migrationFile = __DIR__ . '/database/migrations.sql';
    if (!file_exists($migrationFile)) {
        die("<span class='error'>✗ Migration file not found: {$migrationFile}</span>\n");
    }
    
    $sql = file_get_contents($migrationFile);
    
    echo "<span class='success'>✓ Loaded migration file</span>\n";
    echo "  Running migrations...\n\n";
    
    // Execute migrations
    $pdo->exec($sql);
    
    echo "<span class='success'>✓ Migrations completed successfully!</span>\n\n";
    
    // Verify tables
    $tables = $pdo->query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")->fetchAll();
    echo "Tables created:\n";
    foreach ($tables as $table) {
        echo "  - {$table['tablename']}\n";
    }
    
    echo "\n<span class='success'>=== Migration Complete ===</span>\n";
    echo "\n<span class='info'>⚠️ IMPORTANT: Delete this file (run-migrations-web.php) now for security!</span>\n";
    
} catch (PDOException $e) {
    echo "<span class='error'>✗ Database error: " . htmlspecialchars($e->getMessage()) . "</span>\n";
}
?>
    </pre>
</body>
</html>

