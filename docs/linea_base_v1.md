# Línea Base v1.0.0-baseline

| Item | Valor |
| --- | --- |
| Producto | Sistema Integral de Gestión de Restaurante (SIGR) |
| Versión | `v1.0.0-baseline` |
| Fecha de creación | 31/05/2026 |
| Repositorio | https://github.com/ingjvelez17/sigr |
| Rama estable | `main` |
| Commit de referencia | ver `git rev-parse v1.0.0-baseline` |
| Validado por | Desarrollo (Juan Esteban Vélez Vanegas) |
| Responsable de aprobación | Juan Esteban Vélez Vanegas (rol designado) |
| Estado | Aprobada |

## 1. Componentes incluidos

### 1.1 Backend

| Módulo | Archivo |
| --- | --- |
| Servidor principal | `backend/server.js` |
| Conexión BD | `backend/src/config/database.js` |
| Auth — modelo | `backend/src/models/User.js` |
| Auth — controlador | `backend/src/controllers/authController.js` |
| Auth — rutas | `backend/src/routes/authRoutes.js` |
| Auth — middleware | `backend/src/middlewares/authMiddleware.js` |
| Menú — categoría | `backend/src/models/Category.js` |
| Menú — plato | `backend/src/models/MenuItem.js` |
| Menú — controlador | `backend/src/controllers/menuController.js` |
| Menú — rutas | `backend/src/routes/menuRoutes.js` |
| Pedidos — orden | `backend/src/models/Order.js` |
| Pedidos — item | `backend/src/models/OrderItem.js` |
| Pedidos — controlador | `backend/src/controllers/orderController.js` |
| Pedidos — rutas | `backend/src/routes/orderRoutes.js` |
| Reservas — modelo | `backend/src/models/Reservation.js` |
| Reservas — controlador | `backend/src/controllers/reservationController.js` |
| Reservas — rutas | `backend/src/routes/reservationRoutes.js` |
| Caja — modelo | `backend/src/models/CashRegister.js` |
| Reportes — controlador | `backend/src/controllers/reportController.js` |
| Reportes — rutas | `backend/src/routes/reportRoutes.js` |

### 1.2 Base de datos

| Componente | Archivo |
| --- | --- |
| Esquema y seed | `database/schema.sql` |

### 1.3 Frontend

| Componente | Archivo |
| --- | --- |
| Configuración Vite | `frontend/vite.config.js` |
| Entry HTML | `frontend/index.html` |
| Entry React | `frontend/src/main.jsx` |
| Router raíz | `frontend/src/App.jsx` |
| AuthContext | `frontend/src/services/AuthContext.jsx` |
| Cliente HTTP | `frontend/src/services/api.js` |
| Servicios de módulos | `frontend/src/services/{menu,order,reservation,report}Service.js` |
| Páginas | `frontend/src/pages/*.jsx` |
| Componentes | `frontend/src/components/*.jsx` |
| Estilos | `frontend/src/styles.css` |

### 1.4 Documentación

| Documento | Archivo |
| --- | --- |
| Portada | `docs/portada.md` |
| Introducción | `docs/introduccion.md` |
| Objetivo del taller | `docs/objetivo_taller.md` |
| README principal | `README.md` |
| Changelog | `CHANGELOG.md` |
| Licencia | `LICENSE.txt` |
| Estructura de BD | `docs/estructura_bd.md` |
| Manual de despliegue | `docs/manual_despliegue.md` |
| Control de versiones | `docs/control_versiones.md` |
| Línea base v1 | `docs/linea_base_v1.md` |

## 2. Criterios de aceptación verificados

