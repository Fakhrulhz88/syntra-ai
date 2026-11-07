# Syntra-AI — 3-Minute Demo Script

**Goal:** show the full loop — curriculum → four agents → playable game → teacher insight — in under three minutes, with zero backend dependency.

**Setup before you present**

1. `npm run dev` (or `npm run build && npm run preview`).
2. Open **http://localhost:5173** in a clean browser profile or incognito window.
3. Set language to **BM** (default) or **EN** — pick one and stay consistent.
4. Optional: open `/games` in a second tab as a backup.
5. Turn sound on if the room is quiet; speech synthesis is optional.
6. Have the QR code on screen ready for judges to scan.

> **Clean-slate tip:** if a previous run left demo data, clear site data for `localhost:5173` (or run in incognito). The app reseeds automatically. Everything is local — no network required after the page loads.

---

## 0:00 — 0:20 · Hook (Landing)

**Show:** `/`

**Say:**
> "Teachers spend hours turning a syllabus into something students actually want to do. Syntra-AI turns a curriculum PDF into a playable RPG quiz in about twenty seconds — and gives the teacher a live mastery dashboard."

Point at the hero and the four-agent strip:

> "Four specialised agents do the work: an Analyzer reads the curriculum, a Planner designs the game, a Generator writes the questions, and a Builder assembles the playable experience."

**Click:** **Jana Permainan** (Create).

---

## 0:20 — 0:40 · Create

**Show:** `/create`

**Say:**
> "I'll use the built-in Sejarah KSSM Tingkatan 1 syllabus — the Malacca Sultanate — so the demo is reproducible. In production this is a PDF upload."

**Click:** **Pilih silibus contoh** → **Jana Permainan**.

> "Category, language, difficulty and level count are all configurable. The mock backend keeps the demo offline; the real FastAPI contract is documented in the repo."

The app navigates to `/pipeline/:id`.

---

## 0:40 — 1:30 · The agent pipeline (the money shot)

**Show:** `/pipeline/:id`

While the 18 events stream (~20 seconds), narrate and point:

1. **Agent graph** — each agent moves from *Menunggu* → *Bekerja* → *Selesai*.
2. **Live log** — real-time messages: parsing the PDF, extracting objectives, designing the world, writing questions, assembling scenes.
3. **Agent output panel** — click an agent (e.g. **Penganalisis Kurikulum**) to show the extracted objectives and raw JSON.
4. **Progress + timer** — 50% → 100%, step 3/4 → 4/4.

**Say:**
> "This isn't a fake loading bar — each event is streamed from the agent layer. In the real backend this is Server-Sent Events; in the demo it's the same interface, so the UI doesn't change."

When **Game siap!** appears (confetti):

**Say:**
> "The game is ready: three levels, fifteen questions, five lives, three badges — all generated from the curriculum analysis."

Point at the completion card:

- Title, subject, level, level/question/player counts.
- **QR code + share link** — "Students scan this; no accounts, just a nickname."
- **Luluskan** (Approve) — click it; badge changes to **Diterbitkan**.

**Optional (5 seconds):** type feedback such as *"Tambah soalan tentang undang-undang Melaka"* and click **Jana Semula** to show version 2. Skip if time is tight.

**Click:** **Main Sekarang** (Play Now).

---

## 1:30 — 2:15 · Play

**Show:** `/play/:gameId`

1. **Nickname gate** — type `Aisyah`, click **Mulakan Pengembaraan**. (Enter also works.)
2. **Story intro** — point at HP, points, badges and the three-level mission. Click **Masuk ke peta**.
3. **Level map** — three themed levels, first unlocked, progress 0/3.
4. Click **Pelabuhan Melaka** → **Mula cabaran**.
5. **Answer one MCQ correctly** — select the correct option, click **Hantar jawapan**. Point at:
   - Green feedback and the explanation.
   - HP unchanged, score +100, streak.
6. **Answer one puzzle** (or press `2` / use the number keys to show keyboard support) — submit and show the explanation.
7. Click **Soalan seterusnya** once to show the next question.

**Say:**
> "Every question is tied to a learning objective. Feedback is immediate, and the explanation is generated with the question — this is formative assessment, not just a score."

> **Time-saving option:** after two questions, click the exit icon in the HUD → **Keluar sekarang** to return to the library. The dashboard already contains 25 simulated students, so the analytics story still lands. If you want a real session on the board, finish all three levels (about 60 seconds with the correct answers) before opening the dashboard.

**Open the dashboard:** use the completion card's **Papar Dashboard** link, the game card in `/games`, or navigate directly to `/dashboard/demo-malacca` (or the generated id).

---

## 2:15 — 3:00 · Teacher dashboard + close

**Show:** `/dashboard/:gameId`

**Say:**
> "This is what the teacher sees. Twenty-five students in this demo, with real sessions merged in live."

Point and click:

1. **KPI cards** — players, average score, completion rate, weak objectives.
2. **Objective accuracy chart** — the red bar is the weak objective; hover to show the tooltip.
3. **Isyarat untuk tindakan** — "Only 47% mastered this objective. Regenerate the level focused on it?" Click **Jana semula tahap ini** to show the feedback modal prefilled from the weak objective. (Close it if time is short.)
4. **Leaderboard** — top players, levels reached.
5. **Recent sessions** — filter by **Tahap 1 / 2 / 3**; point out HP and score per student.
6. **Share card** — QR code and copy link for the class.

**Close:**
> "Curriculum in, playable world out, mastery data back to the teacher. Syntra-AI — built for Solution Arena 2026."

---

## Backup plans

| Problem | Recovery |
| --- | --- |
| Pipeline feels slow | Keep talking through the agent graph; it finishes in ~20 s. Or open `/play/demo-malacca` in the backup tab. |
| A route fails to load | Hard-refresh once; the dev server hot-reloads. For the stage, use `npm run preview` after `npm run build`. |
| Demo data looks stale | Clear site data for the origin and reload; seeded games and 25 students return automatically. |
| Speech synthesis unavailable | Buttons disable themselves; skip the read-aloud moment. |
| No internet | Everything is bundled: fonts, art (SVG/Phaser), mock data. No external calls. |
| Judge asks for the real backend | Show `docs/API_CONTRACT.md` and `src/api/httpApi.ts`; switch with `VITE_USE_MOCK=false`. |

## Clicks cheat sheet

| Moment | BM label | EN label |
| --- | --- | --- |
| Create | Jana Permainan | Generate Game |
| Sample source | Pilih silibus contoh | Choose sample syllabus |
| Pipeline complete | Game siap! | Game ready! |
| Approve | Luluskan | Approve |
| Regenerate | Jana Semula | Regenerate |
| Open game | Main Sekarang | Play Now |
| Start game | Mulakan Pengembaraan | Begin Adventure |
| Enter map | Masuk ke peta | Enter the map |
| Start level | Mula cabaran | Start challenge |
| Submit | Hantar jawapan | Submit answer |
| Next | Soalan seterusnya | Next question |
| Finish level | Selesaikan tahap | Finish level |
| Next level | Tahap seterusnya | Next level |
| Finish game | Tamat | Finish |
| Play again | Main lagi | Play again |
| Dashboard | Papar Dashboard | View Dashboard |

## Timing summary

| Segment | Time |
| --- | --- |
| Landing hook | 20 s |
| Create | 20 s |
| Pipeline + approve | 50 s |
| Play | 45 s |
| Dashboard + close | 45 s |
| **Total** | **~3:00** |

If you only have **2 minutes**, cut the create form (start at `/pipeline/demo`), play one question, and spend the remaining time on the dashboard.
