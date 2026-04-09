# Despliegue Docker Compose - AutoExec

## Arquitectura Implementada

- **PostgreSQL**: Base de datos persistente con health checks
- **FastAPI x2**: Dos instancias de API backend balanceadas
- **Laravel x2**: Dos instancias frontend web balanceadas  
- **HAProxy**: Balanceador de carga para APIs y web
- **Prometheus**: Monitoreo de métricas
- **Grafana**: Visualización de métricas
- **Redis**: Cache para Laravel
- **PgAdmin**: Gestión de base de datos

## Ejecución del Despliegue

```bash
# Levantar todos los servicios
docker-compose up --build

# Ejecutar en modo detached (background)
docker-compose up --build -d

# Detener servicios
docker-compose down

# Eliminar volúmenes (cuidado: pierde datos)
docker-compose down -v
```

## Accesos Disponibles

### Aplicaciones
- **Web Frontend**: http://localhost:8080 (balanceado)
- **API Backend**: http://localhost:8000 (balanceado)
- **PgAdmin**: http://localhost:5050
  - Email: admin@admin.com
  - Password: admin123

### Monitoreo
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
  - Usuario: admin
  - Password: admin123
- **HAProxy Stats**: http://localhost:8404/stats
  - Usuario: admin
  - Password: admin

### Base de Datos
- **PostgreSQL**: localhost:5432
  - Database: autoexec
  - User: admin
  - Password: password123

## Verificación del Despliegue

### 1. Verificar estado de contenedores
```bash
docker-compose ps
```

### 2. Verificar logs de servicios
```bash
# Logs generales
docker-compose logs -f

# Logs de servicio específico
docker-compose logs -f postgres
docker-compose logs -f backend1
docker-compose logs -f laravel1
```

### 3. Probar endpoints
```bash
# Health check APIs
curl http://localhost:8000/health

# Verificar balanceador
curl http://localhost:8080/

# Verificar HAProxy stats
curl http://localhost:8404/stats
```

### 4. Verificar monitoreo
- Acceder a Grafana: http://localhost:3000
- Importar dashboard para HAProxy y PostgreSQL
- Verificar métricas en Prometheus: http://localhost:9090

## Network Configuration

Todos los servicios están en la red `autoexec_net` permitiendo comunicación interna:
- Las APIs se conectan a PostgreSQL via `postgres:5432`
- Laravel se conecta a PostgreSQL y Redis
- HAProxy balancea entre instancias
- Prometheus recolecta métricas de todos los servicios

## Health Checks

- **PostgreSQL**: pg_isready
- **FastAPI**: GET /health
- **Laravel**: GET /
- **HAProxy**: Verificación de backends cada 5s

## Persistencia de Datos

- **PostgreSQL**: Volumen `postgres_data` persiste datos de la base
- **Grafana**: Datos de configuración y dashboards persisten
- **PgAdmin**: Configuración de servidores persiste

## Escalabilidad

Para escalar servicios:
```bash
# Escalar APIs a 4 instancias
docker-compose up --scale backend1=2 --scale backend2=2

# Escalar Laravel a 4 instancias  
docker-compose up --scale laravel1=2 --scale laravel2=2
```

## Troubleshooting

### Problemas comunes:
1. **Puertos en uso**: Verificar que los puertos 8080, 8000, 5432, 3000, 9090 estén libres
2. **Permisos**: Asegurar que Docker tiene permisos para crear volúmenes
3. **Conexión BD**: Esperar a que PostgreSQL esté healthy antes de iniciar APIs

### Comandos útiles:
```bash
# Reiniciar servicio específico
docker-compose restart backend1

# Reconstruir imagen
docker-compose build --no-cache backend1

# Entrar a contenedor
docker-compose exec postgres bash
docker-compose exec backend1 bash
```

## Variables de Entorno

Las credenciales están configuradas en docker-compose.yml:
- PostgreSQL: admin/password123
- PgAdmin: admin@admin.com/admin123
- Grafana: admin/admin123

**Importante**: Cambiar estas credenciales en producción.
