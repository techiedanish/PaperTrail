# Roadmap - PaperTrail

Dates follow the program's weekly Sunday deadlines, counting this week (21 September 2026) as Week 1. If the platform calendar differs, the order and the scope of each milestone stay the same and only the dates move.

| Week | Level | Goal |
|---|---|---|
| 1 | Ronin | Decide exactly what I'm building, on paper |
| 2 | Kenshi | Every screen exists and feels real, with fake data |
| 3 | Samurai | It really works and is live on the internet |
| 4 | Shogun  | Real students use it and I improve it from what they say |

---

## Ronin (Week 1): planning

**Ships:** the five documents, the Excalidraw sketch and the README hub.

**Non-code work that also happens this week:**
- Test one real past paper from my college in Google AI Studio (paste 5 to 10 real questions plus a syllabus unit, ask for 5 new questions) to see if the AI part is worth building as planned.
- Check the real free-tier limits shown in my Gemini project.

**Done when:** every document is filled, the sketch link opens without login, and the docs do not contradict each other.

---

## Kenshi (Week 2): the frontend, with no backend

**What ships:** a React app that looks and behaves like the finished product, using fake (mock) data that is shaped like the API responses in API_SPEC.md. This is the full MVP feature list from the PRD (F1 to F10) as screens:

1. Login and register (F1)
2. Vault with filters by semester, subject, exam type and year (F2)
3. Paper detail with a download button that asks guests to log in (F3)
4. Syllabus viewer: subject, units, topics (F4)
5. Upload form with My uploads status list (F5)
6. Practice generator: choose subject, unit, count, see a set of questions (F9) and My history (F10)
7. Admin review queue (F6), paper review with approve, reject and "run extraction" (F7), and verify-questions screen (F8)

**Quality bar:** works on a phone-sized screen, clean folder structure (pages, components, api, mock), loading and empty states designed even though they are fake, and at least 3 meaningful commits spread across the week.

**Alongside the code (no coding needed):** collect at least 10 real papers across 3 subjects from my batch and seniors, and get the syllabus text for those subjects, so the app has real content to be seeded with in Samurai.

**Not in Kenshi:** anything that needs a server, a database, real login or the AI. Ratings, reports, topic stats and usage stats (F11 to F14) are also not built yet.

---

## Samurai (Week 3): backend, database, login, deployment

**What gets added:** everything that turns the screens into a real product, in this order (so that if time runs short, the earlier items are already done):

1. **Foundations (Mon to Tue):** PostgreSQL schema, seed script for subjects and syllabus, register and login with bcrypt and JWT, roles (F1, F4).
2. **Tier 1, the paper library (Wed):** file upload to storage, approved-papers list and filters, login-gated signed-URL download with download log, My uploads (F2, F3, F5).
3. **Admin review (Thu):** review queue, approve and reject with reason (F6).
4. **Tier 2, the AI layer (Thu to Fri):** admin-triggered extraction, question editing and manual entry, mark verified, then the practice generator with the daily limit and saved history (F7, F8, F9, F10).
5. **Hardening and deploy (Sat to Sun):** loading and error states everywhere, environment variables and setup instructions in the README, frontend live on Vercel, backend live on Render, endpoint list in the README.

**Done when:** a stranger can open the live link, register, download a paper, upload one, and (as admin) approve it, extract it, verify it, and then generate practice questions from it.

**If I fall behind, I cut in this order:** (1) polish and history view, (2) automatic extraction is replaced by manual question entry only, (3) generation is limited to one fixed question format, (4) emergency cut: if student upload plus approval is not working by Thursday evening, I hide the student upload screen and ship admin-only upload (admin uploads publish immediately). The core of the paper library (browse, download, syllabus) is never cut.

---

## Shogun (Week 4): launch, real users, feedback

**What gets added:**

- **Launch:** confirm launch readiness from the PRD (10 or more approved papers, 3 or more subjects with syllabus, 2 or more verified papers), then post in my batch and department groups with a plain message: what it is and why they need to sign in.
- **Small product additions (F11 to F14):** thumbs up or down on generated questions, a "report a paper" button, the repeated-topics view per subject, and an admin usage summary plus an in-app link to the feedback form.
- **Users and feedback:** reach at least 25 registered users and at least 25 feedback responses (Google Form whose first question asks how they found PYQs before). Keep a screenshot of the users table and the responses sheet as proof.
- **Iteration:** write up what the feedback said and which visible changes I made because of it. Update the README, and record a demo video if time allows.

**Stretch, only if everything above is finished and stable:** AI-suggested solutions labelled "not verified" (S1) and a second AI provider as fallback (S2).

**Done when:** the success metrics M1 to M7 in the PRD are measured, with proof, and honestly reported even if some targets are missed.

