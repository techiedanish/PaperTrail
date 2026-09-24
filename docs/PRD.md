# Product Requirements Document - PaperTrail

---

## 1. Problem statement

Students in my college, have no single, trustworthy place to get previous-year question papers (PYQs) and the syllabus for the exams they are about to sit, and nothing to practise with once they do find old papers.

Today, papers move around as photos and PDFs in batch WhatsApp groups, on seniors' phones and in private Drive folders. Every exam season the same requests are repeated ("does anyone have the DBMS paper from last year?"), files arrive with no clear subject, exam type or year, and a student rarely ends up with a complete set. The syllabus lives in yet another PDF. Even a student who does assemble a full set only gets *old* questions: nothing produces new practice questions in the style our papers are actually set.

### 1.1 Who has it, and how I know it is real

- **First-hand.** I am a student, and I go through this every exam cycle. It is a problem I have had myself.
- **It recurs on a fixed schedule.** Exams happen four times a year (mid-sem and end-sem, for two semesters), and every batch has to rediscover the same papers each time. Demand is predictable, not occasional.
- **The workaround is visibly bad.** The current "system" is asking in group chats and scrolling back through them. That is a sign of an unmet need: people are already spending effort on a job no tool does properly.
- **Feedback** In feedback form, I will ask users how they found PYQs before this app. My baseline will come from real users.

### 1.2 Why the alternatives fall short

| Alternative | Why it doesn't solve the problem |
|---|---|
| WhatsApp / Telegram groups | No search, no structure, files are unlabeled and get buried or expire |
| Personal Drive folders | Private to whoever owns them, inconsistent naming, links die when someone leaves |
| A general chatbot  | Doesn't know my college's paper pattern, mark distribution or syllabus, so it can drift off-syllabus and off-style |

---

## 2. Target user

**Primary user: A student, preparing for a mid-sem or end-sem exam.**

Example situation: A student a couple of weeks before end-sem, with several theory subjects to prepare. For at least a couple of them they are missing older papers, the syllabus is in a different file, and they want practice questions that look like the ones their department sets.

**Secondary user: the admin (moderator).** Me, and optionally one trusted senior or class representative. The admin reviews uploaded papers, runs the one-time extraction, and verifies the extracted questions.

**Not the target user (for this project):** students of other branches or colleges, teachers, and anyone outside this one college and branch. See Out of scope.

---


## 3. Core features for the MVP

The MVP is split into two tiers so that the product stays useful even if the AI part runs late.

- **Tier 1 — works with no AI at all:** F1 to F6. This alone is a complete, useful "past paper library".
- **Tier 2 — the AI layer on top:** F7 to F10. This is what makes the product different from a shared Drive folder.

| ID | Feature | User | Tier | Notes |
|---|---|---|---|---|
| F1 | Sign up / log in with two roles (student, admin) | Both | 1 | Admin role is assigned directly in the database |
| F2 | Browse the vault and filter by semester, subject, exam type (mid/end) and year | Guest, Student | 1 | Listing is public so people see the value before signing up |
| F3 | Paper detail page and PDF download, **login required for download** | Student | 1 | Downloads are logged (used for success metrics) |
| F4 | Syllabus viewer | Guest, Student | 1 | Seeded from a file, no editing UI |
| F5 | Upload a missing paper, duplicate warning, "My uploads" with status | Student | 1 | Student uploads go to a pending queue; an admin's own uploads are published immediately |
| F6 | Admin review queue: approve or reject (with reason) | Admin | 1 | Only approved papers are visible in the vault |
| F7 | Admin-triggered AI extraction of an approved paper into structured questions (number, text, marks, syllabus topic) | Admin | 2 | Runs once per paper, result is stored |
| F8 | Question verification: admin edits, deletes, adds questions manually, marks the paper verified | Admin | 2 | Manual entry is also the fallback if extraction fails |
| F9 | Practice generator: choose subject, unit and number of questions (max 10) and get new questions in the style of stored verified questions | Student | 2 | Uses stored text only, no PDF reading; daily limit per user |
| F10 | Generation history: view earlier generated sets | Student | 2 | Re-viewing a set costs no AI call |

