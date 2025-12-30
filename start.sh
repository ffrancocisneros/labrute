#!/bin/bash
# Startup script for Railway/Render
# Properly handles PORT environment variable

PORT=${PORT:-8080}
php -S 0.0.0.0:$PORT router.php

