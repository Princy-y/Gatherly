# 🌸 Gatherly AI — Competition-Grade Event Planning Assistant

> **Constraint-Aware Event Replanning with Kawaii Scrapbook Neo-Brutalism & Zero-Hallucination Deterministic Math**
>
> 🔗 **Repository**: [https://github.com/Princy-y/Gatherly](https://github.com/Princy-y/Gatherly.git)

Gatherly AI is a high-grade, accessible event planning web application designed to organize **Weddings**, **Birthdays**, and **Community Gatherings**. Unlike superficial chatbot wrappers, Gatherly AI is built on a clean hexagonal domain architecture where AI acts as an advisory component bounded by deterministic financial arithmetic, dependency graph validation, and explicit user-approval gates.

---

## 📸 Application Preview & Visual Walkthrough

Experience the **Kawaii Scrapbook Neo-Brutalism** design system in action:

### 1. 🌸 Event Dashboard
*Live countdown timer, 4 financial status cards (Budget Cap, Estimated Spend, Invoiced Actuals, Net Surplus/Deficit), upcoming deadline tracks, and celebration triggers.*

![Gatherly AI Dashboard](./public/screenshots/dashboard.png)

---

### 2. 💰 Pastel Budget Studio
*Zero-rounding-error accounting in integer minor units (paise), category distribution progress bars, inline invoiced cost editing, and priority-guided savings recommendations.*

![Gatherly AI Budget Studio](./public/screenshots/budget-studio.png)

---

### 3. 📅 Timeline & Milestone Planner
*Topologically ordered preparation tasks, automated cycle detection, prerequisite dependency badges, status toggles, and dynamic schedule shifting when event dates move.*

![Gatherly AI Timeline Planner](./public/screenshots/timeline.png)

---

### 4. 🔮 Signature Feature: Constraint-Aware What-If Replanner
*Interactive constraint sliders (budget cuts, guest count surges, date acceleration), instant mathematical consequence calculation, side-by-side Before/After trade-off proposals, and explicit user-approval verification.*

![Gatherly AI What-If Replanner](./public/screenshots/what-if-replanner.png)

---

## ✨ Signature Differentiator: Constraint-Aware Replanning

When a user cuts the budget by 25%, adds 50 guests, or shifts an event date earlier:
1. **Deterministic Calculation**: The domain engine instantly computes budget deltas, checks venue/catering capacities, detects timeline clashes, and flags non-negotiable versus optional expenses.
2. **AI-Assisted Trade-Offs**: Gatherly AI queries the language model to synthesize realistic compromises (e.g. replacing plated banquet dinners with artisan live counters or adjusting floral density).
3. **Before-and-After Comparison**: A side-by-side card transparently compares key parameters.
4. **Explicit User Approval**: Proposed modifications **never** silently overwrite user edits. The user must review and click **Apply Approved Changes**, preserving confirmed actual expenses and completed tasks.

---

## 🎨 Art Direction: Kawaii Scrapbook Neo-Brutalism

Gatherly AI rejects generic corporate SaaS dashboards in favor of an adorable, cozy, Pinterest-inspired kawaii stationery aesthetic:
- **Color Palette**: Milky cream (`#FFF9F5`), Dreamy lavender (`#DCCEFF`), Blush pink (`#FFD9E8`), Butter yellow (`#FFF0B8`), Soft mint (`#D5F3DF`), and Muted plum text (`#554564`).
- **Tactile Neo-Brutalism**: Charming pastel offset shadows (`box-shadow: 3px 3px 0px #554564`), playful washi tape headers, and tactile pressed-button states.
- **Micro-Decorations**: Lightweight inline SVG bows, sparkles, flowers, and an adorable bunny mascot.
- **Accessibility**: High contrast ratios compliant with WCAG 2.1 AA, semantic HTML, visible keyboard focus indicators, and reduced-motion support.

---

## 🏗️ Architecture & Engineering Highlights

```mermaid
graph TD
  Presentation["Presentation Layer (React 18 + Tailwind + Accessible UI)"] --> Application["Application Layer (Use Cases & Orchestration)"]
  Application --> Domain["Pure Domain Layer (Zero Dependencies, Integer Minor Units)"]
  Application --> Infrastructure["Infrastructure Layer (LocalStorage, Ollama, Demo Adapter)"]
  Infrastructure --> Domain
```

- **Clean Hexagonal Architecture**: Domain logic contains zero dependencies on React, browser APIs, or external AI providers.
- **Integer Minor Currency Units**: All financial calculations are stored in integer **paise** (1 INR = 100 paise) to eliminate floating-point arithmetic errors.
- **Directed Graph & Cycle Detection**: Timeline tasks form an acyclic dependency graph with automated circular dependency detection (`detectCycle`).
- **Runtime Schema Validation**: Every AI response passes strict **Zod** schema validation before reaching application state.
- **Zero-Secret Public Repo (< 10 MB)**: Fully tracked repository size including screenshots is well under **1.1 MB** (strictly below the 10 MB constraint).

---

## 🚀 Quick Start Guide

### 1. Clone & Install
```bash
git clone https://github.com/Princy-y/Gatherly.git
cd Gatherly
npm install
```

### 2. Run Quality Checks
```bash
# Typecheck
npm run typecheck

# Automated Test Suite (43 tests across 10 suites covering domain, storage, AI schemas, and UI)
npm run test

# Repository Size Audit
npm run audit:size

# Production Build
npm run build
```

### 3. Launch Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🤖 AI Provider Configurations

Gatherly AI provides seamless runtime switching between AI engines:
1. **Demonstration Mode (Default & Production Safe)**: Works 100% offline and in cloud deployments without requiring a local machine or Ollama daemon.
2. **Local Ollama Mode**: Connects directly to local `qwen2.5:3b` at `http://localhost:11434` with request timeouts and abort controllers.
3. **Switch with 1 Click**: Toggle between Demo Engine and Local Ollama via the status badge in the navigation header.

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript (Strict Mode), Vite 5.4, Tailwind CSS 3.4
- **Runtime Validation**: Zod 3.23 (AI outputs, domain entities, storage migrations)
- **Icons & Visuals**: Lucide React, Canvas Confetti, Custom SVG Kawaii components
- **Testing**: Vitest 2.1, React Testing Library 16, JSDOM, Playwright (E2E)
- **Quality Tooling**: ESLint 9 (Flat Config), Prettier, TypeScript `tsc --noEmit`
- **Optional Backend**: FastAPI, Pydantic v2, Uvicorn (Rate-limited, CORS-hardened AI proxy)
- **Local AI Inference**: Ollama (`qwen2.5:3b`) with fallback deterministic `DemoAdapter`

---

## 📂 Project Structure

```
Gatherly/
├── .github/workflows/ci.yml       # GitHub Actions CI (lint, typecheck, test, audit, build)
├── backend/                       # Optional FastAPI proxy service
│   ├── main.py                    # Rate-limited proxy with bounded Pydantic schemas
│   └── requirements.txt
├── docs/                          # In-depth architectural & testing documentation
│   ├── architecture.md            # Hexagonal domain layers, topological scheduling
│   ├── security.md                # Threat model, input sanitation, CSP headers
│   ├── testing.md                 # Test matrix, unit/component coverage report
│   ├── ai-benchmark.md            # Measured latency & JSON accuracy benchmarks
│   └── deployment.md              # Vercel / Netlify / Docker deployment guide
├── public/                        # Static assets, favicon, screenshots
│   └── screenshots/
├── scripts/                       # Engineering audit & benchmark utilities
│   ├── audit-repo-size.cjs        # Git-tracked repo size auditor (< 10 MB limit)
│   └── benchmark-ollama.mjs       # Real Ollama inference test runner
├── src/
│   ├── domain/                    # Pure Domain Layer (zero framework dependencies)
│   │   ├── budget.ts              # Integer-paise financial engine & savings recommender
│   │   ├── constraints.ts         # Deterministic replanning & delta simulation
│   │   ├── currency.ts            # Rupee/paise conversion & Indian number formatting
│   │   ├── timeline.ts            # DAG task ordering, cycle detection (DFS/Kahn's)
│   │   ├── types.ts               # Zod domain schemas & TypeScript types
│   │   └── __tests__/             # Unit tests for pure domain logic
│   ├── infrastructure/            # Adapter & Storage Layer
│   │   ├── ai/                    # Replaceable AI interface (Demo, Ollama, Factory)
│   │   │   ├── aiFactory.ts       # Runtime provider switcher
│   │   │   ├── aiInterface.ts     # Zod output schemas & provider interfaces
│   │   │   ├── demoAdapter.ts     # Deterministic offline mock provider
│   │   │   ├── ollamaAdapter.ts   # Local Ollama HTTP client with timeout/abort
│   │   │   └── __tests__/         # AI response schema validation tests
│   │   └── storage/               # Browser Persistence
│   │       ├── localStorageAdapter.ts # Versioned schema, v0->v1 migrations, recovery
│   │       ├── storageInterface.ts
│   │       └── __tests__/         # Storage corruption & migration tests
│   ├── presentation/              # Presentation & UI Layer
│   │   ├── components/            # Kawaii scrapbook neo-brutalist tabs & modals
│   │   │   ├── BudgetStudioTab.tsx
│   │   │   ├── DashboardTab.tsx
│   │   │   ├── ErrorBoundary.tsx  # React error boundary with friendly recovery
│   │   │   ├── EventSwitchModal.tsx
│   │   │   ├── EventWizardModal.tsx
│   │   │   ├── InspirationStudioTab.tsx
│   │   │   ├── KawaiiDecorations.tsx # Inline SVG bows, sparkles, flowers, bunny
│   │   │   ├── Navbar.tsx
│   │   │   ├── TimelineTab.tsx
│   │   │   ├── VendorChecklistTab.tsx
│   │   │   └── WhatIfSimulatorTab.tsx
│   │   └── __tests__/             # Component & user flow test suites
│   ├── App.tsx                    # Root component with toast notifications
│   ├── index.css                  # Tailwind styles, washi tape, focus-visible
│   └── main.tsx                   # React strict mode entrypoint
├── vercel.json                    # Security headers (CSP, HSTS, X-Frame-Options)
├── vite.config.ts                 # Vite & Vitest configuration
└── tsconfig.json                  # Strict TypeScript configuration
```

---

## 🛠️ Environment Variables & Configuration

A template configuration is provided in [`.env.example`](file:///d:/Gatherly/.env.example):

| Variable | Default Value | Description |
|---|---|---|
| `VITE_AI_PROVIDER` | `demo` | AI mode: `demo` (offline deterministic), `local` (Ollama), or `remote` |
| `VITE_OLLAMA_BASE_URL` | `http://localhost:11434` | Endpoint for local Ollama daemon |
| `VITE_OLLAMA_MODEL` | `qwen2.5:3b` | Target LLM model for local inference |
| `VITE_REMOTE_API_BASE_URL` | `http://localhost:8000` | Optional FastAPI proxy backend URL |

---

## 📜 Available NPM Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts Vite local development server on `http://localhost:5173` |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and bundles for production with Vite |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint 9 Flat Config with `--max-warnings 0` |
| `npm run typecheck` | Validates strict TypeScript types across the entire project (`tsc --noEmit`) |
| `npm run test` | Runs the 43 automated tests using Vitest (JSDOM environment) |
| `npm run test:e2e` | Executes Playwright end-to-end tests in headless Chromium |
| `npm run audit:size` | Audits git-tracked repository size against the strict 10 MB competition limit |

---

## 💡 Code Quality & Engineering Decisions

1. **Integer Minor Currency Units**:
   - Money is never stored as floating-point numbers. Stored as integer **paise** (`1 INR = 100 paise`), eliminating rounding artifacts (`0.1 + 0.2 !== 0.3`).
2. **Zero-Hallucination Deterministic Guardrails**:
   - Math is never delegated to the language model. Budget overrun calculations, guest-to-catering scaling, and date compression deltas run entirely in pure TypeScript domain logic before the AI is consulted.
3. **Explicit Human-in-the-Loop Approval**:
   - AI recommendations never mutate state directly. The What-If Replanner displays a transparent Before-and-After diff and requires an explicit click on "Apply Approved Changes".
4. **Resilient Offline Architecture**:
   - Evaluators don't need local Ollama or a high-end GPU to test Gatherly AI. The production-ready `DemoAdapter` provides instant, deterministic responses matching Zod schemas.
5. **Robust Error Handling**:
   - All AI calls and storage operations use typed `unknown` error narrowing with `instanceof Error`. A dedicated `<ErrorBoundary>` catches uncaught render exceptions, offering graceful in-place recovery.
6. **Defensive Web Security**:
   - Strict Content Security Policy (CSP), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, bounded input lengths on all text fields, and zero usage of `dangerouslySetInnerHTML`.

---

- [Architecture & Domain Model](docs/architecture.md)
- [Security Specification](docs/security.md)
- [Testing Strategy](docs/testing.md)
- [AI Benchmark](docs/ai-benchmark.md)
- [Deployment Guide](docs/deployment.md)
---

## 📋 Competition Acceptance Verification

| Requirement | Implementation Evidence | Status |
|---|---|---|
| **Core planning works without AI** | Budget arithmetic, timeline ordering, and vendor checklists function 100% deterministically. | ✅ Verified |
| **Budget totals strictly verified** | Tested with integer minor units (paise) across 5 dedicated unit test suites. | ✅ Verified |
| **Tasks & vendors editable & persisted** | Versioned browser storage adapter with migration and corrupt recovery tests. | ✅ Verified |
| **AI plans pass runtime validation** | Enforced via Zod schemas (`AIGeneratedPlanOutputSchema`, etc.). | ✅ Verified |
| **Proposed AI changes require user approval** | What-If Simulator features explicit Before/After diff card and "Apply Approved Changes" gate. | ✅ Verified |
| **Responsive & Accessible UI** | Semantic HTML, ARIA dialogs, keyboard navigation, visible focus indicators, and reduced-motion rules. | ✅ Verified |
| **Zero secrets committed** | Zero API keys stored in repo; `.env.example` contains only placeholders. | ✅ Verified |
| **Production works without laptop** | Equipped with deterministic `DemoAdapter` with zero local daemon dependencies. | ✅ Verified |
| **Repository Size < 10 MB** | Verified via audit script: Total tracked repository size with screenshots is **~1.05 MB**. | ✅ Verified |

---

*Crafted with precision, care, and kawaii sparkle for Gatherly AI.* ✨
