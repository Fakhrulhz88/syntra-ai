# Syntra-AI — Submission Checklist

Use this before recording or presenting. Everything below is designed to be verifiable offline.

---

## 1. Build & quality gates

- [x] `npm install` completes cleanly.
- [x] `npm run build` passes (TypeScript strict + Vite production build).
- [x] `npm run lint` passes with **no errors**.
  - Two advisory `react(set-state-in-effect)` warnings remain in `PipelinePage.tsx` and `PlayPage.tsx` (intentional route-reset effects).
- [x] No `any` in application code.
- [x] All UI strings come from `src/i18n/translations.ts` (BM + EN).
- [x] No unused assets or external image/font requests required at runtime.
- [x] `.env.example` documents `VITE_USE_MOCK` and `VITE_API_URL`.
- [x] `.gitignore` excludes `node_modules`, `dist`, local env files and editor noise.

## 2. Routes

- [x] `/` renders the landing page with hero, steps, agents, features and demo CTA.
- [x] `/create` renders the source picker and game settings.
- [x] `/pipeline/demo` creates a sample pipeline and rewrites the URL to `/pipeline/:id`.
- [x] `/pipeline/:id` streams events, shows outputs, completes and offers approve/regenerate/share.
- [x] `/play/:gameId` loads a game and shows the nickname gate.
- [x] `/dashboard/:gameId` loads KPIs, chart, weak objective, leaderboard and recent sessions.
- [x] `/games` lists seeded games with search/filter/cards.
- [x] Unknown routes render the 404 page.
- [x] Unknown game/pipeline ids show friendly not-found states.

## 3. End-to-end flow (verified)

- [x] Create → select sample → **Jana Permainan** → navigates to a real pipeline id.
- [x] Pipeline streams all 18 events and reaches **Game siap!**.
- [x] Completion shows the generated title, level/question counts and share link + QR.
- [x] **Jana Semula** with feedback increments the game version and persists the feedback.
- [x] **Luluskan** sets the game status to `published` and shows the approved badge.
- [x] Play: nickname → intro → map → briefing → 3 levels × 5 questions → final.
- [x] MCQ and puzzle questions both submit and show explanations.
- [x] Correct answers increase score; wrong answers reduce HP; streak resets on a wrong answer.
- [x] Level result awards a badge; next level unlocks on the map.
- [x] Winning shows the victory screen and submits the session exactly once.
- [x] Losing all HP shows the game-over screen and submits the session.
- [x] **Main lagi** resets score, HP, badges, progress and returns to the map.
- [x] Completed session appears in the dashboard leaderboard and recent sessions.
- [x] Session survives a page reload (localStorage).
- [x] Dashboard weak-objective CTA opens the regenerate modal with prefilled feedback.

## 4. Game mechanics

- [x] HP starts at `mechanics.hp` (5) and never goes below 0.
- [x] Score = correct answers × `points_per_correct` (100).
- [x] Level replay clears that level's answers while preserving other levels.
- [x] Level locks enforce order (level 1 unlocked; level N requires N−1 completed).
- [x] `level_reached` is 1-based and reflects the highest level started.
- [x] Badges are awarded per completed level and shown on the final screen.
- [x] Keyboard: `1–4` selects MCQ options, `Enter` submits/continues, `Esc` closes the exit modal.
- [x] Touch targets are at least 44 px; layouts work at 320 px width.
- [x] Read-aloud is optional, feature-detected and degrades gracefully.
- [x] Confetti respects `prefers-reduced-motion`.
- [x] HUD is hidden on the nickname gate and visible from the intro onward.

## 5. Content

- [x] Malacca game is complete in **BM** and **EN**: 3 levels × 5 questions.
- [x] Cybersecurity game is complete in **EN** and **BM**: 3 levels × 5 questions.
- [x] Every question has an explanation and an objective id.
- [x] Every objective id resolves to a real objective in the analysis.
- [x] Both languages have full UI dictionaries (no missing-key fallbacks in the main flow).
- [x] Language choice persists across reloads.
- [x] Dates and numbers are localized.
- [x] 25 deterministic virtual students produce stable, believable stats.
- [x] Seeded games cover published and ready states, both categories and both languages.

## 6. States & resilience

