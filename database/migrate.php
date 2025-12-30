<?php
/**
 * Database Migration Script
 * Run this to create/reset the database tables
 * 
 * Usage: php database/migrate.php
 */

// Load configuration
require_once __DIR__ . '/../config/database.php';

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
    
    echo "✓ Connected to database\n";
    
    // Read migration file
    $migrationFile = __DIR__ . '/migrations.sql';
    if (!file_exists($migrationFile)) {
        die("✗ Migration file not found: {$migrationFile}\n");
    }
    
    $sql = file_get_contents($migrationFile);
    
    echo "✓ Loaded migration file\n";
    echo "  Running migrations...\n\n";
    
    // Execute migrations
    $pdo->exec($sql);
    
    echo "✓ Migrations completed successfully!\n\n";
    
    // Verify tables
    $tables = $pdo->query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")->fetchAll();
    echo "Tables created:\n";
    foreach ($tables as $table) {
        echo "  - {$table['tablename']}\n";
    }
    
    echo "\n=== Migration Complete ===\n";
    
} catch (PDOException $e) {
    die("✗ Database error: " . $e->getMessage() . "\n");
}

