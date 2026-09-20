# Changelog

## Unreleased

### Added

#### Backend

- User authentication with JWT
- Protected API routes
- User profile management
- Password change functionality
- Job Management REST API
- Dashboard Statistics API
- Goal Management REST API
- Skills Management REST API
- Resources Management REST API
- Resource Items REST API
- Interview Round support
- Application Activity support
- Monthly application analytics using MongoDB Aggregation Pipeline
- Google Sign-In authentication

#### Job Management

- Create, Read, Update, Delete job applications
- Search by title and company
- Status filtering
- Job type filtering
- Sorting
- Pagination
- Application details
- Application activity tracking

#### Interview Management

- Create interview rounds
- Edit interview rounds
- Delete interview rounds
- Interview round status
- Interview date
- Interview time
- Interview round tracking

#### Goal Management

- Create, Read, Update, Delete goals
- Primary and Secondary goal support
- Parent-child goal relationships
- Goal Details page
- Goal Card to Goal Details navigation
- Supporting goal navigation
- Search
- Category filtering
- Priority filtering
- Goal type filtering
- Completion filtering
- Sorting
- Parent goal population

#### Skills Management

- Create, Read, Update, Delete skills
- Skill levels
- Skill filtering
- Skill search
- Secondary Goal association

#### Resources Management

- Create, Read, Update, Delete resources
- Resource types
- Resource search
- Resource filtering
- Resource favorites
- Skill association
- External resource links
- Resource Items
- Resource Item management

#### Authentication

- User registration
- User login
- User logout
- JWT authentication
- Protected routes
- User profile management
- Google Sign-In
- Password change functionality

### Improved

#### Backend

- Modular backend architecture using Controllers, Models, Routes, and Middleware
- JWT-based authorization across protected endpoints
- Dashboard analytics generation using MongoDB Aggregation
- Consistent API response structure
- Backend search, sorting, and filtering for core modules
- Backend integration across Goals, Skills, Resources, Applications, Interviews, and Activities

#### Frontend

- Goals page UI and guided setup experience
- Goal Details page design and responsive layout
- Goal action controls
- Goal navigation between related goals
- Skills and Resources page UI and responsiveness
- Resource management experience
- Resource Item management experience
- Application management pages
- Application Details page
- Interview round management UI
- Application activity section
- Profile page UI and loading states
- Authentication page UI
- Dashboard applications and navigation UI
- Global styling and responsive layout
- Navbar and profile experience
- Search, filtering, and sorting consistency across core pages
- Shared UI patterns across application-management pages
- Responsive dialogs and forms
- Mobile-friendly layouts
- Improved handling of long content on smaller screens

### Planned

#### Authentication and Account Management

- Forgot Password
- Password Reset
- Email-based password reset
- Authentication error handling
- Authentication security improvements
- Authentication rate limiting
- Secure password-reset token handling

#### Email Infrastructure

- Reusable email service
- Email configuration
- Password-reset email templates
- Email delivery error handling
- Infrastructure for future career notifications

#### Upcoming Career Actions

- Upcoming Interviews
- Upcoming Goal Deadlines
- Upcoming Follow-ups
- Overdue Follow-ups
- Upcoming Tasks on Dashboard
- Follow-up Scheduling

#### Career Relationships

- Connect Secondary Goals to Primary Goals
- Connect Skills to Secondary Goals
- Connect Resources to Skills
- Connect Applications to Primary Goals
- Connect Interview Stages to Applications
- Cross-link related career entities
- Related entity navigation

#### Career Development Progress

- Introduce meaningful Resource activity or evidence
- Define Skill progress calculation
- Define evidence model
- Define Resource activity tracking
- Propagate Skill progress to Secondary Goals
- Propagate Secondary Goal progress to Primary Goals
- Define progress weighting and calculation rules
- Define completion criteria

#### Guided Career Planning

- Guided Primary Goal creation
- Suggested Secondary Goals
- Suggested Skills
- Suggested Resources
- User customization of suggested career plans

#### Dashboard and Analytics

- Expand Dashboard career-progress overview
- Goal progress visualization
- Skill development tracking
- Resource activity analytics
- Application pipeline visualization
- Career activity trends

#### Navigation

- Improve navigation between related Goals, Skills, Resources, and Applications
- Cross-link related career entities
- Add navigation from Skills to supporting Resources
- Add navigation from Resources to associated Skills
- Add navigation between Primary Goals and Secondary Goals
- Add navigation from Applications to related Goals

### Technical Debt

#### Backend

- [ ] Add pagination and result limits to all list endpoints.
- [ ] Add database indexes for frequently queried fields.
- [ ] Standardize API responses and error handling.
- [ ] Review and optimize cross-entity queries as relationships expand.
- [ ] Standardize validation across controllers.
- [ ] Add authentication rate limiting.
- [ ] Review authentication security.

#### Frontend

- [ ] Add loading indicators for remaining API requests.
- [ ] Replace unnecessary `console.error` usage with appropriate user-facing handling.
- [ ] Debounce search inputs.
- [ ] Implement optimistic UI updates where appropriate.
- [ ] Continue responsive design auditing across all pages.
- [ ] Continue standardizing shared UI patterns.

### Documentation

- Updated Project Vision
- Updated Project Roadmap
- Updated Domain Model
- Updated Database Schema
- Updated API Documentation
- Updated development documentation

---

## Previous Development

### Added

- Goals module
- Skills module
- Resources module
- Dashboard
- LocalStorage persistence
- Shared React components
- Empty states
- Confirmation modals
- Resource favorites
- Skill levels and filtering
- Job Application Tracker
- Interview Round Tracker
- Application Activities
- User authentication
- Backend API integration

### Improved

- Search, sorting, and filtering
- Dashboard summaries
- UI consistency
- Responsive layouts
- Goal navigation
- Application management UI
- Interview management UI
- Resource management UI
- Shared component usage

### Documentation

- Project Vision
- Project Roadmap
- Domain Model
- Database Schema
- API Documentation