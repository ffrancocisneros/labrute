# LaBrute - Guía de Deployment en Railway

Esta guía explica cómo deployar LaBrute en Railway.app paso a paso, basada en la experiencia real del deployment.

## 📚 Tutorial Detallado

Para una guía paso a paso más completa con capturas de pantalla y explicaciones detalladas, consulta:
- **[TUTORIAL_RAILWAY.md](./TUTORIAL_RAILWAY.md)** - Tutorial completo para principiantes

---

## 🚀 Deployment en Railway.app

Railway ofrece un tier gratuito con PostgreSQL incluido. El proyecto está configurado con Dockerfile y scripts de inicio para funcionar correctamente.

### Requisitos Previos

- ✅ Cuenta de GitHub con el código subido
- ✅ Cuenta en Railway (se crea durante el proceso)
- ⏱️ Aproximadamente 15-20 minutos

---

## 📋 Pasos para Deployment

### Paso 1: Crear Cuenta y Proyecto en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión con GitHub
2. Click en **"+ New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta tu repositorio `labrute` (o el nombre que hayas usado)
5. Railway detectará automáticamente el `Dockerfile` y `railway.json`

### Paso 2: Agregar Base de Datos PostgreSQL

1. En tu proyecto de Railway, click en **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará automáticamente la base de datos y configurará `DATABASE_URL`

**Nota**: No necesitas configurar nada manualmente, Railway lo hace automáticamente.

### Paso 3: Configurar Variables de Entorno

1. Click en tu servicio web (no en PostgreSQL)
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-proyecto.up.railway.app
```

**Importante**: 
- `DATABASE_URL` se configura automáticamente cuando agregas PostgreSQL
- `APP_URL` puedes actualizarlo después con la URL real que Railway te asigne
- Para ver la URL, ve a **Settings** → **Domains** después del deploy

### Paso 4: Esperar el Primer Deploy

Railway comenzará a hacer deploy automáticamente. Puedes ver el progreso en la pestaña **"Deployments"**.

**El build incluye**:
- ✅ Instalación de PHP 8.2 con extensiones PostgreSQL
- ✅ Instalación de Composer y dependencias
- ✅ Configuración del script de inicio (`start.sh`)
- ✅ Healthcheck endpoint en `/health`

### Paso 5: Configurar DATABASE_URL

**IMPORTANTE**: Antes de ejecutar las migraciones, necesitas configurar la variable `DATABASE_URL` en tu servicio web.

1. Ve a tu servicio **web** (no PostgreSQL)
2. Ve a **Settings** → **Variables**
3. Agrega una nueva variable:
   - **VARIABLE_NAME**: `DATABASE_URL`
   - **VALUE**: `${{ Postgres.DATABASE_PUBLIC_URL }}`
   
   (Esto conecta automáticamente tu servicio web con PostgreSQL)

4. Railway hará un redeploy automático después de agregar la variable

### Paso 6: Ejecutar Migraciones de Base de Datos

Una vez que `DATABASE_URL` esté configurada y el redeploy haya terminado:

#### Método Recomendado: Usar un Cliente SQL

1. Instala un cliente SQL gratuito:
   - **DBeaver**: https://dbeaver.io/download/ (Recomendado)
   - **pgAdmin**: https://www.pgadmin.org/download/

2. Obtén la información de conexión:
   - Ve a tu servicio **PostgreSQL** en Railway
   - Click en **"Connect"**
   - Copia la información de conexión:
     - **Host**: `shortline.proxy.rlwy.net` (o el que te muestre)
     - **Port**: `59788` (o el que te muestre)
     - **Database**: `railway`
     - **User**: `postgres`
     - **Password**: (la contraseña que te muestre)

3. Conéctate desde el cliente SQL

4. Abre el archivo `database/migrations.sql` de tu proyecto local

5. Copia todo el contenido SQL y ejecútalo en el cliente

#### Método Alternativo: Railway CLI

Si prefieres usar Railway CLI:

1. Instala Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Inicia sesión y conecta:
   ```bash
   railway login
   railway link
   ```

3. Ejecuta las migraciones (nota: puede requerir que PHP esté instalado localmente):
   ```bash
   railway run --service web php database/migrate.php
   ```

**Nota**: Railway no tiene un editor SQL integrado en su interfaz web, por lo que necesitas usar un cliente SQL externo o Railway CLI.

Deberías ver:
```
=== LaBrute Database Migration ===
✓ Connected to database
✓ Loaded migration file
  Running migrations...
