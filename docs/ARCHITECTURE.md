# Architecture - PaperTrail


## 1. System diagram

```
+--------------------------------------------------------------+
|  Browser (student or admin)                                  |
|  React single-page app (Vite), hosted on Vercel              |
+------------------------------+-------------------------------+
                               |
                               |  HTTPS, JSON, JWT sent in the Authorization header
                               v
+--------------------------------------------------------------+
|  Express API (Node.js), hosted on Render                     |
|                                                              |
|  middleware: CORS -> rate limit -> JWT auth -> role check    |
|              -> input validation -> controller               |
+---------------+------------------+---------------------------+
                |                  |                    |
                | SQL (pg)         | Storage API        | HTTPS
                v                  v                    v
      +----------------+  +------------------+  +---------------------+
      | PostgreSQL     |  | Supabase Storage |  | Gemini API (Google) |
      | (Supabase)     |  | private bucket   |  |                     |
      | users, papers, |  | of PDF files     |  | 1. extraction:      |
      | questions,     |  |                  |  |    admin only,      |
      | syllabus, ...  |  |                  |  |    one paper at a   |
      +----------------+  +------------------+  |    time             |
                                                | 2. generation:      |
                                                |    text in, text out|
                                                +---------------------+
```

Nothing in the browser talks to the database, the storage bucket or the Gemini API directly. Every secret (database URL, storage key, Gemini key, JWT secret) lives only on the Express server as an environment variable.

---

## 2. Planned tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | React with Vite, React Router, Tailwind CSS | Component-based UI suits repeated cards, lists and forms, and React has the largest tutorial base if I get stuck |
| Backend | Node.js with Express | Same language (JavaScript) as the frontend, and its request/response model is easy to reason about and debug |
| Database | PostgreSQL, hosted on Supabase, accessed with the `pg` library | The data is strongly relational (subject → units → topics, paper → questions, roles), so SQL fits better than documents |
| File storage | Supabase Storage (one private bucket) | PDFs cannot live on the API server because its disk is wiped on restart, and storage sits next to the database in one dashboard |
| Auth | My own email + password login using bcrypt and JWT, implemented in Express | It teaches the full login flow the program requires, and I control the two roles directly |
| AI | Google Gemini API| One API can read a PDF for extraction and also generate questions, and it has a free tier that needs no credit card |
| Hosting | Vercel (frontend), Render free web service (backend), Supabase (database and files) | All three deploy from GitHub with no card, and give live URLs for the frontend and backend that the program requires |
| Version control | Git and GitHub | Required by the program; commits are spread across each week |



## 3. Data flow

### 3.1 General request lifecycle

1. The browser loads the React app from Vercel.
2. The app calls the API (`VITE_API_URL`) with JSON. Logged-in requests carry the JWT in the `Authorization` header.
3. Express runs its middleware in order: CORS (only my frontend origin) → rate limit → JWT check → role check (student or admin) → input validation.
4. The controller runs the query against PostgreSQL, and/or talks to Supabase Storage or Gemini.
5. The API replies with `{ "data": ... }` on success or `{ "error": { ... } }` on failure (see API_SPEC.md).
6. The UI shows a loading state while waiting, and an error state if the reply is an error.

### 3.2 Flow A - browse and download (Tier 1)

1. Anyone opens the vault. `GET /papers` returns approved papers only, filtered by semester, subject, exam type, year.
2. A guest can open the list and paper page, but the Download button asks them to log in.
3. A logged-in student clicks Download → `GET /papers/:id/download`.
4. The API checks the JWT, records a row in `downloads`, asks Supabase Storage for a short-lived signed URL, and returns it.
5. The browser opens that URL and the PDF downloads. The bucket is private, so file links never work without going through the API.

### 3.3 Flow B - upload a missing paper and admin review (Tier 1)

1. A student fills the upload form (subject, exam type, year, PDF up to 10 MB) → `POST /papers` (multipart).
2. The API validates the file type and size and checks for a duplicate (same subject + exam type + year already pending or approved). If duplicate, it replies 409 and the UI shows the existing paper.
3. If fine, the API stores the file in Supabase Storage and inserts a `papers` row with status `pending`. When the uploader is an admin, the row is created as `approved` immediately and skips the queue.
4. The admin opens the review queue → `GET /admin/papers?status=pending`, previews the file, and approves or rejects → `PATCH /admin/papers/:id`.
5. Approved papers appear in the vault. Rejected ones show the reason in the student's "My uploads" list.

