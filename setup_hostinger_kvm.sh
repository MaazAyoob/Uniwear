#!/usr/bin/env bash
# ==============================================================================
# UNIWEAR — Hostinger KVM 2 VPS Automated Server Setup Script
# Ubuntu 22.04 / 24.04 LTS Compatible
# ==============================================================================
set -euo pipefail

echo "========================================================"
echo " Starting UNIWEAR Production Setup on Hostinger KVM 2 "
echo "========================================================"

# 1. Update and Upgrade Packages
echo "[1/8] Updating system packages..."
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
apt-get install -y curl git ufw build-essential gnupg wget certbot python3-certbot-nginx

# 2. Configure UFW Firewall
echo "[2/8] Securing firewall (UFW)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
# Explicitly keep MongoDB local only
ufw deny 27017 comment 'MongoDB Local Only'
ufw --force enable
ufw status verbose

# 3. Install Node.js LTS (v22.x) and PM2
echo "[3/8] Installing Node.js LTS and PM2..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
npm install -g pm2
pm2 --version

# 4. Install MongoDB Community Server (v7.0)
echo "[4/8] Installing MongoDB Community Server..."
if ! command -v mongod &> /dev/null; then
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
       gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor --yes
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | \
       tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt-get update -y
    apt-get install -y mongodb-org
fi

# Ensure MongoDB binds only to 127.0.0.1
sed -i 's/bindIp: .*/bindIp: 127.0.0.1/' /etc/mongod.conf
systemctl daemon-reload
systemctl enable mongod
systemctl restart mongod
echo "MongoDB status: $(systemctl is-active mongod)"

# 5. Install & Configure Nginx
echo "[5/8] Installing and configuring Nginx..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# 6. Create Target Directory Tree
echo "[6/8] Creating directory structure at /var/www/uniwear..."
mkdir -p /var/www/uniwear/frontend
mkdir -p /var/www/uniwear/backend
mkdir -p /var/www/uniwear/storage/products
mkdir -p /var/www/uniwear/storage/blogs
mkdir -p /var/www/uniwear/storage/catalogs
mkdir -p /var/www/uniwear/storage/logos
mkdir -p /var/www/uniwear/storage/general
mkdir -p /var/www/uniwear/logs
mkdir -p /var/backups/uniwear

# 7. Configure Permissions
chown -R www-data:www-data /var/www/uniwear/storage
chmod -R 775 /var/www/uniwear/storage

echo "========================================================"
echo " Hostinger KVM 2 Server Setup Complete!                 "
echo " Next: Copy repository, restore DB, and run PM2 & Nginx "
echo "========================================================"
