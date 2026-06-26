# Ntanda LMS - Design System & Architecture Specification

This document details the visual style, primitives, layouts, and feature epics implemented in the Ntanda LMS web application.

---

## 1. Design System & Theme Specifications

The application implements a strict, accessible, high-contrast **Dark-Mode SaaS UI** built using Tailwind CSS.

### 🎨 Core Color Palette
To eliminate color errors (muddy blue/slate overlaps) and ensure strict WCAG AA compliance (minimum 4.5:1 contrast ratio), the canvas and surface colors have been unified into a true, deep neutral-slate palette.

| Token / Role | Hex Value | Tailwind Equivalent | Notes / Purpose |
| :--- | :--- | :--- | :--- |
| **Main Canvas Background** | `#030712` | `bg-gray-950` / `bg-slate-950` | Replaces `#0b0f19`. Deep, pure dark canvas to avoid tint bleed. |
| **Default Surface / Card** | `#111827` | `bg-gray-900/40` | Base card/panel surface with `backdrop-blur-md`. |
| **Raised Surface (Sidebar/Pop)** | `#1f2937` | `bg-gray-800` | Used for nested cards, modal layers, and dropdowns. |
| **Subtle Border** | `#1f2937` | `border-gray-800` | Standard, non-intrusive layout boundaries. |
| **Interactive/Highlight Border** | `#374151` | `border-gray-700` | Hover states on cards, inputs, and interactive surfaces. |

### Dynamic Whitelabeling Accents
Accent variables are mapped to CSS custom properties to support dynamic tenant branding without breaking the dark mode foundation.
*   `var(--primary)` (Default: `#3b82f6` - Tailwind Blue 500): Main brand accent, action buttons, and active states.
*   `var(--primary-hover)` (Default: `#2563eb` - Tailwind Blue 600): Darker shade for interactive button states.
*   `var(--secondary)` (Default: `#a855f7` - Tailwind Purple 500): Secondary accent, completions, and badge highlights.

### ✍️ Typography & Text Hierarchy
Using the wrong text color on dark surfaces is the most common cause of "blurry" or unreadable text. The hierarchy is structured for maximum readability:
*   **Primary Text** (`#f9fafb` / `text-gray-50`): Used for all headings, titles, and active button text. Pure white (`#ffffff`) is reserved only for high-signal highlights.
*   **Secondary Text** (`#9ca3af` / `text-gray-400`): Default for body text, descriptions, and structural labels.
*   **Muted Text** (`#6b7280` / `text-gray-500`): Used exclusively for placeholders, timestamps, and disabled states.

---

## 2. Layouts & Application Shells

### 🖥️ Admin Console Layout (`AdminLayout.jsx`)
*   **Structure**: Locked 64-width (`w-64`) left sidebar, a top glassmorphic global header (`h-16`), and a scrollable fluid main workspace view.
*   **Sidebar Styling**: Rendered using `bg-gray-900` with a right boundary of `border-r border-gray-800`.
*   **Navigation Tree**: Interactive Accordion groups organized into four definitive modules:
    *   👥 **User Management**: Student Rosters, Instructor Profiles, Role-Based Access Control (RBAC).
    *   📚 **Academic Ops**: Course Catalog, Cohort Builder, Curriculum Mapping.
    *   📊 **Engagement**: Live Announcements, Feedback Loops, Survey Engines.
    *   ⚙️ **Institution Settings**: Whitelabeling Toggles, Domain Mapping, Billing.

### 🎓 Student Portal Layout (`StudentLayout.jsx`)
*   **Desktop Shell**: Ultra-compact, high-efficiency icon-only sidebar navigation (`w-20`) to maximize viewing real estate for video players and text editors.
*   **Mobile Shell**: Fixed bottom navigation dock (`bottom-0 left-0 right-0 z-50`) using `bg-gray-950/80 backdrop-blur-lg` to eliminate back-layer text bleeding during window scrolling.

---

## 3. UI Primitives & Components

### 🔲 Card Component (`Card.jsx`)
A modular panel container engineered with depth isolation.
```javascript
// Card.jsx implementation outline
export const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-gray-800/60 bg-gray-900/40 backdrop-blur-md p-6 
    transition-all duration-200 hover:border-gray-700 hover:shadow-lg hover:shadow-black/20 ${className}`}>
    {children}
  </div>
);
```

### 🔘 Button Component (`Button.jsx`)
Rigorous design rules mapping out interactive states for high contrast:
*   **Primary Variant**: `bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus:ring-2 focus:ring-blue-500/50 transition-shadow`
*   **Outline Variant**: `border border-gray-700 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-white`
*   **Ghost Variant**: `bg-transparent text-gray-400 hover:bg-gray-800/80 hover:text-gray-100`

### ⌨️ Input Component (`Input.jsx`)
```javascript
// Input.jsx form architecture
export const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <input 
      {...props}
      className="w-full rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-gray-100 
        placeholder-gray-500 transition-all focus:border-[var(--primary)] focus:outline-none 
        focus:ring-2 focus:ring-[var(--primary)]/20" 
    />
  </div>
);
```

### ⏳ Skeleton Component (`Skeleton.jsx`)
A modern pulse overlay designed to reduce visual fatigue on component loading.
```css
/* Custom utility class to append to bg-gray-800 animate-pulse */
.skeleton-shimmer {
  background-image: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent);
}
```

---

## 4. Layout Architecture Blueprints

The front-end structure relies on a React Router layout shell wrapper tree to guarantee smooth navigation context transitions.
```
src/
└── layouts/
    ├── AdminLayout.jsx      # Fixed Sidebar (w-64) + Global Top Nav
    └── StudentLayout.jsx    # Compact Icon Nav (w-20) / Mobile Bottom Bar
```

### Grid Strategy for Content Areas
All dashboard frames must implement a standard 12-column system to align analytical blocks correctly:
*   **Metrics Sections**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
*   **Split View Workspaces**: `grid grid-cols-1 lg:grid-cols-3 gap-6` (Main area taking `lg:col-span-2`, interactive sidebar panel taking `lg:col-span-1`).

---

## 5. Architectural Feature Epics

To ensure scalability across engineering cohorts, any major product iteration must be built against the following development epics:

### Epic 1: Multi-Tenant Tenant Real-Time Whitelabel Engine
*   **Goal**: Load configurations on launch to customize interface tones dynamically.
*   **Mechanism**: Retrieve custom hex parameters during bootstrap sequence; apply parameters directly to document root styles (`document.documentElement.style.setProperty('--primary', serverHex)`).
*   **Failure Safe**: Hard fallback to the system default Tailwind Slate and Blue base configuration if communication errors occur during lookup sequences.

### Epic 2: Adaptive Video & Assessment Learning Shell
*   **Goal**: Give students an uninhibited UI context while viewing class presentations.
*   **Mechanism**: When accessing learning screens, the `StudentLayout.jsx` container switches automatically to theater-mode configuration, collapsing the left panel down to `w-0` to minimize distraction.

### Epic 3: High-Throughput Batch Grading Engine (Admin/Instructor View)
*   **Goal**: Allow quick entry of scores across large rows of student submissions.
*   **Mechanism**: Uses light, un-styled rows within clean tables that don't trigger layout shifting when data updates. Includes keyboard shortcuts (up/down arrows) so teachers can grade rapidly without needing to click around with a mouse.
