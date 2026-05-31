# Changelog

Sigue el formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto se adhiere a [SemVer](https://semver.org/lang/es/).

## [1.0.0-baseline] — 2026-05-31

Primera línea base oficial del SIGR. Tag inmutable que congela la versión inicial estable del sistema.

Repositorio: https://github.com/ingjvelez17/sigr — Rama: `main`.

### Added

- Autenticación con JWT y roles `cliente`, `mesero`, `admin`. Incluye registro, login, logout, perfil del usuario actual y middlewares para autenticación y autorización por rol.
- Menú digital con CRUD completo de categorías y platos, filtros por disponibilidad y categoría, y restricción a rol `admin` en las operaciones de escritura.
- Pedidos con creación transaccional, cálculo automático del total, estados `pendiente / en_preparacion / listo / entregado / cancelado` y notificación en tiempo real por Socket.IO a las salas `kitchen` y `waiter`.
- Reservas con validación anti-colisión por mesa, fecha y hora, estados `confirmada / cancelada / completada / no_show` y endpoint para que el cliente vea su historial.
- Caja con apertura y cierre por turno, cálculo automático de ventas totales del periodo y persistencia en `cash_registers`.
- Reportes diarios de ventas con detalle de top platos, ventas por categoría y persistencia por fecha (UPSERT) en `daily_reports`.
- Esquema PostgreSQL con ocho tablas, llaves foráneas consistentes, restricciones `CHECK` sobre enumerados e índices sobre columnas consultadas con frecuencia (email, fecha, estado).
- Seed inicial con un administrador (`admin@sigr.com / Admin123`), dos categorías y tres platos de ejemplo.
- Frontend React con páginas de inicio, login, registro, menú, pedidos, reservas y reportes; persistencia del token en `localStorage` y cliente Socket.IO para actualización en vivo de pedidos.
- Documentación: README, CHANGELOG, LICENSE, ERD del modelo de datos, manual de despliegue, documento de control de versiones y documento de la línea base.
- `package.json` raíz con scripts orquestadores (`install:all`, `dev`, `build`, `db:setup`).
- Archivos `.env.example` para backend y frontend.

### Changed

- Reorganización del proyecto en `backend/`, `frontend/`, `database/` y `docs/` para separar responsabilidades.

### Fixed

- Sin correcciones aplicables: versión inicial.

[1.0.0-baseline]: https://github.com/ingjvelez17/sigr/releases/tag/v1.0.0-baseline
