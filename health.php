<?php
/**
 * Health Check Endpoint
 * Simple endpoint that doesn't require database connection
 * Used by Railway/Render for health checks
 */

http_response_code(200);
header('Content-Type: application/json');

$health = [
    'status' => 'ok',
    'timestamp' => date('c'),
    'service' => 'LaBrute',
    'version' => '1.0.0'
];

// Optionally check database (but don't fail if it's not available)
try {
    if (file_exists(__DIR__ . '/config/database.php')) {
        require_once __DIR__ . '/config/database.php';
        $health['database'] = 'configured';
    }
} catch (Exception $e) {
    // Database check failed, but that's OK for health check
    $health['database'] = 'not_available';
}

echo json_encode($health, JSON_PRETTY_PRINT);

