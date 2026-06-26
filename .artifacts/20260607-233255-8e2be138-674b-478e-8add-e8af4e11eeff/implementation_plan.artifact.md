# Ntanda Mobile App Implementation Plan (Advanced - Flutter Edition)

This plan outlines the development of a high-performance, advanced mobile application for the Ntanda **Learning Management System (LMS)** using **Flutter and Dart**.

## Goal
To build a premium educational mobile app for Students and Instructors, using **Mock Data** for rapid UI prototyping, followed by backend integration.

## Proposed Changes

---

### [Mobile] Service Layer
Implementing a flexible service architecture to handle both Mock and Real data.

#### [NEW] [mock_service.dart](file:///C:/xampp/htdocs/ntanda/mobile/ntanda/lib/services/mock_service.dart)
- Provides static payloads for Courses, User Stats, and AI Insights.

---

### [Mobile] Flutter Core & Authentication
Implementing the foundational entry flow with a premium educational aesthetic.

#### [NEW] Authentication & Onboarding
- **Onboarding 2**: "Learn Anywhere" highlighting Offline Sync capabilities.
- **Onboarding 3**: "AI Tutor" highlighting contextual help features.
- **Login Screen**: Minimalist UI with phone/email options and educational illustrations.
- **Registration Screen**: Clean multi-field form for new student/instructor accounts.

---

### [Backend] Student Dashboard API Alignment
Adding missing data points required for the "Advanced" student dashboard.

#### [Enrollment.php](file:///C:/xampp/htdocs/ntanda/backend/app/Models/Enrollment.php)
- Add `last_lesson_id` field to track where the student left off.

#### [NEW] StudentDashboardController.php
- `getSummary()`: Returns KPI stats, "Continue Learning" lesson, AI insights, and upcoming deadlines in a single condensed payload.

---

### [Mobile] Student Dashboard Implementation
Implementing the premium "Command Center" for students.

#### Student Features
- **Offline Sync**: Background downloading of modules (Video/PDF).
- **In-App Player**: Custom media player with "Offline Mode" support and speed controls.
- **AI Tutor Chat**: Contextual AI help integrated directly into the course view.

#### Instructor Features
- **QR Scanner**: For quick attendance marking in physical or virtual classrooms.
- **Grading Portal**: Mobile-optimized interface for reviewing and grading assignments.
- **Analytics Dashboards**: High-level overview of student engagement and course progress.

---

## Verification Plan

### Automated Tests
- `flutter test`: Unit tests for Auth logic, Role switching, and API services.
- `flutter drive`: Integration tests for the Login -> Dashboard -> Course Player flow.

### Manual Verification
- **Offline Transition**: Download a module, toggle Airplane mode, and verify the course player still functions.
- **Tenant Sync**: Modify branding on the web admin panel and verify the mobile app updates its theme dynamically.
- **AI Interaction**: Test the AI Tutor's responsiveness within the mobile chat interface.
