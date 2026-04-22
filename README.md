# AutoExec - Sistema de Gestion e Infraestructura

Este repositorio contiene la arquitectura completa del proyecto AutoExec, integrando servicios de backend, aplicacion web, aplicacion movil y una infraestructura de monitoreo y seguridad basada en Docker.

---

## Estructura del Proyecto

```text
AutoExec/
├── AppMovil/               # Aplicacion movil desarrollada con Expo y React Native
├── Backend/                # Directorio principal de servicios de backend
│   ├── main.py             # API principal construida con FastAPI (Python)
│   ├── web/                # Aplicacion de gestion web construida con Laravel (PHP)
│   ├── models/             # Definiciones de modelos de datos
│   ├── routers/            # Endpoints y logica de rutas de la API
│   ├── security/           # Configuracion de autenticacion y seguridad
│   └── data/               # Scripts de gestion de datos y base de datos
├── autoExec/               # Archivos de soporte y configuracion del sistema
├── crowdsec/               # Configuracion de seguridad y firewall dinamico
├── grafana/                # Dashboards y visualizacion de metricas (Observabilidad)
├── haproxy/                # Configuracion del balanceador de carga para las APIs
├── loki/                   # Sistema de agregacion de logs
├── nginx/                  # Servidor web principal y proxy inverso
├── prometheus/             # Sistema de recoleccion de metricas y alertas
├── promtail/               # Agente para el envio de logs a Loki
├── scripts/                # Utilidades y scripts de automatizacion
├── docker-compose.yml      # Orquestacion definitiva de todos los servicios
└── targets.json            # Configuracion de discovery para Prometheus
```

---

## Requisitos del Sistema

Para la ejecucion completa mediante contenedores:
- Docker Engine (v24.0+)
- Docker Compose (v2.0+)

Para desarrollo local (sin Docker):
- Node.js (v20+) y NPM (v10+)
- Python (3.11+)
- PHP (8.2+) y Composer (2.0+)
- PostgreSQL (15+)

---

## Guia de Ejecucion

### Metodo Recomendado: Docker Compose

Este comando levantara la base de datos, las APIs, la web, el sistema de balanceo y todo el stack de monitoreo de forma automatica.

```bash
# Construir e iniciar todos los servicios en segundo plano
docker compose up -d --build

# Verificar que todos los servicios esten activos y saludables
docker compose ps
```

### Ejecucion Individual de Componentes

#### 1. Backend (FastAPI)
Ejecuta la API de servicios principal.
```bash
cd Backend
pip install -r requirements.txt
python main.py
```

#### 2. App Web (Laravel)
Ejecuta la interfaz de administracion web.
```bash
cd Backend/web
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

#### 3. App Movil (Expo)
Ejecuta la aplicacion para dispositivos moviles.
```bash
cd AppMovil
npm install
# Nota: Es necesario configurar la IP del backend en AppMovil/src/config.js
npx expo start
```

---

## Servicios de Monitoreo y Acceso

Una vez desplegado con Docker, los siguientes servicios estaran disponibles:

- Interfaz Web Principal: http://localhost:80
- API Gateway (HAProxy): http://localhost:8000
- Panel de Monitoreo (Grafana): http://localhost:3000 (Credenciales: admin / admin123)
- Metricas (Prometheus): http://localhost:9090
- Gestion de Contenedores (Portainer): http://localhost:9000

---

## Configuracion de Variables de Entorno

### Backend Web (.env)
Es fundamental configurar las siguientes variables para la conexion con la base de datos y la API:
- DB_HOST: postgres (nombre del servicio en Docker)
- DB_DATABASE: autoexec
- API_BASE_URL: http://api1:8000

### App Movil (config.js)
Actualizar la constante API_URL con la direccion IP de la maquina host para permitir la conexion desde dispositivos fisicos o emuladores.

---

## Mantenimiento y Logs

Para visualizar el estado de los servicios en tiempo real:
```bash
docker compose logs -f
```

Para reiniciar un servicio especifico tras un cambio:
```bash
docker compose restart [nombre_del_servicio]
```

---
Documentacion generada para el equipo de desarrollo de AutoExec.
