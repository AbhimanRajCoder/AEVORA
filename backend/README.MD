# AEVORA — Disaster Preparedness & Management Education API

Detailed REST API documentation for the AEVORA backend (`Node.js` + `Express 5` + `Supabase`).

---

## Table of Contents

1. [Base URL & Environment Setup](#base-url--environment-setup)
2. [Authentication & Authorization (RBAC)](#authentication--authorization-rbac)
3. [Standard Response Format & Error Handling](#standard-response-format--error-handling)
4. [Endpoint Summary](#endpoint-summary)
5. [Detailed Route Reference](#detailed-route-reference)
   - [Health Checks](#1-health-checks)
   - [Authentication & Institutions](#2-authentication--institutions)
   - [Learning Modules](#3-learning-modules)
   - [Lessons](#4-lessons)
   - [Quizzes](#5-quizzes)
   - [Virtual Drills](#6-virtual-drills)
   - [Leaderboard](#7-leaderboard)
   - [Emergency Contacts](#8-emergency-contacts)
   - [Campus Alerts](#9-campus-alerts)
   - [Admin Dashboard](#10-admin-dashboard)

---

## Base URL & Environment Setup

- **Local Base URL:** `http://localhost:5000`
- **API Prefix:** `/api/v1`

### Environment Variables (`backend/.env`)

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `5000` | HTTP port the Express server listens on |
| `SUPABASE_URL` | **Yes** | — | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Recommended | — | Supabase public anon key (used by backend auth proxy for login/refresh; falls back to service role key) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | — | Supabase Service Role key (used for auth verification & admin queries) |
| `CORS_ORIGIN` | No | `http://localhost:3000,http://localhost:5173` | Comma-separated list of allowed browser origins |

### Running Locally

```bash
cd backend
npm install
npm run dev     # starts with node --watch server.js
# or
npm start       # starts with node server.js
npm test        # runs automated test suite (tests/*.test.js)
```

---

## Authentication & Authorization (RBAC)

All protected `/api/v1/*` routes require a valid **Supabase Auth JWT** returned by `/api/v1/auth/login` or `/api/v1/auth/signup`, passed in the `Authorization` header:

```http
Authorization: Bearer <supabase_access_token>
```

### How Auth Works (`middleware/auth.js`)
1. Extracts the Bearer token from `Authorization`.
2. Verifies the token via `supabase.auth.getUser(token)`.
3. Fetches the user's record from `public.profiles` (`role`, `institution_id`, `full_name`, `points`).
4. Attaches `req.user = { id, email, role, institution_id, full_name, points }`.

### Roles (`middleware/role.js`)
- **`student`**: Can view modules, complete lessons, take quizzes & virtual drills, view institution leaderboard, view national + institution emergency contacts, and view institution alerts.
- **`admin`**: Has all read permissions plus access to admin-only routes (`POST /api/v1/contacts`, `POST /api/v1/alerts`, `GET /api/v1/dashboard`).

### Multi-Institution Isolation
Institution-scoped resources (`alerts`, `leaderboard`, `local` emergency contacts, and `dashboard` metrics) are strictly filtered by the authenticated user's `req.user.institution_id`.

---

## Standard Response Format & Error Handling

Every endpoint returns a consistent JSON envelope defined in `utils/responseHelper.js`:

### Success Envelope
```json
{
  "success": true,
  "data": { },
  "error": null
}
```

### Error Envelope
```json
{
  "success": false,
  "data": null,
  "error": "Descriptive error message"
}
```

### Common HTTP Error Responses

| Status | When it occurs | Example `error` message |
| :--- | :--- | :--- |
| `400` | Invalid UUID param, missing/invalid body field, or admin missing `institution_id` | `"Invalid ID format: must be a valid UUID"` |
| `401` | Missing `Bearer` token, expired/invalid JWT, or missing `profiles` row | `"Authentication token required"` / `"Invalid or expired token"` / `"User profile not found"` |
| `403` | Non-admin user accessing an admin-only endpoint | `"Access forbidden: administrator privileges required"` |
| `404` | Undefined route or requested resource ID not found | `"Route not found: GET /api/v1/unknown"` / `"Learning module not found"` |
| `500` | Unhandled server or database error | `"Internal Server Error"` |

---

## Endpoint Summary

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Any | Root service health check |
| `GET` | `/api/v1/health` | Public | Any | API v1 health check |
| `POST` | `/api/v1/auth/signup` | Public | Any | Register a new account and return tokens + profile |
| `POST` | `/api/v1/auth/login` | Public | Any | Sign in with email & password and return tokens + profile |
| `POST` | `/api/v1/auth/refresh` | Public | Any | Refresh an expired access token |
| `POST` | `/api/v1/auth/logout` | Public | Any | Close current session |
| `POST` | `/api/v1/auth/google/start` | Public | Any | Start Supabase Google OAuth flow & return browser launch URL |
| `GET` | `/api/v1/auth/google/launch` | Public | Any | Set browser OAuth cookie and redirect to Supabase Google consent |
| `GET` | `/api/v1/auth/google/callback` | Public | Any | Supabase OAuth redirect bridge page |
| `POST` | `/api/v1/auth/google/complete` | Public | Any | Verify Supabase OAuth tokens & provision profile |
| `GET` | `/api/v1/auth/google/status` | Public | Any | Poll & consume completed Google OAuth session tokens |
| `POST` | `/api/v1/auth/google` | Public | Any | Sign in via Supabase `signInWithIdToken` with Google `id_token` |
| `POST` | `/api/v1/auth/google/start` | Public | Any | Start Supabase Google OAuth flow & return browser launch URL |
| `GET` | `/api/v1/auth/google/launch` | Public | Any | Set browser OAuth cookie and redirect to Supabase Google consent |
| `GET` | `/api/v1/auth/google/callback` | Public | Any | Supabase OAuth redirect bridge page |
| `POST` | `/api/v1/auth/google/complete` | Public | Any | Verify Supabase OAuth tokens & provision profile |
| `GET` | `/api/v1/auth/google/status` | Public | Any | Poll & consume completed Google OAuth session tokens |
| `POST` | `/api/v1/auth/google` | Public | Any | Sign in via Supabase `signInWithIdToken` with Google `id_token` |
| `GET` | `/api/v1/auth/me` | Bearer | Any | Get authenticated user's profile |
| `GET` | `/api/v1/institutions` | Public | Any | List available institutions for signup |
| `GET` | `/api/v1/modules` | Bearer | Any | List all learning modules with user progress |
| `GET` | `/api/v1/modules/:id` | Bearer | Any | Get a single module and its lessons with completion status |
| `POST` | `/api/v1/lessons/:id/complete` | Bearer | Any | Mark a lesson as completed for the current user |
| `GET` | `/api/v1/quizzes/:moduleId` | Bearer | Any | Get quiz questions for a module (answers hidden) |
| `POST` | `/api/v1/quizzes/:moduleId/submit` | Bearer | Any | Submit quiz answers for grading & points |
| `GET` | `/api/v1/drills` | Bearer | Any | List all virtual drill scenarios (points/feedback hidden) |
| `GET` | `/api/v1/drills/:id` | Bearer | Any | Get a single virtual drill scenario (points/feedback hidden) |
| `POST` | `/api/v1/drills/:id/submit` | Bearer | Any | Submit drill step choices for grading & points |
| `GET` | `/api/v1/leaderboard` | Bearer | Any | Get student points leaderboard for user's institution |
| `GET` | `/api/v1/contacts` | Bearer | Any | Get national + institution emergency contacts |
| `POST` | `/api/v1/contacts` | Bearer | `admin` | Add a local emergency contact for admin's institution |
| `GET` | `/api/v1/alerts` | Bearer | Any | Get emergency/drill alerts for user's institution |
| `POST` | `/api/v1/alerts` | Bearer | `admin` | Publish a new alert for admin's institution |
| `GET` | `/api/v1/dashboard` | Bearer | `admin` | Get preparedness analytics & score for admin's institution |

---

## Detailed Route Reference

---

### 1. Health Checks

#### `GET /`
Root server status check.

- **Auth:** None (Public)
- **Request:** No params, query, or body.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "name": "Disaster Preparedness & Management Education API",
    "status": "online",
    "timestamp": "2026-11-11T05:05:01.000Z"
  },
  "error": null
}
```

#### `GET /api/v1/health`
API v1 health check endpoint.

- **Auth:** None (Public)
- **Request:** No params, query, or body.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "status": "online",
    "timestamp": "2026-11-11T05:05:01.000Z"
  },
  "error": null
}
```

---

### 2. Authentication & Institutions

#### `POST /api/v1/auth/signup`
Registers a new user via Supabase Auth on the backend, initializes their `profiles` row, and returns session tokens + profile.

- **Auth:** None (Public)
- **Request Body (`application/json`):**
  - `full_name` (`string`, **required**, non-empty)
  - `email` (`string`, **required**, valid email)
  - `password` (`string`, **required**, minimum 6 characters)
  - `institution_id` (`string`, optional, valid UUID; defaults to the first registered institution if omitted)
  - `role` (`string`, optional, default `"student"`; allowed: `"student" | "admin"`)
```json
{
  "full_name": "Aarav Sharma",
  "email": "aarav@apex.edu",
  "password": "password123",
  "institution_id": "11111111-1111-1111-1111-111111111111",
  "role": "student"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "v1.MR...",
    "expires_at": 1794385000,
    "user": {
      "id": "10000000-0000-0000-0000-000000000001",
      "email": "aarav@apex.edu",
      "full_name": "Aarav Sharma",
      "role": "student",
      "institution_id": "11111111-1111-1111-1111-111111111111",
      "points": 0
    }
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: Validation error (missing name, invalid email, password < 6 chars, invalid UUID/role)
  - `404`: `"Selected institution not found"`
  - `409`: `"An account with this email already exists"`

#### `POST /api/v1/auth/login`
Authenticates an existing user with email and password and returns session tokens + profile.

- **Auth:** None (Public)
- **Request Body (`application/json`):**
  - `email` (`string`, **required**, valid email)
  - `password` (`string`, **required**)
```json
{
  "email": "aarav@apex.edu",
  "password": "password123"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "v1.MR...",
    "expires_at": 1794385000,
    "user": {
      "id": "10000000-0000-0000-0000-000000000001",
      "email": "aarav@apex.edu",
      "full_name": "Aarav Sharma",
      "role": "student",
      "institution_id": "11111111-1111-1111-1111-111111111111",
      "points": 100
    }
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: `"A valid email address is required"` / `"Password is required"`
  - `401`: `"Invalid email or password"` / `"User profile not found"`

#### `POST /api/v1/auth/refresh`
Exchanges a valid `refresh_token` for a new `access_token` and `refresh_token`.

- **Auth:** None (Public)
- **Request Body (`application/json`):**
  - `refresh_token` (`string`, **required**)
```json
{
  "refresh_token": "v1.MR..."
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "v1.MR...",
    "expires_at": 1794388600
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: `"refresh_token is required"`
  - `401`: `"Invalid or expired refresh token"`

#### `POST /api/v1/auth/logout`
Closes the user's session on the server (optional `Authorization: Bearer <token>` header).

- **Auth:** Public (Optional Bearer token)
- **Request:** No body required.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  },
  "error": null
}
```

#### `POST /api/v1/auth/google/start`, `GET /api/v1/auth/google/launch`, `GET /api/v1/auth/google/callback`, `POST /api/v1/auth/google/complete`, `GET /api/v1/auth/google/status`, `POST /api/v1/auth/google`
Backend-proxied Supabase Google Sign-In. Mobile clients call `POST /api/v1/auth/google/start` to retrieve `{ auth_url, state }`, open `auth_url` (`/api/v1/auth/google/launch`, which sets an `HttpOnly` state cookie and redirects to Supabase's static `/api/v1/auth/google/callback` redirect URL), let the callback bridge post Supabase tokens to `/api/v1/auth/google/complete`, and poll `GET /api/v1/auth/google/status?state=...` for `{ status: "completed", access_token, refresh_token, user }`. Alternatively, `POST /api/v1/auth/google` signs in directly with a Google `id_token` via `supabase.auth.signInWithIdToken`.

#### `POST /api/v1/auth/google/start`, `GET /api/v1/auth/google/launch`, `GET /api/v1/auth/google/callback`, `POST /api/v1/auth/google/complete`, `GET /api/v1/auth/google/status`, `POST /api/v1/auth/google`
Backend-proxied Supabase Google Sign-In. Mobile clients call `POST /api/v1/auth/google/start` to retrieve `{ auth_url, state }`, open `auth_url` (`/api/v1/auth/google/launch`, which sets an `HttpOnly` state cookie and redirects to Supabase's static `/api/v1/auth/google/callback` redirect URL), let the callback bridge post Supabase tokens to `/api/v1/auth/google/complete`, and poll `GET /api/v1/auth/google/status?state=...` for `{ status: "completed", access_token, refresh_token, user }`. Alternatively, `POST /api/v1/auth/google` signs in directly with a Google `id_token` via `supabase.auth.signInWithIdToken`.

#### `GET /api/v1/auth/me`
Returns the authenticated user's profile attached by `requireAuth`.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Request:** No params, query, or body.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "10000000-0000-0000-0000-000000000001",
    "email": "aarav@apex.edu",
    "role": "student",
    "institution_id": "11111111-1111-1111-1111-111111111111",
    "full_name": "Aarav Sharma",
    "points": 100
  },
  "error": null
}
```

#### `GET /api/v1/institutions`
Returns all registered institutions ordered by `name` ascending (used for the mobile/web signup institution picker).

- **Auth:** None (Public)
- **Request:** No params, query, or body.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Apex Institute of Technology",
      "state": "Maharashtra",
      "district": "Pune"
    }
  ],
  "error": null
}
```

---

### 3. Learning Modules

#### `GET /api/v1/modules`
Retrieves all disaster learning modules ordered by `created_at` ascending, enriched with the authenticated user's lesson completion stats.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Request:** No params, query, or body.
- **Response (`200 OK`):**
  - `disaster_type` is one of: `"earthquake" | "flood" | "fire" | "cyclone" | "general"`.
```json
{
  "success": true,
  "data": [
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "title": "Earthquake Preparedness & Response",
      "disaster_type": "earthquake",
      "description": "Learn essential earthquake survival techniques, indoor hazard management, and proper evacuation protocol.",
      "created_at": "2026-11-10T00:00:00+00:00",
      "total_lessons": 3,
      "completed_lessons": 2,
      "progress_percentage": 67,
      "is_completed": false
    }
  ],
  "error": null
}
```

#### `GET /api/v1/modules/:id`
Retrieves a single learning module along with its ordered lessons and per-lesson `is_completed` flags for the authenticated user.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Path Parameters:**
  - `id` (`string`, **required**): Valid UUID of the learning module.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "22222222-2222-2222-2222-222222222222",
    "title": "Earthquake Preparedness & Response",
    "disaster_type": "earthquake",
    "description": "Learn essential earthquake survival techniques, indoor hazard management, and proper evacuation protocol.",
    "created_at": "2026-11-10T00:00:00+00:00",
    "lessons": [
      {
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "title": "Drop, Cover, and Hold On",
        "content": "When the earth shakes, DROP to your hands and knees...",
        "image_url": "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80",
        "created_at": "2026-11-10T00:00:00+00:00",
        "is_completed": true
      }
    ],
    "total_lessons": 3,
    "completed_lessons": 1,
    "progress_percentage": 33,
    "is_completed": false
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: `"Invalid ID format: must be a valid UUID"`
  - `404`: `"Learning module not found"`

---

### 4. Lessons

#### `POST /api/v1/lessons/:id/complete`
Marks a lesson as completed for the authenticated user (idempotent upsert on `(user_id, lesson_id)` in `lesson_progress`).

- **Auth:** `Bearer <token>` (Student or Admin)
- **Path Parameters:**
  - `id` (`string`, **required**): Valid UUID of the lesson.
- **Request Body:** None required.
- **Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "lesson_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "module_id": "22222222-2222-2222-2222-222222222222",
    "is_completed": true,
    "completed_at": "2026-11-11T05:10:00.000Z"
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: `"Invalid ID format: must be a valid UUID"`
  - `404`: `"Lesson not found"`

---

### 5. Quizzes

#### `GET /api/v1/quizzes/:moduleId`
Retrieves all quiz questions for a given learning module. Correct answers are **stripped** before sending to the client.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Path Parameters:**
  - `moduleId` (`string`, **required**): Valid UUID of the learning module.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "module_id": "22222222-2222-2222-2222-222222222222",
    "module_title": "Earthquake Preparedness & Response",
    "total_questions": 2,
    "questions": [
      {
        "id": "11111111-aaaa-bbbb-cccc-000000000001",
        "module_id": "22222222-2222-2222-2222-222222222222",
        "question": "What is the recommended immediate reaction when an earthquake tremor starts indoors?",
        "options": [
          "Run outside as fast as possible",
          "Drop, Cover, and Hold On under a sturdy desk",
          "Take the elevator to the ground floor",
          "Stand next to a large glass window"
        ],
        "created_at": "2026-11-10T00:00:00+00:00"
      }
    ]
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: `"Invalid moduleId format: must be a valid UUID"`
  - `404`: `"Learning module not found"`

#### `POST /api/v1/quizzes/:moduleId/submit`
Grades submitted quiz answers server-side (case-insensitive, trimmed string comparison), records the attempt in `quiz_attempts`, and awards **50 points** if the user scores `>= 60%` **for the first time** on this module.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Path Parameters:**
  - `moduleId` (`string`, **required**): Valid UUID of the learning module.
- **Request Body (`application/json`):**
  Accepts `answers` in **either** format:

  **Format A — Array of `{ question_id, answer }` objects:**
  ```json
  {
    "answers": [
      {
        "question_id": "11111111-aaaa-bbbb-cccc-000000000001",
        "answer": "Drop, Cover, and Hold On under a sturdy desk"
      },
      {
        "question_id": "11111111-aaaa-bbbb-cccc-000000000002",
        "answer": "Power outages or structural jamming can trap occupants inside"
      }
    ]
  }
  ```

  **Format B — Key-value object mapping `question_id` to `answer`:**
  ```json
  {
    "answers": {
      "11111111-aaaa-bbbb-cccc-000000000001": "Drop, Cover, and Hold On under a sturdy desk",
      "11111111-aaaa-bbbb-cccc-000000000002": "Power outages or structural jamming can trap occupants inside"
    }
  }
  ```

- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "module_id": "22222222-2222-2222-2222-222222222222",
    "score": 100,
    "total_questions": 2,
    "correct_count": 2,
    "is_passed": true,
    "passing_threshold": 60,
    "points_awarded": 50,
    "review": [
      {
        "question_id": "11111111-aaaa-bbbb-cccc-000000000001",
        "question": "What is the recommended immediate reaction when an earthquake tremor starts indoors?",
        "selected_answer": "Drop, Cover, and Hold On under a sturdy desk",
        "correct_answer": "Drop, Cover, and Hold On under a sturdy desk",
        "is_correct": true
      }
    ]
  },
  "error": null
}
```
  - **Notes:**
    - `passing_threshold` is `60` (`score >= 60` sets `is_passed: true`).
    - `points_awarded` is `50` on the user's **first** passing attempt for that `moduleId`, and `0` on failed attempts or subsequent passes.
- **Error Responses:**
  - `400`: `"Invalid moduleId format: must be a valid UUID"`
  - `400`: `"Answers payload is required"`
  - `400`: `"Answers must be a non-empty array or key-value object"`
  - `404`: `"No quiz questions found for this module"`

---

### 6. Virtual Drills

#### `GET /api/v1/drills`
Lists all virtual drill scenarios ordered by `created_at` ascending. Step option `points` and `feedback` are **stripped** so students cannot see scoring before submitting.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Request:** No params, query, or body.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "66666666-6666-6666-6666-666666666601",
      "title": "Campus Earthquake Emergency Drill",
      "steps": [
        {
          "step": 1,
          "scenario": "You are seated in a third-floor lecture hall when strong shaking suddenly begins...",
          "options": [
            { "action": "Drop under a sturdy desk, cover your head and neck, and hold on" },
            { "action": "Sprint toward the stairwell immediately" },
            { "action": "Stand near the glass window to see outside" }
          ]
        }
      ],
      "total_steps": 16,
      "created_at": "2026-11-11T00:00:00+00:00"
    }
  ],
  "error": null
}
```

#### `GET /api/v1/drills/:id`
Retrieves a single virtual drill scenario by UUID with `points` and `feedback` stripped from step options.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Path Parameters:**
  - `id` (`string`, **required**): Valid UUID of the drill scenario.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "66666666-6666-6666-6666-666666666601",
    "title": "Campus Earthquake Emergency Drill",
    "steps": [
      {
        "step": 1,
        "scenario": "You are seated in a third-floor lecture hall when strong shaking suddenly begins...",
        "options": [
          { "action": "Drop under a sturdy desk, cover your head and neck, and hold on" },
          { "action": "Sprint toward the stairwell immediately" },
          { "action": "Stand near the glass window to see outside" }
        ]
      }
    ],
    "total_steps": 16,
    "created_at": "2026-11-11T00:00:00+00:00"
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: `"Invalid ID format: must be a valid UUID"`
  - `404`: `"Drill scenario not found"`

#### `POST /api/v1/drills/:id/submit`
Evaluates student choices for each step of a virtual drill, calculates percentage score (`0`–`100`), records the attempt in `drill_attempts`, and awards `total_points_earned` to the user's profile on their **first** attempt for that drill.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Path Parameters:**
  - `id` (`string`, **required**): Valid UUID of the drill scenario.
- **Request Body (`application/json`):**
  Accepts `choices` in **either** format (matching by action string OR 0-based `action_index` number):

  **Format A — Array of `{ step, action }` or `{ step, action_index }`:**
  ```json
  {
    "choices": [
      {
        "step": 1,
        "action": "Drop under a sturdy desk, cover your head and neck, and hold on"
      },
      {
        "step": 2,
        "action_index": 0
      }
    ]
  }
  ```

  **Format B — Key-value object mapping step number to action string or 0-based index:**
  ```json
  {
    "choices": {
      "1": "Drop under a sturdy desk, cover your head and neck, and hold on",
      "2": 0
    }
  }
  ```

- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "scenario_id": "66666666-6666-6666-6666-666666666601",
    "title": "Campus Earthquake Emergency Drill",
    "score": 100,
    "total_points_earned": 160,
    "max_possible_points": 160,
    "points_awarded": 160,
    "review": [
      {
        "step": 1,
        "scenario": "You are seated in a third-floor lecture hall when strong shaking suddenly begins...",
        "selected_action": "Drop under a sturdy desk, cover your head and neck, and hold on",
        "points_earned": 10,
        "max_points": 10,
        "feedback": "Correct! Drop, Cover, and Hold On protects you from falling debris."
      }
    ]
  },
  "error": null
}
```
  - **Notes:**
    - If a step is omitted or invalid, `selected_action` is `"No action selected"`, `points_earned` is `0`, and `feedback` is `"You did not select a valid action for this step."`.
    - `points_awarded` equals `total_points_earned` on the user's **first** submission for this `scenario_id`, and `0` on subsequent attempts.
- **Error Responses:**
  - `400`: `"Invalid ID format: must be a valid UUID"`
  - `400`: `"Choices payload is required"`
  - `400`: `"Choices must be a non-empty array or step-to-action object"`
  - `404`: `"Drill scenario not found"`

---

### 7. Leaderboard

#### `GET /api/v1/leaderboard`
Returns student rankings (`role = 'student'`) within the authenticated user's `institution_id`, sorted by `points` descending, along with the current user's standing.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Query Parameters:**
  - `limit` (`integer`, optional, default `20`): Maximum number of top-ranked students to return in `leaderboard`.
- **Example Request:**
  `GET /api/v1/leaderboard?limit=10`
- **Response (`200 OK`) — When user belongs to an institution:**
```json
{
  "success": true,
  "data": {
    "institution_id": "11111111-1111-1111-1111-111111111111",
    "total_students": 42,
    "leaderboard": [
      {
        "rank": 1,
        "id": "10000000-0000-0000-0000-000000000001",
        "full_name": "Aarav Sharma",
        "points": 210
      },
      {
        "rank": 2,
        "id": "10000000-0000-0000-0000-000000000002",
        "full_name": "Priya Nair",
        "points": 160
      }
    ],
    "current_user": {
      "rank": 1,
      "id": "10000000-0000-0000-0000-000000000001",
      "full_name": "Aarav Sharma",
      "points": 210
    }
  },
  "error": null
}
```
- **Response (`200 OK`) — When user has `institution_id: null`:**
```json
{
  "success": true,
  "data": {
    "institution_id": null,
    "leaderboard": [],
    "current_user": null
  },
  "error": null
}
```
  - **Note:** Only profiles with `role = 'student'` are included in rankings; if an `admin` calls this endpoint, `current_user` will be `null`.

---

### 8. Emergency Contacts

#### `GET /api/v1/contacts`
Retrieves national emergency contacts (`institution_id IS NULL`) plus local emergency contacts matching the authenticated user's `institution_id`, ordered by `created_at` ascending.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Request:** No params, query, or body.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "total": 6,
    "national_contacts": [
      {
        "id": "c0000000-0000-0000-0000-000000000001",
        "name": "National Emergency Number",
        "phone": "112",
        "institution_id": null,
        "created_at": "2026-11-10T00:00:00+00:00"
      }
    ],
    "local_contacts": [
      {
        "id": "c0000000-0000-0000-0000-000000000005",
        "name": "Campus Security Desk",
        "phone": "020-27654321",
        "institution_id": "11111111-1111-1111-1111-111111111111",
        "created_at": "2026-11-10T00:00:00+00:00"
      }
    ],
    "contacts": [
      {
        "id": "c0000000-0000-0000-0000-000000000001",
        "name": "National Emergency Number",
        "phone": "112",
        "institution_id": null,
        "created_at": "2026-11-10T00:00:00+00:00"
      },
      {
        "id": "c0000000-0000-0000-0000-000000000005",
        "name": "Campus Security Desk",
        "phone": "020-27654321",
        "institution_id": "11111111-1111-1111-1111-111111111111",
        "created_at": "2026-11-10T00:00:00+00:00"
      }
    ]
  },
  "error": null
}
```

#### `POST /api/v1/contacts`
Creates a new local emergency contact scoped to the authenticated admin's `institution_id`.

- **Auth:** `Bearer <token>` (**Admin only**)
- **Request Body (`application/json`):**
  - `name` (`string`, **required**, non-empty after trim)
  - `phone` (`string`, **required**, non-empty after trim)
```json
{
  "name": "Campus Fire Warden",
  "phone": "020-27654399"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "d1111111-1111-1111-1111-111111111111",
    "name": "Campus Fire Warden",
    "phone": "020-27654399",
    "institution_id": "11111111-1111-1111-1111-111111111111",
    "created_at": "2026-11-11T05:15:00.000Z"
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: `"Contact name is required and must be a valid text string"`
  - `400`: `"Contact phone is required and must be a valid string"`
  - `400`: `"Admin must belong to an institution to add a local contact"`
  - `403`: `"Access forbidden: administrator privileges required"`

---

### 9. Campus Alerts

#### `GET /api/v1/alerts`
Retrieves all campus alerts for the authenticated user's `institution_id`, ordered newest first (`created_at` descending). Returns `[]` if the user has no `institution_id`.

- **Auth:** `Bearer <token>` (Student or Admin)
- **Request:** No params, query, or body.
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "aaaaaaaa-0000-0000-0000-000000000001",
      "institution_id": "11111111-1111-1111-1111-111111111111",
      "title": "Scheduled Fire Evacuation Drill",
      "message": "A campus-wide fire drill will take place tomorrow at 10:00 AM. Proceed to Assembly Point B.",
      "severity": "warning",
      "created_at": "2026-11-11T05:00:00.000Z"
    }
  ],
  "error": null
}
```

#### `POST /api/v1/alerts`
Publishes a new campus alert scoped to the authenticated admin's `institution_id`.

- **Auth:** `Bearer <token>` (**Admin only**)
- **Request Body (`application/json`):**
  - `title` (`string`, **required**, non-empty after trim)
  - `message` (`string`, **required**, non-empty after trim)
  - `severity` (`string`, optional, default `"info"`): Case-insensitive; allowed values: `"info" | "warning" | "critical"`.
```json
{
  "title": "Heavy Rainfall Advisory",
  "message": "Avoid basement parking areas until further notice due to waterlogging risk.",
  "severity": "warning"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "aaaaaaaa-0000-0000-0000-000000000002",
    "institution_id": "11111111-1111-1111-1111-111111111111",
    "title": "Heavy Rainfall Advisory",
    "message": "Avoid basement parking areas until further notice due to waterlogging risk.",
    "severity": "warning",
    "created_at": "2026-11-11T05:20:00.000Z"
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: `"Alert title is required and must be a valid text string"`
  - `400`: `"Alert message is required and must be a valid text string"`
  - `400`: `"Invalid severity level. Allowed values: info, warning, critical"`
  - `400`: `"Admin must belong to an institution to create alerts"`
  - `403`: `"Access forbidden: administrator privileges required"`

---

### 10. Admin Dashboard

#### `GET /api/v1/dashboard`
Computes institutional preparedness analytics across all `student` profiles belonging to the authenticated admin's `institution_id`.

- **Auth:** `Bearer <token>` (**Admin only**)
- **Request:** No params, query, or body.
- **Calculation Formula:**
  - `lesson_completion_rate` = `Math.min(100, Math.round((completed_lessons_count / (total_students * total_lessons)) * 100))`
  - `average_quiz_score` = rounded mean of all `quiz_attempts.score` for students in the institution (`0` if no attempts)
  - `drill_participation_rate` = `Math.min(100, Math.round((distinct_drill_participants / total_students) * 100))`
  - `preparedness_score` = `Math.round((lesson_completion_rate + average_quiz_score + drill_participation_rate) / 3)`
- **Response (`200 OK`) — With enrolled students:**
```json
{
  "success": true,
  "data": {
    "institution_id": "11111111-1111-1111-1111-111111111111",
    "institution_name": "Apex Institute of Technology",
    "total_students": 42,
    "lesson_completion_rate": 68,
    "average_quiz_score": 82,
    "drill_participation_rate": 74,
    "preparedness_score": 75,
    "metrics": {
      "total_lessons": 7,
      "completed_lessons_count": 200,
      "total_quiz_attempts": 56,
      "drill_participants_count": 31
    }
  },
  "error": null
}
```
- **Response (`200 OK`) — When `total_students` is `0`:**
```json
{
  "success": true,
  "data": {
    "institution_id": "11111111-1111-1111-1111-111111111111",
    "institution_name": "Apex Institute of Technology",
    "total_students": 0,
    "lesson_completion_rate": 0,
    "average_quiz_score": 0,
    "drill_participation_rate": 0,
    "preparedness_score": 0
  },
  "error": null
}
```
- **Error Responses:**
  - `400`: `"Admin must belong to an institution to view dashboard"`
  - `403`: `"Access forbidden: administrator privileges required"`

