#!/usr/bin/env bash
# ==============================================================================
# UNIWEAR — Automated Daily Backup Script
# Backs up Local MongoDB + Persistent storage/ directory with 7-day retention
# Add to crontab: 0 3 * * * /var/www/uniwear/backup_uniwear.sh >> /var/www/uniwear/logs/backup.log 2>&1
# ==============================================================================
set -euo pipefail

BACKUP_DIR="/var/backups/uniwear"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DAILY_DIR="$BACKUP_DIR/backup_$TIMESTAMP"
RETENTION_DAYS=7

mkdir -p "$DAILY_DIR"

echo "[$TIMESTAMP] Starting UNIWEAR automated backup..."

# 1. MongoDB Dump
echo "Dumping local MongoDB..."
mongodump --host 127.0.0.1 --port 27017 --db uniwear --out "$DAILY_DIR/mongo" --quiet
tar -czf "$DAILY_DIR/mongodb_dump.tar.gz" -C "$DAILY_DIR/mongo" uniwear
rm -rf "$DAILY_DIR/mongo"

# 2. Storage Directory Archive
echo "Archiving storage directory..."
if [ -d "/var/www/uniwear/storage" ]; then
    tar -czf "$DAILY_DIR/storage_backup.tar.gz" -C /var/www/uniwear storage
fi

# 3. Secure permissions
chmod 600 "$DAILY_DIR"/*.tar.gz

# 4. Prune Backups older than RETENTION_DAYS
echo "Pruning backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup_*" -mtime +"$RETENTION_DAYS" -exec rm -rf {} +

echo "Backup completed successfully at $DAILY_DIR"
