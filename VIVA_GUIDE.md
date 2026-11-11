# Faculty Viva & Demo Explanation Guide

**Project:** Disaster Preparedness & Management Education System  
**Tech Stack:** Node.js, Express.js, Supabase (PostgreSQL + Authentication + Row Level Security)  
**Base API Prefix:** `/api/v1`

---

## 1. What Problem Does This System Solve?
In many Indian schools and colleges, disaster safety is limited to static notice boards or rare drills. Students often do not know how to react calmly during earthquakes, fires, floods, cyclones, or crowd stampedes, and administrators have no way to measure how prepared their campus actually is.

This backend powers an interactive disaster preparedness platform where:
- **Students** study structured modules, complete lessons, take server-graded quizzes, practice realistic multi-step virtual drills, view emergency contacts/alerts, and compete on their institution's leaderboard.
- **Admins (Principals / Safety Officers)** publish emergency alerts, add local campus emergency contacts, and track a real-time **Preparedness Score** on their dashboard.

---

## 2. Clean 4-Layer Backend Architecture
Every API request follows one predictable path:

`Route` -> `Middleware (Auth / Role / Validator)` -> `Controller` -> `Service` -> `Supabase (PostgreSQL)`

1. **Routes (`backend/routes/`)**: Define URL paths and attach middleware (e.g., `requireAuth`, `requireAdmin`, validators). Routes contain zero business logic.
2. **Middleware (`backend/middleware/` & `backend/validators/`)**:
   - `requireAuth`: Reads the `Authorization: Bearer <token>` header, verifies the JWT with Supabase Auth, loads the user's `role` and `institution_id` from `profiles`, and attaches `req.user`.
   - `requireAdmin`: Blocks any non-admin user with HTTP `403 Forbidden`.
   - Validators: Reject malformed UUIDs or missing request fields early with HTTP `400 Bad Request`.
3. **Controllers (`backend/controllers/`)**: Extract parameters/body from `req`, call a service function, and return a standardized JSON response.
4. **Services (`backend/services/`)**: Contain all business logic, score calculations, and Supabase database queries.
5. **Standard JSON Envelope (`backend/utils/responseHelper.js`)**: Every endpoint (including 401, 403, 404, and 500 errors) returns:
   ```json
   { "success": true, "data": { ... }, "error": null }
   ```

---

## 3. Security & Multi-Institution Privacy
- **Student vs Admin Access Control (RBAC)**:
  - Students **cannot** post campus alerts (`POST /api/v1/alerts`), add emergency contacts (`POST /api/v1/contacts`), or open the institutional dashboard (`GET /api/v1/dashboard`). All three routes enforce `requireAdmin`, returning `403 Forbidden` for students.
- **Multi-Institution Data Isolation**:
  - Every user profile belongs to an `institution_id`.
  - Services filter alerts, leaderboard rankings, emergency contacts (national + own institution), and dashboard metrics strictly by `req.user.institution_id`.
  - PostgreSQL Row Level Security (RLS) policies in `supabase/schema.sql` enforce the same isolation directly at the database layer.
- **Anti-Cheating Server-Side Grading**:
  - `GET /api/v1/quizzes/:moduleId` strips `correct_answer` before sending questions to students.
  - `GET /api/v1/drills` and `GET /api/v1/drills/:id` strip `points` and `feedback` from each option so students cannot inspect answers in browser DevTools.
  - Grading and point awarding happen strictly on the backend on submission.

---

## 4. Seeded Content & Virtual Drill Scenarios
The database seed (`supabase/seed.sql` and `supabase/migrations/20261111000000_add_drill_scenarios.sql`) provisions:
- **3 Learning Modules** (Earthquake, Flood, Fire) with 7 lessons and 6 quiz questions.
- **National & Campus Emergency Contacts**: `112` (National Emergency), `101` (Fire), `102` (Ambulance), `1078` (NDMA Helpline), plus campus security/medical numbers.
- **Virtual Drill Simulations** including **5 comprehensive 15–17 step scenarios**:
  1. *Earthquake During Chemistry Lab on 3rd Floor* — 16 questions/steps
  2. *Flash Flood Emergency on College Campus* — 15 questions/steps
  3. *Hostel Electrical Fire & Smoke Evacuation Drill* — 16 questions/steps
  4. *Cyclone & Severe Coastal Gale Storm Shelter Drill* — 16 questions/steps
  5. *Campus Auditorium Stampede & Mass Casualty Triage Drill* — 17 questions/steps

---

## 5. Preparedness Score Formula (Admin Dashboard)
`GET /api/v1/dashboard` computes three institutional percentages across all students in the admin's `institution_id`:
1. **Lesson Completion %**: Percentage of `(total_students * total_lessons)` marked complete.
2. **Average Quiz Score %**: Mean score across all quiz attempts by students in that institution.
3. **Drill Participation %**: Percentage of students who have completed at least one virtual drill.

$$\text{Preparedness Score} = \frac{\text{Lesson Completion \%} + \text{Average Quiz Score \%} + \text{Drill Participation \%}}{3}$$

---

## 6. Quick Demo & Verification Commands
- **Run automated Phase 5 verification suite** (tests 5 drill scenarios, RBAC 403 checks, multi-institution isolation, and `{ success, data, error }` format):
  ```bash
  cd backend
  npm test
  ```
- **Start the backend server**:
  ```bash
  cd backend
  npm start
  ```
- **Apply seed & 5 drill scenarios in Supabase**: Run `supabase/schema.sql` (for fresh setup) or `supabase/migrations/20261111000000_add_drill_scenarios.sql` (to add the 5 scenarios to an existing database) in the Supabase SQL Editor.

