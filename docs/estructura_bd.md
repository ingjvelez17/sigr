# SIGR — Estructura de Base de Datos

**Versión:** 1.0.0-baseline
**Motor:** PostgreSQL 14+
**Esquema fuente:** [`database/schema.sql`](../database/schema.sql)

---

## 1. Diagrama ERD (texto / ASCII)

```
                  +---------------------+
                  |       USERS         |
                  |---------------------|
                  | id (PK)             |
                  | name                |
                  | email (UQ, IDX)     |
                  | password_hash       |
                  | role (cliente/      |
                  |      mesero/admin)  |
                  | phone               |
                  | created_at          |
                  +----------+----------+
                             |
        +--------------------+----------------------+
        |                    |                      |
        | 1..N               | 1..N                 | 1..N
        v                    v                      v
+----------------+   +-----------------+   +--------------------+
| ORDERS         |   | RESERVATIONS    |   | CASH_REGISTERS     |
|----------------|   |-----------------|   |--------------------|
| id (PK)        |   | id (PK)         |   | id (PK)            |
| customer_id FK |   | customer_id FK  |   | opened_by FK -> U  |
| waiter_id FK   |   | reservation_date|   | closed_by FK -> U  |
| table_number   |   | reservation_time|   | opening_amount     |
| status         |   | table_number    |   | closing_amount     |
| total          |   | party_size      |   | opening_time       |
| notes          |   | status          |   | closing_time       |
| created_at     |   | notes           |   | total_sales        |
+--------+-------+   +-----------------+   | total_orders       |
         |                                 | status (abierta/   |
         | 1..N                            |        cerrada)    |
         v                                 +--------------------+
+--------------------+
| ORDER_ITEMS        |
|--------------------|
| id (PK)            |
| order_id FK        |
| menu_item_id FK    |
| quantity           |
| unit_price         |
| subtotal           |
| notes              |
+---------+----------+
          |
          | N..1
          v
+--------------------+      N..1     +-----------------+
| MENU_ITEMS         | ------------> | CATEGORIES      |
|--------------------|               |-----------------|
| id (PK)            |               | id (PK)         |
| name (IDX)         |               | name (UQ)       |
| description        |               | description     |
| price              |               +-----------------+
| category_id FK     |
| available (IDX)    |
| image_url          |
+--------------------+

+----------------------+
| DAILY_REPORTS        |
|----------------------|
| id (PK)              |
| report_date (UQ,IDX) |
| total_orders         |
| total_sales          |
| average_order        |
| data (JSONB)         |
| generated_at         |
+----------------------+
```

---

## 2. Descripción de cada tabla

### 2.1 `users`
Centraliza a todos los actores del sistema.
| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | SERIAL PK | Identificador único |
| `name` | VARCHAR(120) | Nombre completo |
| `email` | VARCHAR(160) UQ | Login. Único e indexado |
| `password_hash` | VARCHAR(255) | Hash bcrypt (cost 10) |
| `role` | VARCHAR(20) CHECK | `cliente` \| `mesero` \| `admin` |
| `phone` | VARCHAR(30) | Opcional |
| `created_at`, `updated_at` | TIMESTAMP | Auditoría |

### 2.2 `categories`
Categorías del menú (Entradas, Platos Fuertes, Bebidas, Postres…).

### 2.3 `menu_items`
Platos individuales con precio y disponibilidad. Relación N→1 con `categories`.

### 2.4 `orders`
Pedido raíz. Contiene metadatos del pedido y un `total` calculado por trigger
aplicativo durante la transacción de creación. Estados:
`pendiente`, `en_preparacion`, `listo`, `entregado`, `cancelado`.

### 2.5 `order_items`
Líneas de pedido. Guarda `unit_price` y `subtotal` históricos para que el
precio del plato pueda cambiar sin afectar pedidos pasados.

### 2.6 `reservations`
Reservas por mesa, fecha y hora con `party_size`. Estados:
`confirmada`, `cancelada`, `completada`, `no_show`.

### 2.7 `cash_registers`
Turno de caja: apertura, cierre, totales y usuarios responsables.

### 2.8 `daily_reports`
Snapshot diario de ventas (`UPSERT` por `report_date`) para alimentar
dashboards sin recalcular cada vez.

---

## 3. Relaciones entre entidades

| Origen | Destino | Cardinalidad | Acción on delete |
| --- | --- | --- | --- |
| `orders.customer_id` | `users.id` | N : 1 | SET NULL |
| `orders.waiter_id` | `users.id` | N : 1 | SET NULL |
| `order_items.order_id` | `orders.id` | N : 1 | CASCADE |
| `order_items.menu_item_id` | `menu_items.id` | N : 1 | RESTRICT |
| `menu_items.category_id` | `categories.id` | N : 1 | RESTRICT |
| `reservations.customer_id` | `users.id` | N : 1 | CASCADE |
| `cash_registers.opened_by` | `users.id` | N : 1 | RESTRICT |
| `cash_registers.closed_by` | `users.id` | N : 1 | SET NULL |

Reglas clave:

- Eliminar un pedido borra sus `order_items` (CASCADE) pero **no** el plato del
  menú (RESTRICT).
- Eliminar una categoría está **restringido** si tiene platos asociados.
- Eliminar un cliente conserva sus pedidos (`customer_id` queda `NULL`) para
  no perder ingresos contabilizados.

---

## 4. Índices

| Tabla | Índice | Motivo |
| --- | --- | --- |
| `users` | `idx_users_email` | Login rápido |
| `users` | `idx_users_role` | Filtros por rol |
| `menu_items` | `idx_menu_items_category`, `idx_menu_items_available` | Listado del menú |
| `orders` | `idx_orders_status`, `idx_orders_created_at` | Tablero en cocina |
| `reservations` | `idx_reservations_date`, `idx_reservations_status` | Vista de hoy |
| `daily_reports` | `idx_daily_reports_date` | Histórico |
