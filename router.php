<?php
/**
 * PHP Built-in Server Router
 * This file handles routing for the PHP development server
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve static files directly
$staticExtensions = ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'woff', 'woff2', 'ttf'];
$extension = pathinfo($uri, PATHINFO_EXTENSION);

if (in_array(strtolower($extension), $staticExtensions)) {
    $filePath = __DIR__ . $uri;
    if (file_exists($filePath)) {
        // Set appropriate content type
        $mimeTypes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
        ];
        if (isset($mimeTypes[$extension])) {
            header('Content-Type: ' . $mimeTypes[$extension]);
        }
        return false; // Let PHP serve the file
    }
}

// Route to PHP files
$phpFile = __DIR__ . $uri;

// Handle health check endpoint (for Railway/Render)
if ($uri === '/health' || $uri === '/health.php') {
    require __DIR__ . '/health.php';
    return true;
}

// Handle root URL
if ($uri === '/') {
    require __DIR__ . '/index.php';
    return true;
}

// Check if URI points to a PHP file
if (substr($uri, -4) === '.php' && file_exists($phpFile)) {
    require $phpFile;
    return true;
}

// Check if URI is a directory with index.php
if (is_dir($phpFile) && file_exists($phpFile . '/index.php')) {
    require $phpFile . '/index.php';
    return true;
}

// Check if adding .php makes it valid
if (file_exists($phpFile . '.php')) {
    require $phpFile . '.php';
    return true;
}

// If file exists, serve it (for other static files)
if (file_exists($phpFile) && !is_dir($phpFile)) {
    return false;
}

// 404 Not Found
http_response_code(404);
echo '<!DOCTYPE html>
<html>
<head>
    <title>404 - No encontrado</title>
    <style>
        body { font-family: Georgia, serif; background: #1a1410; color: #e8e0d5; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .error { text-align: center; }
        h1 { color: #d4a855; font-size: 4rem; margin-bottom: 0.5rem; }
        a { color: #d4a855; }
    </style>
</head>
<body>
    <div class="error">
        <h1>404</h1>
        <p>Página no encontrada</p>
        <a href="/">Volver al inicio</a>
    </div>
</body>
</html>';
return true;

