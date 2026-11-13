# UniVoiceMail

**Enterprise-grade · Gmail-style · Modern Digital Email App**  
Domain: **uniorbi.com**

A beautiful, mobile-first React + Vite email client featuring live glassy gradient wallpapers, glassmorphism UI, full threading-ready architecture, Gmail SMTP/API sending, and Cloudflare Email Worker inbound routing.

---

## Features

- **Gmail-style interface** — Sidebar folders, list + reading pane, compose, search, stars, labels, attachments
- **Live 24/7 wallpapers** — Animated aurora gradients + sparkling particles
- **Glass morphism** — Frosted panels, soft glows, professional dark theme
- **Mobile responsive** — Adaptive layouts for phone / tablet / desktop
- **Gmail SMTP / API sending** — OAuth2-ready compose flow (demo simulates send)
- **Cloudflare Worker inbound** — Email Worker script for *@uniorbi.com reception
- **Auto Configuration panel** — Domain verification, Worker deploy status, SMTP auth, system health
- **Zustand state** — Clean store for emails, folders, auth flags

---

## Quick Start

```bash
cd uni-voicemail
npm install
npm run dev
```

Open http://localhost:5173

---

## Project Structure

```
uni-voicemail/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── EmailList.tsx
│   │   ├── EmailView.tsx
│   │   ├── ComposeModal.tsx
│   │   └── SettingsPanel.tsx
│   ├── store/emailStore.ts
│   ├── types/email.ts
│   ├── lib/utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── cloudflare-worker/
│   ├── email-worker.js
│   └── wrangler.toml
├── public/
└── package.json
```

---

## Production Integrations

### 1. Sending — Gmail SMTP / Gmail API

1. Create a Google Cloud project → Enable Gmail API
2. Configure OAuth consent screen + create OAuth2 credentials
3. Backend should handle token exchange & refresh
4. Use nodemailer with OAuth2 or Gmail API users.messages.send

### 2. Receiving — Cloudflare Email Routing + Worker

1. Add domain uniorbi.com to Cloudflare
2. Enable Email Routing
3. Create routing rule: *@uniorbi.com → Worker uni-email-router
4. Deploy:

```bash
cd cloudflare-worker
npx wrangler secret put UNIVOICE_WEBHOOK_URL
npx wrangler secret put WORKER_SECRET
npx wrangler deploy
```

5. Backend webhook stores the message and pushes to the React client via WebSocket/SSE.

### 3. Domain Management

- MX → Cloudflare Email Routing
- SPF / DKIM / DMARC managed in Cloudflare
- Settings panel shows verification status (wire to Cloudflare API)

---

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Zustand
- Lucide React
- date-fns

---

## License

Proprietary — UniVoiceMail / uniorbi.com
