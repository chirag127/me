# 🌌 Chirag Singhal — Premium Developer Portfolio

> **Architecting the Future with Code.**
> Modern, data-driven, and high-performance portfolio built with **React 19**, **TypeScript**, and **Vite**.

![Portfolio Hero Mockup](file:///C:/Users/chira/portfolio_hero_mockup.png)

## ✨ Core Pillars

- **🚀 Performance First**: Built with Vite 6 and React 19 for blazing-fast load times and smooth transitions.
- **💎 Premium Aesthetics**: Dark mode by default with glassmorphism UI, powered by **Mantine 8**.
- **📊 Real-Time Data**: Dynamic integration with GitHub, LeetCode, and custom resume analytics.
- **🛡️ Type Safe**: 100% Strict TypeScript for reliability and maintainability.
- **📱 Responsive & PWA**: Optimized for all devices, ready to be installed as a Progressive Web App.

---

## 🛠️ The Tech Ecosystem

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Mantine 8, Framer Motion |
| **Data Viz** | Recharts, Chart.js, Lucide Icons |
| **State/Logic** | Zustand, React Router 7, Date-fns |
| **Backend/Auth** | Firebase Auth, Puter.js |
| **Infrastructure** | Cloudflare Pages, GitHub Pages, CI/CD Actions |

![Tech Stack Visualizer](file:///C:/Users/chira/tech_stack_visualizer.png)

---

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/chirag127/me.git
    cd me
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup environment variables:**
    Copy `.env.example` to `.env` and fill in your credentials, including the Firebase configuration:
    ```bash
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_STORAGE_BUCKET=...
    VITE_FIREBASE_MESSAGING_SENDER_ID=...
    VITE_FIREBASE_APP_ID=...
    VITE_FIREBASE_MEASUREMENT_ID=...
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🛠️ Features

- **Firebase Integration:** Supports Firebase App Initialization and Analytics out of the box.

### Production
```bash
# Build the production bundle
npm run build

# Deploy to Cloudflare (Primary)
npm run deploy

# Deploy to GitHub Pages (Backup)
npm run deploy:gh
```

---

## 🏗️ Architecture Overview

The codebase is designed for modularity and scalability:

- `src/components`: Atomic UI components and visually stunning charts.
- `src/data`: The single source of truth for resume and project data.
- `src/pages`: 66+ unique pages across 7 thematic "Drives".
- `src/stores`: Lightweight state management with Zustand.

---

## 🛡️ CI/CD & Reliability

This project uses a dual-deployment strategy for 99.9% uptime:
1. **Primary**: [Cloudflare Pages](https://chirag127.in) for edge performance.
2. **Failover**: [GitHub Pages](https://chirag127.github.io/me/) as a fallback.

Automatic tests and builds are triggered on every push via GitHub Actions.

---

## 📄 License

MIT © [Chirag Singhal](https://chirag127.in)
