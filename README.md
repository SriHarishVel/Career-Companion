# Career Companion

Career Companion is a personal career management system designed to help users organize and track their career goals, skills, learning resources, job applications, interview rounds, and related career activities in one connected system.

## Status

🚧 **Under Development**

## Overview

Career Companion connects long-term career planning with day-to-day career activities.

The core career development workflow is:

```text
Primary Goals
      ↓
Secondary Goals
      ↓
Skills
      ↓
Resources
```

The system also supports the job-search workflow:

```text
Career Goals
      ↓
Job Applications
      ↓
Interview Rounds
```

The goal is to provide a structured view of a user's career journey rather than managing goals, learning, skills, and applications as completely separate activities.

## Core Workflow

Career Companion is organized around four main career-development levels:

- **Primary Goals** — high-level career objectives.
- **Secondary Goals** — smaller objectives that contribute to a primary goal.
- **Skills** — abilities being developed to support career goals.
- **Resources** — learning materials used to develop skills.

Job applications and interview rounds provide an additional workflow for managing the job-search process.

## Current Features

### Authentication & Account Management

- User authentication
- JWT-based authentication
- User profile management
- Password reset functionality
- Account security management

### Career Goals

- Primary goal management
- Secondary goal management
- Goal progress tracking
- Goal deadlines
- Career journey overview

### Skills & Resources

- Skills management
- Skill progress tracking
- Resource management
- Resources organized within the career development workflow

### Job Applications

- Job application tracking
- Application status management
- Interview round tracking
- Application activities
- Follow-up tracking
- Follow-up completion status
- Overdue follow-up identification
- Follow-up reminders

### Dashboard

- Career journey overview
- Goal progress statistics
- Skill progress statistics
- Resource statistics
- Application statistics
- Recent activity
- Upcoming actions
- Upcoming interviews
- Upcoming goal deadlines
- Follow-up reminders

### Search & Organization

- Search
- Filtering
- Sorting

### Backend & API

- REST API
- MongoDB database
- JWT authentication
- Reusable email service

## Technology Stack

### Frontend

- React

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### Authentication

- JSON Web Tokens (JWT)

### API

- REST API

## Setup & Running

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd Career-Companion
```

Install frontend dependencies:

```bash
cd FRONTEND
npm install
```

Install backend dependencies:

```bash
cd ../BACKEND
npm install
```

### Environment Variables

Create the required environment configuration for the frontend and backend.

Environment files may contain sensitive information such as database credentials, authentication secrets, or email credentials.

> Do not commit `.env` files or other files containing secrets to the repository.

### Running the Application

Start the backend server:

```bash
cd BACKEND
npm run dev
```

Start the frontend development server in a separate terminal:

```bash
cd FRONTEND
npm run dev
```

The frontend and backend run as separate development processes. The frontend communicates with the backend through the REST API, while the backend uses MongoDB for persistent data storage.

> **Note:** The exact environment variables and npm scripts should match the configuration in the project's `FRONTEND/package.json`, `BACKEND/package.json`, and environment files.

## Project Structure

The project is organized into three main areas: the frontend application, backend API, and project documentation.

```text
Career Companion/
│
├── FRONTEND/
│   └── SRC/
│       └── PAGES/
│           ├── ApplicationDetail/
│           ├── Applications/
│           ├── Auth/
│           ├── Dashboard/
│           ├── GoalDetail/
│           ├── Goals/
│           ├── Home/
│           ├── NotFound/
│           ├── Profile/
│           ├── ResetPassword/
│           ├── ResourceDetail/
│           ├── Resources/
│           ├── SkillDetail/
│           └── Skills/
│
├── BACKEND/
│   ├── CONTROLLERS/
│   ├── MIDDLEWARE/
│   ├── ROUTES/
│   ├── SERVICES/
│   └── UTILS/
│
└── DOCS/
    ├── api_documentation.md
    ├── changelog.md
    ├── database_schema.md
    ├── domain_model.md
    ├── project_roadmap.md
    ├── project_vision.md
    └── diagrams/
        ├── er_diagram.excalidraw
        └── er_diagram.png
```

The frontend is organized around application pages and their related components, while the backend separates controllers, middleware, routes, services, and utility functions.

## Documentation

Detailed project documentation is maintained in the `DOCS` directory.

| Document                         | Description                                                           |
| -------------------------------- | --------------------------------------------------------------------- |
| `project_vision.md`              | Defines the purpose, goals, and overall direction of Career Companion |
| `project_roadmap.md`             | Defines planned development phases and future improvements            |
| `domain_model.md`                | Describes the core entities and their relationships                   |
| `database_schema.md`             | Documents the database models and schema                              |
| `api_documentation.md`           | Documents the REST API endpoints                                      |
| `changelog.md`                   | Records completed development work and project changes                |
| `diagrams/er_diagram.excalidraw` | Editable entity relationship diagram                                  |
| `diagrams/er_diagram.png`        | Rendered entity relationship diagram                                  |

## Future Direction

Career Companion is being developed toward a more connected career planning system where progress can be understood across related career activities.

The intended direction is to preserve meaningful relationships between:

```text
Goals
  ↓
Skills
  ↓
Resources
```

while also supporting:

```text
Goals
  ↓
Applications
  ↓
Interview Rounds
```

Future development will focus on improving these connected workflows, actionable reminders, dashboard analytics, and other career-management capabilities defined in the project roadmap.

## Scope

Career Companion is intentionally focused on career organization and management.

### Career Companion Will Not

- Teach programming or other subjects directly
- Host courses or educational videos
- Replace dedicated learning platforms
- Depend on AI as a core requirement
- Become a social media platform

External learning resources can be organized and tracked within Career Companion, but the application itself is not intended to replace the platforms where learning takes place.

## Development Philosophy

Career Companion is designed around the following principles:

- **User control** — users manage their own goals, skills, resources, and applications.
- **Connected information** — related career entities should maintain meaningful relationships.
- **Actionable progress** — the system should help users identify what requires attention.
- **Structured organization** — career information should remain organized and understandable.
- **Focused scope** — the application should remain a career-management system rather than becoming a learning platform or social network.

## Project Status

Career Companion is actively under development.

The core foundations for authentication, career goals, skills, resources, job applications, interview tracking, follow-up management, and dashboard functionality are in place.

Development is continuing toward the remaining features and improvements defined in the project roadmap.