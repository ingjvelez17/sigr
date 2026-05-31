# SIGR — Manual de Despliegue (Producción)

**Versión documento:** 1.0.0-baseline
**Aplicación:** Sistema Integral de Gestión de Restaurante

---

## 1. Prerrequisitos del servidor

| Componente | Versión mínima | Notas |
| --- | --- | --- |
| Sistema operativo | Ubuntu 22.04 LTS / Windows Server 2022 | 2 vCPU, 4 GB RAM |
| Node.js | 18 LTS | Recomendado 20 LTS |
| npm | 9 | Incluido con Node |
| PostgreSQL | 14 | Recomendado 16 |
| Nginx | 1.22 | Reverse proxy / TLS |
| Git | 2.40 | Para clonar el repo |
| PM2 (opcional) | 5 | Manejo de procesos |

Apertura de puertos:
- `80/tcp` y `443/tcp` → Nginx
- `4000/tcp` → API (interno)
- `5432/tcp` → PostgreSQL (solo loopback o red privada)

---

## 2. Pasos de instalación

### 2.1 Preparar el servidor

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential nginx postgresql postgresql-contrib

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

node -v && npm -v
```

### 2.2 Crear usuario de aplicación

```bash
sudo adduser --system --group sigr
sudo mkdir -p /opt/sigr && sudo chown sigr:sigr /opt/sigr
```

### 2.3 Clonar el repositorio

```bash
sudo -u sigr -H git clone https://github.com/ingjvelez17/sigr.git /opt/sigr
cd /opt/sigr
sudo -u sigr -H git checkout v1.0.0-baseline   # commit a93b4f1
```

### 2.4 Configurar PostgreSQL

```bash
sudo -u postgres psql <<SQL
CREATE USER sigr_app WITH PASSWORD 'cambia_esta_clave';
CREATE DATABASE sigr_db OWNER sigr_app;
GRANT ALL PRIVILEGES ON DATABASE sigr_db TO sigr_app;
SQL

# Cargar esquema y seed
sudo -u sigr -H psql -h localhost -U sigr_app -d sigr_db -f /opt/sigr/database/schema.sql
```

### 2.5 Instalar dependencias y construir

```bash
cd /opt/sigr
sudo -u sigr -H npm run install:all
sudo -u sigr -H npm run build      # genera frontend/dist
```

---

## 3. Configuración de variables de entorno

### 3.1 `backend/.env`

```env
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://sigr.tudominio.com

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=sigr_db
DB_USER=sigr_app
DB_PASSWORD=cambia_esta_clave

JWT_SECRET=genera_uno_con_openssl_rand_base64_64
JWT_EXPIRES_IN=8h
BCRYPT_ROUNDS=12
```

Generar `JWT_SECRET` seguro:

```bash
openssl rand -base64 64
```

### 3.2 `frontend/.env`

```env
VITE_API_URL=https://sigr.tudominio.com/api
VITE_SOCKET_URL=https://sigr.tudominio.com
```

> Rebuild del frontend cada vez que cambien las `VITE_*`:
> `npm --prefix frontend run build`.

---

## 4. Servicio systemd para la API

`/etc/systemd/system/sigr-api.service`

```ini
[Unit]
Description=SIGR API
After=network.target postgresql.service

[Service]
Type=simple
User=sigr
WorkingDirectory=/opt/sigr/backend
EnvironmentFile=/opt/sigr/backend/.env
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Activar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now sigr-api
sudo systemctl status sigr-api
```

---

## 5. Nginx (frontend estático + reverse proxy)

`/etc/nginx/sites-available/sigr`

```nginx
server {
    listen 80;
    server_name sigr.tudominio.com;

    root /opt/sigr/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Activar y emitir TLS:

```bash
sudo ln -s /etc/nginx/sites-available/sigr /etc/nginx/sites-enabled/sigr
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d sigr.tudominio.com
```

---

## 6. Comandos de inicio y verificación

```bash
# Estado servicios
sudo systemctl status sigr-api
sudo systemctl status nginx
sudo systemctl status postgresql

# Logs en vivo
sudo journalctl -u sigr-api -f

# Healthcheck
curl -fsS https://sigr.tudominio.com/api/health
# Respuesta esperada: {"status":"ok","uptime":<n>}

# Smoke test de login
curl -X POST https://sigr.tudominio.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@sigr.com","password":"Admin123"}'
```

---

## 7. Backups

Backup nocturno con `pg_dump`:

```bash
# /etc/cron.daily/sigr-backup
#!/bin/bash
DATE=$(date +%F)
sudo -u postgres pg_dump -Fc sigr_db > /var/backups/sigr_${DATE}.dump
find /var/backups -name "sigr_*.dump" -mtime +14 -delete
```

Restauración:

```bash
sudo -u postgres pg_restore -c -d sigr_db /var/backups/sigr_YYYY-MM-DD.dump
```

---

## 8. Rollback

Para volver al commit baseline tras una actualización fallida:

```bash
cd /opt/sigr
sudo -u sigr -H git checkout a93b4f1
sudo -u sigr -H npm run install:all
sudo -u sigr -H npm run build
sudo systemctl restart sigr-api
```
