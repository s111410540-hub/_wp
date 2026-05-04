# AGENT.md

Game-focused Q&A forum (Stack Overflow for gamers). Stack: Cloudflare Pages + Pages Functions (Workers) + D1 (SQLite).

## Hard Runtime Constraints

Running on **Cloudflare Workers**, not Node.js:
- No `require()` — ES Modules only
- No Node built-ins (`fs`, `path`, `crypto`, `buffer`)
- No Express or any HTTP framework
- Use Web Crypto API for hashing (not `bcrypt`)
- Use standard `Request`/`Response` (not `res`/`req`)
- Max 50ms CPU per request

## Dev Commands

```bash
wrangler pages dev public --d1=DB=forum-db   # local preview → localhost:8788
wrangler d1 execute forum-db --local --file=schema.sql  # apply schema locally
wrangler d1 execute forum-db --file=schema.sql          # apply schema to prod
wrangler pages deploy public                 # deploy → <project>.pages.dev
```

## File Map

```
public/               static frontend (HTML/CSS/JS)
functions/api/
  _middleware.js      JWT guard for all /api/* routes
  auth/register.js    POST /api/auth/register
  auth/login.js       POST /api/auth/login
  questions.js        GET/POST /api/questions
  questions/[id].js   GET /api/questions/:id
  answers.js          POST /api/answers
  answers/[id]/accept.js  POST /api/answers/:id/accept
  votes.js            POST /api/votes
schema.sql            source of truth — edit here, then re-execute
seed.sql              demo data
wrangler.toml         DB binding + JWT_SECRET
```

## Database Rules

**ALWAYS use `.bind()`. NEVER interpolate user input into SQL.**

```js
// ✅
await env.DB.prepare("SELECT * FROM questions WHERE id = ?").bind(id).first();
// ❌
await env.DB.prepare(`SELECT * FROM questions WHERE id = ${id}`).first();
```

| Method | Use when |
|--------|----------|
| `.first()` | SELECT single row |
| `.all()` | SELECT multiple → `{ results: [] }` |
| `.run()` | INSERT / UPDATE / DELETE |

## Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  reputation INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL, content TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  game_tag TEXT, vote_count INTEGER DEFAULT 0,
  answer_count INTEGER DEFAULT 0, is_solved INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  question_id INTEGER NOT NULL REFERENCES questions(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  is_accepted INTEGER DEFAULT 0, vote_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  target_type TEXT NOT NULL CHECK(target_type IN ('question','answer')),
  target_id INTEGER NOT NULL,
  value INTEGER NOT NULL CHECK(value IN (1,-1)),
  UNIQUE(user_id, target_type, target_id)
);
```

## API Contract

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/api/auth/register` | — | `{ username, email, password }` |
| POST | `/api/auth/login` | — | `{ email, password }` → `{ token }` |
| GET | `/api/questions` | — | `?tag=&search=` |
| POST | `/api/questions` | ✓ | `{ title, content, game_tag }` |
| GET | `/api/questions/:id` | — | — |
| POST | `/api/answers` | ✓ | `{ question_id, content }` |
| POST | `/api/answers/:id/accept` | ✓ owner | — |
| POST | `/api/votes` | ✓ | `{ target_type, target_id, value }` |

Auth header: `Authorization: Bearer <jwt>`. Errors: `{ "error": "message" }`.

## wrangler.toml

```toml
name = "my-forum"
compatibility_date = "2024-01-01"
pages_build_output_dir = "public"

[[d1_databases]]
binding = "DB"
database_name = "forum-db"
database_id = "REPLACE_AFTER_wrangler_d1_create"

[vars]
JWT_SECRET = "REPLACE_WITH_STRONG_SECRET"
```

## Pre-Demo Checklist

```
[ ] database_id and JWT_SECRET filled in wrangler.toml
[ ] wrangler d1 execute forum-db --file=schema.sql
[ ] wrangler d1 execute forum-db --file=seed.sql
[ ] wrangler pages deploy public
[ ] Smoke test: register → post question → answer → vote → accept
```
