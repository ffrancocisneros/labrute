# LaBrute - Arena de Gladiadores

Un clon moderno del clásico juego LaBrute, construido con tecnologías actuales.

![LaBrute](https://img.shields.io/badge/LaBrute-Arena%20Game-gold)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)

## Tecnologías

### Backend
- **Node.js** + **Express** - Servidor API REST
- **TypeScript** - Tipado estático
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticación
- **Zod** - Validación de datos

### Frontend
- **React 18** - Biblioteca de UI
- **Material-UI (MUI)** - Componentes de diseño
- **Vite** - Build tool
- **TypeScript** - Tipado estático
- **React Router** - Navegación

### Base de Datos
- **PostgreSQL** - Base de datos relacional

## Estructura del Proyecto

```
labrute/
├── backend/                 # API Node.js/Express
│   ├── prisma/             # Esquema de Prisma
│   ├── src/
│   │   ├── config/         # Configuración
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middleware
│   │   ├── routes/         # Rutas API
│   │   ├── services/       # Lógica de negocio
│   │   ├── types/          # Tipos TypeScript
│   │   ├── utils/          # Utilidades
│   │   ├── app.ts          # Configuración Express
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # App React
│   ├── public/             # Assets estáticos
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── Auth/       # Login, Register
│   │   │   ├── Brute/      # Cards, Stats, Forms
│   │   │   ├── Fight/      # Arena, Log
│   │   │   └── Layout/     # Header, Footer
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Páginas
│   │   ├── services/       # API client
│   │   ├── types/          # Tipos TypeScript
│   │   ├── App.tsx         # App principal
│   │   ├── main.tsx        # Entry point
│   │   └── theme.ts        # Tema MUI
│   ├── package.json
│   └── vite.config.ts
│
├── original-game/           # Assets del juego original
│   └── swf-exported/       # Sprites exportados
│
├── docker-compose.yml       # Docker para desarrollo
├── Dockerfile.new          # Docker para producción
└── README.md
```

## Desarrollo Local

### Requisitos
- Node.js 20+
- PostgreSQL 15+ (o Docker)
- npm o yarn

### Opción 1: Con Docker (Recomendado)

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

Acceder a:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- PostgreSQL: localhost:5432

### Opción 2: Sin Docker

1. **Instalar PostgreSQL** y crear una base de datos:
```sql
CREATE DATABASE labrute;
```

2. **Configurar Backend**:
```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp env.example.txt .env
# Editar .env con tu DATABASE_URL

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

3. **Configurar Frontend**:
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar dev server
npm run dev
```

## Variables de Entorno

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/labrute"
PORT=3001
NODE_ENV=development
JWT_SECRET=tu-secreto-jwt
SESSION_SECRET=tu-secreto-sesion
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Brutes
- `GET /api/brutes` - Listar mis brutes
- `POST /api/brutes` - Crear brute
- `GET /api/brutes/:id` - Obtener brute
- `GET /api/brutes/name/:name` - Buscar por nombre
- `DELETE /api/brutes/:id` - Eliminar brute
- `GET /api/brutes/:id/opponents` - Listar oponentes
- `POST /api/brutes/:id/level-up` - Subir de nivel
- `GET /api/brutes/leaderboard` - Ranking
- `GET /api/brutes/skills` - Listar habilidades

### Peleas
- `POST /api/fights` - Iniciar pelea
- `GET /api/fights/:id` - Obtener pelea
- `GET /api/fights/brute/:bruteId` - Historial de peleas
- `GET /api/fights/recent` - Peleas recientes

## Características

### Implementadas
- ✅ Registro e inicio de sesión
- ✅ Creación de brutes con nombre y habilidades
- ✅ Sistema de combate automático
- ✅ Estadísticas (vida, fuerza, agilidad, velocidad, armadura)
- ✅ Habilidades pasivas
- ✅ Sistema de niveles y experiencia
- ✅ Ranking de jugadores
- ✅ Historial de peleas

### Por Implementar
- 🔄 Animaciones de combate con sprites originales
- 🔄 Sistema completo de armas con efectos visuales
- 🔄 Sistema de mascotas (pets)
- 🔄 Árbol de habilidades al subir de nivel
- 🔄 Sistema de torneos

## Habilidades

| Habilidad | Descripción | Efecto |
|-----------|-------------|--------|
| Armor | Armadura | +5 armadura, -1 velocidad |
| First Strike | Primer Golpe | Ataca primero |
| Immortality | Inmortalidad | +250% resistencia, -25% otros stats |
| Resistant | Resistente | Máx -20% vida por golpe |
| Toughened Skin | Piel Dura | +2 armadura |
| Vitality | Vitalidad | +20% vida |

## Armas

| Tipo | Descripción |
|------|-------------|
| Fast | Mayor combo, intervalo bajo |
| Heavy | Alto daño, lento |
| Long | Mayor contraataque |
| Thrown | Proyectiles ilimitados |
| Sharp | Mayor bloqueo |

## Deployment

### Railway

1. Conecta tu repositorio de GitHub a Railway
2. Configura las variables de entorno:
   - `DATABASE_URL` (añade PostgreSQL)
   - `JWT_SECRET`
   - `SESSION_SECRET`
   - `NODE_ENV=production`
3. Railway detectará automáticamente el Dockerfile

### Variables de Producción
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
PORT=3001
JWT_SECRET=genera-un-secreto-seguro
SESSION_SECRET=genera-otro-secreto-seguro
FRONTEND_URL=https://tu-dominio.railway.app
```

## Licencia

Este proyecto está bajo la licencia AGPL-3.0. Es un tributo al juego original LaBrute.

## Créditos

- Juego original: Motion Twin
- Proyecto base: [Eternaltwin LaBrute](https://gitlab.com/eternaltwin/labrute/labrute-react)
- Sprites y assets del juego original