✓ Migrations completed successfully!
Tables created:
  - users
  - brutes
  - skills
  - weapons
  - fights
  - sessions
=== Migration Complete ===
```

### Paso 6: Verificar que Todo Funciona

1. Obtén la URL de tu aplicación:
   - Ve a **Settings** → **Domains**
   - Verás una URL como: `https://labrute-production-xxxx.up.railway.app`
2. Abre la URL en tu navegador
3. Deberías ver la página de inicio de LaBrute
4. Prueba:
   - ✅ Ver la página principal
   - ✅ Hacer clic en "Registrarse"
   - ✅ Crear una cuenta de prueba
   - ✅ Iniciar sesión

---

## 🔧 Archivos de Configuración

El proyecto incluye los siguientes archivos para el deployment:

### Archivos Principales

- **`Dockerfile`**: Configuración de Docker con PHP 8.2 y extensiones PostgreSQL
- **`railway.json`**: Configuración de Railway (builder, healthcheck, start command)
- **`start.sh`**: Script de inicio que maneja correctamente la variable `PORT`
- **`health.php`**: Endpoint de healthcheck que no requiere base de datos
- **`router.php`**: Router para el servidor PHP integrado

### Archivos de Configuración Adicionales

- **`composer.json`**: Dependencias PHP (PHP 8.2+, extensiones PostgreSQL)
- **`nixpacks.toml`**: Configuración alternativa para Nixpacks (no se usa actualmente)
- **`env.example.txt`**: Plantilla de variables de entorno
- **`.railwayignore`**: Archivos a ignorar en Railway

### Estructura del Deployment

```
┌─────────────────────────────────────┐
│  Railway Project                    │
│  ┌──────────────┐  ┌──────────────┐ │
│  │ Web Service  │  │ PostgreSQL   │ │
│  │ (Dockerfile) │  │ (Automático) │ │
│  └──────┬───────┘  └──────┬───────┘ │
│         │                 │          │
│         └────────┬────────┘          │
│                  │                   │
│         DATABASE_URL (auto)          │
└─────────────────────────────────────┘
```

---

## 🐛 Solución de Problemas

### Problema: "Build failed - php80 has been dropped"

**Causa**: Railway intentaba usar PHP 8.0 que ya no está disponible.

**Solución**: ✅ Ya resuelto. El proyecto usa PHP 8.2 en el Dockerfile.

---

### Problema: "Cannot find libpq-fe.h"

**Causa**: Faltaban las librerías de desarrollo de PostgreSQL.

**Solución**: ✅ Ya resuelto. El Dockerfile instala `libpq-dev` y `postgresql-client`.

---

### Problema: "Healthcheck failed" o "Invalid address: 0.0.0.0:$PORT"

**Causa**: La variable `$PORT` no se expandía correctamente.

**Solución**: ✅ Ya resuelto. Se creó `start.sh` que maneja correctamente la variable PORT.

Si aún tienes este problema:
1. Verifica que `start.sh` esté en el repositorio
2. Verifica que el Dockerfile copie y haga ejecutable `start.sh`
3. Verifica que `railway.json` use `/usr/local/bin/start.sh` como startCommand

---

### Problema: "Error 500" o página en blanco

**Solución**:
1. Ve a **Variables** y temporalmente cambia:
   ```
   APP_DEBUG=true
   ```
2. Recarga la página y verás el error detallado
3. Revisa los logs en **Deployments** → click en el deployment → **Logs**
4. Una vez solucionado, vuelve a poner `APP_DEBUG=false`

---

### Problema: "Error de conexión a la base de datos"

**Solución**:
1. Verifica que `DATABASE_URL` esté configurada en **Variables**
   - Railway la configura automáticamente cuando agregas PostgreSQL
   - Si no está, verifica que PostgreSQL esté conectado al servicio web
2. Verifica que el servicio PostgreSQL esté corriendo (debe tener un check verde ✅)
3. Ejecuta las migraciones nuevamente:
   ```bash
   php database/migrate.php
   ```

---

### Problema: "Las migraciones no funcionan"

