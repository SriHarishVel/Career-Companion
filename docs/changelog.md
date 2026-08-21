**# Changelog**

**## Unreleased**

**### Added**

**#### Backend**

- User authentication with JWT
- Protected API routes
- User profile management
- Password change functionality
- Job Management REST API
- Dashboard Statistics API
- Goal Management REST API
- Skills Management REST API
- Resources Management REST API
- Monthly application analytics using MongoDB Aggregation Pipeline

**#### Job Management**

- Create, Read, Update, Delete job applications
- Search by title and company
- Status filtering
- Job type filtering
- Sorting
- Pagination

**#### Goal Management**

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

**#### Skills Management**

- Create, Read, Update, Delete skills
- Skill levels
- Skill filtering
- Skill search
- Secondary Goal association

**#### Resources Management**

- Create, Read, Update, Delete resources
- Resource types
- Resource search
- Resource filtering
- Resource favorites
- Skill association
- External resource links

**### Improved**

**#### Backend**

- Modular backend architecture using Controllers, Models, Routes, and Middleware
- JWT-based authorization across protected endpoints
- Dashboard analytics generation using MongoDB Aggregation
- Consistent API response structure
- Backend search, sorting, and filtering for core modules

**#### Frontend**

- Goals page UI and guided setup experience
- Goal Details page design and responsive layout
- Goal action controls
- Goal navigation between related goals
- Skills and Resources page UI and responsiveness
- Profile page UI and loading states
- Authentication page UI
- Dashboard applications and navigation UI
- Global styling and responsive layout
- Navbar and profile experience

**### Planned**

**#### Career Development Progress**

- Connect Skills to Secondary Goals
- Connect Resources to Skills
- Introduce meaningful Resource activity or evidence
- Define Skill progress calculation
- Propagate Skill progress to Secondary Goals
- Propagate Secondary Goal progress to Primary Goals
- Define progress weighting and calculation rules

**#### Navigation**

- Improve navigation between related Goals, Skills, Resources, and Applications
- Cross-link related career entities

**### Documentation**

- Updated Project Vision
- Updated Project Roadmap
- Updated Domain Model
- Updated Database Schema
- Updated API Documentation

**---**

**## Previous Development**

**### Added**

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

**### Improved**

- Search, sorting, and filtering
- Dashboard summaries
- UI consistency

**### Documentation**

- Project Vision
- Project Roadmap
- Domain Model
- Database Schema
