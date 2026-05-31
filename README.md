# SIGR — Sistema Integral de Gestión de Restaurante

Aplicación web fullstack para la administración de un restaurante: autenticación con roles, menú digital, pedidos en tiempo real, reservas y cierre de caja con reportes de ventas.

| Atributo | Valor |
| --- | --- |
| Versión | `v1.0.0-baseline` |
| Repositorio | https://github.com/ingjvelez17/sigr |
| Rama estable | `main` |
| Autor | Juan Esteban Vélez Vanegas |
| Licencia | MIT |

## Módulos

- Autenticación con JWT (clientes, meseros, administrador).
- Menú digital con CRUD de platos y categorías.
- Registro y seguimiento de pedidos en tiempo real (Socket.IO).
- Reservas por fecha, hora y mesa.
- Cierre de caja y reportes diarios de ventas.

## Stack

- Backend: Node.js 18+, Express 4, JWT, bcryptjs, Socket.IO.
- Frontend: React 18, React Router 6, Vite 5, Axios.
- Base de datos: PostgreSQL 14+ (driver `pg`).
- Otros: dotenv, morgan, cors.

## Requisitos previos

- Node.js >= 18
- npm >= 9
- PostgreSQL >= 14
- Git

```bash
node -v
npm -v
psql --version
```

## Instalación

```bash
git clone https://github.com/ingjvelez17/sigr.git
cd sigr
npm run install:all
```

Crear la base de datos y cargar el esquema:

```bash
createdb sigr_db
psql -d sigr_db -f database/schema.sql
```

O usar el script abreviado:

```bash
npm run db:setup
```

## Variables de entorno

Copiar los `.env.example` y completarlos:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### `backend/.env`

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto del API | `4000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `FRONTEND_URL` | Origen permitido por CORS | `http://localhost:5173` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base | `sigr_db` |
| `DB_USER` | Usuario PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña PostgreSQL | `postgres` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `cambia_este_secreto` |
| `JWT_EXPIRES_IN` | Expiración del token | `8h` |
| `BCRYPT_ROUNDS` | Costo bcrypt | `10` |

### `frontend/.env`

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL del API | `http://localhost:4000/api` |
| `VITE_SOCKET_URL` | URL del socket | `http://localhost:4000` |

## Ejecución

Desarrollo:

```bash
npm run dev
```

Levanta backend (`:4000`) y frontend (`:5173`) en paralelo.

Manual:

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
| GET | `/menu/items` | público | Lista platos (filtros: `available`, `categoryId`) |
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
| GET | `/reports/daily` | admin | Reporte diario (`date=YYYY-MM-DD`) |

## Estructura del proyecto

```
sigr/
├── backend/                # API Node + Express
│   ├── src/
│   │   ├── config/         # Conexión a PostgreSQL
│   │   ├── controllers/    # Lógica HTTP
│   │   ├── middlewares/    # JWT y autorización
│   │   ├── models/         # Acceso a datos
│   │   └── routes/         # Definición de endpoints
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/               # SPA React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/       # axios + AuthContext
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql          # Esquema PostgreSQL + seed
├── docs/
│   ├── portada.md
│   ├── introduccion.md
│   ├── objetivo_taller.md
│   ├── estructura_bd.md
│   ├── manual_despliegue.md
│   ├── control_versiones.md
│   └── linea_base_v1.md
├── README.md
├── CHANGELOG.md
├── LICENSE.txt
└── package.json
```

## Flujo principal

```
   +-----------+      JWT       +------------+      SQL       +--------------+
   | Cliente   | -------------> |  Express   | -------------> | PostgreSQL   |
   | (React)   | <------------- |  API REST  | <------------- |              |
   +-----------+   JSON / WS    +------------+                +--------------+
        |                              |
        |       Socket.IO push         |
        +------------------------------+
                (pedidos en tiempo real
                 a cocina y mesero)
```

Flujo de un pedido:

```
[Cliente] --POST /orders--> [API] --INSERT--> [PostgreSQL]
                                |
                                +--socket.emit("order:new")--> [Cocina]
                                                                  |
                       [Mesero] <--socket.emit("order:updated")---+
```

## Documentación complementaria

| Documento | Ruta |
| --- | --- |
| Portada | `docs/portada.md` |
| Introducción | `docs/introduccion.md` |
| Objetivo del taller | `docs/objetivo_taller.md` |
| Estructura de la BD (ERD) | `docs/estructura_bd.md` |
| Manual de despliegue | `docs/manual_despliegue.md` |
| Control de versiones | `docs/control_versiones.md` |
| Línea base v1.0.0 | `docs/linea_base_v1.md` |
| Historial de cambios | `CHANGELOG.md` |

## Licencia

Distribuido bajo licencia MIT. Ver [`LICENSE.txt`](./LICENSE.txt).