**Solución**:
1. Verifica que estás en el servicio web (no en PostgreSQL)
2. Asegúrate de que `DATABASE_URL` esté configurada
3. Intenta ejecutar manualmente el SQL:
   - Ve a tu servicio PostgreSQL → **"Data"** → **"Query"**
   - Copia el contenido de `database/migrations.sql`
   - Pégalo y ejecuta

---

### Problema: "No se cargan las imágenes/estilos"

**Solución**:
1. Verifica que los archivos estáticos estén en el repositorio
2. Verifica los logs para ver si hay errores 404
3. Asegúrate de que `router.php` esté sirviendo archivos estáticos correctamente (ya está configurado)

---

### Problema: "El servidor no inicia"

**Solución**:
1. Revisa los logs del deployment
2. Verifica que `start.sh` tenga permisos de ejecución (el Dockerfile lo hace automáticamente)
3. Verifica que el Dockerfile esté correcto
4. Intenta hacer un redeploy manual

---

## 📊 Límites del Plan Gratuito de Railway

Railway ofrece un tier gratuito generoso:

- **$5 de crédito gratis por mes** (suficiente para uso personal/grupo de amigos)
- **512 MB de RAM** por servicio
- **1 GB de almacenamiento** para base de datos
- **100 GB de transferencia** por mes
- **Sin límite de tiempo** (no se suspende después de X tiempo de inactividad)

**Consejo**: Para un grupo pequeño de amigos, el plan gratuito es más que suficiente.

---

## ✅ Checklist de Deployment

Antes de considerar el deployment completo, verifica:

- [ ] El código está en GitHub
- [ ] El proyecto está creado en Railway
- [ ] PostgreSQL está agregado y conectado
- [ ] Las variables de entorno están configuradas (`APP_ENV`, `APP_DEBUG`, `APP_URL`)
- [ ] El build se completó exitosamente
- [ ] Las migraciones se ejecutaron correctamente
- [ ] La aplicación carga en el navegador (healthcheck funciona)
- [ ] Puedes registrarte e iniciar sesión
- [ ] Puedes crear un brute
- [ ] El dashboard funciona correctamente

---

## 🔄 Actualizaciones y Redeploy

Cada vez que hagas cambios en el código:

1. Haz commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push
   ```

2. Railway detectará automáticamente los cambios y hará un nuevo deploy

3. Si necesitas hacer un redeploy manual:
   - Ve a **Deployments**
   - Click en **"Redeploy"** en el deployment más reciente

---

## 🌐 Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio:

1. En **Settings** → **Domains**, click en **"+ Custom Domain"**
2. Ingresa tu dominio (ej: `labrute.tudominio.com`)
3. Railway te dará instrucciones para configurar los DNS
4. Agrega los registros CNAME que Railway te indique en tu proveedor de DNS

---

## 📚 Recursos Adicionales

- [Documentación oficial de Railway](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway) - Para soporte de la comunidad
- [TUTORIAL_RAILWAY.md](./TUTORIAL_RAILWAY.md) - Tutorial detallado paso a paso

---

## 💡 Tips y Mejores Prácticas

1. **Mantén tus variables de entorno seguras**: Nunca compartas `DATABASE_URL` públicamente
2. **Monitorea el uso**: Revisa periódicamente el dashboard de Railway para ver el consumo
3. **Haz backups**: Railway hace backups automáticos de PostgreSQL, pero considera hacer backups manuales importantes
4. **Revisa los logs**: Si algo no funciona, los logs son tu mejor amigo (Deployments → Logs)
5. **Usa APP_DEBUG con cuidado**: Solo en desarrollo, nunca en producción con datos reales

---

## 🎉 ¡Listo!

Tu aplicación LaBrute está ahora deployada en Railway y lista para que tus amigos jueguen.

**URL de tu aplicación**: `https://tu-proyecto.up.railway.app`

### Próximos pasos sugeridos:

1. Comparte la URL con tus amigos
2. Crea algunas cuentas de prueba
3. Prueba el sistema de peleas
4. Monitorea el uso en Railway dashboard
5. Considera agregar un dominio personalizado si lo deseas

---

## Licencia

Este proyecto está bajo licencia AGPL-3.0. Los assets están bajo CC-BY-NC-SA-4.0.
Basado en el trabajo de [Eternaltwin](https://gitlab.com/eternaltwin/labrute/labrute).
