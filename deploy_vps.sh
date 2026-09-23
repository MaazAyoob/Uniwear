#!/usr/bin/env bash
# ==============================================================================
# UNIWEAR — Application Deployment & Service Launch Script
# Run from repository root on Hostinger KVM 2 VPS
# ==============================================================================
set -euo pipefail

echo "=== Deploying UNIWEAR Application ==="

APP_DIR="/var/www/uniwear"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Sync Frontend Files
echo "[1/6] Deploying frontend static files..."
mkdir -p "$APP_DIR/frontend"
# Copy all HTML, assets, styles, js
cp -r "$SCRIPT_DIR"/*.html "$APP_DIR/frontend/" 2>/dev/null || true
if [ -d "$SCRIPT_DIR/frontend" ]; then
    cp -r "$SCRIPT_DIR/frontend/"* "$APP_DIR/frontend/"
fi
if [ -d "$SCRIPT_DIR/assets" ]; then
    cp -r "$SCRIPT_DIR/assets" "$APP_DIR/frontend/"
fi
if [ -d "$SCRIPT_DIR/styles" ]; then
    cp -r "$SCRIPT_DIR/styles" "$APP_DIR/frontend/"
fi
if [ -d "$SCRIPT_DIR/js" ]; then
    cp -r "$SCRIPT_DIR/js" "$APP_DIR/frontend/"
fi

# 2. Sync Backend Files
echo "[2/6] Deploying backend application..."
mkdir -p "$APP_DIR/backend"
if [ -d "$SCRIPT_DIR/backend" ]; then
    cp -r "$SCRIPT_DIR/backend/"* "$APP_DIR/backend/"
elif [ -d "$SCRIPT_DIR/server" ]; then
    cp -r "$SCRIPT_DIR/server/"* "$APP_DIR/backend/"
fi

# Install backend dependencies
cd "$APP_DIR/backend"
npm install --omit=dev

# 3. Setup Environment
if [ ! -f "$APP_DIR/backend/.env" ]; then
    echo "Creating production .env from template..."
    cp "$APP_DIR/backend/.env.example" "$APP_DIR/backend/.env"
    RANDOM_JWT=$(openssl rand -hex 32)
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$RANDOM_JWT/" "$APP_DIR/backend/.env"
    sed -i "s|MONGODB_URI=.*|MONGODB_URI=mongodb://127.0.0.1:27017/uniwear|" "$APP_DIR/backend/.env"
fi

# 4. Configure Nginx
echo "[4/6] Linking and reloading Nginx configuration..."
cp "$SCRIPT_DIR/nginx-uniwear.conf" /etc/nginx/sites-available/uniwear
ln -sf /etc/nginx/sites-available/uniwear /etc/nginx/sites-enabled/uniwear
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 5. Start / Reload PM2
echo "[5/6] Managing PM2 processes..."
cd "$APP_DIR/backend"
if pm2 describe uniwear-api > /dev/null 2>&1; then
    pm2 reload uniwear-api --update-env
else
    pm2 start server.js --name uniwear-api
fi
pm2 save
pm2 startup systemd -u root --hp /root || true

# 6. Verify Health Endpoint
echo "[6/6] Verifying API Health..."
sleep 2
HEALTH_STATUS=$(curl -s http://127.0.0.1:5000/api/health || echo "FAILED")
echo "Health Check Response: $HEALTH_STATUS"

echo "=== UNIWEAR Deployment Completed Successfully! ==="