- Autenticación con JWT funcional para los tres roles (`cliente`, `mesero`, `admin`).
- Contraseñas almacenadas con hash bcrypt (cost configurable vía variable de entorno).
- CRUD completo de platos y categorías protegido por rol `admin`.
- Pedidos creados en transacción atómica con cálculo automático del total.
- Estados de pedido implementados: `pendiente`, `en_preparacion`, `listo`, `entregado`, `cancelado`.
- Notificación en tiempo real de nuevos pedidos vía Socket.IO.
- Reservas con validación anti-colisión por mesa, fecha y hora.
- Apertura y cierre de caja con cálculo automático de ventas totales por turno.
- Reporte diario que persiste en `daily_reports` con `UPSERT` por fecha.
- Esquema SQL con foreign keys, restricciones `CHECK` e índices sobre campos consultados con frecuencia.
- Seed inicial: un administrador, dos categorías, tres platos de ejemplo.
- Frontend React con rutas privadas controladas por rol.
- Variables de entorno documentadas en `.env.example` para backend y frontend.
- Documentación completa: README, CHANGELOG, ERD, manual de despliegue, control de versiones.
- Licencia MIT aplicada.
- Convenciones de código aplicadas y documentadas.

## 3. Convenciones de código adoptadas

### 3.1 Nombrado

| Elemento | Convención | Ejemplo |
| --- | --- | --- |
| Variables y funciones JS | camelCase en inglés | `getMenuItem`, `userId` |
| Componentes React | PascalCase | `MenuItemCard`, `OrdersPage` |
| Constantes globales | UPPER_SNAKE_CASE | `JWT_SECRET`, `VALID_ROLES` |
| Tablas y columnas SQL | snake_case | `menu_items`, `created_at` |
| Endpoints REST | kebab-case en plural | `/api/menu/items` |
| Archivos modelo | PascalCase.js | `User.js`, `OrderItem.js` |
| Archivos rutas y controladores | camelCase.js | `authRoutes.js`, `menuController.js` |

### 3.2 Estructura

Separación estricta `routes → controllers → models → config`. Cada módulo de negocio expone su router en `routes/*.js`. Los modelos retornan objetos planos (filas de `pg`) sin clases ORM. Los controllers usan `try/catch` con `async/await` —nunca callbacks. Las respuestas HTTP siempre devuelven el código apropiado (200, 201, 400, 401, 403, 404, 500) y la validación de inputs ocurre al inicio del controller (fail-fast).

### 3.3 Manejo de errores

Los logs del servidor llevan el prefijo `[modulo.funcion]` para facilitar la búsqueda. El mensaje devuelto al cliente nunca expone el stack trace. Los códigos HTTP siguen la convención REST estándar: 400 para validación, 401 para falta de autenticación, 403 para falta de permisos, 404 para recursos inexistentes, 500 para errores no clasificados.

### 3.4 Git y versionado

SemVer `MAJOR.MINOR.PATCH[-tag]`. Tags inmutables para líneas base con sufijo `-baseline`. Mensajes de commit en imperativo presente siguiendo Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).

## 4. Evidencia y trazabilidad

| Artefacto | Ubicación |
| --- | --- |
| Tag de la línea base | `v1.0.0-baseline` en `main` |
| Comando de creación del tag | `git tag -a v1.0.0-baseline -m "Línea base SIGR v1.0.0"` |
| Esquema SQL ejecutable | `database/schema.sql` |
| Diagrama ERD | `docs/estructura_bd.md` |
| Manual de despliegue | `docs/manual_despliegue.md` |
| Estrategia Git | `docs/control_versiones.md` |
| Lista de cambios | `CHANGELOG.md` |
| Endpoints | `README.md` |
| Issues | https://github.com/ingjvelez17/sigr/issues |
| Release | https://github.com/ingjvelez17/sigr/releases/tag/v1.0.0-baseline |

## 5. Validación y aprobación

| Rol | Nombre | Fecha | Firma |
| --- | --- | --- | --- |
| Desarrollador | Juan Esteban Vélez Vanegas | 31/05/2026 | _________________ |
| Validación | Juan Esteban Vélez Vanegas | 31/05/2026 | _________________ |
| Aprobación | Juan Esteban Vélez Vanegas (rol coordinador designado) | 31/05/2026 | _________________ |

Esta línea base congela los artefactos relacionados. Cualquier modificación posterior debe incrementar la versión (mínimo PATCH) y registrarse en `CHANGELOG.md`.
