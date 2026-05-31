# Línea Base v1.0.0-baseline

**Producto:** Sistema Integral de Gestión de Restaurante (SIGR)
**Versión:** v1.0.0-baseline
**Fecha de creación:** 31/05/2026
**Repositorio:** https://github.com/ingjvelez17/sigr
**Rama estable:** `main`
**Commit etiquetado:** `e06d37d` (ver `git rev-parse v1.0.0-baseline`)
**Validado por:** Juan Esteban Vélez Vanegas (rol de desarrollo)
**Aprobado por:** Juan Esteban Vélez Vanegas (rol coordinador designado)
**Estado:** Aprobada

## 1. Componentes incluidos

### 1.1 Backend

Estructura `routes → controllers → models → config` aplicada a cada módulo.

- Servidor principal: `backend/server.js`
- Conexión a PostgreSQL: `backend/src/config/database.js`
- Módulo de autenticación: `User.js`, `authController.js`, `authRoutes.js`, `authMiddleware.js`
- Módulo de menú: `Category.js`, `MenuItem.js`, `menuController.js`, `menuRoutes.js`
- Módulo de pedidos: `Order.js`, `OrderItem.js`, `orderController.js`, `orderRoutes.js`
- Módulo de reservas: `Reservation.js`, `reservationController.js`, `reservationRoutes.js`
- Módulo de caja y reportes: `CashRegister.js`, `reportController.js`, `reportRoutes.js`

### 1.2 Base de datos

- `database/schema.sql` con definición de las ocho tablas, índices, restricciones y seed inicial.

### 1.3 Frontend

- Configuración: `vite.config.js`, `index.html`, `main.jsx`
- Router y contexto: `App.jsx`, `services/AuthContext.jsx`
- Cliente HTTP: `services/api.js`
- Servicios por módulo: `menuService`, `orderService`, `reservationService`, `reportService`
- Páginas: `HomePage`, `LoginPage`, `RegisterPage`, `MenuPage`, `OrdersPage`, `ReservationsPage`, `ReportsPage`
- Componentes compartidos: `Navbar`, `MenuItemCard`, `OrderRow`
- Estilos: `styles.css`

### 1.4 Documentación

- Portada, introducción y objetivo del taller (`docs/portada.md`, `docs/introduccion.md`, `docs/objetivo_taller.md`)
- README, CHANGELOG y LICENSE en la raíz
- Estructura de la BD: `docs/estructura_bd.md`
- Manual de despliegue: `docs/manual_despliegue.md`
- Control de versiones: `docs/control_versiones.md`
- Documento de la línea base (este archivo): `docs/linea_base_v1.md`

## 2. Criterios de aceptación

Cada criterio fue verificado manualmente antes de aprobar la línea base.

- Autenticación con JWT funcional para los tres roles (cliente, mesero, admin).
- Contraseñas guardadas con hash bcrypt; el costo del hash es configurable por variable de entorno.
- CRUD completo de platos y categorías protegido por rol admin.
- Pedidos creados en transacción atómica con cálculo automático del total a partir de los precios actuales del menú.
- Estados de pedido implementados: pendiente, en_preparacion, listo, entregado y cancelado.
- Notificación en tiempo real al crear o actualizar pedidos vía Socket.IO.
- Reservas con validación anti-colisión por mesa, fecha y hora.
- Apertura y cierre de caja con cálculo automático de las ventas del periodo.
- Reporte diario persistido en `daily_reports` con UPSERT por fecha.
- Esquema SQL con llaves foráneas, restricciones CHECK e índices sobre los campos consultados con frecuencia.
- Seed inicial: un administrador, dos categorías y tres platos.
- Frontend con rutas privadas controladas por rol.
- Variables de entorno documentadas en `.env.example` para backend y frontend.
- Documentación completa publicada en el repositorio.
- Licencia MIT aplicada.
- Convenciones de código documentadas y aplicadas (sección 3).

## 3. Convenciones de código

### 3.1 Nombres

- Variables y funciones JavaScript: camelCase en inglés (`getMenuItem`, `userId`).
- Componentes React: PascalCase (`MenuItemCard`, `OrdersPage`).
- Constantes globales: UPPER_SNAKE_CASE (`JWT_SECRET`, `VALID_ROLES`).
- Tablas y columnas SQL: snake_case (`menu_items`, `created_at`).
- Endpoints REST: kebab-case en plural (`/api/menu/items`).
- Archivos de modelos: PascalCase (`User.js`, `OrderItem.js`).
- Archivos de rutas y controladores: camelCase (`authRoutes.js`, `menuController.js`).

### 3.2 Estructura del backend

Separación estricta entre `routes`, `controllers`, `models` y `config`. Cada módulo expone su router en `routes/*.js`. Los modelos retornan objetos planos (filas de `pg`) sin clases ORM. Los controllers usan async/await con try/catch en todos los endpoints. Las respuestas HTTP devuelven el código apropiado (200, 201, 400, 401, 403, 404, 500) y la validación de inputs se hace al inicio del controller.

### 3.3 Manejo de errores

Los logs del servidor llevan el prefijo `[modulo.funcion]` para facilitar la búsqueda. El mensaje devuelto al cliente no expone el stack trace. Los códigos HTTP siguen la convención REST: 400 para validación, 401 sin autenticación, 403 sin permisos, 404 recurso no encontrado, 500 errores no clasificados.

### 3.4 Git y versionado

SemVer en formato `MAJOR.MINOR.PATCH[-tag]`. Tags inmutables para líneas base con sufijo `-baseline`. Mensajes de commit en imperativo presente siguiendo Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).

## 4. Evidencia y trazabilidad

- Tag: `v1.0.0-baseline` en `main`.
- Hash del commit etiquetado: `e06d37d` (largo: `e06d37d885ff2e25bb6f84dc94622090b2c0add9`).
- Comando que creó el tag: `git tag -a v1.0.0-baseline -m "Linea base SIGR v1.0.0"`.
- Esquema SQL: `database/schema.sql`.
- ERD del modelo de datos: `docs/estructura_bd.md`.
- Manual de despliegue: `docs/manual_despliegue.md`.
- Estrategia de control de versiones: `docs/control_versiones.md`.
- Bitácora de cambios: `CHANGELOG.md`.
- Endpoints documentados: sección "Endpoints principales" del README.
- Seguimiento de bugs y mejoras: https://github.com/ingjvelez17/sigr/issues
- Release publicado: https://github.com/ingjvelez17/sigr/releases/tag/v1.0.0-baseline

## 5. Validación y aprobación

Dado que el equipo está conformado por una sola persona, los roles de desarrollo, validación y aprobación los asume Juan Esteban Vélez Vanegas como rol coordinador designado.

| Rol | Nombre | Fecha | Firma |
| --- | --- | --- | --- |
| Desarrollador | Juan Esteban Vélez Vanegas | 31/05/2026 | ______________ |
| Validación funcional | Juan Esteban Vélez Vanegas | 31/05/2026 | ______________ |
| Aprobación final | Juan Esteban Vélez Vanegas | 31/05/2026 | ______________ |

Cualquier modificación posterior a este tag debe incrementar la versión (mínimo PATCH), registrarse en `CHANGELOG.md` y generar un nuevo tag de release.
