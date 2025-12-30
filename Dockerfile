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

# Copiar y hacer ejecutable el script de inicio
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Exponer puerto (Railway/Render lo configuran automáticamente)
EXPOSE 8080

# Comando de inicio
CMD ["/usr/local/bin/start.sh"]

