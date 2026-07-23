# UNIWEAR Enterprise Workwear Portal

A modern, production-ready enterprise workwear & uniform manufacturing platform built for high scalability, seamless customer quotation management, and dynamic CMS control.

---

## 📁 Project Architecture & Directory Structure

```
vercel-deploy-uniwear/
│
├── assets/                          # Organized Static Assets
│   ├── favicons/                    # Site favicons
│   │   └── favicon.png
│   ├── images/                      # Optimized image assets
│   │   ├── hero/                    # Hero banner images
│   │   │   └── hero-banner.png
│   │   ├── industries/              # Industry wear mockups & showcases
│   │   │   ├── corporate-gifting.png
│   │   │   ├── corporate-uniforms.png
│   │   │   ├── hospitality-uniforms.png
│   │   │   ├── industrial-uniforms.png
│   │   │   └── institutional-uniforms.png
│   │   ├── manufacturing/           # Manufacturing lifecycle steps
│   │   │   ├── lifecycle-step-1.png
│   │   │   ├── lifecycle-step-2.png
│   │   │   └── lifecycle-step-3.png
│   │   └── products/                # Product details & UI mocks
│   │       ├── corporate-blazer-detail.png
│   │       └── uniform-customizer-ui.png
│   └── logos/                       # Brand logos & icons
│       ├── logo-full.png
│       ├── logo-icon.png
│       └── logo-icon.svg
│
├── styles/                          # Modular Design System
│   └── main.css                     # Global typography, glassmorphism, depth & animations
│
├── js/                              # Modular Frontend Logic
│   ├── api/                         # API client & fetch helpers
│   │   └── api.js
│   ├── config/                      # Environment configuration
│   │   └── config.js
│   └── utils/                       # Shared state & utility functions
│       └── shared.js
│
├── server/                          # Production Express & MongoDB Backend
│   ├── config/                      # Database & seeds configuration
│   │   ├── db.js
│   │   └── seeds.js
│   ├── controllers/                 # Express route controllers
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── catalogController.js
│   │   ├── customerProductController.js
│   │   ├── dashboardController.js
│   │   ├── exportController.js
│   │   ├── leadController.js
│   │   ├── notificationController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── quotationController.js
│   │   ├── settingsController.js
│   │   ├── ticketController.js
│   │   └── userController.js
│   ├── middleware/                  # Auth & Error handling middlewares
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/                      # Mongoose Database Models
│   │   ├── Blog.js
│   │   ├── Catalog.js
│   │   ├── CompanySettings.js
│   │   ├── CustomerProduct.js
│   │   ├── Lead.js
│   │   ├── Notification.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Quotation.js
│   │   ├── Ticket.js
│   │   └── User.js
│   ├── routes/                      # API Express Route definitions
│   ├── seedNow.js                   # Database seed script
│   ├── server.js                    # Express application entry point
│   └── package.json                 # Backend dependencies
│
├── index.html                       # Homepage
├── about.html                       # About Us Page
├── uniforms.html                    # Uniforms Collection
├── gifts.html                       # Corporate Gifting
├── catalog.html                     # Product Catalog Library
├── clientele.html                   # Enterprise Clientele
├── blog.html                        # Insights & Articles
├── contact.html                     # Contact & Quotation Consultation
├── login.html                       # Portal Login & Registration
├── admin-portal.html                # Enterprise Admin Dashboard
├── customer-portal.html             # Client Portal Dashboard
└── vercel.json                      # Vercel deployment & proxy rewrites
```

---

## 🚀 Local Development Setup

### 1. Start the Express Backend (Render environment locally)
```bash
cd server
npm install
npm run dev
```
The API server runs at `http://localhost:5000/api`.

### 2. Launch the Frontend
Open `index.html` in your browser or serve via any static web server.
When accessing via `localhost`, the frontend automatically targets `http://localhost:5000/api`.

---

## 🌐 Production Deployment

- **Frontend Hosting**: Vercel (`https://your-app.vercel.app`)
- **Backend Hosting**: Render (`https://uniwear-api.onrender.com`)
- **Vercel Proxy Rewrites**: Handled seamlessly by `vercel.json`:
  ```json
  {
    "version": 2,
    "rewrites": [
      {
        "source": "/api/:path*",
        "destination": "https://uniwear-api.onrender.com/api/:path*"
      }
    ]
  }
  ```

---

## 🔒 Verification & Compliance

- **Non-Functional Refactor**: Zero change to application features, UI layouts, database schemas, or API routes.
- **Asset Integrity**: 100% of image references use modern, standardized `assets/` relative paths.
- **Zero Dead Code**: Removed duplicate unorganized root assets.
