# Dockerfile para Railway/Render
# Usa PHP 8.2 con extensiones PostgreSQL

FROM php:8.2-cli

# Instalar dependencias del sistema para PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones necesarias
RUN docker-php-ext-install pdo pdo_pgsql

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader || true

# Exponer puerto (Railway/Render lo configuran automáticamente)
EXPOSE 8080

# Comando de inicio (usar shell para expandir variables de entorno)
CMD php -S 0.0.0.0:${PORT:-8080} router.php

