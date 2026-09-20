# Career Companion Roadmap

## Project Direction

Career Companion is designed as a guided career management platform rather than a collection of independent productivity tools.

The application should guide users from defining a career objective to developing the required skills, organizing learning resources, tracking job applications, and measuring career progress.

The system should preserve relationships between goals, skills, resources, applications, and interview stages so users can understand how individual activities contribute to their larger career objectives.

The long-term structure is:

```text
Primary Goal
      ↓
Secondary Goal
      ↓
Skill
      ↓
Resource / Evidence
```

Applications connect to the career side of the system:

```text
Primary Goal
      ↓
Application
      ↓
Interview Rounds
      ↓
Application Activities
```

Each phase contributes toward building this connected career-management experience.

---

# Phase 1 - Foundation

Establish the core structure of the application and create the first version of the career management system.

## Features

- Dashboard
- Goal Management
- Skill Tracking
- Resource Organization
- Local Data Persistence
- Search, Sorting, and Filtering
- Confirmation Modals
- Empty States

Status: Core foundation established

---

# Phase 2 - Goal System

Expand goals into a structured planning system.

## Features

- Primary Goals
- Secondary Goals
- Goal Relationships
- Goal Details
- Goal Notes
- Goal History
- Goal Milestones

## Future Goal Planning

- Guided creation of a Primary Goal
- Suggested Secondary Goals
- Customization of suggested goals
- Goal-to-Skill relationships
- Goal progress tracking

Status: Goal system exists, but deeper goal relationships and guided planning remain future work.

---

# Phase 3 - Career Tracking

Introduce career-focused modules that connect directly to user goals.

## Completed

- Job Application Tracker
- Application Status Management
- Interview Round Tracker
- Interview Date and Time
- Career Progress Dashboard

## Remaining

- Interview Notes
- Application Activity Tracking
- Additional interview activity/history improvements
- Stronger connection between Applications and Primary Goals

## Interview Management

Interview rounds currently support:

- Round name
- Status
- Date
- Time
- Editing
- Deletion

Interview date and time now provide the foundation for future interview notifications and upcoming-career-action functionality.

Status: Core application and interview tracking implemented.

---

# Phase 4 - Frontend Refinement

Improve usability, consistency, responsiveness, and overall user experience.

## Features

- Responsive Design Improvements
- Mobile-Friendly Application Experience
- Navigation Improvements
- Improved Validation and Feedback
- Design System Standardization
- Dashboard Enhancements
- Goal Details Experience
- Profile Experience
- Authentication Experience

## Current Refinement Work

Recent work has focused on standardizing and fixing bugs across the major application-management pages.

This includes:

- Consistent search/filter interfaces
- Consistent sorting behavior
- Consistent empty states
- Consistent action controls
- Responsive layouts
- Application detail responsiveness
- Interview round layouts
- Activity section layouts
- Responsive dialogs and forms
- Improved handling of long content
- Shared styling instead of page-specific duplication

## Mobile-Friendly Application Experience

The application should work properly across:

- Mobile phones
- Tablets
- Desktop screens

This includes:

- Responsive navbar and navigation
- Responsive grids and cards
- Mobile-friendly forms and inputs
- Responsive tables and lists
- Appropriate spacing and typography on small screens
- Touch-friendly buttons and interactive elements
- Responsive modals
- Mobile-friendly dashboard layouts
- Responsive empty states and feedback messages
- Preventing horizontal scrolling and overflow

Status: Active refinement phase.

---

# Phase 5 - Backend Integration

Move the application from browser storage to a centralized backend architecture.

## Features

- Node.js and Express Backend
- REST API Development
- MongoDB Database
- Backend Integration for Frontend Modules
- Goal APIs
- Skill APIs
- Resource APIs
- Resource Item APIs
- Application APIs
- Interview Round APIs
- Application Activity APIs
- Dashboard Analytics APIs
- Backend Search, Sorting, and Filtering

## Completed

- Goal APIs
- Skill APIs
- Resource APIs
- Resource Item APIs
- Application APIs
- Interview Round support
- Application Activity support
- Frontend integration for the major backend-backed modules

Status: Core backend integration completed.

