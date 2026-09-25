# Requirements - PaperTrail


## 1. Functional requirements

### Accounts and roles (F1)

| # | The system must… | Built at |
|---|---|---|
| FR-1 | Let a visitor create an account with name, email and password (minimum 8 characters) | Samurai |
| FR-2 | Let a registered user log in and stay logged in for up to 24 hours | Samurai |
| FR-3 | Store passwords only as bcrypt hashes and never return them | Samurai |
| FR-4 | Support two roles, student and admin, with admin assigned directly in the database | Samurai |
| FR-5 | Optionally restrict registration to configured email domains | Samurai |

### Vault and syllabus (F2, F3, F4)

| # | The system must… | Built at |
|---|---|---|
| FR-6 | Show a public list of approved papers filterable by semester, subject, exam type (mid or end) and year | Samurai |
| FR-7 | Show a paper page with subject, exam type, year and number of verified questions | Samurai |
| FR-8 | Allow PDF download only to logged-in users, through short-lived signed links (the storage bucket is private) | Samurai |
| FR-9 | Record every download with user, paper and time | Samurai |
| FR-10 | Show the syllabus of a subject as units and topics, loaded from a seed file | Samurai |

### Contributing papers (F5)

| # | The system must… | Built at |
|---|---|---|
| FR-11 | Let a student upload a PDF (max 10 MB) with subject, exam type and year | Samurai |
| FR-12 | Reject non-PDF files and files over the limit before storing them | Samurai |
| FR-13 | Refuse a paper when the same subject, exam type and year already exists as pending or approved, and point to the existing one | Samurai |
| FR-14 | Keep student uploads hidden from the vault until an admin approves them, while papers uploaded by an admin are published immediately | Samurai |
| FR-15 | Show each student their own uploads with status (pending, approved, rejected) and any reject reason | Samurai |

### Admin review, extraction and verification (F6, F7, F8)

| # | The system must… | Built at |
|---|---|---|
| FR-16 | Give admins a review queue of papers filtered by status | Samurai |
| FR-17 | Let an admin approve a paper or reject it with a reason | Samurai |
| FR-18 | Let an admin run AI extraction on an approved paper, producing questions with number, text, marks and syllabus topic, saved as unverified | Samurai |
| FR-19 | Validate the AI's output format, retry once on malformed output, and show a clear error if it still fails | Samurai |
| FR-20 | Let an admin edit, delete and manually add questions for a paper | Samurai |
| FR-21 | Let an admin mark a paper's questions as verified | Samurai |
| FR-22 | Use only verified questions as source material for generation | Samurai |

### Practice generation (F9, F10)

| # | The system must… | Built at |
|---|---|---|
| FR-23 | Let a student choose a subject, a unit and a number of questions (1 to 10) and generate a new practice set | Samurai |
| FR-24 | Generate from stored verified questions and the unit's topics only, without reading any PDF at request time | Samurai |
| FR-25 | Refuse generation with a clear message when a subject has fewer than 3 verified questions | Samurai |
| FR-26 | Limit each user to 5 generated sets per day | Samurai |
| FR-27 | Save each generated set and let its owner view it again without a new AI call | Samurai |
| FR-28 | Label generated questions as AI-generated practice questions | Samurai |

### Added at Shogun (F11 to F14)

| # | The system must… | Built at |
|---|---|---|
| FR-29 | Let a student rate each question in their own set with thumbs up or down | Shogun |
| FR-30 | Let a student report a paper with a reason, and let an admin review and resolve reports | Shogun |
| FR-31 | Show per subject which topics appear most often and carry the most marks in verified questions | Shogun |
| FR-32 | Give admins totals for users, downloads and generated sets | Shogun |
| FR-33 | Link to the feedback form from inside the app | Shogun |

### Screens without a backend (Kenshi)

| # | The frontend must… | Built at |
|---|---|---|
| FR-34 | Provide all screens for F1 to F10 using mock data shaped like the API responses, so Samurai only swaps the data source | Kenshi |

---

## 2. Non-functional requirements

