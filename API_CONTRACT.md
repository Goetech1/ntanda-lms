# Ntanda LMS — Backend API Documentation

> **Version:** 1.0.0 | **Base URL:** `http://localhost:3001/api/v1` | **Format:** JSON

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Modules Summary](#2-modules-summary)
3. [Authentication Guide](#3-authentication-guide)
4. [Error Handling Guide](#4-error-handling-guide)
5. [Validation Rules Reference](#5-validation-rules-reference)
6. [Endpoints by Module](#6-endpoints-by-module)
   - [Auth](#61-auth)
   - [Users](#62-users)
   - [Roles & Permissions](#63-roles--permissions)
   - [Tenant](#64-tenant)
   - [Institution](#65-institution)
   - [Departments](#66-departments)
   - [Academic Sessions](#67-academic-sessions)
   - [Course Categories](#68-course-categories)
   - [Courses](#69-courses)
   - [Course Modules](#610-course-modules)
   - [Lessons](#611-lessons)
   - [Enrollments](#612-enrollments)
   - [Assessments & Question Bank](#613-assessments--question-bank)
   - [Submissions & Auto-Grading](#614-submissions--auto-grading)
   - [Examinations](#615-examinations)
   - [Students (SIS)](#616-students-sis)
   - [Instructors](#617-instructors)
   - [Attendance](#618-attendance)
   - [Academic Records](#619-academic-records)
   - [Payments](#620-payments)
   - [Subscriptions](#621-subscriptions)
   - [Certificates](#622-certificates)

---

## 1. Project Overview

Ntanda LMS is a **multi-tenant SaaS Learning Management System** built with:

| Layer | Technology |
|-------|-----------|
| API Framework | NestJS (Node.js) |
| ORM | Prisma |
| Database | PostgreSQL |
| Authentication | JWT (Access + Refresh Token via HTTP-only Cookie) |
| Auth Strategy | Role-Based Access Control (RBAC) + Permission Guards |

### Multi-Tenancy Architecture
Every request is scoped to a **tenant**. The tenant is identified in one of two ways:
1. **Header:** `x-tenant-id: <uuid>` on public routes (login, register).
2. **JWT Claim:** The `tenantId` embedded in the access token is automatically used for all protected routes.

> **All data is strictly isolated per tenant.** A user of Tenant A can never access Tenant B's data.

---

## 2. Modules Summary

| Module | Base Route | Auth Required | Description |
|--------|-----------|---------------|-------------|
| Auth | `/auth` | Partial | Login, Register, Token Refresh, Logout |
| Users | `/users` | ✅ Yes | User management (admin) |
| Roles | `/roles` | ✅ Yes | Role CRUD |
| Permissions | `/permissions` | ✅ Yes | Permission management |
| Tenant | `/tenant` | ✅ Yes | Tenant profile & branding |
| Institution | `/institutions/current` | ✅ Yes | Institution settings |
| Departments | `/departments` | ✅ Yes | Department management |
| Academic Sessions | `/academic-sessions` | ✅ Yes | Session scheduling |
| Course Categories | `/course-categories` | ✅ Yes | Category CRUD |
| Courses | `/courses` | ✅ Yes | Course management |
| Course Modules | `/course-modules` | ✅ Yes | Curriculum builder |
| Lessons | `/lessons` | ✅ Yes | Lesson content |
| Enrollments | `/enrollments` | ✅ Yes | Student enrollment & progress |
| Assessments | `/assessments` | ✅ Yes | Quizzes, Assignments, Exams |
| Examinations | `/v1/exams` | ✅ Yes | Scheduled exams, attempts, anti-cheat |
| Students | `/students` | ✅ Yes | Student profiles (SIS) |
| Instructors | `/instructors` | ✅ Yes | Instructor profiles |
| Attendance | `/attendance` | ✅ Yes | Attendance tracking |
| Academic Records | `/academic-records` | ✅ Yes | Transcripts, GPA |
| Payments | `/v1/payments` | ✅ Yes | Stripe, Paystack, Flutterwave |
| Subscriptions | `/v1/subscriptions` | ✅ Yes | SaaS tenant subscriptions |
| Certificates | `/v1/certificates` | Partial | Issuance + public verification |

---

## 3. Authentication Guide

### Token Flow

```
1. POST /api/v1/auth/login   →  Returns { access_token } + sets refresh_token cookie
2. Include header: Authorization: Bearer <access_token>  on all protected requests
3. On 401 → POST /api/v1/auth/refresh  →  Returns new { access_token }
4. POST /api/v1/auth/logout  →  Clears refresh_token cookie
```

### Headers Required

| Header | Value | When |
|--------|-------|------|
| `Authorization` | `Bearer <access_token>` | All protected routes |
| `x-tenant-id` | `<tenant-uuid>` | `/auth/login`, `/auth/register` only |
| `Content-Type` | `application/json` | All POST/PATCH requests |

### Access Token Payload (decoded)

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "ADMIN",
  "tenantId": "tenant-uuid",
  "iat": 1717123456,
  "exp": 1717127056
}
```

### Token Lifetimes

| Token | Lifetime |
|-------|---------|
| Access Token | 60 minutes |
| Refresh Token (cookie) | 7 days |

---

## 4. Error Handling Guide

All errors follow a consistent structure:

```json
{
  "statusCode": 400,
  "message": "Human-readable error description",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

| Code | Meaning | Typical Cause |
|------|---------|---------------|
| `200` | OK | Successful GET / PATCH |
| `201` | Created | Successful POST |
| `400` | Bad Request | Validation failure, business rule violation |
| `401` | Unauthorized | Missing / expired / invalid JWT |
| `403` | Forbidden | Valid JWT but insufficient permissions |
| `404` | Not Found | Resource does not exist or belongs to different tenant |
| `409` | Conflict | Duplicate unique constraint (e.g., email already exists) |
| `500` | Internal Server Error | Unexpected server error |

### Error Code Reference

| errorCode | Meaning |
|-----------|---------|
| `AUTH_001` | Invalid credentials |
| `AUTH_002` | Account suspended |
| `AUTH_003` | Tenant not found / inactive |
| `AUTH_004` | Refresh token invalid or expired |
| `TENANT_001` | Tenant header missing on public route |

---

## 5. Validation Rules Reference

### Common Field Rules

| Field | Type | Rules |
|-------|------|-------|
| `email` | string | Valid email format, unique per tenant |
| `password` | string | Min 8 chars, at least 1 uppercase, 1 number |
| `fullName` | string | Min 2 chars, Max 100 chars |
| UUID fields (`id`, `tenantId`, etc.) | string | Valid UUID v4 format |
| `price` | number | Min 0, decimal(10,2) |
| `progressPercentage` | number | Integer 0–100 |
| `score` | number | Integer 0–100 |
| `durationMinutes` | number | Integer, min 1 |
| `date` fields | string | ISO 8601 date format (`YYYY-MM-DD`) |
| `scheduledAt` | string | ISO 8601 datetime format |

---

## 6. Endpoints by Module

---

### 6.1 Auth

**Base Route:** `/api/v1/auth`  
**Authentication:** Not required (except `/logout`)

---

#### `POST /auth/login`

Authenticates a user and returns a JWT access token. Sets a secure HTTP-only `refresh_token` cookie.

**Headers:**
```
x-tenant-id: <tenant-uuid>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required, non-empty string

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "a1b2c3d4-...",
      "email": "admin@school.com",
      "fullName": "Admin User",
      "role": "ADMIN"
    }
  }
}
```

**Error Responses:**
```json
// 401 - Wrong password
{ "statusCode": 401, "message": "Invalid credentials", "errorCode": "AUTH_001" }

// 401 - Tenant not found
{ "statusCode": 401, "message": "Tenant not found or inactive", "errorCode": "AUTH_003" }
```

---

#### `POST /auth/register`

Registers a new user under the specified tenant.

**Headers:**
```
x-tenant-id: <tenant-uuid>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "student@school.com",
  "password": "SecurePass123",
  "fullName": "John Doe"
}
```

**Validation Rules:**
- `email`: Required, valid email, unique within tenant
- `password`: Required, min 8 characters
- `fullName`: Required, min 2 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "user-uuid",
    "email": "student@school.com",
    "fullName": "John Doe"
  }
}
```

---

#### `POST /auth/refresh`

Exchanges the HTTP-only `refresh_token` cookie for a new access token.

**Request Body:** _(none — uses the cookie automatically)_

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### `POST /auth/logout`

**Auth Required:** ✅  
Revokes the refresh token and clears the cookie.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 6.2 Users

**Base Route:** `/api/v1/users`  
**Auth Required:** ✅  
**Permission Required:** See per-endpoint

---

#### `POST /users` — `CREATE_USER`

**Request Body:**
```json
{
  "email": "instructor@school.com",
  "password": "SecurePass123",
  "fullName": "Jane Smith",
  "roleId": "role-uuid"
}
```

**Success Response (201):**
```json
{
  "id": "user-uuid",
  "email": "instructor@school.com",
  "fullName": "Jane Smith",
  "roleId": "role-uuid",
  "tenantId": "tenant-uuid",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

#### `GET /users` — `READ_USER`

Returns all users for the current tenant.

**Success Response (200):**
```json
[
  {
    "id": "user-uuid",
    "email": "admin@school.com",
    "fullName": "Admin User",
    "role": { "id": "role-uuid", "name": "ADMIN" },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

#### `GET /users/:id` — `READ_USER`

Returns a single user by ID. Returns `404` if not in current tenant.

---

#### `PATCH /users/:id` — `UPDATE_USER`

**Request Body (all fields optional):**
```json
{
  "fullName": "Updated Name",
  "avatarUrl": "https://cdn.example.com/avatar.jpg",
  "roleId": "new-role-uuid"
}
```

---

#### `DELETE /users/:id` — `DELETE_USER`

Soft-deletes the user (sets `deletedAt`). Returns `200` on success.

---

### 6.3 Roles & Permissions

**Base Route:** `/api/v1/roles`, `/api/v1/permissions`  
**Auth Required:** ✅

---

#### `POST /roles`
```json
{ "name": "INSTRUCTOR", "description": "Teaching staff role" }
```

#### `GET /roles` — Returns all roles for the tenant.

#### `PATCH /roles/:id`
```json
{ "name": "SENIOR_INSTRUCTOR", "description": "Updated description" }
```

#### `DELETE /roles/:id` — Deletes a non-system role.

#### `POST /roles/:id/permissions`
Assigns permissions to a role.
```json
{ "permissionIds": ["perm-uuid-1", "perm-uuid-2"] }
```

---

#### `GET /permissions` — Returns all available system permissions.

```json
[
  { "id": "perm-uuid", "action": "CREATE_COURSE", "resource": "courses" },
  { "id": "perm-uuid", "action": "READ_USER", "resource": "users" }
]
```

---

### 6.4 Tenant

**Base Route:** `/api/v1/tenant`  
**Auth Required:** ✅

---

#### `GET /tenant` — Returns current tenant profile and branding.

```json
{
  "id": "tenant-uuid",
  "name": "Springfield Academy",
  "domain": "springfield.ntanda.io",
  "subdomain": "springfield",
  "status": "ACTIVE",
  "branding": {
    "primaryColor": "#2563eb",
    "logoUrl": "https://cdn.example.com/logo.png"
  }
}
```

#### `PATCH /tenant` — Update tenant name and branding.

```json
{
  "name": "Springfield Academy Updated",
  "branding": {
    "primaryColor": "#7c3aed",
    "logoUrl": "https://cdn.example.com/new-logo.png"
  }
}
```

---

### 6.5 Institution

**Base Route:** `/api/v1/institutions/current`  
**Auth Required:** ✅

---

#### `GET /institutions/current`

Returns the institution profile for the current tenant.

```json
{
  "id": "institution-uuid",
  "name": "Springfield Academy",
  "address": "123 Main St, Springfield",
  "contactEmail": "info@springfield.edu",
  "contactPhone": "+1234567890",
  "motto": "Knowledge is Power",
  "settings": {}
}
```

#### `PATCH /institutions/current`

**Request Body (all optional):**
```json
{
  "name": "Springfield International Academy",
  "address": "456 New Street, Springfield",
  "contactEmail": "contact@springfield.edu",
  "contactPhone": "+0987654321",
  "motto": "Excellence in Education",
  "settings": { "allowSelfEnrollment": true }
}
```

---

### 6.6 Departments

**Base Route:** `/api/v1/departments`  
**Auth Required:** ✅

---

#### `POST /departments`
```json
{
  "name": "Computer Science",
  "code": "CS",
  "description": "Department of Computer Science and Engineering",
  "institutionId": "institution-uuid"
}
```

**Validation:**
- `name`: Required, string
- `code`: Required, string, unique per institution
- `institutionId`: Required, valid UUID

#### `GET /departments` — Returns all departments for the current tenant.

#### `PATCH /departments/:id`
```json
{ "name": "Computer Science & Engineering", "description": "Updated description" }
```

#### `DELETE /departments/:id`

---

### 6.7 Academic Sessions

**Base Route:** `/api/v1/academic-sessions`  
**Auth Required:** ✅

---

#### `POST /academic-sessions`
```json
{
  "name": "2024/2025",
  "startDate": "2024-09-01",
  "endDate": "2025-07-31",
  "institutionId": "institution-uuid"
}
```

**Validation:**
- `name`: Required, string (e.g. "2024/2025")
- `startDate`: Required, ISO date (`YYYY-MM-DD`)
- `endDate`: Required, ISO date, must be after `startDate`
- `institutionId`: Required, valid UUID

#### `GET /academic-sessions` — Returns all sessions.

#### `PATCH /academic-sessions/:id/activate` — Sets the session as active (deactivates others).

#### `DELETE /academic-sessions/:id`

---

### 6.8 Course Categories

**Base Route:** `/api/v1/course-categories`  
**Auth Required:** ✅

---

#### `POST /course-categories`
```json
{
  "name": "Web Development",
  "slug": "web-development",
  "description": "Frontend and backend web technologies"
}
```

**Validation:**
- `name`: Required, string
- `slug`: Required, lowercase, hyphenated, unique per tenant
- `description`: Optional, string

#### `GET /course-categories` — Returns all categories for the tenant.

#### `PATCH /course-categories/:id`
```json
{ "name": "Full-Stack Web Development" }
```

#### `DELETE /course-categories/:id`

---

### 6.9 Courses

**Base Route:** `/api/v1/courses`  
**Auth Required:** ✅  
**Permissions:** `CREATE_COURSE`, `READ_COURSE`, `UPDATE_COURSE`, `DELETE_COURSE`

---

#### `POST /courses`
```json
{
  "title": "Advanced React Patterns",
  "description": "Deep dive into React hooks, context, and performance optimization.",
  "price": 149.99,
  "categoryId": "category-uuid",
  "thumbnailUrl": "https://cdn.example.com/react-course.jpg",
  "status": "DRAFT"
}
```

**Validation:**
- `title`: Required, string, 3–200 chars
- `description`: Required, string
- `price`: Required, number ≥ 0
- `status`: Optional, one of `DRAFT | PUBLISHED | ARCHIVED` (default: `DRAFT`)
- `categoryId`: Optional, valid UUID
- `thumbnailUrl`: Optional, valid URL string

**Success Response (201):**
```json
{
  "id": "course-uuid",
  "title": "Advanced React Patterns",
  "description": "Deep dive into React hooks...",
  "price": "149.99",
  "status": "DRAFT",
  "version": 1,
  "instructorId": "user-uuid",
  "tenantId": "tenant-uuid",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### `GET /courses` — Returns all courses for the tenant (with category, instructor).

#### `GET /courses/:id` — Returns a single course with modules and lessons.

#### `PATCH /courses/:id`
```json
{
  "title": "Advanced React Patterns v2",
  "status": "PUBLISHED",
  "price": 199.99
}
```

> **Note:** Updating content bumps the `version` field automatically.

#### `DELETE /courses/:id` — Soft-deletes the course (sets `deletedAt`).

---

### 6.10 Course Modules

**Base Route:** `/api/v1/course-modules`  
**Auth Required:** ✅

---

#### `POST /course-modules`
```json
{
  "courseId": "course-uuid",
  "title": "Module 1: Getting Started",
  "orderIndex": 1
}
```

**Validation:**
- `courseId`: Required, valid UUID, must belong to current tenant
- `title`: Required, string
- `orderIndex`: Required, integer ≥ 1

#### `GET /course-modules/by-course/:courseId` — Returns all modules for a course.

#### `PATCH /course-modules/:id`
```json
{ "title": "Module 1: Introduction & Setup", "orderIndex": 1 }
```

#### `DELETE /course-modules/:id`

---

### 6.11 Lessons

**Base Route:** `/api/v1/lessons`  
**Auth Required:** ✅

---

#### `POST /lessons`
```json
{
  "moduleId": "module-uuid",
  "title": "Lesson 1: Setting Up React",
  "content": "In this lesson we will install Node.js and create-react-app...",
  "videoUrl": "https://cdn.example.com/videos/lesson1.mp4",
  "orderIndex": 1
}
```

**Validation:**
- `moduleId`: Required, valid UUID, must belong to current tenant
- `title`: Required, string
- `content`: Required, text (HTML or Markdown supported)
- `videoUrl`: Optional, valid URL
- `orderIndex`: Required, integer ≥ 1

#### `GET /lessons/by-module/:moduleId` — Returns all lessons in order.

#### `PATCH /lessons/:id`
```json
{
  "title": "Updated Lesson Title",
  "content": "Updated content...",
  "videoUrl": "https://cdn.example.com/videos/lesson1-updated.mp4"
}
```

#### `DELETE /lessons/:id`

---

### 6.12 Enrollments

**Base Route:** `/api/v1/enrollments`  
**Auth Required:** ✅

---

#### `POST /enrollments` — `ENROLL_COURSE`

Manually enrolls a student (admin action). Student enrollments from payments happen automatically via webhook.

```json
{
  "userId": "student-user-uuid",
  "courseId": "course-uuid"
}
```

**Success Response (201):**
```json
{
  "id": "enrollment-uuid",
  "userId": "student-uuid",
  "courseId": "course-uuid",
  "progressPercentage": 0,
  "completedAt": null,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**Error Responses:**
```json
// 409 - Already enrolled
{ "statusCode": 409, "message": "User is already enrolled in this course" }
```

#### `GET /enrollments/my-enrollments`

Returns all enrollments for the authenticated student.

```json
[
  {
    "id": "enrollment-uuid",
    "progressPercentage": 65,
    "completedAt": null,
    "course": {
      "id": "course-uuid",
      "title": "Advanced React Patterns",
      "thumbnailUrl": "..."
    }
  }
]
```

#### `GET /enrollments/by-course/:courseId` — `READ_ENROLLMENT`

Admin endpoint. Returns all students enrolled in a course.

#### `PATCH /enrollments/:id/progress` — `UPDATE_ENROLLMENT_PROGRESS`

Updates student progress on a course.

```json
{ "progress": 75 }
```

**Validation:**
- `progress`: Required, integer 0–100

---

### 6.13 Assessments & Question Bank

**Base Route:** `/api/v1/assessments`  
**Auth Required:** ✅

---

#### `POST /assessments`

Creates an assessment (quiz, assignment, or exam) tied to a course.

```json
{
  "courseId": "course-uuid",
  "title": "React Fundamentals Quiz",
  "type": "QUIZ",
  "timeLimitMinutes": 30,
  "totalPoints": 100
}
```

**Validation:**
- `courseId`: Required, valid UUID
- `title`: Required, string
- `type`: Required, one of `QUIZ | ASSIGNMENT | EXAM`
- `timeLimitMinutes`: Optional, integer ≥ 1
- `totalPoints`: Required, integer ≥ 1

---

#### `GET /assessments/course/:courseId`

Returns all assessments for a course.

---

#### `GET /assessments/:id`

Returns a single assessment with its questions.

---

#### `GET /assessments/:id/quiz`

Returns a **randomized** version of the quiz questions (order shuffled). Use this for student quiz sessions.

---

#### `POST /assessments/:id/questions`

Adds a question to an assessment.

```json
{
  "content": "Which hook is used for side effects in React?",
  "options": ["useState", "useEffect", "useRef", "useContext"],
  "correctAnswer": ["useEffect"],
  "points": 10,
  "orderIndex": 1
}
```

**Validation:**
- `content`: Required, string
- `options`: Required, array of strings (min 2 for MCQ)
- `correctAnswer`: Required, array of correct option values
- `points`: Required, integer ≥ 1
- `orderIndex`: Required, integer ≥ 1

---

#### `PATCH /assessments/questions/:questionId`

```json
{
  "content": "Updated question text?",
  "options": ["Option A", "Option B", "Option C"],
  "correctAnswer": ["Option A"]
}
```

#### `DELETE /assessments/questions/:questionId`

---

### 6.14 Submissions & Auto-Grading

**Base Route:** `/api/v1/assessments`  
**Auth Required:** ✅

---

#### `POST /assessments/:id/submit`

Submits answers for an assessment. Auto-grades MCQ and TRUE_FALSE questions immediately.

```json
{
  "answers": {
    "question-uuid-1": "useEffect",
    "question-uuid-2": "true",
    "question-uuid-3": "Component lifecycle"
  }
}
```

**Validation:**
- `answers`: Required, object where keys are question UUIDs and values are student answers

**Success Response (201):**
```json
{
  "id": "submission-uuid",
  "assessmentId": "assessment-uuid",
  "userId": "student-uuid",
  "status": "GRADED",
  "score": 80,
  "answers": { "...": "..." },
  "submittedAt": "2025-01-01T12:00:00.000Z"
}
```

> **Auto-Grading Logic:** For `MCQ` and `TRUE_FALSE` questions, the system compares submitted answers to `correctAnswer` and computes the score. `SHORT_ANSWER` submissions have status `PENDING` until manually reviewed.

---

### 6.15 Examinations

**Base Route:** `/api/v1/exams`  
**Auth Required:** ✅

---

#### `POST /v1/exams`

Schedules a formal exam for a course (Instructor/Admin only).

```json
{
  "courseId": "course-uuid",
  "title": "Midterm Examination",
  "scheduledAt": "2025-06-15T09:00:00.000Z",
  "durationMinutes": 120,
  "requireWebcam": true,
  "secureBrowser": false
}
```

**Validation:**
- `courseId`: Required, valid UUID
- `title`: Required, string
- `scheduledAt`: Optional, ISO 8601 datetime (if omitted, exam is available immediately)
- `durationMinutes`: Required, integer ≥ 1
- `requireWebcam`: Optional, boolean (default: `false`)
- `secureBrowser`: Optional, boolean (default: `false`)

**Success Response (201):**
```json
{
  "id": "exam-uuid",
  "courseId": "course-uuid",
  "title": "Midterm Examination",
  "scheduledAt": "2025-06-15T09:00:00.000Z",
  "durationMinutes": 120,
  "requireWebcam": true,
  "secureBrowser": false,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

#### `GET /v1/exams/course/:courseId`

Returns all scheduled exams for a course, ordered by `scheduledAt`.

---

#### `POST /v1/exams/:id/attempts/start`

Starts (or resumes) the authenticated student's attempt. Returns `400` if the exam has not yet reached its `scheduledAt` time.

**Request Body:** _(none)_

**Success Response (201):**
```json
{
  "id": "attempt-uuid",
  "examId": "exam-uuid",
  "userId": "student-uuid",
  "startedAt": "2025-06-15T09:01:22.000Z",
  "completedAt": null,
  "score": null,
  "antiCheatFlags": []
}
```

**Error Responses:**
```json
// 400 - Too early
{ "statusCode": 400, "message": "Exam has not started yet" }
```

---

#### `PATCH /v1/exams/attempts/:id/anti-cheat`

Appends an anti-cheat infraction record to the attempt. Call this continuously from the frontend's background worker.

```json
{
  "type": "TAB_SWITCH",
  "details": "User switched to another tab"
}
```

**Or for webcam loss:**
```json
{
  "type": "FACE_NOT_DETECTED",
  "details": "Webcam feed lost for 5 seconds"
}
```

**Anti-Cheat Flag Types (recommended):**
| Type | Description |
|------|-------------|
| `TAB_SWITCH` | User navigated away from exam tab |
| `WINDOW_BLUR` | Exam window lost focus |
| `FACE_NOT_DETECTED` | Webcam did not detect a face |
| `MULTIPLE_FACES` | More than one face detected |
| `COPY_PASTE` | Copy/paste event fired |

**Success Response (200):**
```json
{
  "id": "attempt-uuid",
  "antiCheatFlags": [
    { "type": "TAB_SWITCH", "details": "User switched to another tab", "timestamp": "2025-06-15T09:15:00.000Z" }
  ]
}
```

---

#### `POST /v1/exams/attempts/:id/submit`

Finalizes the exam attempt and records the final score.

```json
{
  "score": 85
}
```

**Validation:**
- `score`: Required, integer 0–100

**Success Response (200):**
```json
{
  "id": "attempt-uuid",
  "score": 85,
  "completedAt": "2025-06-15T11:00:00.000Z",
  "antiCheatFlags": [...]
}
```

---

### 6.16 Students (SIS)

**Base Route:** `/api/v1/students`  
**Auth Required:** ✅

---

#### `POST /students`

Creates a student profile for a user.

```json
{
  "userId": "user-uuid",
  "studentIdString": "STU-2024-001",
  "dateOfBirth": "2000-05-20",
  "address": "123 Student Lane, Springfield",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567890",
    "relationship": "Parent"
  }
}
```

**Validation:**
- `userId`: Required, valid UUID, must belong to current tenant
- `studentIdString`: Optional, string, unique per tenant
- `dateOfBirth`: Optional, ISO date (`YYYY-MM-DD`)
- `address`: Optional, string
- `emergencyContact`: Optional, object with `name`, `phone`, `relationship`

#### `GET /students`

Returns all student profiles for the current tenant (with user info).

```json
[
  {
    "id": "profile-uuid",
    "studentIdString": "STU-2024-001",
    "gpa": "3.75",
    "user": {
      "id": "user-uuid",
      "fullName": "John Doe",
      "email": "john@school.com"
    }
  }
]
```

#### `GET /students/:id` — Returns a single student profile.

#### `PATCH /students/:id`
```json
{
  "address": "Updated address",
  "emergencyContact": { "name": "New Contact", "phone": "+0987654321", "relationship": "Guardian" }
}
```

---

### 6.17 Instructors

**Base Route:** `/api/v1/instructors`  
**Auth Required:** ✅

---

#### `POST /instructors`

Creates an instructor profile for a user.

```json
{
  "userId": "user-uuid",
  "bio": "10 years of software engineering experience.",
  "expertise": ["JavaScript", "React", "Node.js"],
  "qualifications": ["BSc Computer Science", "MSc Software Engineering"],
  "teachingSubjects": ["Web Development", "API Design"]
}
```

**Validation:**
- `userId`: Required, valid UUID
- `bio`: Optional, string (max 2000 chars)
- `expertise`: Optional, array of strings
- `qualifications`: Optional, array of strings
- `teachingSubjects`: Optional, array of strings

#### `GET /instructors` — Returns all instructors with their profiles and ratings.

#### `GET /instructors/:id` — Returns a single instructor with their courses.

#### `PATCH /instructors/:id`
```json
{ "bio": "Updated bio text", "rating": 4.8 }
```

---

### 6.18 Attendance

**Base Route:** `/api/v1/attendance`  
**Auth Required:** ✅

---

#### `POST /attendance`

Marks attendance for a student in a course on a given date.

```json
{
  "courseId": "course-uuid",
  "userId": "student-uuid",
  "date": "2025-06-03",
  "status": "PRESENT",
  "remarks": "On time"
}
```

**Validation:**
- `courseId`: Required, valid UUID
- `userId`: Required, valid UUID
- `date`: Required, ISO date (`YYYY-MM-DD`)
- `status`: Required, one of `PRESENT | ABSENT | LATE | EXCUSED`
- `remarks`: Optional, string

> **Note:** A unique constraint exists on `(tenantId, courseId, userId, date)`. Submitting twice for the same student/course/date will throw a `409 Conflict`.

#### `GET /attendance/course/:courseId?date=YYYY-MM-DD`

Returns attendance records for a course on a specific date.

```json
[
  {
    "id": "attendance-uuid",
    "userId": "student-uuid",
    "status": "PRESENT",
    "remarks": "On time",
    "user": { "fullName": "John Doe", "email": "john@school.com" }
  }
]
```

#### `GET /attendance/student/:userId?courseId=<uuid>`

Returns full attendance history for a student in a course.

---

### 6.19 Academic Records

**Base Route:** `/api/v1/academic-records`  
**Auth Required:** ✅

---

#### `GET /academic-records/student/:userId/transcript`

Returns a full academic transcript for a student including:
- All enrolled courses
- Progress percentage
- Completion dates
- Overall GPA (calculated from all completed course scores)

**Success Response (200):**
```json
{
  "student": {
    "id": "profile-uuid",
    "studentIdString": "STU-2024-001",
    "gpa": "3.75",
    "user": { "fullName": "John Doe", "email": "john@school.com" }
  },
  "transcript": [
    {
      "course": { "id": "course-uuid", "title": "Advanced React Patterns" },
      "progressPercentage": 100,
      "completedAt": "2025-05-01T00:00:00.000Z",
      "grade": "A"
    }
  ]
}
```

---

### 6.20 Payments

**Base Route:** `/api/v1/payments`  
**Auth Required:** ✅

---

#### `GET /v1/payments`

- **Admin/Super Admin:** Returns all payments for the tenant.
- **Student:** Returns only the authenticated user's payments.

```json
[
  {
    "id": "payment-uuid",
    "amount": "149.99",
    "currency": "USD",
    "status": "COMPLETED",
    "gateway": "STRIPE",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "course": { "id": "course-uuid", "title": "Advanced React Patterns" },
    "user": { "id": "user-uuid", "fullName": "John Doe" }
  }
]
```

---

#### `POST /v1/payments/stripe/checkout`

Initiates a Stripe payment session for course enrollment.

```json
{
  "courseId": "course-uuid",
  "amount": 149.99
}
```

**Validation:**
- `courseId`: Required, valid UUID, course must exist in tenant
- `amount`: Required, number > 0

**Success Response (201):**
```json
{
  "sessionId": "mock_stripe_abc123...",
  "gateway": "STRIPE",
  "url": "/student/checkout/success?session_id=mock_stripe_abc123&gateway=stripe"
}
```

**Error Responses:**
```json
// 400 - Already enrolled
{ "statusCode": 400, "message": "User is already enrolled in this course" }

// 404 - Course not found
{ "statusCode": 404, "message": "Course not found" }
```

---

#### `POST /v1/payments/paystack/checkout`

Initiates a Paystack payment session.

```json
{
  "courseId": "course-uuid",
  "amount": 149.99
}
```

**Success Response (201):**
```json
{
  "sessionId": "mock_paystack_xyz789...",
  "gateway": "PAYSTACK",
  "url": "/student/checkout/success?session_id=mock_paystack_xyz789&gateway=paystack"
}
```

---

#### `POST /v1/payments/flutterwave/checkout`

Initiates a Flutterwave payment session.

```json
{
  "courseId": "course-uuid",
  "amount": 149.99
}
```

**Success Response (201):**
```json
{
  "sessionId": "mock_flutterwave_lmn456...",
  "gateway": "FLUTTERWAVE",
  "url": "/student/checkout/success?session_id=mock_flutterwave_lmn456&gateway=flutterwave"
}
```

---

#### `POST /v1/payments/webhook`

**⚠️ Internal / Gateway callback endpoint.**  
Confirms a payment and automatically provisions the student enrollment.

```json
{
  "sessionId": "mock_stripe_abc123...",
  "status": "COMPLETED"
}
```

**Status Values:**
| Value | Effect |
|-------|--------|
| `COMPLETED` | Marks payment complete, creates `Enrollment` record |
| `FAILED` | Marks payment as failed |
| `REFUNDED` | Marks payment as refunded |

**Success Response (200):**
```json
{
  "id": "payment-uuid",
  "status": "COMPLETED",
  "updatedAt": "2025-01-01T12:30:00.000Z"
}
```

---

### 6.21 Subscriptions

**Base Route:** `/api/v1/subscriptions`  
**Auth Required:** ✅  
**Intended for:** Admin and Super Admin roles

---

#### `POST /v1/subscriptions`

Creates a new SaaS subscription for the current tenant.

```json
{
  "planName": "PRO"
}
```

**Plan Names (recommended values):**
| Plan | Description |
|------|-------------|
| `STARTER` | Up to 100 students |
| `PRO` | Up to 1,000 students |
| `ENTERPRISE` | Unlimited students + priority support |

**Validation:**
- `planName`: Required, string (e.g. `STARTER`, `PRO`, `ENTERPRISE`)

**Success Response (201):**
```json
{
  "id": "subscription-uuid",
  "tenantId": "tenant-uuid",
  "planName": "PRO",
  "stripeSubscriptionId": "mock_sub_abc123...",
  "status": "ACTIVE",
  "currentPeriodEnd": "2025-07-01T00:00:00.000Z",
  "createdAt": "2025-06-01T00:00:00.000Z"
}
```

**Error:**
```json
// 400 - Already subscribed
{ "statusCode": 400, "message": "Tenant already has an active subscription" }
```

---

#### `GET /v1/subscriptions`

Returns the current (latest) subscription for the tenant.

```json
{
  "id": "subscription-uuid",
  "planName": "PRO",
  "status": "ACTIVE",
  "currentPeriodEnd": "2025-07-01T00:00:00.000Z"
}
```

---

#### `PATCH /v1/subscriptions/:id/cancel`

Cancels an active subscription.

**Request Body:** _(none)_

**Success Response (200):**
```json
{
  "id": "subscription-uuid",
  "status": "CANCELED",
  "updatedAt": "2025-06-03T10:00:00.000Z"
}
```

---

### 6.22 Certificates

**Base Route:** `/api/v1/certificates`  
**Auth Required:** Partial (verify endpoint is public)

---

#### `POST /v1/certificates/issue`

Issues a certificate for a student who has achieved 100% progress on a course. Idempotent — calling twice returns the same certificate.

```json
{
  "courseId": "course-uuid"
}
```

**Validation:**
- `courseId`: Required, valid UUID
- Student must have an enrollment record with `progressPercentage === 100`

**Success Response (201):**
```json
{
  "id": "certificate-uuid",
  "userId": "student-uuid",
  "courseId": "course-uuid",
  "validationCode": "A1B2C3D4E5F6G7H8",
  "certificateUrl": "/certificate/verify/A1B2C3D4E5F6G7H8",
  "issuedAt": "2025-06-01T00:00:00.000Z",
  "course": {
    "id": "course-uuid",
    "title": "Advanced React Patterns"
  }
}
```

**Error Responses:**
```json
// 400 - Incomplete course
{ "statusCode": 400, "message": "Course is not fully completed yet" }

// 404 - Not enrolled
{ "statusCode": 404, "message": "Enrollment not found" }
```

---

#### `GET /v1/certificates`

Returns all certificates earned by the authenticated student.

```json
[
  {
    "id": "cert-uuid",
    "validationCode": "A1B2C3D4E5F6G7H8",
    "certificateUrl": "/certificate/verify/A1B2C3D4E5F6G7H8",
    "issuedAt": "2025-06-01T00:00:00.000Z",
    "course": { "id": "course-uuid", "title": "Advanced React Patterns" }
  }
]
```

---

#### `GET /v1/certificates/verify/:validationCode`

**🌐 PUBLIC endpoint — no authentication required.**  
Used for QR code / link verification by third parties (employers, institutions).

**URL Example:** `GET /api/v1/certificates/verify/A1B2C3D4E5F6G7H8`

**Success Response (200):**
```json
{
  "id": "cert-uuid",
  "validationCode": "A1B2C3D4E5F6G7H8",
  "issuedAt": "2025-06-01T00:00:00.000Z",
  "user": {
    "fullName": "John Doe",
    "email": "john@school.com"
  },
  "course": {
    "title": "Advanced React Patterns",
    "description": "Deep dive into React hooks..."
  },
  "tenant": {
    "name": "Springfield Academy",
    "branding": { "logoUrl": "https://cdn.example.com/logo.png" }
  }
}
```

**Error Response:**
```json
// 404 - Invalid code
{ "statusCode": 404, "message": "Certificate not found or invalid" }
```

> **QR Code Integration:** Generate a QR code pointing to:  
> `https://your-domain.com/certificate/verify/<validationCode>`  
> The frontend `/certificate/verify/[code]` page calls this endpoint to render the verified certificate.

---

## Appendix: Frontend Integration Quick Reference

### Typical Student Flow
```
1. POST /auth/login                    → Get access_token
2. GET /enrollments/my-enrollments    → See enrolled courses
3. GET /courses/:id                   → View course content
4. PATCH /enrollments/:id/progress    → Update lesson progress
5. GET /assessments/course/:courseId  → Load quiz
6. POST /assessments/:id/submit       → Submit quiz answers
7. POST /v1/certificates/issue        → Claim certificate at 100%
8. GET /v1/certificates               → View all certificates
```

### Typical Admin Flow
```
1. POST /auth/login                    → Get access_token
2. PATCH /institutions/current        → Configure institution
3. POST /departments                  → Create departments
4. POST /users                        → Add instructors/students
5. POST /courses                      → Create courses
6. POST /course-modules               → Build curriculum
7. POST /lessons                      → Add lesson content
8. POST /assessments                  → Create quizzes
9. GET /v1/payments                   → View payment history
10. GET /academic-records/student/…   → View transcripts
```

### Pagination (Future)
All list endpoints will support query parameters:
- `?page=1&limit=20` for pagination
- `?search=keyword` for filtering
- `?sortBy=createdAt&order=desc` for sorting

*(Currently all list endpoints return full result sets.)*