### 3.1 Post-MVP features (added at Shogun)

| ID | Feature |
|---|---|
| F11 | Thumbs up / thumbs down on each generated question |
| F12 | "Report a paper" (wrong, broken, copyright) and an admin reports list |
| F13 | Repeated-topics view per subject (a database query over verified questions, no AI at runtime) |
| F14 | Admin usage summary (users, downloads, sets generated) and an in-app link to the feedback form |

### 3.2 Stretch goals (not committed)

Only attempted if everything above is finished and stable:

- **S1:** AI-suggested solution per question, always labelled "AI-generated, not verified".
- **S2:** A second LLM provider (Groq) as fallback for generation only, if the primary provider's free limits block real use.

---

## 4. Out of scope

Each item is a deliberate decision. This list is as binding as the feature list.

| Not building | Why |
|---|---|
| AI reading a PDF when a student clicks something | Cost, slowness and errors. Extraction is admin-triggered, once per paper, and verified by a human |
| OCR/extraction of every student upload automatically | Same reason; also unverified text must never feed the generator |
| AI solutions in the MVP (only S1 stretch, labelled unverified) | A wrong answer to an exam question is worse than none, and verifying every solution would double the admin's work |
| "Chat with a paper" / a general study chatbot | It is a different product and would turn this into a thin chatbot wrapper |
| Other branches, colleges or universities | Narrow beats broad. The whole point is having real, verified papers and syllabus for one specific group, not a thin layer over many |
| Admin management screens (create admins, edit the syllabus) | Admin role is set in the database and the syllabus is seeded from a file. This saves a week of UI |
| Email verification, forgot-password emails | Needs an email service and adds signup friction. Handled manually by the admin if needed |
| Notes, textbooks, handwritten notes, video uploads | Scope creep; the product is question papers and syllabus only |
| Comments, discussion threads, leaderboards, social features | Not needed to prove the core loop |
| Detecting duplicate files by content | Only a metadata check (subject + exam type + year) is done |
| Model training or fine-tuning | An existing API is used |
| Payments, ads, premium tiers | No monetisation in the program window |
| Native mobile app, offline mode | A responsive website is enough |

---

## 5. Success metrics

"Used it and got value" means a registered user **downloaded a paper** or **generated a practice set**. Targets are for the end of Shogun and connect directly to the program's 25-real-users requirement.

| # | Metric | Target | How it is measured |
|---|---|---|---|
| M1 | Registered users | at least 25 | `users` table screenshot |
| M2 | Activation: registered users who downloaded at least one paper | at least 60% (15 of 25) | distinct `user_id` in `downloads` |
| M3 | Practice: registered users who generated at least one set | at least 40% (10 of 25) | distinct `user_id` in `generated_sets` |
| M4 | Quality: thumbs-up share of rated generated questions | at least 60%, with at least 25 ratings | `generated_questions.rating` |
| M5 | Contribution loop: papers uploaded by students and approved | at least 3, from at least 2 different students | `papers` where uploader is not the admin and status is approved |
| M6 | Return use: users with activity on 2 or more different days | at least 8 users | distinct dates in `downloads` / `generated_sets` |
| M7 | Feedback: form responses collected, with a written summary of what I learned | at least 25 | Google Form export |
---
## 6. The product in one paragraph

PaperTrail is a login-protected, department-specific exam-prep site. Students browse and download approved past papers and view the syllabus. If a paper is missing, they upload it, and an admin approves it. After approval, the admin runs a one-time AI extraction that turns the paper into structured questions, then corrects and verifies them. From then on, students can generate fresh practice questions for any syllabus unit; the AI works only from the stored, verified questions and never reads a PDF when a student clicks "Generate".

**Core loop:** find paper → download → practise with generated questions → contribute a missing paper → admin approves and verifies → paper (and better practice questions) become available to everyone.

---