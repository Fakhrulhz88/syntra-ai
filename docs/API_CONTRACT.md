# Syntra-AI — Frontend / Backend API Contract

Version: **1.0** · Last updated: **November 2026**

This document is the single source of truth for the seam between the Syntra-AI React app and the FastAPI backend. The TypeScript types in [`src/types/index.ts`](../src/types/index.ts) mirror these schemas. The frontend consumes them through [`src/api/client.ts`](../src/api/client.ts); the real implementation lives in [`src/api/httpApi.ts`](../src/api/httpApi.ts), and the offline demo implementation in [`src/api/mockApi.ts`](../src/api/mockApi.ts).

---

## 1. Conventions

| Item | Rule |
| --- | --- |
| Base URL | `VITE_API_URL` (default `http://localhost:8000`), no trailing slash |
| Content type | `application/json` except upload (`multipart/form-data`) |
| Encoding | UTF-8 |
| Timestamps | ISO 8601 with timezone, e.g. `2026-11-08T09:15:00+08:00` |
| IDs | Opaque strings. Suggested prefixes: `pipe-`, `game-`, `file-`, `session-` |
| Language | `"bm"` (Bahasa Melayu) or `"en"` (English) |
| Category | `"school"` or `"higher-ed"` |
| Difficulty | `"easy"`, `"medium"`, `"hard"` |
| Game status | `"generating"`, `"ready"`, `"published"` |
| CORS | The API must allow the frontend origin (dev: `http://localhost:5173`) for `GET`, `POST`, `OPTIONS` and `text/event-stream` |
| Errors | Non-2xx responses should return `{ "detail": "MESSAGE" }`; the client surfaces `API_ERROR:<status>:<statusText>` |

The frontend never calls `fetch` directly from a page. All access goes through `ApiClient`:

```ts
export interface ApiClient {
  uploadPdf(file: File, onProgress?: (percent: number) => void): Promise<UploadResult>
  startPipeline(input: CreateGameInput): Promise<PipelineStart>
  getPipeline(pipelineId: string): Promise<PipelineInfo>
  streamPipeline(pipelineId: string, options?: StreamOptions): AsyncGenerator<AgentEvent>
  getGame(gameId: string): Promise<GameRecord>
  listGames(): Promise<GameSummary[]>
  submitAnswer(gameId: string, questionId: string, answer: string, timeMs: number): Promise<SubmitAnswerResult>
  submitSession(session: GameSession): Promise<SubmitSessionResult>
  getTeacherStats(gameId: string): Promise<TeacherStats>
  regenerateGame(gameId: string, input: { feedback?: string }): Promise<GameRecord>
  approveGame(gameId: string): Promise<GameRecord>
}
```

`StreamOptions` is `{ signal?: AbortSignal }`; aborting must close the SSE connection.

---

## 2. Core schemas

### 2.1 `AgentEvent`

One pipeline log line. The pipeline screen renders these in order.

