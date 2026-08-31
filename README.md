# ⚡ Hackathon Tracker PWA

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-FF5722?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Security](https://img.shields.io/badge/Vulnerabilities-0_Detected-brightgreen?style=for-the-badge&logo=snyk&logoColor=white)](https://github.com/)

A full-stack, installable **Progressive Web App (PWA)** with an Express backend and React 19 frontend built in a bold, tactile **Neo-Brutalist** design aesthetic. It enables developers, students, and competitive programmers to discover, track, manage, and analyze hackathons with live countdown timers, smart timeline trackers, deadline alerts, offline capabilities, and data portability.

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [📂 Directory Structure](#-directory-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [📲 PWA Installation Guide (Mobile & Desktop)](#-pwa-installation-guide-mobile--desktop)
- [🔌 RESTful API Reference](#-restful-api-reference)
- [🔒 Security Hardening & Vulnerability Protection](#-security-hardening--vulnerability-protection)
- [📜 Available Scripts](#-available-scripts)
- [🌐 Deployment](#-deployment)
- [📄 License](#-license)

---

## ✨ Key Features

- **🎨 Neo-Brutalist UI/UX**: High-contrast borders, tactile drop-shadows (`box-shadow: 4px 4px 0 #000`), bold retro typography (`Space Grotesk` & `JetBrains Mono`), and reactive motion animations powered by `motion/react`.
- **⏱️ Real-Time Countdown & Status Transitions**: Live ticking timers tracking:
  - Registration Deadline Countdown
  - Event Start Time Countdown
  - Event In-Progress Duration Timer
  - Automatic status updates (`upcoming` $\rightarrow$ `ongoing` $\rightarrow$ `completed`).
- **📱 Offline-First Progressive Web App (PWA)**:
  - Custom Service Worker (`sw.js`) caching core app assets and network fallbacks.
  - Web App Manifest (`manifest.json`) enabling installability across Desktop (Chrome, Edge) and Mobile (Android, iOS).
  - Standalone app experience without browser navigation chrome.
- **🛡️ Full-Stack CRUD REST API**:
  - Express.js backend with robust MVC architecture (Controllers, Routes, Middlewares, Validators).
  - Validation with `express-validator` to ensure strict payload structure and sanitize inputs.
- **🔔 Deadline Notification System**: Customizable browser alerts and sound notifications for imminent registration deadlines and event kickoffs.
- **📊 Interactive Filtering & Search**:
  - Filter by status tabs: `All`, `Upcoming`, `Ongoing`, `Completed`.
  - Filter by mode: `Online` vs `In-Person`.
  - Instant search across hackathon names, tags, and venues.
- **🎉 Outcome & Achievement Tracking**: Record outcomes (`won`, `finalist`, `participant`, `pending`) with dynamic confetti celebrations (`canvas-confetti`).
- **💾 Data Portability**: Instant JSON export, backup restoration, bulk data import, and one-click demo data reset.
- **🤖 AI Studio Integration**: Ready for Gemini API integrations via `@google/genai`.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT (Browser / PWA)               │
│  React 19 + TypeScript + Tailwind CSS v4 + Motion UI  │
│  Service Worker (Offline Cache) & Web App Manifest     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST (Fetch API)
┌───────────────────────────▼────────────────────────────┐
│                  EXPRESS BACKEND SERVER                │
│  - Middleware: CORS, Morgan Logger, Body Parsers       │
│  - Input Sanitization & Validators (express-validator) │
│  - Error Handling & Stack-Trace Stripping              │
│  - RESTful Endpoints: /api/hackathons                  │
└───────────────────────────┬────────────────────────────┘
                            │ Read / Write
┌───────────────────────────▼────────────────────────────┐
│                    DATA STORAGE LAYER                  │
│       JSON File Persistence Store (data/hackathons.json)│
└────────────────────────────────────────────────────────┘
```

---

## 📂 Directory Structure

```
hackathon-tracker/
├── api/                        # Express API Backend
│   ├── controllers/            # Request handlers & business logic
│   │   └── hackathonController.js
│   ├── middlewares/            # Custom middlewares (errors, validator runner)
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/                 # Data model & persistent JSON I/O
│   │   └── hackathonModel.js
│   ├── routes/                 # REST sub-routers
│   │   └── hackathons.js
│   ├── validators/             # Input validation schemas (express-validator)
│   │   └── hackathonValidator.js
│   └── index.js                # Express app configuration & middleware pipeline
├── data/                       # Local JSON database storage
│   └── hackathons.json         # Seed / live hackathon records
├── public/                     # Static assets & PWA files
│   ├── icons/                  # PWA application icons (192x192, 512x512, SVG)
│   ├── manifest.json           # Web App Manifest
│   └── sw.js                   # Service Worker script
├── src/                        # React Frontend
│   ├── components/             # Reusable UI components
│   │   ├── BottomNav.tsx       # Mobile bottom navigation bar
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── DetailModal.tsx     # Full hackathon details & timeline
│   │   ├── FilterTabs.tsx      # Status & mode filter pills
│   │   ├── HackathonCard.tsx   # Neo-Brutalist card with live countdowns
│   │   ├── HackathonModal.tsx  # Add / Edit form modal
│   │   ├── Header.tsx          # App header & branding
│   │   ├── NotificationModal.tsx
│   │   ├── OnboardingModal.tsx
│   │   ├── PwaInstallBanner.tsx# In-app installation prompt
│   │   ├── SettingsView.tsx    # App preferences, export/import & demo reset
│   │   └── Sidebar.tsx         # Desktop sidebar navigation
│   ├── App.tsx                 # Root application component & state management
│   ├── index.css               # Global styling, fonts, and theme tokens
│   ├── main.tsx                # React DOM entry point
│   ├── types.ts                # TypeScript interfaces & types
│   └── utils.ts                # Time formatting, countdown calculations, sounds
├── .env.example                # Template for environment configuration
├── .gitignore                  # Git ignore rules for secrets and build artifacts
├── index.html                  # HTML entry point with PWA meta tags & SW registration
├── package.json                # Project dependencies and npm scripts
├── server.ts                   # Development & production server entry point
├── tsconfig.json               # TypeScript compiler configuration
├── vercel.json                 # Vercel serverless deployment config
└── vite.config.ts              # Vite build tool configuration
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion v12)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Typography**: Google Fonts (*Space Grotesk* & *JetBrains Mono*)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 4](https://expressjs.com/)
- **Validation**: [express-validator 7](https://express-validator.github.io/)
- **Logging**: [Morgan](https://www.npmjs.com/package/morgan)
- **Security & CORS**: [cors](https://www.npmjs.com/package/cors), [dotenv](https://www.npmjs.com/package/dotenv)

---

## 🚀 Quick Start Guide

### **1. Prerequisites**
- **Node.js** (v18.0.0 or later recommended)
- **npm** (v9.0.0 or later)

### **2. Clone & Install**
```bash
# Clone the repository
git clone https://github.com/your-username/hackathon-tracker.git

# Enter the project directory
cd hackathon-tracker

# Install dependencies
npm install
```

### **3. Configure Environment Variables**
Copy the `.env.example` template:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

Configure your `.env` settings:
```ini
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

### **4. Start the Application**
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**.

---

## 📲 PWA Installation Guide (Mobile & Desktop)

### **💻 On Desktop (Chrome / Brave / Edge)**
1. Open `http://localhost:3000` (or your deployed URL).
2. Look at the address bar for the **Install App** icon, or click the in-app **"Install App"** banner.
3. Click **Install**. The app will open in an independent, distraction-free desktop window.

### **📱 On Mobile (Android - Google Chrome)**
1. Open the URL in Chrome.
2. Tap the **Three Dots Menu (⋮)** in the top right.
3. Select **"Install app"** or **"Add to Home screen"**.
4. The app icon will appear on your home screen and launcher.

### **🍎 On Mobile (iOS - Safari)**
1. Open the URL in Safari.
2. Tap the **Share** button (box with an upward arrow) at the bottom.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top right corner.

---

## 🔌 RESTful API Reference

All API routes are prefixed with `/api`.

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & system uptime | None |
| `GET` | `/api/hackathons` | Fetch all hackathons (supports filtering) | None |
| `GET` | `/api/hackathons/:id` | Fetch a single hackathon by ID | None |
| `POST` | `/api/hackathons` | Create a new hackathon | `JSON` (Hackathon fields) |
| `PUT` | `/api/hackathons/:id` | Update an existing hackathon | `JSON` (Hackathon fields) |
| `DELETE` | `/api/hackathons/:id` | Remove a hackathon | None |
| `POST` | `/api/hackathons/reset` | Restore demo seed dataset | None |
| `POST` | `/api/hackathons/import` | Bulk import hackathons | `JSON` (Array of items) |

### Sample `POST /api/hackathons` Payload:
```json
{
  "name": "Global AI Hackathon 2026",
  "mode": "online",
  "venue": "Virtual / Discord",
  "link": "https://hackathon.example.com",
  "registrationDeadline": "2026-09-15T23:59:00.000Z",
  "startTime": "2026-09-20T09:00:00.000Z",
  "endTime": "2026-09-22T18:00:00.000Z",
  "tags": ["AI", "GenAI", "Web3"],
  "notes": "Building autonomous AI agents with multimodal LLMs."
}
```

---

## 🔒 Security Hardening & Vulnerability Protection

This repository incorporates security best practices to protect data, server resources, and credentials:

1. **🛡️ Zero-Leak Secret Management**:
   - `.env`, `.env.*`, and `*.local` files are strictly excluded via `.gitignore`.
   - Only dummy placeholders are maintained in `.env.example`.
2. **🧹 Error Sanitization**:
   - The global error handler (`api/middlewares/errorHandler.js`) strips execution stack traces in production (`NODE_ENV === 'production'`) to prevent server fingerprinting and information disclosure.
3. **🔍 Strict Input Validation & Sanitization**:
   - Endpoints are shielded by `express-validator` schemas verifying data types, URLs, enum bounds, and date integrity before hitting controllers.
4. **🛑 Payload Limitation**:
   - Body parsers enforce maximum payload caps (`limit: '10mb'`) to mitigate Denial of Service (DoS) attacks via memory exhaustion.
5. **🌐 Controlled Cross-Origin Access**:
   - Configured CORS policies limit unauthorized HTTP verbs and header injection.
6. **📦 Dependency Auditing**:
   - Clean dependency tree with **0 known vulnerabilities** (`npm audit` verified).

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts full-stack dev server (Express backend + Vite HMR frontend) |
| `npm run build` | Builds frontend production bundle and compiles backend to `dist/` |
| `npm run start` | Runs the compiled production server |
| `npm run preview`| Previews the production Vite build locally |
| `npm run lint` | Runs TypeScript compiler type-check (`tsc --noEmit`) |
| `npm run clean` | Cleans previous build artifacts (`dist/`) |

---

## 🌐 Deployment

### **Deploying to Vercel**
The project includes a pre-configured `vercel.json` for zero-configuration serverless deployment:
1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set your environment variables (e.g., `GEMINI_API_KEY`) in the Vercel Dashboard.
4. Click **Deploy**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built for the developer community.
