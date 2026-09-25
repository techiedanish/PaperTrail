# API Specification - PaperTrail

This is the planned API. Routes may gain small details while building, but the resources, auth rules and error shape are the commitment.

---

## 1. Conventions

- **Base path:** `/api/v1`
- **Format:** JSON for requests and responses (uploads use `multipart/form-data`).
- **Success shape:** a `data` field holding one object or an array. List endpoints also return `"meta": { "page", "limit", "total" }`.
- **Pagination:** `?page=1&limit=20` (limit max 50).
- **Auth levels used below:** **Public** (no login), **Student** (any logged-in user, including admins), **Admin** (role must be `admin`).
- **Milestone column:** which program level builds the endpoint. Kenshi has no backend, so it uses mock data shaped like these responses.

---

## 2. Auth strategy

**Provider: my own email + password auth in Express, using bcrypt and JWT.**

- **Why:** the program requires a real login flow, this teaches it end to end, and I control the two roles (student, admin) directly instead of mapping a third-party provider's roles.
- **Registration:** name, email, password (minimum 8 characters). Passwords are hashed with bcrypt and never stored or returned in plain text. If `ALLOWED_EMAIL_DOMAINS` is set on the server, only those email domains can register (decided in Samurai based on whether students at my college have institutional emails).
- **Login:** returns a signed JWT (24-hour expiry) containing user id and role.
- **Sending it:** the frontend sends the token in the `Authorization` header (as `Bearer` followed by the token) on every protected request.
- **Roles:** `student` by default. `admin` is set directly in the database.
- **Known trade-off:** the token is kept in the browser (localStorage), which is simple across two hosts (Vercel and Render) but exposed if the site had an XSS bug. Mitigations: 24-hour expiry, no HTML rendering of user-supplied text, and strict input validation. Moving to an httpOnly cookie is a possible later upgrade.
- **Not in scope:** email verification, password reset by email, third-party (Google) login.

---

## 3. Error response shape (standardised)

Every error, from every endpoint, has this shape:

```json
{
  "error": {
    "code": "DUPLICATE_PAPER",
    "message": "A paper for this subject, exam type and year already exists.",
    "details": { "existing_paper_id": 42 }
  }
}
```

- `code`: stable, machine-readable, UPPER_SNAKE_CASE (the frontend switches on this).
- `message`: short, human-readable, safe to show the user.
- `details`: optional object; for validation errors it is `{ "fields": { "email": "must be a valid email" } }`. Never contains stack traces or secrets.

| HTTP | code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Body, query or params fail validation |
| 401 | `UNAUTHENTICATED` | Missing, invalid or expired token; wrong email/password |
| 403 | `FORBIDDEN` | Logged in but not allowed (e.g. student calling an admin route) |
| 404 | `NOT_FOUND` | Resource doesn't exist (or isn't visible to this user) |
| 409 | `DUPLICATE_PAPER` / `EMAIL_TAKEN` | Conflicting existing record |
| 413 | `FILE_TOO_LARGE` | Upload over 10 MB |
| 415 | `UNSUPPORTED_FILE_TYPE` | Upload is not a PDF |
| 422 | `NOT_ENOUGH_SOURCE_QUESTIONS` | Generation requested for a subject with fewer than 3 verified questions |
| 429 | `RATE_LIMITED` | Too many requests in a short time |
| 429 | `DAILY_LIMIT_REACHED` | User already generated 5 sets today |
| 502 | `AI_UNAVAILABLE` | Gemini failed, timed out or rate-limited |
| 500 | `INTERNAL_ERROR` | Anything unexpected (logged server-side) |

---

## 4. Planned endpoints

### 4.1 System and auth

| Method | Route | Auth | Description | Milestone |
|---|---|---|---|---|
| GET | `/health` | Public | Server and database health check (also used to wake the server) | Samurai |
| POST | `/auth/register` | Public | Create a student account | Samurai |
| POST | `/auth/login` | Public | Log in, returns JWT and user | Samurai |
| GET | `/auth/me` | Student | Current user (id, name, email, role) | Samurai |

### 4.2 Vault and syllabus

| Method | Route | Auth | Description | Milestone |
|---|---|---|---|---|
| GET | `/subjects` | Public | List subjects, filter by `semester` | Samurai |
| GET | `/subjects/:id` | Public | One subject with its units and topics (the syllabus) | Samurai |
| GET | `/papers` | Public | List **approved** papers; filters: `subject_id`, `semester`, `exam_type`, `year`, pagination | Samurai |
| GET | `/papers/:id` | Public | One approved paper's details (no file link) and question count | Samurai |
| GET | `/papers/:id/download` | Student | Logs a download and returns a short-lived signed URL for the PDF | Samurai |

