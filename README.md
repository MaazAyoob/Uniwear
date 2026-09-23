# UNIWEAR Enterprise Workwear Portal

Production-ready enterprise workwear & uniform manufacturing platform self-hosted on **Hostinger KVM 2 VPS**.

---

## 📁 Final Production Architecture & Directory Structure

```
UNIWEAR/
│
├── frontend/                        # Public Website + Admin & Customer Portals
│   ├── assets/                      # Static Assets (favicons, images, logos)
│   ├── styles/                      # Design System (main.css)
│   ├── js/                          # Modular Frontend Logic (config, api, utils)
│   ├── index.html                   # Homepage
│   ├── about.html                   # About Us
│   ├── uniforms.html                # Uniforms Collection
│   ├── gifts.html                   # Corporate Gifting
│   ├── catalog.html                 # Product Catalog Library
│   ├── clientele.html               # Enterprise Clientele
│   ├── blog.html                    # Insights & Articles
│   ├── contact.html                 # Contact & Consultation
│   ├── login.html                   # Login & Registration
│   ├── admin-portal.html            # Admin Management Portal
│   └── customer-portal.html         # Client Portal Dashboard
│
├── backend/                         # Production Node.js + Express API
│   ├── config/                      # Database (Local MongoDB) & seeds
│   ├── controllers/                 # Route controllers
│   ├── middleware/                  # Auth, Upload & Error handling
│   ├── models/                      # Mongoose Models used by the application
│   ├── routes/                      # API Endpoints (/api/*)
│   ├── package.json
│   ├── server.js                    # Express Application Entry
│   └── .env.example                 # Sanitized Environment Template
│
├── storage/                         # Persistent Uploaded Files (Outside deployment tree)
│   ├── products/
│   ├── blogs/
│   ├── catalogs/
│   ├── logos/
│   └── general/
│
├── nginx-uniwear.conf               # Production Nginx Reverse Proxy Config
├── ecosystem.config.js              # PM2 Process Manager Configuration
├── setup_hostinger_kvm.sh           # Automated Server Provisioning Script
├── deploy_vps.sh                    # Automated Application Deployment Script
├── backup_uniwear.sh                # Automated MongoDB & Storage Daily Backup
├── README.md
└── .gitignore
```

---

## 🌐 Server Architecture (Hostinger KVM 2)

```
Internet (Port 80 / 443)
       │
   [Domain]
       ▼
 [ Nginx Reverse Proxy & Static Server ]
   ├── /               ──> Serves /var/www/uniwear/frontend/ (HTML, CSS, JS, Assets)
   ├── /storage/       ──> Serves /var/www/uniwear/storage/ (Persistent media uploads)
   └── /api/           ──> Proxies to http://127.0.0.1:5000/api/
                             │
                             ▼
                   [ PM2: uniwear-api ]
                     (Express.js Backend)
                             │
                             ▼
                   [ Local MongoDB Community ]
                     (127.0.0.1:27017)
```

---

## 🚀 Deployment Instructions on Hostinger KVM 2

### 1. Provision the Server
Run the provisioning script on a clean Ubuntu 22.04 / 24.04 VPS:
```bash
chmod +x setup_hostinger_kvm.sh
sudo ./setup_hostinger_kvm.sh
```
This installs Node.js v22 LTS, PM2, Nginx, MongoDB Community Server v7.0, and sets up UFW firewall rules.

### 2. Deploy Application & Launch Services
```bash
chmod +x deploy_vps.sh
sudo ./deploy_vps.sh
```

### 3. Migrate Base64 Images to Persistent Storage
```bash
node scratch/migrate_base64_images.js
```

### 4. Enable SSL with Certbot
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 5. Automated Daily Backups
Add to root crontab (`sudo crontab -e`):
```cron
0 3 * * * /var/www/uniwear/backup_uniwear.sh >> /var/www/uniwear/logs/backup.log 2>&1
```

---

## 🔒 Security & Verification
- **Zero Third-Party Production Lock-In**: Complete removal of Vercel and Render dependencies.
- **Local Database Isolation**: MongoDB listens strictly on `127.0.0.1:27017`, blocked externally by UFW.
- **Persistent Media**: Images and catalogs stored on disk in `storage/` and referenced by URI in MongoDB.
- **Health Check**: `GET /api/health`
