# Gettiks.com

Monorepo: Next.js frontend in `gettiks-web/` and Firebase Functions in `functions/`.

## Setup

1. Create Firebase project and enable Auth providers (Email/Password, Google, Facebook), Firestore, Storage, Analytics, Cloud Messaging.
2. Copy `gettiks-web/.env.example` to `gettiks-web/.env.local` and fill Firebase keys and Stripe publishable key.
3. In `functions/` set environment variables for Stripe, SMTP, and web URL.

```bash
cd functions
npm i
firebase functions:config:set stripe.secret="sk_live_..." web.url="https://gettiks.com" smtp.host="..." smtp.port="587" smtp.user="..." smtp.pass="..."
```

## Develop

```bash
cd gettiks-web && npm i && npm run dev
```

## Deploy

```bash
firebase deploy
```