- [x] Loading states for games, dashboard, pipeline and the lazy play route.
- [x] Empty states for no games, no search results and no recent sessions.
- [x] Error states with retry for games, dashboard and pipeline.
- [x] Not-found states for unknown ids.
- [x] Toasts for session save failure, regenerate/approve failure and unsupported speech.
- [x] API errors never crash the page.
- [x] localStorage read/write is wrapped in try/catch (private mode safe).
- [x] Mock pipeline supports `AbortSignal`; navigating away cancels the stream.
- [x] Regenerate modal remounts cleanly and resets its local state.

## 7. Accessibility & UX

- [x] Skip link and semantic landmarks.
- [x] Visible focus styles.
- [x] Labelled inputs, `aria-pressed` on options, `role="status"` feedback, `role="alert"` errors.
- [x] Colour is not the only signal for correct/incorrect (icons + text).
- [x] Reduced-motion support for confetti.
- [x] Responsive navbar, cards, charts, quiz and HUD.
- [x] No horizontal scroll on mobile.
- [x] Contrast checked for primary text, buttons and badges.

## 8. Performance

- [x] Phaser is lazy-loaded only on `/play/:gameId`.
- [x] Fonts are bundled locally (no Google Fonts request).
- [x] Scenes are procedural (no large image downloads).
- [x] Production build is split into route-level chunks.
- [x] Pipeline log does not block the main thread.
- [x] `canvas-confetti` only fires on completion/victory.

## 9. API switch

- [x] `src/api/index.ts` selects `mockApi` by default.
- [x] `VITE_USE_MOCK=false` selects `httpApi`.
- [x] `httpApi` covers upload, pipeline start/get/stream, games, answers, sessions, stats, regenerate and approve.
- [x] SSE parsing validates event shape and supports abort.
- [x] `docs/API_CONTRACT.md` matches the TypeScript types and endpoint paths.
- [x] No page imports `mockApi` directly.

## 10. Demo readiness

- [x] `npm run dev` serves on port 5173.
- [x] A clean browser profile seeds all four demo games automatically.
- [x] `/pipeline/demo` works without filling the form.
- [x] The full flow has been smoke-tested in headless Chrome (play → win → replay → game over → dashboard; pipeline → regenerate → approve; create → pipeline).
- [x] QR codes render locally.
- [x] The app works offline after load.
- [x] [DEMO_SCRIPT.md](DEMO_SCRIPT.md) is rehearsed and fits in 2–3 minutes.
- [x] Backup tab open at `/games` or `/play/demo-malacca`.
- [x] Laptop volume, screen resolution and browser zoom are set before presenting.

## 11. Repository hygiene

- [x] README explains the product, stack, setup, routes and architecture.
- [x] `docs/API_CONTRACT.md` documents every endpoint, schema and error convention.
- [x] `DEMO_SCRIPT.md` includes timings, narration and fallbacks.
- [x] `CHECKLIST.md` (this file) is current.
- [x] Git history is split into logical commits.
- [x] No secrets, API keys or personal data in the repo.
- [x] `dist/` is ignored; build artifacts are reproducible.

---

## Judging criteria mapping

| Criterion | Where to look |
| --- | --- |
| **Agentic AI** | `/pipeline/:id` — four specialised agents, streaming events, outputs, human approval and feedback loop |
| **Edutainment** | `/play/:gameId` — story, themed Phaser scenes, HP/score/streak/badges, immediate explanations |
| **Curriculum alignment** | Objectives → levels → questions → per-objective dashboard accuracy |
| **Teacher value** | `/dashboard/:gameId` — KPIs, weak-objective CTA, leaderboard, recent sessions, regenerate |
| **Technical execution** | Strict TypeScript, API seam, SSE + mock parity, lazy loading, responsive/a11y |
| **Demo polish** | Seeded data, bilingual content, offline assets, QR sharing, confetti, error/empty states |
| **Completeness** | End-to-end create → pipeline → play → dashboard → library, documented contract |

---

## Final pre-flight (60 seconds)

1. `npm run build` — expect success.
2. `npm run lint` — expect 0 errors.
3. Open a clean incognito window at `http://localhost:5173`.
4. Click **Jana Permainan** once to confirm the create route loads.
5. Open `/pipeline/demo` in a second tab and let it run once.
6. Open `/play/demo-malacca` and confirm the nickname gate.
7. Open `/dashboard/demo-malacca` and confirm the chart and leaderboard.
8. Close the rehearsal tabs, reopen a clean tab at `/`, and start the demo.