---

# Phase 6 - Authentication and Account Management

Introduce user accounts and secure access to career data.

## Completed

- User Registration
- User Login
- User Logout
- JWT Authentication
- Protected Routes
- User Profile Management
- Google Sign-In
- Google Account Authentication

## Next

- Forgot Password
- Password Reset
- Email-Based Password Reset
- Change Password
- Authentication Error Handling
- Account Security Improvements

## Authentication Security Improvements

- Verify Google account email status
- Review Google/local account linking
- Secure password-reset tokens
- Token expiration
- Password-reset token invalidation
- Authentication rate limiting
- Consistent authentication error responses

Status: Core authentication implemented. Password recovery and additional security hardening remain.

---

# Phase 7 - Email Infrastructure

Introduce reusable communication infrastructure rather than implementing email separately for individual features.

## Features

- Email service
- Email configuration
- Password-reset emails
- Reusable email templates
- Email delivery error handling

## Future Email Uses

The same infrastructure can later support:

- Interview reminders
- Follow-up reminders
- Goal deadline reminders
- Important application notifications

The email system should be reusable so future notification features do not require separate email implementations.

Status: Upcoming.

---

# Phase 8 - Upcoming and Actionable Career Tasks

Make existing dates and career activities actionable.

The initial approach should derive actionable items from existing career entities rather than immediately introducing a generic reminder system.

## Features

- Upcoming Interviews
- Upcoming Goal Deadlines
- Upcoming Follow-ups
- Overdue Follow-ups
- Upcoming Tasks on Dashboard
- Interview Date + Time Display
- Follow-up Scheduling

The existing interview date/time functionality provides the foundation for this phase.

A generic `Reminder` model should only be introduced if existing career entities cannot adequately represent the required tasks.

Status: Upcoming.

---

# Phase 9 - Career Relationships

Strengthen the relationships between the core career entities.

The intended structure is:

```text
Primary Goal
      ↓
Secondary Goal
      ↓
Skill
      ↓
Resource
```

Applications remain connected to the relevant career goal:

```text
Primary Goal
      ↓
Application
      ↓
Interview Rounds
      ↓
Application Activities
```

## Features

- Link Secondary Goals to Primary Goals
- Link Skills to Secondary Goals
- Link Resources to Skills
- Link Applications to Primary Goals
- Connect Interview Stages to Applications
- Cross-entity navigation
- Related entity views

## Navigation Improvements

- Goals → related Skills
- Skills → supporting Resources
- Resources → associated Skills
- Primary Goals → Secondary Goals
- Secondary Goals → related Skills
- Applications → related Primary Goals
- Applications → Interview Rounds
- Related entities → parent entities

Status: Important upcoming development phase.

---

# Phase 10 - Evidence-Based Progress

Introduce meaningful evidence of learning and career development.

Resources should not automatically increase progress simply because they are saved or linked.

The intended progression is:

```text
Resource Activity and Evidence
            ↓
      Skill Progress
            ↓
 Secondary Goal Progress
            ↓
   Primary Goal Progress
```

## Potential Evidence

- Completed learning activities
- Completed exercises
- Projects
- Assessments
- Certifications
- Practice work
- Other user-provided evidence

Evidence should contribute to Skill progress only when there is a meaningful basis for doing so.

## Progress System

Before implementation, define:

- Skill progress calculation
- Evidence model
- Resource activity tracking
- Skill-to-Secondary Goal aggregation
- Secondary Goal-to-Primary Goal aggregation
- Weighting rules
- Completion criteria

Status: Design phase only.

The calculation model should be finalized before automated hierarchical progress is implemented.

---

# Phase 11 - Guided Career Planning

Allow users to build a career plan starting from a Primary Goal.

## Example

Primary Goal

> Get Software Developer Job (8+ LPA)

### Suggested Secondary Goals

- Practice DSA
- Build Portfolio
- Learn Backend Development
- Prepare for Interviews

### Suggested Skills

- Java
- SQL
- Node.js
- React

### Suggested Resources

- Courses
- Documentation
- Videos
- Articles

Users should be able to:

