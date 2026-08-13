# Career Companion Roadmap

## Project Direction

Career Companion is designed as a guided career management platform rather than a collection of independent productivity tools.

The application should guide users from defining a career objective to developing the required skills, organizing learning resources, tracking job applications, and measuring career progress.

Each phase in this roadmap contributes toward building that guided experience.

## Phase 1 - Foundation

Establish the core structure of the application and create the first version of the career management system.

### Features

* Dashboard
* Goal Management
* Skill Tracking
* Resource Organization
* Local Data Persistence
* Search, Sorting, and Filtering
* Confirmation Modals
* Empty States

---

## Phase 2 - Goal System

Expand goals into a structured planning system.

### Features

* Primary Goals
* Secondary Goals
* Goal Relationships
* Goal Notes
* Goal History
* Goal Milestones

---

## Phase 3 - Career Tracking

Introduce career-focused modules that connect directly to user goals.

### Features

* Job Application Tracker (Completed)
* Application Status Management (Completed)
* Interview Round Tracker
* Interview Notes
* Career Progress Dashboard (Completed)

---

## Phase 4 - Frontend Refinement

Improve usability, consistency, responsiveness, and overall user experience.

### Features

* Responsive Design Improvements
* Mobile-Friendly Application Experience
* Navigation Improvements
* Improved Validation and Feedback
* Design System Standardization
* Dashboard Enhancements

### Mobile-Friendly Application Experience

The application should work properly across:

* Mobile phones
* Tablets
* Desktop screens

This includes:

* Responsive navbar and navigation
* Responsive grids and cards
* Mobile-friendly forms and inputs
* Responsive tables and lists
* Appropriate spacing and typography on small screens
* Touch-friendly buttons and interactive elements
* Responsive modals
* Mobile-friendly dashboard layouts
* Responsive empty states and feedback messages
* Preventing horizontal scrolling and overflow

---

## Phase 5 - Backend Integration

Move the application from browser storage to a centralized backend architecture.

### Features

* Node.js and Express Backend
* REST API Development
* MongoDB Database
* Backend Integration for Frontend Modules
* Goal APIs
* Skill APIs
* Resource APIs
* Application APIs
* Dashboard Analytics APIs

---

## Phase 6 - Authentication

Introduce user accounts and secure access to data.

### Features

* User Registration
* User Login and Logout
* JWT Authentication
* Protected Routes
* User Profile Management
* Password Change

---

## Phase 7 - Release Preparation

Prepare the application for public use and portfolio presentation.

### Features

* Testing and Bug Fixing
* Documentation
* Deployment
* Performance Optimization

## Future Enhancements

### Guided Goal Planning

Allow users to create a career plan starting from a primary goal.

Example:

Primary Goal:
- Get Software Developer Job (8+ LPA)

The application can suggest:

Secondary Goals:
- Practice DSA
- Build Portfolio
- Learn Backend Development
- Prepare for Interviews

Skills:
- Java
- SQL
- Node.js
- React

Resources:
- Courses
- Documentation
- Videos

Users can accept, reject, or customize the suggested plan.

The system should assist planning without removing user control.

### Goal Relationships

- Link secondary goals to primary goals
- Link skills to secondary goals
- Link resources to skills
- Link applications to primary goals

## Technical Debt & Optimizations

These improvements are intentionally postponed until all core features are complete.

### Backend

- [ ] Move search, filtering, and sorting from the frontend to the backend for all modules using query parameters (`req.query`) and `getX(params)` service calls.
- [ ] Add pagination and result limits to all list endpoints.
- [ ] Add database indexes for frequently queried fields.
- [ ] Standardize API responses and error handling.

### Frontend

- [ ] Add loading indicators for API requests.
- [ ] Replace `console.error` with user-friendly error messages.
- [ ] Debounce search inputs.
- [ ] Implement optimistic UI updates where appropriate.

### Navigation

- [ ] Improve navigation between related entities.
- [ ] Make Goals, Skills, Resources, and Applications cross-link to each other.