### 3.4 Flow C - one-time extraction and verification (Tier 2)

1. For an approved paper, the admin clicks "Run extraction" → `POST /admin/papers/:id/extract`.
2. The API fetches the PDF from Supabase Storage, and sends it to Gemini together with the list of topic names for that subject (from the syllabus tables) and a required JSON output format.
3. The API validates the JSON. If it is malformed, it retries once. If it still fails, it returns an error and the admin uses manual entry instead.
4. Valid results are saved as `questions` rows with `verified = false`, each with number, text, marks and a topic.
5. The admin edits, deletes or adds questions (`PATCH`, `DELETE`, `POST` under `/admin/...`) and then marks the paper verified.
6. Only `verified = true` questions are ever used by the generator.

This runs a few times per exam season, per paper, not per student click.

### 3.5 Flow D - practice generation (Tier 2)

1. A student picks subject, unit and count (max 10) → `POST /generate`.
2. The API checks the user's daily limit (5 sets per day). Over the limit: 429.
3. The API loads the unit's topics and up to 10 verified questions for that subject from PostgreSQL. If fewer than 3 verified questions exist, it replies with a clear "not enough source questions yet" error.
4. It sends only that text to Gemini with instructions: same style and marks pattern, only topics from this unit, no answers, do not copy the examples, return JSON.
5. The API validates the JSON, saves a `generated_sets` row plus `generated_questions` rows, and returns them.
6. If Gemini is rate-limited or times out, the API returns a 502 with a friendly message and the UI offers a retry. No PDF is read in this flow.

---

## 4. Key entities and rough data model

Rough nouns and relationships, not a final schema.

| Entity | Purpose | Key fields |
|---|---|---|
| User | A person with an account | name, email, password hash, role (student or admin) |
| Subject | A course | code, name, semester |
| Unit | A syllabus unit of a subject | subject, number, title |
| Topic | A topic within a unit | unit, name |
| Paper | One uploaded question paper | subject, exam type (mid or end), year, file path, status (pending, approved, rejected), reject reason, uploaded by, reviewed by, verified flag |
| Question | One question extracted or entered from a paper | paper, number, text, marks, topic, verified flag |
| Download | A log of one download | user, paper, time |
| GeneratedSet | One practice test a student generated | user, subject, unit, requested count, time |
| GeneratedQuestion | One question inside a set | set, text, marks, topic, rating (added at Shogun) |
| Report | A user's report about a paper (Shogun) | paper, user, reason, status |

**Relationships**

- A User uploads many Papers; an admin User reviews many Papers.
- A Subject has many Units; a Unit has many Topics.
- A Subject has many Papers; a Paper has many Questions; a Question may point to one Topic.
- A User makes many Downloads; each Download points to one Paper.
- A User has many GeneratedSets; each GeneratedSet has many GeneratedQuestions and points to one Subject and one Unit.
- A Paper can have many Reports; each Report comes from one User.

---

## 5. Roles and access

| Action | Guest | Student | Admin |
|---|---|---|---|
| Browse vault, view paper page, view syllabus | Yes | Yes | Yes |
| Download PDF | No | Yes | Yes |
| Upload a missing paper, see own uploads | No | Yes | Yes |
| Generate practice questions, see own history | No | Yes | Yes |
| Approve or reject papers | No | No | Yes |
| Run extraction, edit or verify questions | No | No | Yes |
| View reports and usage summary (Shogun) | No | No | Yes |

The admin role is set directly in the database. There is no screen for creating admins.

---

## 6. Planned repository layout

```
PaperTrail/
├── README.md
├── docs/                    # the five documents + sketch
├── client/                  # React (Vite)
│   └── src/
│       ├── pages/           # Login, Vault, PaperDetail, Syllabus, Upload, Practice, Admin...
│       ├── components/      # reusable cards, filters, buttons, loaders, error boxes
│       ├── api/             # one small module that wraps fetch calls
│       ├── mock/            # mock JSON used in Kenshi (before the backend exists)
│       └── styles/
└── server/                  # Node + Express
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── middleware/      # auth, roles, rate limit, validation, error handler
    │   ├── services/        # storage, gemini (extraction + generation)
    │   └── db/              # pg connection
    ├── db/
    │   ├── schema.sql
    │   └── seed/            # subjects, syllabus, sample data (JSON)
    └── .env.example
```


---