```json
{
  "agent": "analyzer",
  "status": "done",
  "message": "5 objectives, 6 concepts and 12 keywords extracted.",
  "timestamp": "2026-11-08T09:15:03+08:00",
  "output_preview": "{\n  \"subject\": \"Sejarah\",\n  \"level\": \"KSSM Tingkatan 1\"\n}"
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `agent` | `"analyzer" \| "planner" \| "generator" \| "builder"` | yes | Pipeline stage |
| `status` | `"pending" \| "running" \| "done" \| "error"` | yes | Agent state at this event |
| `message` | `string` | yes | Human-readable progress line |
| `timestamp` | `string` | yes | ISO 8601 |
| `output_preview` | `string` | no | Pretty-printed JSON or text shown in the output panel |

Recommended event order (18 events): analyzer `running/done` (4), planner (4), generator (6), builder (4). The frontend does not require exactly 18, but progress uses `events.length / 18`.

### 2.2 `LearningObjective`

```json
{ "id": "obj-1", "text": "Menjelaskan latar belakang pengasasan Kesultanan Melayu Melaka." }
```

### 2.3 `CurriculumAnalysis`

```json
{
  "subject": "Sejarah",
  "level": "KSSM Tingkatan 1",
  "objectives": [
    { "id": "obj-1", "text": "Menjelaskan latar belakang pengasasan Kesultanan Melayu Melaka." },
    { "id": "obj-2", "text": "Menganalisis faktor kegemilangan Melaka." }
  ],
  "concepts": ["Kesultanan", "Perdagangan", "Diplomasi"],
  "keywords": ["Melaka", "Parameswara", "Selat Melaka"],
  "difficulty": "Sederhana"
}
```

| Field | Type | Required |
| --- | --- | --- |
| `subject` | `string` | yes |
| `level` | `string` | yes |
| `objectives` | `LearningObjective[]` | yes |
| `concepts` | `string[]` | yes |
| `keywords` | `string[]` | yes |
| `difficulty` | `string` | yes |

### 2.4 `Question`

```json
{
  "id": "q1-1",
  "type": "mcq",
  "text": "Siapakah pengasas Kesultanan Melayu Melaka?",
  "options": ["Parameswara", "Sultan Mansur Shah", "Tun Perak", "Raja Iskandar"],
  "answer": "Parameswara",
  "explanation": "Parameswara membuka Melaka sekitar tahun 1400 selepas melarikan diri dari Temasik.",
  "objective_id": "obj-1"
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | yes | Unique within the game |
| `type` | `"mcq" \| "puzzle"` | yes | Puzzle renders a free-text input |
| `text` | `string` | yes | Question prompt |
| `options` | `string[]` | for `mcq` | Not sent/needed for `puzzle` |
| `answer` | `string` | yes | For MCQ, the exact option text. Multiple accepted spellings may be separated by a pipe character. |
| `explanation` | `string` | yes | Shown after answering |
| `objective_id` | `string` | yes | Must match an objective id in the analysis |

Answer matching on the backend should be tolerant: trim, lowercase, collapse whitespace and ignore punctuation, as the mock does.

### 2.5 `GameLevel`

```json
{
  "id": "level-1",
  "name": "Pelabuhan Melaka",
  "scene": "harbour",
  "difficulty": "Mudah",
  "objective_ids": ["obj-1", "obj-2"],
  "narrative": "Tahun 1400. Sebuah pelabuhan kecil mula berkembang...",
  "image_prompt": "A bustling 15th-century Malacca harbour at golden hour, wooden ships, traders...",
  "questions": []
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | yes | |
| `name` | `string` | yes | Shown on map/briefing |
| `scene` | `string` | yes | Phaser scene key. Known keys: `harbour`, `fort`, `market`, `firewall`, `server`, `vault`; unknown keys fall back to `map` |
| `difficulty` | `string` | yes | Display label |
| `objective_ids` | `string[]` | yes | Objectives covered by this level |
| `narrative` | `string` | yes | Story briefing |
| `image_prompt` | `string` | yes | Reserved for future image generation |
| `questions` | `Question[]` | yes | 5 per level in the demo |

### 2.6 `GameMechanics`

```json
{ "hp": 5, "points_per_correct": 100, "badges": ["Penjelajah Selat", "Penjaga Kota", "Warisan Melaka"] }
```

| Field | Type | Required |
| --- | --- | --- |
| `hp` | `number` | yes |
| `points_per_correct` | `number` | yes |
| `badges` | `string[]` | yes |

### 2.7 `GameBlueprint`

```json
{
  "title": "Legenda Selat Melaka",
  "theme": "Kesultanan Melayu Melaka · Pengembaraan Sejarah",
  "story_intro": "Tahun 1400. Kamu seorang pedagang muda...",
  "mechanics": { "hp": 5, "points_per_correct": 100, "badges": ["Penjelajah Selat", "Penjaga Kota", "Warisan Melaka"] },
  "levels": []
}
```

### 2.8 `AnswerRecord` and `GameSession`

```json
{
  "question_id": "q1-1",
  "correct": true,
  "time_ms": 8421
}
```

```json
{
  "game_id": "game-abc123",
  "nickname": "Aisyah",
  "score": 1400,
  "hp": 3,
  "level_reached": 3,
  "answers": [
    { "question_id": "q1-1", "correct": true, "time_ms": 8421 }
  ]
}
```

`level_reached` is **1-based** and means the highest level the player started. The frontend submits the session exactly once when the final screen is reached, whether the player won or ran out of HP.

### 2.9 `TeacherStats`

```json
{
  "game_id": "game-abc123",
  "total_players": 27,
  "avg_score": 959,
  "per_objective": [
    { "objective_id": "obj-1", "text": "Menjelaskan latar belakang pengasasan...", "accuracy": 0.82 }
  ],
  "leaderboard": [
    { "nickname": "PemainDemo", "score": 1500, "level_reached": 3 }
  ],
  "recent_sessions": []
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `game_id` | `string` | yes | |
| `total_players` | `number` | yes | Unique players |
| `avg_score` | `number` | yes | Mean score |
| `per_objective` | `ObjectiveStat[]` | yes | `accuracy` is a fraction `0..1` |
| `leaderboard` | `LeaderboardEntry[]` | yes | Top 10 recommended |
| `recent_sessions` | `GameSession[]` | yes | Newest first, 25 recommended |

`ObjectiveStat` is `{ objective_id: string, text: string, accuracy: number }`.
`LeaderboardEntry` is `{ nickname: string, score: number, level_reached: number }`.

### 2.10 Frontend application types

These wrap the agent output for the app. A backend may persist them as-is.

#### `GameRecord`

```json
{
  "id": "game-abc123",
  "blueprint": { "title": "...", "theme": "...", "story_intro": "...", "mechanics": {}, "levels": [] },
  "analysis": { "subject": "Sejarah", "level": "KSSM Tingkatan 1", "objectives": [], "concepts": [], "keywords": [], "difficulty": "Sederhana" },
  "status": "ready",
  "created_at": "2026-11-08T09:15:00+08:00",
  "category": "school",
  "language": "bm",
  "subject": "Sejarah",
  "level": "KSSM Tingkatan 1",
  "players": 20,
  "version": 1,
  "feedback": "Add more questions about Melaka's laws."
}
```

`feedback` is optional. `version` increments on regenerate.

#### `GameSummary`

```json
{
  "id": "game-abc123",
  "title": "Legenda Selat Melaka",
  "subject": "Sejarah",
  "level": "KSSM Tingkatan 1",
  "category": "school",
  "language": "bm",
  "status": "published",
  "created_at": "2026-11-08T09:15:00+08:00",
  "players": 27,
  "levels": 3,
  "theme": "Kesultanan Melayu Melaka · Pengembaraan Sejarah"
}
```

#### `CreateGameInput`

```json
{
  "sample": true,
  "file_id": "file-abc123",
  "category": "school",
  "subject": "sejarah",
  "language": "bm",
  "difficulty": "medium",
  "levels": 3
}
```

Exactly one of `sample: true` or `file_id` should identify the source. `levels` is 2 or 3 in the demo UI.

#### `PipelineStart` / `PipelineInfo`

```json
{ "pipeline_id": "pipe-abc123", "game_id": "game-abc123" }
```

```json
{
  "pipeline_id": "pipe-abc123",
  "game_id": "game-abc123",
  "input": { "sample": true, "category": "school", "subject": "sejarah", "language": "bm", "difficulty": "medium", "levels": 3 },
  "created_at": "2026-11-08T09:15:00+08:00",
  "version": 1,
  "feedback": "Optional teacher feedback from the previous version."
}
```

#### `UploadResult`

```json
{ "file_id": "file-abc123", "filename": "Silibus_Sejarah_KSSM_T1.pdf", "size": 2480113 }
```

#### `SubmitAnswerResult`

```json
{ "correct": true, "explanation": "Parameswara membuka Melaka sekitar tahun 1400...", "points_awarded": 100 }
```

#### `SubmitSessionResult`

```json
{ "ok": true, "session_id": "session-abc123" }
```

---

## 3. Endpoints

### 3.1 `POST /api/upload`

Upload a curriculum PDF.

- **Request:** `multipart/form-data`, field name `file`
- **Limits (enforced client-side):** PDF only, max 20 MB
- **Response:** `200 UploadResult`

```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@Silibus_Sejarah_KSSM_T1.pdf"
```

The browser `fetch` implementation does not expose byte-level progress; the client currently reports completion only. Swap to `XMLHttpRequest` if a real upload progress bar is required.

### 3.2 `POST /api/pipeline/start`

Create a game record and start the agent pipeline.

- **Request body:** `CreateGameInput`
- **Response:** `200 PipelineStart`

The game should be created with `status: "generating"` and `version: 1`.

### 3.3 `GET /api/pipeline/{pipeline_id}`

Fetch pipeline metadata. Used on page load and refresh.

- **Response:** `200 PipelineInfo`
- **404:** unknown pipeline id

The frontend treats a message containing `PIPELINE_NOT_FOUND` as a not-found state.

### 3.4 `GET /api/pipeline/{pipeline_id}/events` (SSE)

Stream `AgentEvent` frames as the agents work.

- **Content-Type:** `text/event-stream`
- **Frames:** each `data:` line is one JSON `AgentEvent`
- **Termination:** send `event: done` after the final event, or close the connection
- **Heartbeat:** comments (`: ping`) are allowed
- **Client abort:** the frontend closes the `EventSource` via `AbortSignal`

Example stream:

```text
: ping

data: {"agent":"analyzer","status":"running","message":"Opening the PDF and detecting document structure…","timestamp":"2026-11-08T09:15:01+08:00"}

data: {"agent":"analyzer","status":"done","message":"5 objectives, 6 concepts and 12 keywords extracted.","timestamp":"2026-11-08T09:15:03+08:00","output_preview":"{ ... }"}

event: done
data: {}
```

On completion the backend must:

1. Persist the final `GameBlueprint` and `CurriculumAnalysis`.
2. Set the game `status` to `"ready"`.
3. Keep the pipeline available for `GET /api/pipeline/{id}`.

The frontend refetches `GET /api/games/{game_id}` after the stream ends, so the final game must already be persisted at that point.

### 3.5 `GET /api/games/{game_id}`

Fetch the full playable game record.

- **Response:** `200 GameRecord`
- **404:** unknown game id

The frontend treats a message containing `GAME_NOT_FOUND` as a not-found state.

### 3.6 `GET /api/games`

List games for the library.

- **Response:** `200 GameSummary[]`
- **Order:** newest `created_at` first

`players` should include simulated/demo players plus real sessions, matching the dashboard's `total_players`.

### 3.7 `POST /api/games/{game_id}/answers`

Check a single answer. Called immediately after the student submits, before the next question.

- **Request:**

```json
{ "question_id": "q1-1", "answer": "Parameswara", "time_ms": 8421 }
```

- **Response:** `200 SubmitAnswerResult`
- **Errors:** `404` unknown game or question

The server should not reveal the answer in the question payload. The explanation and correct answer are returned only after submission. For incorrect answers the frontend derives the displayed correct answer from the blueprint it already has; the backend may add a `correct_answer` field later without breaking the contract.

### 3.8 `POST /api/sessions`

Persist a completed (won or game-over) session.

- **Request:** `GameSession`
- **Response:** `200 SubmitSessionResult`
- **Idempotency:** recommended on `(game_id, nickname, score, answers)` or a client-generated run id

The frontend submits exactly once per run.

### 3.9 `GET /api/teacher/{game_id}/stats`

Teacher analytics for a game.

- **Response:** `200 TeacherStats`
- **404:** unknown game id

The dashboard computes completion rate from `recent_sessions` (completed = answered all questions in the game), not from `total_players`, so the 25-session window is intentional.

### 3.10 `POST /api/games/{game_id}/regenerate`

Regenerate a game with optional teacher feedback.

- **Request:**

```json
{ "feedback": "Add more questions about Melaka's laws." }
```

- **Response:** `200 GameRecord` with `version` incremented and `feedback` stored
- **Side effects:** a new pipeline may be created; if so, return the updated game synchronously as above

The pipeline completion screen and dashboard regenerate modal both call this endpoint. The updated game should be immediately playable.

### 3.11 `POST /api/games/{game_id}/approve`

Publish an approved game.

- **Request:** `{ "approved": true }`
- **Response:** `200 GameRecord` with `status: "published"`

---

## 4. Mock parity

`mockApi` implements every method above without a backend:

| Concern | Mock behavior |
| --- | --- |
| Upload | Simulated progress (12 → 100%) over ~0.8 s |
| Pipeline start | 650 ms delay, creates a game from an authored variant |
| Pipeline events | 18 events, ~0.45 s initial delay + 0.55–1.4 s per event (~17–22 s total) |
| Pipeline persistence | Configs in `localStorage` under `syntra:v1:pipelines` |
| `/pipeline/demo` | Creates a fresh Malacca BM game and pipeline on first visit; reuses it if still present |
| Answer checking | Tolerant normalization (case, punctuation, whitespace); multiple answers separated by a pipe character |
| Sessions | Appended to `localStorage` under `syntra:v1:sessions` (max 200) |
| Teacher stats | 25 deterministic virtual students per game, merged with local sessions |
| Regenerate | Increments `version`, stores `feedback`, sets `status: "ready"` |
| Approve | Sets `status: "published"` |
| Errors | `GAME_NOT_FOUND:<id>`, `PIPELINE_NOT_FOUND:<id>`, `QUESTION_NOT_FOUND:<id>` |

When swapping to the real backend, the UI requires no changes beyond `VITE_USE_MOCK=false`.

---

## 5. Contract checklist

- [ ] CORS allows the frontend origin for all routes and SSE.
- [ ] SSE emits valid `AgentEvent` JSON and terminates with `event: done`.
- [ ] The game is persisted before the stream ends.
- [ ] `GET /api/games/{id}` works immediately after completion.
- [ ] `answers` accepts MCQ option text and puzzle text.
- [ ] `level_reached` is 1-based.
- [ ] `per_objective[].accuracy` is `0..1`.
- [ ] `recent_sessions` is newest first and capped at 25.
- [ ] Regenerate bumps `version` and stores feedback.
- [ ] Approve sets `status: "published"`.
- [ ] 404 messages contain `GAME_NOT_FOUND` / `PIPELINE_NOT_FOUND` for friendly UI states.
