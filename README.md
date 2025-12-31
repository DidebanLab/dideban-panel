# 🛡️ Dideban Panel

Dideban Panel is the official web dashboard for Dideban, a private, lightweight, and self-hosted monitoring system.
It is built with SvelteKit and designed to be fast, minimal, and production-ready, serving as the primary UI for observing system health, checks, agents, and alerts.

<p align="center">
  <img src="static/images/demo-dashboard.png" />
</p>


## Key technologies

- SvelteKit
- Vite
- Tailwind CSS
- Prettier + ESLint (formatting and linting)

---

## Prerequisites

- Node.js (LTS)
- npm (or pnpm / yarn/ bun)

---

## ✨ Features

- 🟢 Real-time monitoring dashboard

- 📊 Service & resource status overview

- 🖥️ Agents & servers management UI

- 🚨 Alert visualization (Telegram / Bale – MVP)

- 🌗 Dark / Light theme support

- ⚡ Fast UI with minimal overhead

- 🔒 Private-by-default (self-hosted)

- 🧩 Modular & extensible component structure

---

## Quick start

From the project root (this folder):

```bash
# install dependencies
npm install

# run dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

---

## Available scripts (package.json)

- `dev` — run Vite dev server
- `build` — build a production bundle with Vite
- `preview` — preview the production build
- `prepare` — svelte-kit sync (project preparation)
- `format` — run Prettier to format files
- `lint` — run Prettier check and ESLint

---

## Project structure

```bash
frontend/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   │
│   ├── components/
│   │   ├── common/
│   │   │   └── Chart.svelte
│   │   │
│   │   ├── global/
│   │   │   ├── Topbar.svelte
│   │   │   └── sidebar/
│   │   │       ├── Sidebar.svelte
│   │   │       └── deps/
│   │   │           └── Support.svelte
│   │   │
│   │   ├── layouts/
│   │   │   └── MainLayout.svelte
│   │   │
│   │   └── pages/
│   │       └── dashboard/
│   │           ├── PerformanceOverview.svelte
│   │           ├── TopRight.svelte
│   │           └── statusOverview/
│   │               └── StatusOverview.svelte
│   │
│   ├── stores/
│   │   └── theme.svelte.js
│   │
│   └── static/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── svelte.config.js
├── vite.config.js
└── package.json
```

## 🧠 Philosophy

Dideban is built with these principles in mind:

* **Clear separation between core engine and UI**
* **High readability and clean, understandable code**
* **Clear and well-organized architecture**
* **Long-Term Maintainability**
* **Intentional simplicity — no unnecessary complexity**
* **Standards-driven and aligned with best practices**

---

## 🔔 Alerting (MVP)

Supported in MVP:

* Telegram Bot notifications
* Bale.ai Bot notifications

Planned:

* Email
* Webhook
* Script execution
* Alert grouping & throttling

---

## 📄 License

MIT License

---

## ❤️ Name Origin

**Dideban (دیدبان)** means *Watcher / Guardian* in Persian — a silent observer that keeps your systems safe.

---

## ⭐ Star the Project

If you like the idea, consider giving the repo a star ⭐

It helps the project grow and stay motivated.
