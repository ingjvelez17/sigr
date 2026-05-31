# Changelog

Todas las modificaciones notables del proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0-baseline] - 2026-05-31

Primera línea base oficial del Sistema Integral de Gestión de Restaurante.

- Repositorio: https://github.com/ingjvelez17/sigr
- Rama: `main`
- Responsable de aprobación: Juan Esteban Vélez Vanegas

### Added

- Módulo de autenticación con JWT y roles `cliente`, `mesero`, `admin`. Incluye registro, login, logout, perfil del usuario autenticado y middlewares de autenticación y autorización por rol.
- Módulo de menú digital con CRUD completo de categorías y platos, filtros por disponibilidad y categoría, y restricciones por rol `admin` para las operaciones de escritura.
- Módulo de pedidos con creación transaccional, cálculo automático del total, estados `pendiente`, `en_preparacion`, `listo`, `entregado` y `cancelado`, y notificación en tiempo real vía Socket.IO a las salas `kitchen` y `waiter`.
- Módulo de reservas con validación anti-colisión por mesa, fecha y hora, estados `confirmada`, `cancelada`, `completada` y `no_show`, y endpoint para que el cliente consulte su historial.
- Módulo de caja con apertura y cierre por turno, cálculo automático de ventas totales del periodo y persistencia en `cash_registers`.
- Módulo de reportes diarios de ventas con detalle de top platos, ventas por categoría y persistencia por fecha en `daily_reports`.
- Esquema PostgreSQL con ocho tablas, llaves foráneas consistentes, restricciones `CHECK` para enumerados e índices sobre campos consultados con frecuencia.
- Seed inicial con un administrador, dos categorías y tres platos de ejemplo.
- Frontend React con páginas para inicio, login, registro, menú, pedidos, reservas y reportes, persistencia del token en `localStorage` y cliente Socket.IO para actualización en vivo de pedidos.
- Documentación: README con tabla de endpoints, manual de despliegue, modelo de datos con ERD, control de versiones y documento de línea base.
- `package.json` raíz con scripts orquestadores `install:all`, `dev`, `build` y `db:setup`.
- Archivos `.env.example` para backend y frontend.

### Changed

- Estructura del proyecto reorganizada en `backend/`, `frontend/`, `database/` y `docs/` para separar responsabilidades.

### Fixed

- Sin correcciones aplicables: versión inicial.

[1.0.0-baseline]: https://github.com/ingjvelez17/sigr/releases/tag/v1.0.0-baseline