- Accept suggestions
- Reject suggestions
- Modify suggestions
- Add their own goals
- Add their own skills
- Add their own resources
- Customize the resulting career plan

The system should assist planning without removing user control.

Status: Future development.

---

# Phase 12 - Dashboard and Analytics

Expand the Dashboard from basic aggregation into a meaningful career-progress overview.

## Applications

- Total applications
- Active applications
- Interview stages
- Offers
- Rejections
- Application activity

## Goals

- Active goals
- Completed goals
- Overdue goals
- Goal progress

## Skills

- Skills being developed
- Skills with evidence
- Skill progress

## Resources

- Total resources
- Completed resource items
- Resource activity

## Future Analytics

- Progress visualizations
- Career activity trends
- Application pipeline visualization
- Goal progress visualization
- Skill development trends

Status: Current dashboard exists; deeper analytics depend on the relationship and progress systems being implemented first.

---

# Phase 13 - Release Preparation

Prepare the application for public use and portfolio presentation.

## Features

- Testing and Bug Fixing
- Documentation
- Deployment
- Performance Optimization
- Production Environment Configuration
- Security Review
- Error Handling Review
- Responsive Design Audit

Status: Final release phase.

---

# Technical Debt & Optimizations

These improvements should be addressed progressively as the core features stabilize.

## Backend

- [ ] Add pagination and result limits to all list endpoints.
- [ ] Add database indexes for frequently queried fields.
- [ ] Standardize API responses and error handling.
- [ ] Review and optimize cross-entity queries as relationships expand.
- [ ] Add backend support for future evidence and progress calculations.
- [ ] Add authentication rate limiting.
- [ ] Review authentication security.
- [ ] Standardize validation across controllers.

## Frontend

- [ ] Add loading indicators for remaining API requests.
- [ ] Replace unnecessary `console.error` usage with appropriate user-facing handling.
- [ ] Debounce search inputs.
- [ ] Implement optimistic UI updates where appropriate.
- [ ] Improve cross-entity navigation.
- [ ] Continue responsive design auditing across all pages.
- [ ] Continue standardizing shared UI patterns.

## Navigation

- [ ] Improve navigation between related entities.
- [ ] Make Goals, Skills, Resources, and Applications cross-link to each other.
- [ ] Add navigation from Skills to supporting Resources.
- [ ] Add navigation from Resources to associated Skills.
- [ ] Add navigation between Primary Goals and Secondary Goals.
- [ ] Add navigation from Applications to their related Goals.
- [ ] Add navigation from related entities back to their parent entities.

## Progress System

- [ ] Define Skill progress calculation.
- [ ] Define evidence model.
- [ ] Define Resource activity tracking.
- [ ] Define Skill-to-Secondary Goal progress aggregation.
- [ ] Define Secondary Goal-to-Primary Goal progress aggregation.
- [ ] Define weighting rules for related Skills and Goals.
- [ ] Define completion criteria.

---

# Current Development Status

Career Companion has moved beyond the initial CRUD prototype.

The application currently has:

```text
Frontend
   ↓
React Application
   ↓
Backend APIs
   ↓
Express / Node.js
   ↓
MongoDB
```

The major career-management modules are already connected to the backend, including:

- Goals
- Skills
- Resources
- Resource Items
- Applications
- Interview Rounds
- Application Activities
- Dashboard data
- User accounts
- Authentication

The current development focus is therefore shifting from building isolated CRUD functionality toward connecting the existing entities into a coherent career-management system.

---

# Current Product Direction

The immediate development direction is:

```text
Authentication & Account Reliability
             ↓
Email Infrastructure
             ↓
Upcoming Career Actions
             ↓
Goal / Skill / Resource Relationships
             ↓
Evidence-Based Progress
             ↓
Guided Career Planning
             ↓
Career Analytics
```

The next concrete feature should be Forgot Password, followed by the reusable email service required to deliver password-reset emails.

After that, the application should make existing career data actionable through:

- Upcoming Interviews
- Follow-ups
- Goal Deadlines

Only after those foundations are established should the project move deeply into:

- Goal/Skill/Resource relationships
- Evidence tracking
- Hierarchical progress
- Guided career planning
- Advanced analytics
