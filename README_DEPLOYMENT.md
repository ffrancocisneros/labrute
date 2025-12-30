# LaBrute - Guía de Deployment

Esta guía explica cómo deployar LaBrute en servicios gratuitos de hosting.

## 📚 Tutoriales Detallados

- **[TUTORIAL_RAILWAY.md](./TUTORIAL_RAILWAY.md)** - Tutorial paso a paso completo para deployar en Railway.app (recomendado para principiantes)

---

Esta guía es una referencia rápida. Para instrucciones detalladas paso a paso, consulta el tutorial específico arriba.

## Opción 1: Railway.app (Recomendado)

Railway ofrece un tier gratuito con PostgreSQL incluido. El proyecto incluye `railway.json` y `nixpacks.toml` para configuración automática.

### Pasos:

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Regístrate con tu cuenta de GitHub

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio
   - Railway detectará automáticamente la configuración de `railway.json`

3. **Agregar PostgreSQL**
   - En tu proyecto, click en "+ New"
   - Selecciona "Database" → "PostgreSQL"
   - Railway configurará `DATABASE_URL` automáticamente

4. **Configurar variables de entorno**
   - Ve a Settings → Variables
   - Agrega:
     ```
     APP_ENV=production
     APP_DEBUG=false
     APP_URL=https://tu-proyecto.up.railway.app
     ```
   - Railway ya configurará `DATABASE_URL` automáticamente

5. **Ejecutar migraciones**
   - Ve a la terminal de Railway o conéctate via CLI:
     ```bash
     railway run php database/migrate.php
     ```
   - O ejecuta manualmente después del primer deploy

6. **¡Listo!**
   - Tu app estará disponible en `https://tu-proyecto.up.railway.app`
   - Railway usará automáticamente el comando de inicio definido en `railway.json`

---

## Opción 2: Render.com

El proyecto incluye `render.yaml` para configuración automática. Render puede detectar este archivo y configurar el servicio automáticamente.

### Pasos (Método Automático con render.yaml):

1. **Crear cuenta en Render**
   - Ve a [render.com](https://render.com)
   - Regístrate con GitHub

2. **Crear nuevo servicio desde repositorio**
   - Click en "New" → "Blueprint"
   - Conecta tu repositorio
   - Render detectará automáticamente `render.yaml` y configurará todo

3. **¡Listo!**
   - Render creará automáticamente el Web Service y la base de datos PostgreSQL
   - Las variables de entorno se configurarán automáticamente
   - Ejecuta las migraciones manualmente desde la shell de Render:
     ```bash
     php database/migrate.php
     ```

### Pasos (Método Manual):

1. **Crear cuenta en Render**
   - Ve a [render.com](https://render.com)
   - Regístrate con GitHub

2. **Crear Web Service**
   - Click en "New" → "Web Service"
   - Conecta tu repositorio
   - Configuración:
     - Environment: `PHP`
     - Build Command: `composer install --no-dev --optimize-autoloader`
     - Start Command: `php -S 0.0.0.0:$PORT router.php`

3. **Crear base de datos PostgreSQL**
   - Click en "New" → "PostgreSQL"
   - Copia la URL de conexión

4. **Configurar variables de entorno**
   - En tu Web Service, ve a "Environment"
   - Agrega:
     ```
     DATABASE_URL=<tu-url-de-postgresql>
     APP_ENV=production
     APP_DEBUG=false
     APP_URL=https://tu-servicio.onrender.com
     ```

5. **Ejecutar migraciones**
   - Usa la shell de Render o conéctate por SSH:
     ```bash
     php database/migrate.php
     ```

---

## Opción 3: Desarrollo Local

### Requisitos:
- PHP 8.0+
- PostgreSQL
- Extensiones: pdo, pdo_pgsql

### Pasos:

1. **Clonar repositorio**
   ```bash
   git clone https://tu-repositorio.git
   cd labrute
   ```

2. **Configurar base de datos**
   - Crea una base de datos PostgreSQL llamada `labrute`
   - Copia `env.example.txt` a `.env` y edita los valores
   - O configura las variables de entorno directamente

3. **Ejecutar migraciones**
   ```bash
   php database/migrate.php
   ```

4. **Iniciar servidor**
   ```bash
   php -S localhost:8080 router.php
   ```

5. **Abrir en navegador**
   - Ve a `http://localhost:8080`

---

## Archivos de Configuración

El proyecto incluye varios archivos para facilitar el deployment:

- **`railway.json`**: Configuración automática para Railway.app
- **`nixpacks.toml`**: Configuración de build para Railway (usando Nixpacks)
- **`render.yaml`**: Configuración automática para Render.com
- **`Procfile`**: Configuración para Heroku/Render (método alternativo)
- **`env.example.txt`**: Plantilla de variables de entorno (copia a `.env` para desarrollo local)
- **`.railwayignore`**: Archivos a ignorar en Railway
- **`.renderignore`**: Archivos a ignorar en Render
- **`scripts/post-deploy.sh`**: Script opcional para ejecutar después del deployment

## Variables de Entorno

| Variable | Descripción | Requerido | Ejemplo |
|----------|-------------|-----------|---------|
| `DATABASE_URL` | URL completa de PostgreSQL | Sí* | `postgres://user:pass@host:5432/db` |
| `DB_HOST` | Host de la base de datos | Sí* | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | Sí* | `5432` |
| `DB_NAME` | Nombre de la base de datos | Sí* | `labrute` |
| `DB_USER` | Usuario de PostgreSQL | Sí* | `postgres` |
| `DB_PASS` | Contraseña | Sí* | `secreto` |
| `APP_ENV` | Entorno de la app | No | `production` o `development` |
| `APP_DEBUG` | Mostrar errores detallados | No | `true` o `false` |
| `APP_URL` | URL pública de la app | No | `https://miapp.railway.app` |

\* Usa `DATABASE_URL` O las variables individuales (`DB_HOST`, `DB_PORT`, etc.). Railway y Render suelen proporcionar `DATABASE_URL` automáticamente.

---

## Solución de Problemas

### Error de conexión a la base de datos
- Verifica que `DATABASE_URL` esté configurado correctamente
- Asegúrate de que las extensiones `pdo_pgsql` estén habilitadas

### Error 500
- Activa `APP_DEBUG=true` temporalmente para ver el error
- Revisa los logs en Railway/Render

### Las migraciones no funcionan
- Conecta directamente a PostgreSQL y ejecuta el contenido de `database/migrations.sql`

---

## Licencia

Este proyecto está bajo licencia AGPL-3.0. Los assets están bajo CC-BY-NC-SA-4.0.
Basado en el trabajo de [Eternaltwin](https://gitlab.com/eternaltwin/labrute/labrute).

