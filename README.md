# 🚗 AutoExec - Sistema de Gestión e Infraestructura

Bienvenido al repositorio central de **AutoExec**. Este proyecto integra una API robusta, una plataforma web de gestión, una aplicación móvil y un stack completo de monitoreo y seguridad mediante contenedores Docker.

---

## 📂 Estructura del Proyecto

```text
AutoExec/
├── AppMovil/               # Aplicación Móvil (Expo + React Native)
├── Backend/                # Núcleo del Sistema
│   ├── main.py             # API principal (FastAPI)
│   ├── web/                # Aplicación Web (Laravel)
│   └── ...
├── docker-compose.yml      # Orquestación de servicios (Docker)
├── nginx/                  # Configuración de Servidor Web y Proxy
├── haproxy/                # Balanceador de carga de APIs
├── grafana/                # Dashboards de Monitoreo
├── prometheus/             # Recolección de métricas
├── loki/                   # Gestión de logs
├── promtail/               # Agente de recolección de logs
└── crowdsec/               # Seguridad y Firewall Dinámico
```

---

## 🛠️ Requisitos Generales

Para ejecutar el proyecto completo, se recomienda el uso de **Docker**. Si deseas ejecutar componentes por separado, necesitarás:

- **Docker & Docker Compose** (Recomendado)
- **Node.js:** v20+ & **NPM:** v10+ (Para App Móvil)
- **Python:** 3.11+ (Para Backend FastAPI)
- **PHP:** 8.2+ & **Composer:** 2+ (Para Backend Web Laravel)
- **Base de Datos:** PostgreSQL 15+ (Incluido en Docker)

---

## 🚀 Guía de Inicio Rápido (Docker)

La forma más sencilla de levantar todo el ecosistema (Base de datos, APIs, Web y Monitoreo) es usando Docker Compose:

```bash
# 1. Clonar el repositorio
git clone https://github.com/IsaacAlvSil/AutoExec.git
cd AutoExec

# 2. Levantar todos los servicios
docker compose up -d --build

# 3. Verificar que todo esté corriendo
docker compose ps
```

---

## 🔧 Ejecución por Componentes

### 1. Backend (API FastAPI)
Ubicado en la raíz de `Backend/`.
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate en Windows
pip install -r requirements.txt
python main.py
```

### 2. App Web (Laravel)
Ubicado en `Backend/web/`.
```bash
cd Backend/web
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 3. App Móvil (React Native)
Ubicado en `AppMovil/`.
```bash
cd AppMovil
npm install
# Ajusta el API_URL en src/config.js con tu IP local
npx expo start
```

---

## 📊 Monitoreo y Observabilidad

El proyecto incluye un stack de monitoreo listo para usar:

- **Grafana:** [http://localhost:3000](http://localhost:3000) (Admin / admin123)
- **Prometheus:** [http://localhost:9090](http://localhost:9090)
- **Portainer:** [http://localhost:9000](http://localhost:9000) (Gestión de contenedores)

---

## 🌐 Variables de Entorno Mínimas

### Web (Backend/web/.env)
```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=autoexec
API_BASE_URL=http://api1:8000
```

### Móvil (AppMovil/src/config.js)
```javascript
const API_URL = 'http://[TU_IP_LOCAL]:8000';
```

---

## 📋 Validación Recomendada

Antes de realizar cambios significativos, asegúrate de que el stack de Docker sea estable:
- Revisa los logs: `docker compose logs -f`
- Verifica la salud de la DB: `docker exec -it autoexec_postgres pg_isready`

---
*Desarrollado por el equipo de AutoExec.*
