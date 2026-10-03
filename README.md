# PaperTrail

> Verified past exam papers, the syllabus, and AI-generated practice question.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](YOUR_LIVE_URL)
[![Repo](https://img.shields.io/badge/GitHub-Repo-black?style=for-the-badge&logo=github)](https://github.com/techiedanish/PaperTrail)

---

## Preview

## Screenshots

### 1. Home Page (Light Mode)
![Home Page](docs/screenshots/1-HomePage.png)

---

### 2. Home Page (Dark Mode)
![Home Page Dark Mode](docs/screenshots/2-HomePage_darkMode.png)

---

### 3. The Vault
![The Vault](docs/screenshots/3-TheVault.png)

---

### 4. Review Page
![Review Page](docs/screenshots/4-ReviewPage.png)

---

### 5. Sign In Page
![Sign In Page](docs/screenshots/5-SignInPage.png)
---

## What It Does

Every exam season, students chase seniors and group chats for old question papers, and even when they find them, there's nothing to practise with beyond those same old questions. PaperTrail is a login-protected hub for verified previous-year papers and the syllabus, scoped to one college and branch. Students browse and filter papers, read the syllabus unit by unit, and upload a paper that's missing. Its core differentiator is the practice generator: it builds new questions only from past questions an admin has checked and verified for a subject and unit, so output stays inside the syllabus and in the style of real exams — not a generic chatbot prompt. An admin side reviews uploads, runs a one-time extraction per paper, and checks the extracted questions before they can be used by anyone.

This is the **Kenshi** submission: every screen above is real, interactive and responsive, built entirely on mock data with no backend yet, as the level requires.

---

## Features

- **Vault with live filtering** — search and filter approved papers by subject, exam type and year; empty and loading states are designed, not blank
- **Practice generator** — pick a subject, unit and count, and it assembles a set from mock verified questions with a loading state, a "not enough source questions" state, and a daily-limit state, matching the real behaviour specced in [API_SPEC.md](./docs/API_SPEC.md)
- **Syllabus viewer** — expand/collapse units and topics, with a direct link into the practice generator pre-scoped to that unit
- **Upload with duplicate detection** — client-side validation (PDF only, 10 MB cap) and a check against existing papers before submission
- **Admin review flow** — a four-step approve → extract → verify → publish flow, including an editable, deletable, addable question list after mock extraction
- **Dark mode, animation and a role preview switch** — since there's no real auth at this level, a role switcher (guest/student/admin) in the nav makes every screen reachable

---

## Planning Docs

- [Product Requirements](./docs/PRD.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [API Spec](./docs/API_SPEC.md)
- [Roadmap](./docs/ROADMAP.md)
- [Requirements](./docs/REQUIREMENTS.md)

**Ronin result:** passed with 70/100. Judge feedback: the practice generator is the strongest differentiator, not the paper repository itself — the Kenshi build below leans into that. The other note was to keep the architecture simple and production-oriented rather than impressive; see the note at the top of [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for how that's being carried into Samurai.

**Deviations from the plan:**
- **Semester filter deferred.** The PRD and sketch include a semester filter alongside subject, exam type and year. The current mock dataset only covers one semester, so filtering by it would be a no-op; the filter UI will come back once Samurai's seed data spans multiple semesters.
- **Repository layout simplified for this level.** [ARCHITECTURE.md](./docs/ARCHITECTURE.md) originally planned a `client/` + `server/` split. Since Kenshi has no backend, the app lives at the repo root instead (`src/`, `public/`, `docs/`); the `client/`/`server/` split returns in Samurai when the Express API is added.
- Everything else matches the Level 1 PRD's Kenshi scope (F1-F10 as screens, see [ROADMAP.md](./docs/ROADMAP.md)).

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React (Vite) | Frontend framework |
| React Router | Client-side routing |
| Tailwind CSS v4 | Styling, design tokens |
| Framer Motion | Animation and transitions |
| Mock JSON (`src/mock/data.js`) | Stands in for the Samurai backend; shaped to match [API_SPEC.md](./docs/API_SPEC.md) |
| Vercel | Deployment |

No AI, database or auth provider is called at this level - those are planned for Samurai (see [ARCHITECTURE.md](./docs/ARCHITECTURE.md)).

---

## Run Locally

```bash
git clone https://github.com/techiedanish/PaperTrail
cd PaperTrail
npm install
npm run dev
```

## Environment Variables

None required at this level. Mock data lives in `src/mock/data.js` and needs no configuration.

---

## What I Learned

_Fill this in honestly after building - 3 to 4 sentences on the hardest part and the design/animation decision you're most proud of._

---

## What I'm Building Toward

**Samurai (full-stack):** A PostgreSQL database seeded with the syllabus, real login with student and admin roles, PDF upload to private storage, an admin approval queue, downloads that only work when logged in, and the AI layer: admin-triggered extraction, question verification, and a practice generator that uses only verified stored questions with a daily limit per user. If time gets tight, the paper library is protected first and the AI features shrink, never the reverse - see the cut order in [ROADMAP.md](./docs/ROADMAP.md).

**Shogun (production):** At least 25 real students from my college and branch registered, with proof. Ratings on generated questions, paper reports, a repeated-topics view, and at least 25 feedback responses collected and honestly written up against the metrics in [PRD.md](./docs/PRD.md).

**Beyond the program:** scoped to one college and branch deliberately, since that's where real papers and real users are reachable in four weeks. If it works, the natural next step is letting a student pick their college and branch at signup - not something built now, just the direction this could grow in.

---

*Submitted to Journey to Mastery - Level 2: Kenshi*
