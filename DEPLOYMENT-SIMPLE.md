# Despliegue Docker Compose Simplificado - AutoExec

## Arquitectura Implementada

- **PostgreSQL**: Base de datos persistente
- **API1 + API2**: Dos instancias FastAPI duplicadas
- **Web**: Una instancia Laravel (simplificado)
- **HAProxy**: Balanceador de carga
- **Prometheus**: Monitoreo
- **Grafana**: Visualización

## Ejecución Inmediata

```bash
# Usar la versión simplificada
docker-compose -f docker-compose-simple.yml up --build

# O reemplazar el archivo original
cp docker-compose-simple.yml docker-compose.yml
cp haproxy/haproxy-simple.cfg haproxy/haproxy.cfg
cp prometheus/prometheus-simple.yml prometheus/prometheus.yml

docker-compose up --build
```

## Accesos Disponibles

### Aplicaciones
- **Web Frontend**: http://localhost:8080 (balanceado)
- **API Backend**: http://localhost:8000 (balanceado)
- **Web Directo**: http://localhost:9000 (sin balanceador)

### Monitoreo
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin123)
- **HAProxy Stats**: http://localhost:8404/stats (admin/admin)

### Base de Datos
- **PostgreSQL**: localhost:5432 (admin/password123)

## Verificación del Despliegue

### 1. Verificar contenedores
```bash
docker-compose ps
```

### 2. Probar endpoints
```bash
# Health check APIs
curl http://localhost:8000/health

# Verificar web
curl http://localhost:8080/

# Verificar balanceo
for i in {1..5}; do curl http://localhost:8000/health; echo ""; done
```

### 3. Verificar monitoreo
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090/targets

## Características Clave

✅ **PostgreSQL primero** con health checks
✅ **APIs duplicadas** (api1, api2) balanceadas
✅ **Web Laravel** funcional automática
✅ **HAProxy** balanceo round-robin
✅ **Monitoreo completo** Prometheus + Grafana
✅ **Health checks** en todos los servicios
✅ **Red interna** para comunicación
✅ **Persistencia** de datos

## Solución de Problemas

Si Laravel falla por migraciones:

```bash
# Entrar al contenedor web y ejecutar migraciones
docker-compose exec web php artisan migrate
docker-compose exec web php artisan key:generate
```

## Escalabilidad

```bash
# Escalar APIs
docker-compose -f docker-compose-simple.yml up --scale api1=2 --scale api2=2
```

## Limpieza

```bash
docker-compose -f docker-compose-simple.yml down -v
```
