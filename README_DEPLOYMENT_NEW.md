# Guía de Deployment - LaBrute (Node.js/React)

Esta guía explica cómo deployar LaBrute en Railway usando la nueva arquitectura Node.js + React.

## Arquitectura

```
┌─────────────────────────────────────┐
│         Frontend (React)             │
│  - Vite + React 18                  │
│  - Material-UI                       │
│  - Servido como archivos estáticos  │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│      Backend (Node.js/Express)        │
│  - Express API                         │
│  - Prisma ORM                          │
│  - TypeScript                          │
│  - Puerto: 3001                        │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│      PostgreSQL Database              │
│  - Railway Postgres                    │
└──────────────────────────────────────┘
```

## Pre-requisitos

- Cuenta de GitHub con el repositorio del proyecto
- Cuenta de Railway (https://railway.app)

## Paso 1: Preparar el Repositorio

Asegúrate de que tu repositorio tenga la siguiente estructura:

```
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── Dockerfile.new
├── railway.new.json
└── docker-compose.yml
```

## Paso 2: Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión con GitHub
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige el repositorio de LaBrute
5. Railway detectará automáticamente el proyecto

## Paso 3: Agregar PostgreSQL

1. En tu proyecto Railway, click en **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará una base de datos automáticamente

## Paso 4: Configurar Variables de Entorno

En el servicio web (no en la base de datos):

1. Click en tu servicio → **"Variables"**
2. Agrega las siguientes variables:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `JWT_SECRET` | (genera una cadena aleatoria segura) |
| `SESSION_SECRET` | (genera otra cadena aleatoria) |
| `FRONTEND_URL` | (la URL de tu app después de deploy) |

### Generar Secretos Seguros

Puedes generar secretos seguros con:

```bash
# En terminal
openssl rand -hex 32
```

O usando una herramienta online de generación de contraseñas.

## Paso 5: Configurar Dockerfile

Si no está automáticamente configurado:

1. En el servicio → **"Settings"**
2. En **"Build"**, selecciona **"Dockerfile"**
3. En **"Dockerfile path"**, escribe: `Dockerfile.new`

## Paso 6: Configurar Start Command

1. En el servicio → **"Settings"**
2. En **"Deploy"** → **"Start Command"**:

```bash
npx prisma migrate deploy && node dist/index.js
```

## Paso 7: Verificar Health Check

1. En **"Settings"** → **"Deploy"**
2. **"Health Check Path"**: `/api/health`

## Paso 8: Deploy

1. Railway comenzará el build automáticamente
2. Espera a que el build termine (puede tomar 2-5 minutos)
3. Una vez completado, click en **"Generate Domain"** para obtener una URL pública

## Paso 9: Verificar Deployment

1. Visita tu URL de Railway
2. Deberías ver la página principal de LaBrute
3. Intenta registrarte y crear un brute

### Verificar API

Visita `https://tu-url.railway.app/api/health`

Deberías ver:
```json
{"status":"ok","timestamp":"2024-..."}
```

## Solución de Problemas

### Error: "Connection refused" en database

- Verifica que `DATABASE_URL` esté configurado correctamente
- Usa `${{Postgres.DATABASE_URL}}` (con dobles llaves)

### Error: Build failed

1. Revisa los logs de build en Railway
2. Asegúrate de que `Dockerfile.new` existe
3. Verifica que los package.json sean válidos

### Error: Health check failed

1. Aumenta el timeout del health check a 300 segundos
2. Verifica que el endpoint `/api/health` responda
3. Revisa los logs de deploy para errores de inicio

### Frontend no carga

1. Verifica que el build de frontend se completó
2. El frontend se sirve desde `/public` en el backend
3. Revisa que `FRONTEND_URL` coincida con tu dominio

## Desarrollo Local

Para desarrollo local, usa Docker Compose:

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

O manualmente:

```bash
# Terminal 1 - Backend
cd backend
npm install
cp env.example.txt .env  # Editar con tu DATABASE_URL
npx prisma migrate dev
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Actualizar Deployment

Para actualizar tu deployment:

1. Haz push de los cambios a GitHub
2. Railway detectará los cambios automáticamente
3. Iniciará un nuevo build y deploy

## Monitoreo

En Railway puedes:

- Ver logs en tiempo real
- Monitorear uso de recursos
- Ver métricas de la base de datos
- Configurar alertas

## Costos

Railway ofrece:
- **Starter Plan**: $5/mes con $5 de crédito inicial gratis
- **Hobby Plan**: Pay-as-you-go
- La base de datos PostgreSQL tiene su propio costo

Para proyectos pequeños, generalmente es ~$5-15/mes.

## Recursos Adicionales

- [Documentación de Railway](https://docs.railway.app/)
- [Prisma con Railway](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

