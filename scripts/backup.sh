#!/bin/bash

# Script de backup automático para PostgreSQL
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/autoexec_backup_$DATE.sql"

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Realizar backup
pg_dump -h postgres -U admin -d autoexec > $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE

# Eliminar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completado: $BACKUP_FILE.gz"
