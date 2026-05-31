# SIGR — Sistema Integral de Gestión de Restaurante

Aplicación web fullstack para administrar la operación diaria de un restaurante: autenticación con roles, menú digital, pedidos en tiempo real, reservas y cierre de caja con reportes de ventas.

- Versión: `v1.0.0-baseline`
- Repositorio: https://github.com/ingjvelez17/sigr
- Autor: Juan Esteban Vélez Vanegas
- Licencia: MIT

## Módulos

- Autenticación con JWT y roles cliente / mesero / administrador.
- Menú digital con CRUD de platos y categorías.
- Pedidos en tiempo real con notificación por Socket.IO.
- Reservas por fecha, hora y mesa.
- Cierre de caja por turno y reportes diarios de ventas.

## Stack

Backend: Node.js 18+, Express 4, bcryptjs, jsonwebtoken, Socket.IO, dotenv, morgan, cors.
Frontend: React 18, React Router 6, Vite 5, Axios.
Base de datos: PostgreSQL 14+ (driver `pg`).

## Requisitos

- Node.js >= 18 y npm >= 9
- PostgreSQL >= 14
- Git

```bash
node -v
npm -v
psql --version
```

## Instalación

Clonar el repo y descargar dependencias:

```bash
git clone https://github.com/ingjvelez17/sigr.git
cd sigr
npm run install:all
```

Crear la base de datos y cargar el esquema con seed:

```bash
createdb sigr_db
psql -d sigr_db -f database/schema.sql
```

O el script equivalente:

```bash
npm run db:setup
```

## Variables de entorno

Copiar los `.env.example` y completar:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### `backend/.env`

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `PORT` | Puerto del API | `4000` |
| `NODE_ENV` | Entorno | `development` |
| `FRONTEND_URL` | Origen permitido por CORS | `http://localhost:5173` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base | `sigr_db` |
| `DB_USER` | Usuario PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña PostgreSQL | (sin valor) |
| `JWT_SECRET` | Secreto para firmar JWT | (cambiar en producción) |
| `JWT_EXPIRES_IN` | Expiración del token | `8h` |
| `BCRYPT_ROUNDS` | Costo bcrypt | `10` |

### `frontend/.env`

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `VITE_API_URL` | URL del API | `http://localhost:4000/api` |
| `VITE_SOCKET_URL` | URL del socket | `http://localhost:4000` |

## Ejecución

Desarrollo (levanta backend y frontend en paralelo):

```bash
npm run dev
```

Si se prefiere por separado:

```bash
cd backend && npm run dev    # terminal 1
cd frontend && npm run dev   # terminal 2
```

Producción:

```bash
npm run build           # construye frontend en frontend/dist
cd backend && npm start # arranca API
```

Credenciales del seed:

| Usuario | Email | Contraseña |
| --- | --- | --- |
| Administrador | `admin@sigr.com` | `Admin123` |

## Endpoints principales

Base URL: `http://localhost:4000/api`

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/auth/register` | público | Registra un usuario |
| POST | `/auth/login` | público | Login y emisión de JWT |
| GET | `/auth/me` | JWT | Perfil del usuario actual |
| POST | `/auth/logout` | JWT | Cierra la sesión |
| GET | `/menu/categories` | público | Lista categorías |
| POST | `/menu/categories` | admin | Crea categoría |
| GET | `/menu/items` | público | Lista platos |
| POST | `/menu/items` | admin | Crea plato |
| PUT | `/menu/items/:id` | admin | Actualiza plato |
| DELETE | `/menu/items/:id` | admin | Elimina plato |
| GET | `/orders` | JWT | Lista pedidos |
| POST | `/orders` | JWT | Crea pedido |
| PATCH | `/orders/:id/status` | mesero/admin | Cambia estado |
| GET | `/reservations` | mesero/admin | Lista reservas |
| GET | `/reservations/me` | JWT | Mis reservas |
| POST | `/reservations` | JWT | Crea reserva |
| PATCH | `/reservations/:id/status` | mesero/admin | Cambia estado |
| POST | `/reports/cash/open` | mesero/admin | Abre caja |
| POST | `/reports/cash/:id/close` | mesero/admin | Cierra caja |
| GET | `/reports/daily` | admin | Reporte diario |

## Estructura del proyecto

```
sigr/
├── backend/                # API Node + Express
│   ├── src/
│   │   ├── config/         # Conexión a PostgreSQL
│   │   ├── controllers/    # Lógica HTTP
│   │   ├── middlewares/    # JWT y autorización
│   │   ├── models/         # Acceso a datos
│   │   └── routes/         # Endpoints
│   ├── server.js
│   └── package.json
├── frontend/               # SPA React + Vite
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── database/
│   └── schema.sql
├── docs/                   # Documentación del taller
├── README.md
├── CHANGELOG.md
├── LICENSE.txt
└── package.json
```

## Documentación adicional

- Portada del taller: `docs/portada.md`
- Introducción: `docs/introduccion.md`
- Objetivo del taller: `docs/objetivo_taller.md`
- Modelo de datos (ERD): `docs/estructura_bd.md`
- Manual de despliegue: `docs/manual_despliegue.md`
- Control de versiones: `docs/control_versiones.md`
- Documento de línea base v1.0.0: `docs/linea_base_v1.md`
- Historial de cambios: `CHANGELOG.md`

## Licencia

MIT. Ver `LICENSE.txt`.
