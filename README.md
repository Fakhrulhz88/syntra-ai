# Syntra-AI

**Turn a curriculum PDF into a playable RPG quiz — automatically.**

Syntra-AI is the frontend for an agentic curriculum-to-game generator built for **Solution Arena: Agentic AI Challenge 2026** (theme: *Edutainment & Innovation*). Upload a syllabus, watch four AI agents analyse, plan, generate and build a game, then send students into a themed adventure and review their mastery in a teacher dashboard.

The demo runs **fully offline on mock data** — no backend, API keys or network connection required.

![Flow](https://img.shields.io/badge/flow-PDF%20→%20agents%20→%20game%20→%20dashboard-22d3ee) ![Stack](https://img.shields.io/badge/stack-React%2019%20·%20Vite%20·%20TypeScript%20·%20Phaser%203-a78bfa) ![Languages](https://img.shields.io/badge/language-BM%20%2F%20EN-f5c451)

---

## What is in the demo

| Step | Route | What happens |
| --- | --- | --- |
| 1. Create | `/create` | Pick a sample syllabus or drop a PDF, choose category, language, difficulty and 2–3 levels. |
| 2. Pipeline | `/pipeline/:id` | Four agents stream 18 live events: **Analyzer → Planner → Generator → Builder**. Progress, timer, live log, expandable JSON outputs, completion confetti, share link + QR. Approve or regenerate with teacher feedback. |
| 3. Play | `/play/:gameId` | Nickname gate → story intro → level map → 3 themed Phaser scenes → MCQ + puzzle questions with explanations, HP, score, streak and badges → level and final results. |
| 4. Dashboard | `/dashboard/:gameId` | Teacher KPIs, per-objective accuracy chart, weak-objective call to action, leaderboard, recent sessions, level filter, share card and regenerate-with-feedback. |
| 5. Library | `/games` | Search and filter every generated game; play, open the dashboard or copy the share link. |

A one-click demo route, **`/pipeline/demo`**, spins up a fresh Malacca game so you can start the pipeline without filling the form.

---

## Feature highlights

- **Agentic pipeline theatre** — animated four-agent graph, per-agent status, streaming log, output previews with raw JSON, elapsed timer, step counter and completion state.
- **Human-in-the-loop** — approve a generated game, or regenerate it with free-text feedback; feedback is carried into the next pipeline version.
- **Real game loop** — HP, points, streak, badges, locked levels, replay, game-over and victory paths, keyboard shortcuts, touch targets, reduced-motion-aware confetti and optional speech synthesis.
- **Hybrid Phaser + React** — Phaser renders the animated Malacca harbour / cyber firewall / map scenes and particles; React renders accessible HUD, quiz and narrative overlays.
- **Bilingual by design** — full BM and EN UI plus genuinely authored BM/EN content for both demo topics. Language persists across reloads.
- **Teacher analytics** — 25 deterministic virtual students per game, merged with real sessions from `localStorage`; objective accuracy drives the "weak objective" recommendation.
- **API seam** — one `ApiClient` interface with a complete `mockApi` (default) and a FastAPI/SSE `httpApi`; switch with one env variable.
- **Demo-proof** — seeded games, loading/empty/error states, offline fonts, no external image requests, responsive down to mobile.

---

## Tech stack

- **React 19 + TypeScript 7** (strict, no `any`)
- **Vite 8**
- **React Router 7**
- **Tailwind CSS 3.4** with a custom token palette
- **Phaser 3** for scenes/particles
- **Framer Motion** for transitions
- **Recharts** for objective analytics
- **Zustand** for i18n + toasts
- **canvas-confetti**, **qrcode.react**, **lucide-react**
- **oxlint** for linting
- Bundled **Inter / Poppins / Press Start 2P** via `@fontsource` (offline)

---

## Quick start

```bash
cd syntra-ai
npm install
npm run dev
```

Open **http://localhost:5173**.

The mock API is the default, so the app works with no `.env` file. To configure it explicitly:

```bash
cp .env.example .env
```

```dotenv
VITE_USE_MOCK=true
VITE_API_URL=http://localhost:8000
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | Type-check (`tsc -b`) and production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run oxlint |

> Verified with `npm run build` (success) and `npm run lint` (zero errors, zero warnings). The build prints a non-blocking chunk-size advisory for the lazy-loaded Phaser game bundle.

---

## Routes

| Path | Page | Notes |
| --- | --- | --- |
| `/` | Landing | Hero, how it works, agents, features, demo QR |
| `/create` | Create | Sample syllabus or PDF, game settings |
| `/pipeline/demo` | Pipeline | Auto-creates a fresh sample game, then rewrites the URL to its real pipeline id |
| `/pipeline/:id` | Pipeline | Live SSE/mock stream, outputs, approve/regenerate |
| `/play/:gameId` | Play | Full game, lazy-loaded so Phaser stays out of the landing bundle |
| `/dashboard/:gameId` | Dashboard | Teacher analytics + share + regenerate |
| `/games` | Games library | Search, status filters, cards |
| `*` | Not found | Friendly 404 with links |

---

## Architecture

```text
src/
  api/            ApiClient contract, mockApi, httpApi, factory
  components/
    layout/       Navbar, Footer, SiteLayout
    landing/      Hero, Steps, Agents, Features, DemoCta
    create/       SegmentedControl, UploadDropzone, CreateSidebar
    pipeline/     AgentGraph, LiveLog, AgentOutput, PipelineCompletion
    play/         NicknameGate, Hud, StoryIntro, LevelMap, Briefing,
                  QuizScreen, LevelResult, FinalResult, ExitModal
    dashboard/    KpiCard, ObjectiveChart, WeakObjectiveCard, Leaderboard,
                  RecentSessions, RegenerateModal
    ui/           Button, Badge, Progress, Spinner, Modal, Toast, QRCard, ...
  data/           Authored Malacca + Cyber variants, agent events, seeded games,
                  deterministic student simulator
  game/           Phaser GameScene/GameStage, scene metadata, audio
  i18n/           BM/EN dictionaries + persisted Zustand store
  lib/            storage, formatting, speech, cn
  pages/          Route-level screens
  store/          Toast store
  types/          Backend contract + frontend app types
docs/
  API_CONTRACT.md
```

### The API seam

Every screen talks only to `src/api/index.ts`:

```ts
export const api: ApiClient = isMockMode ? mockApi : httpApi
```

- **`mockApi`** implements the entire contract in memory + `localStorage`: upload progress, pipeline configs, an 18-event async generator, seeded games, answer checking, session storage, deterministic teacher stats, regenerate and approve.
- **`httpApi`** maps the same interface to the FastAPI routes in [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md), including `EventSource` streaming with abort support.

To use the real backend:

```dotenv
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:8000
```

### Data and state

- **Seeded games:** `demo-malacca`, `demo-cyber`, `demo-malacca-en`, `demo-cyber-bm`.
- **New games:** ids like `game-…`; the mock truncates the authored 3-level blueprint to the requested 2–3 levels.
- **Persistence:** games, sessions, pipeline configs, nickname, sound and voice preferences are stored under `syntra:v1:*` in `localStorage`.
- **Stats:** 25 deterministic virtual students are simulated per game; real sessions are merged on top. Completion rate is computed over the 25-session window shown to teachers.
- **Language:** BM is the default; the navbar toggle switches the whole UI and is persisted.

### Demo content

Both topics are authored end-to-end, in both languages, so the language selector changes real content rather than labels:

- **Sejarah KSSM Tingkatan 1** — *Legenda Selat Melaka* (Kesultanan Melayu Melaka): 3 levels × 5 questions.
- **Introduction to Cybersecurity** — *Firewall Protocol* (undergraduate year 1): 3 levels × 5 questions.

Each level mixes MCQ and puzzle questions, includes explanations, maps to learning objectives and awards a badge.

---

## Accessibility & UX

- Semantic landmarks, skip link, labelled inputs and `aria-*` state on quiz controls.
- Keyboard support: `1–4` to select MCQ options, `Enter` to submit/continue, `Esc` closes the exit modal.
- Focus-visible styles, 44px+ touch targets, responsive layouts from 320px up.
- Speech synthesis is optional and feature-detected; buttons disable gracefully when unsupported.
- Confetti respects `prefers-reduced-motion`.
- All UI strings live in `src/i18n/translations.ts`.

---

## Documentation

- [API contract](docs/API_CONTRACT.md) — types, endpoints, SSE format, error codes and mock parity.
- [Demo script](DEMO_SCRIPT.md) — a timed 2–3 minute walkthrough with fallbacks.
- [Submission checklist](CHECKLIST.md) — pre-demo verification and judging criteria.

---

## Known limitations

- The mock API is a deterministic demo, not a real LLM: uploaded PDFs are accepted but content comes from the authored variants.
- Teacher stats are simulated for demo purposes; only the current browser's sessions are real.
- `localStorage` is per browser/profile, so leaderboards are not shared across devices.
- The FastAPI client is a contract-complete stub; it expects a backend that matches `docs/API_CONTRACT.md`.
- Only History/Sejarah and Cybersecurity are available in the mock; other subjects are marked "coming soon".

---

Built for **Solution Arena: Agentic AI Challenge 2026** · Theme: Edutainment & Innovation.