### Performance

- Pages that read data (vault, syllabus, history) should feel responsive: under about 2 seconds once the server is awake.
- Practice generation may take longer, so it always shows a loading state and should finish within about 30 seconds or show an error.
- The free hosting server sleeps after inactivity and needs about a minute to wake. The UI must tell the user it is waking up instead of looking frozen.

### Security

- Passwords hashed with bcrypt; JWT secret, database URL, storage key and Gemini key only in environment variables, never in Git.
- Every admin route checks the role on the server. Hiding a button in the UI is not security.
- The PDF bucket is private; downloads only via signed URLs that expire quickly and only for logged-in users.
- Server-side validation of all input, file type and size checks, rate limiting on all routes, stricter on login.
- CORS allows only my frontend origin.
- No user data (name, email) is ever sent to the AI API.
- Known trade-off: the token is stored in the browser (see API_SPEC.md); mitigated by short expiry and strict input handling.

### Accessibility and usability

- Works on phones (designed and tested from a 360 px wide screen upward) as well as desktop.
- Semantic HTML, labelled form fields, visible focus states and keyboard-usable navigation.
- Text and buttons with sufficient colour contrast; status is never conveyed by colour alone (status chips also have text).
- Every data-fetching screen has a loading state, an empty state and an error state with a plain-language message.

### Reliability and data quality

- AI output is never trusted blindly: extraction is reviewed by an admin, generation output is validated before it is saved.
- Errors follow the single error shape in API_SPEC.md so the UI can handle them consistently.
- Generated sets and uploaded papers persist across restarts (database and storage, not server memory or disk).

### Maintainability

- Clear folder structure (see ARCHITECTURE.md), small focused commits throughout each week, and a README with setup steps and an endpoint list.
- Model name, allowed origins and limits come from configuration, not hard-coded values.

---

## 3. Assumptions and constraints

### Time and people

- Solo builder working around a full college timetable, planning for roughly 10 to 12 focused hours per week.
- Four one-week sprints with a hard Sunday deadline (Ronin, Kenshi, Samurai, Shogun).

### Tools I already know vs. tools I have to learn

- **Already comfortable with:** HTML, CSS, JavaScript fundamentals, Git and GitHub basics, Markdown.
- **To learn or deepen during the program:** React with Vite and Router, Tailwind CSS, Express, SQL and PostgreSQL with the `pg` library, JWT and bcrypt authentication, Supabase Storage, the Gemini API, and deployment on Vercel and Render.
- Because so much is new, the cut order in ROADMAP.md protects the paper library (Tier 1) first.

### Money and platform constraints

- Everything runs on free tiers with no payment card: Vercel, Render, Supabase and the Gemini free tier.
- The Render free server sleeps and wakes slowly; the Supabase free project pauses after a week of inactivity; the Gemini free tier has per-minute and per-day limits and may use inputs to improve Google products.
- Uploaded files are capped at 10 MB, and total file storage must stay under the 1 GB free allowance.

### Content and users

- I can collect at least 10 real papers across 3 subjects from my own batch and seniors before launch, and I can get the matching syllabus text.
- Papers are shared for study inside this one college and branch, with a report route so any paper can be removed on request.
- Exams happen four times a year, so Shogun week may not coincide with exam season; older papers are seeded so the product is useful at any time.
- **Scoped to one college and one branch for the program.** The idea could later expand to other colleges and branches by asking a student which college and branch they belong to at signup, and mapping their account to that scope. This is a possible future direction, not something built or modelled during Ronin to Shogun, to avoid the extra moderation and cold-start problems a multi-college launch would bring in a 4-week window.
- Users will reach the app through batch and department groups, and 25 real registered users is reachable in that community.
- Students may or may not have institutional email addresses, so the email-domain restriction is optional and decided during Samurai.

### Dependencies and unknowns

- The AI feature depends on how well Gemini handles my real papers. I will test one real paper this week, and the fallback is manual question entry by the admin, which keeps the generator working either way.
- The exact free-tier limits are read from my own Gemini project before Samurai starts.
