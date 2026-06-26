# Ntanda LMS - Onboarding Screen Design Specs

This document details the layout, animations, and content for the "Premium" onboarding flow in the Flutter app.

## General Design Language
- **Colors**: `#FFFFFF` (White Background), `#004AC6` (Primary Blue), `#7C43AB` (Secondary Accent).
- **Transitions**: Smooth horizontal paging with subtle parallax effects on illustrations.
- **Buttons**: Rounded-pill shapes with subtle shadows.

---

## Slide 1: Welcome to Ntanda
- **Illustration**: A clean 3D isometric representation of a modern "Floating Campus" or a stack of digital books with a glowing "N" logo.
- **Title**: **Redefining Education**
- **Subtitle**: Experience a world-class Learning Management System designed for the modern age.
- **Action**: "Next" button.

## Slide 2: Offline Learning (Advanced)
- **Visuals**: A student using a tablet on a plane or park. A "Downloading..." progress ring around a module icon that turns into a green checkmark.
- **Title**: **Learn Anywhere, Anytime**
- **Subtitle**: No internet? No problem. Download your lessons and study offline without worrying about data.
- **Micro-interaction**: A pulsing "Download" icon that animates when the slide is active.
- **Action**: "Next" button.

## Slide 3: AI-Powered Tutor
- **Visuals**: A friendly, translucent AI avatar or a clean chat bubble interface with glowing circuit-like accents.
- **Title**: **Your Personal AI Tutor**
- **Subtitle**: Get instant answers, personalized summaries, and smart study paths curated just for you.
- **Micro-interaction**: Text typing animation (e.g., "AI: How can I help you today?") appearing in the chat bubbles.
- **Action**: "Get Started" button (leads to Login).

---

## Functional Components (Flutter)
- **`OnboardingPager`**: Using `PageView.builder` for efficient memory management of high-res illustrations.
- **`SmoothPageIndicator`**: A custom dot indicator that expands for the active page.
- **`FadeInUp` Animations**: Using the `animate_do` package to bring in text and buttons with a premium feel.
