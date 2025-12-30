# 🚂 Tutorial: Deploy de LaBrute en Railway.app

Este tutorial te guiará paso a paso para deployar LaBrute en Railway.app de forma completamente gratuita.

## 📋 Requisitos Previos

Antes de comenzar, necesitas:

- ✅ Una cuenta de GitHub (gratuita)
- ✅ El código de LaBrute subido a un repositorio de GitHub
- ✅ Una cuenta de Railway (se crea durante el proceso)
- ⏱️ Aproximadamente 15-20 minutos

---

## 🎯 Paso 1: Preparar el Repositorio en GitHub

### 1.1. Verificar que el código esté en GitHub

Si aún no has subido tu código a GitHub:

1. Ve a [github.com](https://github.com) e inicia sesión
2. Click en el botón **"+"** (arriba a la derecha) → **"New repository"**
3. Completa:
   - **Repository name**: `labrute` (o el nombre que prefieras)
   - **Description**: "LaBrute - Arena fighting game"
   - **Visibility**: Público o Privado (tu elección)
   - ⚠️ **NO marques** "Add a README file" (si ya tienes código local)
4. Click en **"Create repository"**

### 1.2. Subir el código (si es necesario)

Si tienes el código localmente y aún no está en GitHub:

```bash
# En tu terminal, navega a la carpeta del proyecto
cd d:\bruto

# Inicializa git si no está inicializado
git init

# Agrega todos los archivos
git add .

# Haz tu primer commit
git commit -m "Initial commit: LaBrute ready for deployment"

# Agrega el repositorio remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/labrute.git

# Sube el código
git branch -M main
git push -u origin main
```

---

## 🚂 Paso 2: Crear Cuenta en Railway

### 2.1. Acceder a Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"Start a New Project"** o **"Login"**

### 2.2. Iniciar sesión con GitHub

1. Railway te pedirá autenticarte
2. Selecciona **"Login with GitHub"**
3. Autoriza a Railway para acceder a tus repositorios
   - Railway necesita acceso para leer tus repositorios y hacer deploy
   - Puedes limitar el acceso solo a repositorios específicos si prefieres

### 2.3. Verificar la cuenta

Una vez autenticado, serás redirigido al dashboard de Railway. Verás una pantalla vacía con el mensaje "No projects yet".

---

## 🏗️ Paso 3: Crear el Proyecto en Railway

### 3.1. Iniciar nuevo proyecto

1. En el dashboard de Railway, click en **"+ New Project"** (botón grande en el centro)
2. Se abrirá un menú con opciones

### 3.2. Seleccionar el repositorio

1. En el menú, selecciona **"Deploy from GitHub repo"**
2. Railway mostrará una lista de tus repositorios de GitHub
3. Busca y selecciona el repositorio **`labrute`** (o el nombre que hayas usado)
4. Si no aparece, click en **"Configure GitHub App"** y autoriza el acceso

### 3.3. Configuración inicial

Railway detectará automáticamente:
- ✅ Que es un proyecto PHP (por `composer.json`)
- ✅ La configuración en `railway.json`
- ✅ El archivo `nixpacks.toml`

**No necesitas cambiar nada en este paso**, Railway configurará todo automáticamente.

---

## 🗄️ Paso 4: Agregar Base de Datos PostgreSQL

### 4.1. Crear el servicio de base de datos

1. En tu proyecto de Railway, verás un servicio (tu aplicación web)
2. Click en **"+ New"** (arriba a la derecha, dentro del proyecto)
3. En el menú desplegable, selecciona **"Database"**
4. Luego selecciona **"Add PostgreSQL"**

### 4.2. Configuración automática

Railway:
- ✅ Creará una base de datos PostgreSQL
- ✅ Generará automáticamente la variable de entorno `DATABASE_URL`
- ✅ Conectará automáticamente la base de datos a tu aplicación

**No necesitas configurar nada manualmente**, Railway lo hace todo.

### 4.3. Verificar la conexión

1. En el panel de tu proyecto, verás dos servicios:
   - Tu aplicación web (con un nombre como "labrute" o el nombre del repo)
   - PostgreSQL (con un nombre como "Postgres")
2. Ambos están conectados automáticamente

---

## ⚙️ Paso 5: Configurar Variables de Entorno

### 5.1. Acceder a las variables

1. Click en tu servicio web (el que no es la base de datos)
2. Ve a la pestaña **"Variables"** (en el menú superior)
3. Verás una lista de variables de entorno

### 5.2. Agregar variables necesarias

Railway ya habrá configurado automáticamente:
- ✅ `DATABASE_URL` (conectada a tu PostgreSQL)

Ahora necesitas agregar manualmente:

1. Click en **"+ New Variable"** o **"+ Raw Editor"**
2. Agrega las siguientes variables una por una:

```
APP_ENV=production
```

```
APP_DEBUG=false
```

```
APP_URL=https://tu-proyecto.up.railway.app
```

**Nota sobre APP_URL**: 
- Railway te dará una URL automática como `https://labrute-production-xxxx.up.railway.app`
- Puedes verla en la pestaña **"Settings"** → **"Domains"**
- O espera a que Railway termine el deploy y te mostrará la URL
- Puedes actualizar esta variable después con la URL correcta

### 5.3. Verificar variables

Tu lista de variables debería verse así:

```
DATABASE_URL=postgres://postgres:password@host:port/database (automática)
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-proyecto.up.railway.app
```

---

## 🚀 Paso 6: Ejecutar Migraciones de Base de Datos

### 6.1. Esperar el primer deploy

1. Railway comenzará a hacer deploy automáticamente
2. Puedes ver el progreso en la pestaña **"Deployments"**
3. Espera a que el deploy termine (verás un check verde ✅)

### 6.2. Abrir la terminal de Railway

1. En tu servicio web, ve a la pestaña **"Deployments"**
2. Click en el deployment más reciente (el que tiene el check verde)
3. En la parte inferior, verás una sección **"Logs"**
4. O mejor aún, ve a la pestaña **"Settings"** → **"Service"** → busca **"Open Shell"** o **"Connect"**

### 6.3. Ejecutar las migraciones

En la terminal de Railway, ejecuta:

```bash
php database/migrate.php
```

Deberías ver algo como:

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

### 6.4. Alternativa: Usar Railway CLI

Si prefieres usar la CLI de Railway desde tu computadora:

1. Instala Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Inicia sesión:
   ```bash
   railway login
   ```

3. Conecta tu proyecto:
   ```bash
   railway link
   ```

4. Ejecuta las migraciones:
   ```bash
   railway run php database/migrate.php
   ```

---

## 🌐 Paso 7: Verificar el Deploy

### 7.1. Obtener la URL de tu aplicación

1. En tu servicio web, ve a la pestaña **"Settings"**
2. Busca la sección **"Domains"** o **"Networking"**
3. Verás una URL como: `https://labrute-production-xxxx.up.railway.app`
4. Click en la URL o cópiala

### 7.2. Probar la aplicación

1. Abre la URL en tu navegador
2. Deberías ver la página de inicio de LaBrute
3. Prueba:
   - ✅ Ver la página principal
   - ✅ Hacer clic en "Registrarse"
   - ✅ Crear una cuenta de prueba
   - ✅ Iniciar sesión

### 7.3. Verificar la base de datos

Si todo funciona correctamente:
- ✅ Puedes registrarte
- ✅ Puedes iniciar sesión
- ✅ Puedes crear un brute
- ✅ Puedes ver tu dashboard

---

## 🔧 Paso 8: Configuración Adicional (Opcional)

### 8.1. Dominio personalizado

Si quieres usar tu propio dominio:

1. En **Settings** → **Domains**, click en **"+ Custom Domain"**
2. Ingresa tu dominio (ej: `labrute.tudominio.com`)
3. Railway te dará instrucciones para configurar los DNS
4. Agrega los registros CNAME que Railway te indique en tu proveedor de DNS

### 8.2. Variables de entorno adicionales

Si necesitas ajustar configuraciones:

1. Ve a **Variables**
2. Puedes agregar:
   - `SESSION_LIFETIME=604800` (7 días en segundos)
   - `SESSION_NAME=labrute_session`
   - `PASSWORD_COST=12`

### 8.3. Monitoreo y logs

- **Logs**: Ve a la pestaña **"Deployments"** → click en un deployment → verás los logs
- **Métricas**: Railway muestra uso de CPU, memoria y red en tiempo real
- **Alertas**: Puedes configurar alertas en **Settings** → **Notifications**

---

## 🐛 Solución de Problemas Comunes

### Problema: "Error 500" o página en blanco

**Solución:**
1. Ve a **Variables** y temporalmente cambia:
   ```
   APP_DEBUG=true
   ```
2. Recarga la página y verás el error detallado
3. Revisa los logs en **Deployments**
4. Una vez solucionado, vuelve a poner `APP_DEBUG=false`

### Problema: "Error de conexión a la base de datos"

**Solución:**
1. Verifica que `DATABASE_URL` esté configurada en **Variables**
2. Verifica que el servicio PostgreSQL esté corriendo (debe tener un check verde ✅)
3. Ejecuta las migraciones nuevamente:
   ```bash
   php database/migrate.php
   ```

### Problema: "Las migraciones no funcionan"

**Solución:**
1. Verifica que estás en el servicio web (no en PostgreSQL)
2. Asegúrate de que `DATABASE_URL` esté configurada
3. Intenta ejecutar manualmente el SQL:
   - Ve a tu servicio PostgreSQL → **"Data"** → **"Query"**
   - Copia el contenido de `database/migrations.sql`
   - Pégalo y ejecuta

### Problema: "No se cargan las imágenes/estilos"

**Solución:**
1. Verifica que los archivos estáticos estén en el repositorio
2. Asegúrate de que `router.php` esté configurado correctamente (ya lo está)
3. Verifica los logs para ver si hay errores 404

### Problema: "El deploy falla"

**Solución:**
1. Revisa los logs del deployment
2. Verifica que `composer.json` esté correcto
3. Verifica que `nixpacks.toml` tenga las extensiones PHP correctas
4. Asegúrate de que todas las dependencias estén en `composer.json`

---

## 📊 Límites del Plan Gratuito de Railway

Railway ofrece un tier gratuito generoso, pero tiene límites:

- **$5 de crédito gratis por mes** (suficiente para uso personal/grupo de amigos)
- **512 MB de RAM** por servicio
- **1 GB de almacenamiento** para base de datos
- **100 GB de transferencia** por mes
- **Sin límite de tiempo** (no se suspende después de X tiempo de inactividad)

**Consejo**: Para un grupo pequeño de amigos, el plan gratuito es más que suficiente.

---

## ✅ Checklist Final

Antes de considerar el deploy completo, verifica:

- [ ] El código está en GitHub
- [ ] El proyecto está creado en Railway
- [ ] PostgreSQL está agregado y conectado
- [ ] Las variables de entorno están configuradas
- [ ] Las migraciones se ejecutaron correctamente
- [ ] La aplicación carga en el navegador
- [ ] Puedes registrarte e iniciar sesión
- [ ] Puedes crear un brute
- [ ] El dashboard funciona correctamente

---

## 🎉 ¡Listo!

Tu aplicación LaBrute está ahora deployada en Railway y disponible para que tus amigos jueguen.

**URL de tu aplicación**: `https://tu-proyecto.up.railway.app`

### Próximos pasos sugeridos:

1. Comparte la URL con tus amigos
2. Crea algunas cuentas de prueba
3. Prueba el sistema de peleas
4. Monitorea el uso en Railway dashboard
5. Considera agregar un dominio personalizado si lo deseas

---

## 📚 Recursos Adicionales

- [Documentación oficial de Railway](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway) - Para soporte de la comunidad
- [README_DEPLOYMENT.md](./README_DEPLOYMENT.md) - Documentación técnica del proyecto

---

## 💡 Tips y Mejores Prácticas

1. **Mantén tus variables de entorno seguras**: Nunca compartas `DATABASE_URL` públicamente
2. **Monitorea el uso**: Revisa periódicamente el dashboard de Railway para ver el consumo
3. **Haz backups**: Railway hace backups automáticos de PostgreSQL, pero considera hacer backups manuales importantes
4. **Actualiza regularmente**: Mantén tu código actualizado en GitHub, Railway hará redeploy automáticamente
5. **Revisa los logs**: Si algo no funciona, los logs son tu mejor amigo

---

**¿Problemas?** Revisa la sección de "Solución de Problemas" arriba o consulta la documentación de Railway.

¡Disfruta jugando LaBrute con tus amigos! 🎮⚔️