### 4.3 Contributing papers

| Method | Route | Auth | Description | Milestone |
|---|---|---|---|---|
| POST | `/papers` | Student | Upload a paper (`multipart`: `file`, `subject_id`, `exam_type`, `year`); creates it as `pending`, or as `approved` immediately when the uploader is an admin; 409 if duplicate | Samurai |
| GET | `/papers/mine` | Student | My uploads with status and reject reason | Samurai |

`/papers/mine` is declared before `/papers/:id` so it is not treated as an id.

### 4.4 Practice generation

| Method | Route | Auth | Description | Milestone |
|---|---|---|---|---|
| POST | `/generate` | Student | Generate a practice set from `subject_id`, `unit_id`, `count` (1 to 10); 5 sets per user per day | Samurai |
| GET | `/generated-sets` | Student | My earlier sets (history) | Samurai |
| GET | `/generated-sets/:id` | Student | One of my sets with its questions | Samurai |
| PATCH | `/generated-questions/:id/rating` | Student | Thumbs up (1) or down (-1) on a question in my own set | Shogun |

### 4.5 Admin

| Method | Route | Auth | Description | Milestone |
|---|---|---|---|---|
| GET | `/admin/papers` | Admin | Review queue; filter by `status` (pending, approved, rejected) | Samurai |
| PATCH | `/admin/papers/:id` | Admin | Approve or reject (`status`, optional `reject_reason`) | Samurai |
| POST | `/admin/papers/:id/extract` | Admin | Run AI extraction on an approved paper; stores unverified questions | Samurai |
| GET | `/admin/papers/:id/questions` | Admin | List a paper's questions (verified and unverified) | Samurai |
| POST | `/admin/papers/:id/questions` | Admin | Add a question manually (fallback when extraction fails) | Samurai |
| PATCH | `/admin/questions/:id` | Admin | Edit text, marks or topic | Samurai |
| DELETE | `/admin/questions/:id` | Admin | Remove a wrong extracted question | Samurai |
| POST | `/admin/papers/:id/verify` | Admin | Mark all the paper's questions as verified | Samurai |

### 4.6 Added at Shogun

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/papers/:id/report` | Student | Report a paper (wrong, broken, copyright) with a reason |
| GET | `/admin/reports` | Admin | List reports |
| PATCH | `/admin/reports/:id` | Admin | Mark a report resolved, optionally unpublish the paper |
| GET | `/subjects/:id/topic-stats` | Student | Repeated-topics view: verified question count and total marks per topic |
| GET | `/admin/stats` | Admin | Users, downloads and generated sets totals |

---

## 5. Example requests and responses

**Register**

```http
POST /api/v1/auth/register
{ "name": "Asha", "email": "asha@example.com", "password": "at-least-8-chars" }
```
```json
{ "data": { "token": "eyJhbGciOiJIUzI1NiJ9.example-payload.example-signature", "user": { "id": 7, "name": "Asha", "role": "student" } } }
```

**Upload a paper**

```http
POST /api/v1/papers        (multipart/form-data)
file=dbms-mid-2024.pdf  subject_id=3  exam_type=mid  year=2024
```
```json
{ "data": { "id": 51, "status": "pending", "subject_id": 3, "exam_type": "mid", "year": 2024 } }
```

**Generate practice questions**

```http
POST /api/v1/generate
{ "subject_id": 3, "unit_id": 12, "count": 5 }
```
```json
{
  "data": {
    "set_id": 88,
    "questions": [
      { "id": 401, "text": "Explain the difference between 2NF and 3NF with an example.", "marks": 5, "topic": "Normalisation" }
    ],
    "remaining_today": 4
  }
}
```

**Generation blocked by the daily limit**

```json
{
  "error": {
    "code": "DAILY_LIMIT_REACHED",
    "message": "You have used all 5 practice sets for today. Try again tomorrow.",
    "details": { "limit": 5 }
  }
}
```

---

## 6. Rate limits and input rules

- General: 100 requests per minute per IP. Auth endpoints: 10 per minute per IP.
- Generation: 5 sets per user per day (`DAILY_LIMIT_REACHED`).
- Upload: PDF only, max 10 MB, checked before storing.
- All bodies and query strings are validated on the server; the frontend validation is for convenience only.
- CORS allows only the deployed frontend origin (and localhost during development).
