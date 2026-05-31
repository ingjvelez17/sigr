-- =====================================================================
-- SIGR - Sistema Integral de Gestion de Restaurante
-- Esquema de base de datos PostgreSQL 14+
-- Version: 1.0.0-baseline
-- Commit ref: a93b4f1
-- =====================================================================

DROP TABLE IF EXISTS daily_reports        CASCADE;
DROP TABLE IF EXISTS cash_registers       CASCADE;
DROP TABLE IF EXISTS reservations         CASCADE;
DROP TABLE IF EXISTS order_items          CASCADE;
DROP TABLE IF EXISTS orders               CASCADE;
DROP TABLE IF EXISTS menu_items           CASCADE;
DROP TABLE IF EXISTS categories           CASCADE;
DROP TABLE IF EXISTS users                CASCADE;

-- ---------------------------------------------------------------------
-- USERS
-- Almacena clientes, meseros y administrador. La contrasena se
-- guarda hasheada con bcrypt (campo password_hash).
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('cliente', 'mesero', 'admin')),
    phone         VARCHAR(30),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role  ON users (role);

-- ---------------------------------------------------------------------
-- CATEGORIES
-- Categorias del menu (entradas, platos fuertes, bebidas, postres...).
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_name ON categories (name);

-- ---------------------------------------------------------------------
-- MENU_ITEMS
-- Platos individuales que el restaurante ofrece.
-- ---------------------------------------------------------------------
CREATE TABLE menu_items (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    description TEXT,
    price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    available   BOOLEAN NOT NULL DEFAULT TRUE,
    image_url   VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_items_category   ON menu_items (category_id);
CREATE INDEX idx_menu_items_available  ON menu_items (available);
CREATE INDEX idx_menu_items_name       ON menu_items (name);

-- ---------------------------------------------------------------------
-- ORDERS
-- Pedidos hechos en el restaurante. Estados:
-- pendiente, en_preparacion, listo, entregado, cancelado.
-- ---------------------------------------------------------------------
CREATE TABLE orders (
    id           SERIAL PRIMARY KEY,
    customer_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
    waiter_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    table_number INTEGER,
    status       VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                  CHECK (status IN ('pendiente','en_preparacion','listo','entregado','cancelado')),
    total        NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    notes        TEXT,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status      ON orders (status);
CREATE INDEX idx_orders_customer    ON orders (customer_id);
CREATE INDEX idx_orders_waiter      ON orders (waiter_id);
CREATE INDEX idx_orders_created_at  ON orders (created_at);

-- ---------------------------------------------------------------------
-- ORDER_ITEMS
-- Detalle de cada pedido (relacion N-N entre orders y menu_items).
-- ---------------------------------------------------------------------
CREATE TABLE order_items (
    id           SERIAL PRIMARY KEY,
    order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    quantity     INTEGER NOT NULL CHECK (quantity > 0),
    unit_price   NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    subtotal     NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    notes        TEXT,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order     ON order_items (order_id);
CREATE INDEX idx_order_items_menu_item ON order_items (menu_item_id);

-- ---------------------------------------------------------------------
-- RESERVATIONS
-- Reservas de mesa por fecha y hora. Estados:
-- confirmada, cancelada, completada, no_show.
-- ---------------------------------------------------------------------
CREATE TABLE reservations (
    id               SERIAL PRIMARY KEY,
    customer_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    table_number     INTEGER NOT NULL,
    party_size       INTEGER NOT NULL CHECK (party_size > 0),
    status           VARCHAR(20) NOT NULL DEFAULT 'confirmada'
                      CHECK (status IN ('confirmada','cancelada','completada','no_show')),
    notes            TEXT,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reservations_date     ON reservations (reservation_date);
CREATE INDEX idx_reservations_status   ON reservations (status);
CREATE INDEX idx_reservations_customer ON reservations (customer_id);

-- ---------------------------------------------------------------------
-- CASH_REGISTERS
-- Apertura y cierre de caja por turno.
-- ---------------------------------------------------------------------
CREATE TABLE cash_registers (
    id              SERIAL PRIMARY KEY,
    opened_by       INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    closed_by       INTEGER REFERENCES users(id) ON DELETE SET NULL,
    opening_amount  NUMERIC(10,2) NOT NULL CHECK (opening_amount >= 0),
    closing_amount  NUMERIC(10,2),
    opening_time    TIMESTAMP NOT NULL DEFAULT NOW(),
    closing_time    TIMESTAMP,
    total_sales     NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_orders    INTEGER NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'abierta'
                     CHECK (status IN ('abierta','cerrada')),
    notes           TEXT
);

CREATE INDEX idx_cash_registers_status ON cash_registers (status);
CREATE INDEX idx_cash_registers_opened ON cash_registers (opening_time);

-- ---------------------------------------------------------------------
-- DAILY_REPORTS
-- Snapshot diario de ventas para acceso rapido en dashboards.
-- ---------------------------------------------------------------------
CREATE TABLE daily_reports (
    id            SERIAL PRIMARY KEY,
    report_date   DATE NOT NULL UNIQUE,
    total_orders  INTEGER NOT NULL DEFAULT 0,
    total_sales   NUMERIC(10,2) NOT NULL DEFAULT 0,
    average_order NUMERIC(10,2) NOT NULL DEFAULT 0,
    data          JSONB,
    generated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_daily_reports_date ON daily_reports (report_date);

-- =====================================================================
-- SEED INICIAL
-- =====================================================================

-- Admin por defecto. Contrasena en texto plano: Admin123
-- (hash bcrypt generado con cost=10)
INSERT INTO users (name, email, password_hash, role, phone) VALUES
('Administrador SIGR',
 'admin@sigr.com',
 '$2a$10$h5ygJLHHZL4.ENLFKV7sNe3Ysbf6sRClX.0.EBoI6mMmIsvPErEW6',
 'admin',
 '3000000000');

-- Categorias
INSERT INTO categories (name, description) VALUES
('Platos Fuertes', 'Platos principales del menu del restaurante'),
('Bebidas',        'Bebidas frias y calientes');

-- Platos de ejemplo
INSERT INTO menu_items (name, description, price, category_id, available) VALUES
('Bandeja Paisa',
 'Plato tipico colombiano con frijoles, arroz, carne molida, chicharron, huevo, platano y aguacate',
 28000.00, 1, TRUE),
('Lomo de Res al Grill',
 'Lomo de res de 250g acompanado de papas rusticas y vegetales salteados',
 35000.00, 1, TRUE),
('Limonada Natural',
 'Limonada hecha al momento con limones frescos',
 6000.00, 2, TRUE);

-- Mensaje final
DO $$
BEGIN
  RAISE NOTICE 'SIGR schema cargado correctamente. Usuario admin: admin@sigr.com / Admin123';
END $$;
