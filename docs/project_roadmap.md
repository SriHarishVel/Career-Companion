**# Career Companion Roadmap**

**## Project Direction**

Career Companion is designed as a guided career management platform rather than a collection of independent productivity tools.

The application should guide users from defining a career objective to developing the required skills, organizing learning resources, tracking job applications, and measuring career progress.

The system should preserve relationships between goals, skills, resources, applications, and interview stages so that users can understand how individual activities contribute to their larger career objectives.

Each phase in this roadmap contributes toward building that guided experience.

**## Phase 1 - Foundation**

Establish the core structure of the application and create the first version of the career management system.

**### Features**

- Dashboard
- Goal Management
- Skill Tracking
- Resource Organization
- Local Data Persistence
- Search, Sorting, and Filtering
- Confirmation Modals
- Empty States

**---**

**## Phase 2 - Goal System**

Expand goals into a structured planning system.

**### Features**

- Primary Goals
- Secondary Goals
- Goal Relationships
- Goal Details
- Goal Notes
- Goal History
- Goal Milestones

**---**

**## Phase 3 - Career Tracking**

Introduce career-focused modules that connect directly to user goals.

**### Features**

- Job Application Tracker (Completed)
- Application Status Management (Completed)
- Interview Round Tracker
- Interview Notes
- Career Progress Dashboard (Completed)

**---**

**## Phase 4 - Frontend Refinement**

Improve usability, consistency, responsiveness, and overall user experience.

**### Features**

- Responsive Design Improvements
- Mobile-Friendly Application Experience
- Navigation Improvements
- Improved Validation and Feedback
- Design System Standardization
- Dashboard Enhancements
- Goal Details Experience
- Profile Experience
- Authentication Experience

**### Mobile-Friendly Application Experience**

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

**---**

**## Phase 5 - Backend Integration**

Move the application from browser storage to a centralized backend architecture.

**### Features**

- Node.js and Express Backend
- REST API Development
- MongoDB Database
- Backend Integration for Frontend Modules
- Goal APIs (Completed)
- Skill APIs (Completed)
- Resource APIs (Completed)
- Application APIs (Completed)
- Dashboard Analytics APIs
- Backend Search, Sorting, and Filtering

**---**

**## Phase 6 - Authentication**

Introduce user accounts and secure access to data.

**### Features**

- User Registration
- User Login and Logout
- JWT Authentication
- Protected Routes
- User Profile Management
- Password Change

**---**

**## Phase 7 - Release Preparation**

Prepare the application for public use and portfolio presentation.

**### Features**

- Testing and Bug Fixing
- Documentation
- Deployment
- Performance Optimization

**## Current Product Direction**

The next stage of Career Companion is to strengthen the relationships between goals, skills, and resources rather than adding more disconnected features.

The intended career structure is:

Primary Goal
↓
Secondary Goal
↓
Skill
↓
Resource

Resources currently represent external learning material such as documentation, articles, courses, videos, and other third-party references.

Saving or linking a Resource should not automatically increase progress.

Future versions should introduce evidence of learning activity or completed work so that Resource activity can contribute to Skill progress.

The intended long-term progression is:

Resource Activity and Evidence
↓
Skill Progress
↓
Secondary Goal Progress
↓
Primary Goal Progress

The exact calculation, weighting, and evidence model should be defined before automatic hierarchical progress is implemented.

**## Future Enhancements**

**### Guided Goal Planning**

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

**### Goal and Career Relationships**

- Link secondary goals to primary goals
- Link skills to secondary goals
- Link resources to skills
- Link applications to primary goals
- Connect interview stages to relevant applications
- Preserve relationships between career entities

**### Evidence-Based Progress**

Allow users to record meaningful evidence of skill development.

Potential evidence may include:

- Completed learning activities
- Completed exercises
- Projects
- Assessments
- Certifications
- Other user-provided evidence

Evidence should contribute to Skill progress only when there is a meaningful basis for doing so.

Skill progress can then contribute to related Secondary Goals, while Secondary Goal progress can contribute to Primary Goals.

**## Technical Debt & Optimizations**

These improvements are intentionally postponed until all core features are complete.

**### Backend**

- [ ] Add pagination and result limits to all list endpoints.
- [ ] Add database indexes for frequently queried fields.
- [ ] Standardize API responses and error handling.
- [ ] Review and optimize cross-entity queries as relationships expand.
- [ ] Add backend support for future evidence and progress calculations.

**### Frontend**

- [ ] Add loading indicators for remaining API requests.
- [ ] Replace `console.error` with user-friendly error messages.
- [ ] Debounce search inputs.
- [ ] Implement optimistic UI updates where appropriate.
- [ ] Improve cross-entity navigation.

**### Navigation**

- [ ] Improve navigation between related entities.
- [ ] Make Goals, Skills, Resources, and Applications cross-link to each other.
- [ ] Add navigation from Skills to their supporting Resources.
- [ ] Add navigation from Resources to their associated Skills.
- [ ] Add navigation between Primary Goals and their Secondary Goals.

**### Progress System**

- [ ] Define Skill progress calculation.
- [ ] Define evidence model.
- [ ] Define Resource activity tracking.
- [ ] Define Skill-to-Secondary Goal progress aggregation.
- [ ] Define Secondary Goal-to-Primary Goal progress aggregation.
- [ ] Define weighting rules for related Skills and Goals.
