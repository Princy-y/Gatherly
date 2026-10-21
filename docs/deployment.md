# Gatherly AI — Deployment & Environment Configuration Guide

## 1. Production AI Availability & Standalone Independence

A core requirement of Gatherly AI is that **the production deployment must never depend on a local workstation or laptop running an active Ollama process**.

To satisfy this reliably:
- **Default Production Mode (`VITE_AI_PROVIDER=demo`)**: Gatherly AI comes equipped with a deterministic, knowledge-grounded `DemoAdapter`. It simulates realistic, domain-validated recommendations for Weddings, Birthdays, and Community events without making any remote or local network calls.
- **Local Development Mode (`VITE_AI_PROVIDER=local`)**: Developers running Ollama locally with `qwen2.5:3b` can switch to live local LLM inference with a single click in the top navigation bar or by setting `.env`.
- **Remote Production Service (`VITE_AI_PROVIDER=remote`)**: When hosting a remote server, the included minimal FastAPI proxy (`backend/main.py`) acts as a hardened gateway with rate limiting, bounded payloads, and restricted CORS.

---

## 2. Environment Variables Specification

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
|---|---|---|
| `VITE_AI_PROVIDER` | `demo` | AI engine mode: `demo` (offline/cloud safe), `local` (local Ollama), or `remote` (FastAPI proxy). |
| `VITE_OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama HTTP endpoint when in `local` mode. |
| `VITE_OLLAMA_MODEL` | `qwen2.5:3b` | Target LLM model name. |
| `VITE_REMOTE_API_BASE_URL` | `http://localhost:8000` | Target backend proxy URL when in `remote` mode. |

---

## 3. Fresh Clone Setup & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v20 and v24)
- npm 9+ (tested on npm 11)
- Optional: Ollama 0.4+ with `qwen2.5:3b` (`ollama pull qwen2.5:3b`)

### Step-by-Step Execution

```bash
# 1. Clone repository
git clone https://github.com/your-username/gatherly-ai.git
cd gatherly-ai

# 2. Install dependencies
npm install

# 3. Run typecheck & automated tests
npm run typecheck
npm run test

# 4. Verify repository size is < 10 MB
npm run audit:size

# 5. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 4. Production Static Deployment (Vercel, Netlify, Cloudflare Pages)

Because Gatherly AI is built with Vite and features client-side persistence and the `DemoAdapter`, it can be deployed to any static web hosting platform in 60 seconds with **zero external dependencies**:

```bash
# Build production bundle
npm run build
```

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_AI_PROVIDER=demo`

---

## 5. Optional Backend Deployment (FastAPI AI Proxy)

If you wish to deploy the secure AI backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```
