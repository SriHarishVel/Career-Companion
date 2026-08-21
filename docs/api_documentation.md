# Career Companion API Documentation

## Overview

The Career Companion API provides backend services for authentication, user profiles, career goals, skills, learning resources, jobs, job applications, interview rounds, home dashboard data, and dashboard statistics.

---

## Base URL

    /api

---

## Authentication

Protected endpoints require the following request header:

    Authorization: Bearer <JWT_TOKEN>

JWT tokens are generated during login and expire after 7 days.

---

# Authentication API

## Register User

Creates a new Career Companion user account.

### Endpoint

    POST /api/auth/register

### Authentication

Not Required

### Request Body

| Field    | Type   | Required | Validation |
| -------- | ------ | -------- | ---------- |
| fullName | String | Yes      | Required   |
| email    | String | Yes      | Required   |
| password | String | Yes      | Required   |

### Validation

- All fields are required.
- A user with the same email cannot already exist.
- Passwords are stored using bcrypt hashing.

### Example Request

    {
        "fullName": "John Doe",
        "email": "john@example.com",
        "password": "password123"
    }

### Success Response (201)

    {
        "message": "User registered successfully",
        "user": {
            "id": "USER_ID",
            "fullName": "John Doe",
            "email": "john@example.com"
        }
    }

---

## Login

Authenticates an existing user and returns a JWT token.

### Endpoint

    POST /api/auth/login

### Authentication

Not Required

### Request Body

| Field    | Type   | Required |
| -------- | ------ | -------- |
| email    | String | Yes      |
| password | String | Yes      |

### Example Request

    {
        "email": "john@example.com",
        "password": "password123"
    }

### Success Response (200)

    {
        "message": "Login successful",
        "token": "JWT_TOKEN",
        "user": {
            "id": "USER_ID",
            "fullName": "John Doe",
            "email": "john@example.com"
        }
    }

---

# User API

The user routes provide authenticated profile management.

## Get Profile

Returns the authenticated user's profile.

### Endpoint

    GET /api/users/profile

### Authentication

Bearer Token Required

### Success Response (200)

Returns the authenticated user's profile without the password field.

---

## Update Profile

Updates the authenticated user's profile.

### Endpoint

    PUT /api/users/profile

### Authentication

Bearer Token Required

### Request Body

| Field    | Type   | Required |
| -------- | ------ | -------- |
| fullName | String | No       |
| email    | String | No       |

### Example Request

    {
        "fullName": "John Doe",
        "email": "john@example.com"
    }

### Success Response (200)

Returns the updated user document.

---

## Change Password

Changes the authenticated user's password.

### Endpoint

    PUT /api/users/change-password

### Authentication

Bearer Token Required

### Request Body

| Field           | Type   | Required |
| --------------- | ------ | -------- |
| currentPassword | String | Yes      |
| newPassword     | String | Yes      |

### Validation

- Current password must be correct.
- New password must contain at least 6 characters.
- New password must be different from the current password.

### Example Request

    {
        "currentPassword": "oldPassword",
        "newPassword": "newPassword123"
    }

### Success Response (200)

    {
        "message": "Password updated successfully"
    }

### Authentication Profile Routes

The same profile operations are also exposed through the authentication router:

| Operation       | Endpoint                      |
| --------------- | ----------------------------- |
| Get Profile     | GET /api/auth/profile         |
| Update Profile  | PUT /api/auth/profile         |
| Change Password | PUT /api/auth/change-password |

---

# Home API

## Get Home Data

Returns the main career journey data used by the home dashboard.

### Endpoint

    GET /api/home

### Authentication

Bearer Token Required

### Success Response (200)

    {
        "primaryGoal": {},
        "secondaryGoals": [],
        "completedSecondaryGoals": 0,
        "overallProgress": 0,
        "todaysFocus": {},
        "skills": [],
        "resources": [],
        "applications": []
    }

### Response Fields

| Field                   | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| primaryGoal             | A Primary Goal belonging to the authenticated user   |
| secondaryGoals          | Secondary Goals belonging to the authenticated user  |
| completedSecondaryGoals | Number of completed Secondary Goals                  |
| overallProgress         | Average progress of Secondary Goals                  |
| todaysFocus             | An incomplete Secondary Goal selected using progress |
| skills                  | Five most recently created Skills                    |
| resources               | Five most recently created Resources                 |
| applications            | Five most recently created Jobs                      |

---

# Goals API

## Goal Model

Goals can be either Primary or Secondary.

### Category Values

- Learning
- Career
- Health
- Personal

### Priority Values

- High
- Medium
- Low

### Goal Type Values

- Primary
- Secondary

### Progress

- Minimum: 0
- Maximum: 100

---

## Create Goal

Creates a new goal.

### Endpoint

    POST /api/goals

### Authentication

Bearer Token Required

### Request Body

| Field      | Type     | Required                     |
| ---------- | -------- | ---------------------------- |
| title      | String   | Yes                          |
| category   | String   | No                           |
| priority   | String   | No                           |
| goalType   | String   | No                           |
| parentGoal | ObjectId | Required for Secondary goals |
| progress   | Number   | No                           |
| completed  | Boolean  | No                           |
| deadline   | Date     | No                           |

### Notes

- Secondary goals must provide a `parentGoal`.
- Primary goals automatically store `parentGoal = null`.
- The goal is associated with the authenticated user.
- `lastUpdated` is set when the goal is created.

### Example Request

    {
        "title": "Become Backend Developer",
        "category": "Career",
        "priority": "High",
        "goalType": "Primary",
        "progress": 20,
        "completed": false,
        "deadline": "2026-12-31"
    }

### Success Response (201)

Returns the created goal document.

---

## Get Goals

Returns all goals belonging to the authenticated user.

### Endpoint

    GET /api/goals

### Authentication

Bearer Token Required

### Query Parameters

| Parameter | Description                                          |
| --------- | ---------------------------------------------------- |
| search    | Search by goal title                                 |
| category  | Learning, Career, Health, Personal                   |
| priority  | High, Medium, Low                                    |
| goalType  | Primary, Secondary                                   |
| status    | Active, Completed                                    |
| sort      | az, za, high, low, recent, priorityHigh, priorityLow |

### Success Response (200)

Returns an array of goals.

### Notes

- Parent goals are populated with their title.
- Primary Goal progress is synchronized from Secondary Goals before filtering and sorting.
- Default sorting is newest first.

---

## Get Goal

Returns a single goal.

### Endpoint

    GET /api/goals/:id

### Authentication

Bearer Token Required

### Success Response (200)

Returns the requested goal document with its parent goal title populated.

---

## Update Goal

Updates an existing goal.

### Endpoint

    PUT /api/goals/:id

### Authentication

Bearer Token Required

### Request Body

Any goal field may be updated.

| Field      | Type     |
| ---------- | -------- |
| title      | String   |
| category   | String   |
| priority   | String   |
| goalType   | String   |
| parentGoal | ObjectId |
| progress   | Number   |
| completed  | Boolean  |
| deadline   | Date     |

### Notes

- Only provided fields are updated.
- `lastUpdated` is updated whenever the goal is modified.
- The authenticated user must own the goal.

### Success Response (200)

Returns the updated goal document.

---

## Delete Goal

Deletes a goal.

### Endpoint

    DELETE /api/goals/:id

### Authentication

Bearer Token Required

### Notes

Deleting a Primary Goal also deletes all Secondary Goals belonging to that Primary Goal.

### Success Response (200)

    {
        "message": "Goal deleted successfully"
    }

---

# Skills API

## Skill Model

A Skill represents a capability associated with a Secondary Goal.

### Fields

| Field         | Type     |
| ------------- | -------- |
| name          | String   |
| category      | String   |
| level         | String   |
| progress      | Number   |
| secondaryGoal | ObjectId |
| user          | ObjectId |

---

## Create Skill

Creates a new Skill.

### Endpoint

    POST /api/skills

### Authentication

Bearer Token Required

### Request Body

| Field         | Type     | Required |
| ------------- | -------- | -------- |
| name          | String   | Yes      |
| category      | String   | No       |
| level         | String   | No       |
| progress      | Number   | No       |
| secondaryGoal | ObjectId | No       |

### Example Request

    {
        "name": "Node.js",
        "category": "Backend",
        "level": "Intermediate",
        "progress": 40,
        "secondaryGoal": "SECONDARY_GOAL_ID"
    }

### Success Response (201)

Returns the created Skill document.

---

## Get Skills

Returns all Skills belonging to the authenticated user.

### Endpoint

    GET /api/skills

### Authentication

Bearer Token Required

### Query Parameters

| Parameter     | Description                       |
| ------------- | --------------------------------- |
| search        | Search by Skill name              |
| category      | Filter by category                |
| level         | Filter by Skill level             |
| secondaryGoal | Filter by Secondary Goal          |
| sort          | az, za, progressHigh, progressLow |

### Success Response (200)

Returns an array of Skills.

### Notes

Secondary Goals are populated in the response.

---

## Get Skill

Returns a single Skill.

### Endpoint

    GET /api/skills/:id

### Authentication

Bearer Token Required

### Success Response (200)

Returns the requested Skill with its Secondary Goal populated.

---

## Update Skill

Updates an existing Skill.

### Endpoint

    PUT /api/skills/:id

### Authentication

Bearer Token Required

### Request Body

Any of the following fields may be updated:

| Field         | Type     |
| ------------- | -------- |
| name          | String   |
| category      | String   |
| level         | String   |
| progress      | Number   |
| secondaryGoal | ObjectId |

### Success Response (200)

Returns the updated Skill document.

---

## Delete Skill

Deletes a Skill.

### Endpoint

    DELETE /api/skills/:id

### Authentication

Bearer Token Required

### Success Response (200)

    {
        "message": "Skill deleted successfully"
    }

---

# Resources API

## Resource Model

A Resource represents external learning material associated with a Skill.

### Fields

| Field       | Type     |
| ----------- | -------- |
| title       | String   |
| type        | String   |
| url         | String   |
| description | String   |
| favorite    | Boolean  |
| completed   | Boolean  |
| skill       | ObjectId |
| user        | ObjectId |

---

## Create Resource

Creates a new Resource.

### Endpoint

    POST /api/resources

### Authentication

Bearer Token Required

### Request Body

| Field       | Type     | Required |
| ----------- | -------- | -------- |
| title       | String   | Yes      |
| type        | String   | No       |
| url         | String   | No       |
| description | String   | No       |
| favorite    | Boolean  | No       |
| completed   | Boolean  | No       |
| skill       | ObjectId | No       |

### Example Request

    {
        "title": "Node.js Documentation",
        "type": "Documentation",
        "url": "https://nodejs.org/docs",
        "description": "Official Node.js documentation",
        "favorite": true,
        "completed": false,
        "skill": "SKILL_ID"
    }

### Success Response (201)

Returns the created Resource document.

---

## Get Resources

Returns all Resources belonging to the authenticated user.

### Endpoint

    GET /api/resources

### Authentication

Bearer Token Required

### Query Parameters

| Parameter | Description                 |
| --------- | --------------------------- |
| search    | Search by Resource title    |
| type      | Filter by Resource type     |
| favorite  | Filter favorite Resources   |
| completed | Filter by completion status |
| skill     | Filter by Skill             |
| sort      | az, za, oldest              |

### Success Response (200)

Returns an array of Resources.

### Notes

Skills are populated with their name and level.

---

## Get Resource

Returns a single Resource.

### Endpoint

    GET /api/resources/:id

### Authentication

Bearer Token Required

### Success Response (200)

Returns the requested Resource with its Skill populated.

---

## Update Resource

Updates an existing Resource.

### Endpoint

    PUT /api/resources/:id

### Authentication

Bearer Token Required

### Request Body

Any of the following fields may be updated:

| Field       | Type     |
| ----------- | -------- |
| title       | String   |
| type        | String   |
| url         | String   |
| description | String   |
| favorite    | Boolean  |
| completed   | Boolean  |
| skill       | ObjectId |

### Success Response (200)

Returns the updated Resource document.

---

## Delete Resource

Deletes a Resource.

### Endpoint

    DELETE /api/resources/:id

### Authentication

Bearer Token Required

### Success Response (200)

    {
        "message": "Resource deleted successfully"
    }

---

# Jobs API

## Job Model

A Job represents a job opportunity being tracked by the user.

### Fields

| Field    | Type     |
| -------- | -------- |
| title    | String   |
| company  | String   |
| location | String   |
| status   | String   |
| jobType  | String   |
| salary   | Number   |
| notes    | String   |
| user     | ObjectId |

---

## Create Job

Creates a new Job.

### Endpoint

    POST /api/jobs

### Authentication

Bearer Token Required

### Request Body

| Field    | Type   | Required |
| -------- | ------ | -------- |
| title    | String | Yes      |
| company  | String | Yes      |
| location | String | No       |
| status   | String | No       |
| jobType  | String | No       |
| salary   | Number | No       |
| notes    | String | No       |

### Success Response (201)

Returns the created Job document.

---

## Get Jobs

Returns Jobs belonging to the authenticated user.

### Endpoint

    GET /api/jobs

### Authentication

Bearer Token Required

### Query Parameters

| Parameter | Description                               |
| --------- | ----------------------------------------- |
| search    | Search by title or company                |
| status    | Filter by status                          |
| jobType   | Filter by job type                        |
| sort      | newest, oldest, company-asc, company-desc |
| page      | Page number                               |
| limit     | Number of Jobs per page                   |

### Success Response (200)

    {
        "jobs": [],
        "totalJobs": 0,
        "totalPages": 0,
        "currentPage": 1
    }

---

## Get Job

Returns a single Job.

### Endpoint

    GET /api/jobs/:id

### Authentication

Bearer Token Required

### Success Response (200)

Returns the requested Job document.

---

## Update Job

Updates an existing Job.

### Endpoint

    PUT /api/jobs/:id

### Authentication

Bearer Token Required

### Request Body

Any of the following fields may be updated:

| Field    | Type   |
| -------- | ------ |
| title    | String |
| company  | String |
| location | String |
| status   | String |
| jobType  | String |
| salary   | Number |
| notes    | String |

### Success Response (200)

Returns the updated Job document.

---

## Delete Job

Deletes a Job.

### Endpoint

    DELETE /api/jobs/:id

### Authentication

Bearer Token Required

### Success Response (200)

    {
        "message": "Job deleted successfully"
    }

---

# Applications API

## Application Model

An Application represents an application submitted for a job opportunity.

Applications may optionally be associated with a Primary Goal.

Interview Rounds are stored inside the Application.

### Fields

| Field           | Type     |
| --------------- | -------- |
| company         | String   |
| role            | String   |
| status          | String   |
| appliedDate     | Date     |
| applicationUrl  | String   |
| primaryGoal     | ObjectId |
| interviewRounds | Array    |
| user            | ObjectId |

### Status Values

The available values depend on the Application model configuration.

---

## Create Application

Creates a new job application.

### Endpoint

    POST /api/applications

### Authentication

Bearer Token Required

### Request Body

| Field          | Type     | Required |
| -------------- | -------- | -------- |
| company        | String   | Yes      |
| role           | String   | Yes      |
| status         | String   | No       |
| appliedDate    | Date     | No       |
| applicationUrl | String   | No       |
| primaryGoal    | ObjectId | No       |

### Example Request

    {
        "company": "Google",
        "role": "Software Engineer",
        "status": "Applied",
        "appliedDate": "2026-08-21",
        "applicationUrl": "https://careers.google.com",
        "primaryGoal": "PRIMARY_GOAL_ID"
    }

### Success Response (201)

Returns the created Application document.

---

## Get Applications

Returns Applications belonging to the authenticated user.

### Endpoint

    GET /api/applications

### Authentication

Bearer Token Required

### Query Parameters

| Parameter   | Description                  |
| ----------- | ---------------------------- |
| search      | Search by company or role    |
| status      | Filter by application status |
| primaryGoal | Filter by Primary Goal       |
| sort        | appliedDate, company, role   |

### Success Response (200)

Returns an array of Applications.

### Notes

- Primary Goals are populated in the response.
- Applications are sorted by `lastUpdated` descending by default.
- Applications currently do not use pagination.

---

## Get Application

Returns a single Application.

### Endpoint

    GET /api/applications/:id

### Authentication

Bearer Token Required

### Success Response (200)

Returns the requested Application with its Primary Goal populated.

### Errors

- 404 if the Application does not exist.
- 403 if the Application does not belong to the authenticated user.

---

## Update Application

Updates an existing Application.

### Endpoint

    PUT /api/applications/:id

### Authentication

Bearer Token Required

### Request Body

Any of the following fields may be updated:

| Field          | Type     |
| -------------- | -------- |
| company        | String   |
| role           | String   |
| status         | String   |
| appliedDate    | Date     |
| applicationUrl | String   |
| primaryGoal    | ObjectId |

### Success Response (200)

Returns the updated Application document.

---

## Add Interview Round

Adds an Interview Round to an Application.

### Endpoint

    POST /api/applications/:id/rounds

### Authentication

Bearer Token Required

### Request Body

| Field  | Type   | Required |
| ------ | ------ | -------- |
| title  | String | Yes      |
| status | String | No       |
| date   | Date   | No       |

### Example Request

    {
        "title": "Technical Interview",
        "status": "Scheduled",
        "date": "2026-09-10"
    }

### Success Response (200)

Returns the updated Application with its Primary Goal populated.

---

## Update Interview Round

Updates an Interview Round within an Application.

### Endpoint

    PUT /api/applications/:id/rounds/:roundId

### Authentication

Bearer Token Required

### Request Body

| Field  | Type   |
| ------ | ------ |
| title  | String |
| status | String |
| date   | Date   |

### Success Response (200)

Returns the updated Application.

### Errors

- 404 if the Application does not exist.
- 404 if the Interview Round does not exist.
- 403 if the Application does not belong to the authenticated user.

---

## Delete Interview Round

Deletes an Interview Round from an Application.

### Endpoint

    DELETE /api/applications/:id/rounds/:roundId

### Authentication

Bearer Token Required

### Success Response (200)

Returns the updated Application with its Primary Goal populated.

---

## Delete Application

Deletes an Application.

### Endpoint

    DELETE /api/applications/:id

### Authentication

Bearer Token Required

### Success Response (200)

    {
        "message": "Application deleted successfully"
    }

---

# Dashboard API

## Get Statistics

Returns Job statistics for the authenticated user.

### Endpoint

    GET /api/dashboard/stats

### Authentication

Bearer Token Required

### Success Response (200)

    {
        "totalJobs": 5,
        "applied": 1,
        "interview": 2,
        "offer": 1,
        "rejected": 1,
        "monthlyStats": [
            {
                "month": "Jul 2026",
                "count": 5
            }
        ]
    }

### Response Fields

| Field        | Description                                  |
| ------------ | -------------------------------------------- |
| totalJobs    | Total Jobs created by the authenticated user |
| applied      | Number of Jobs with Applied status           |
| interview    | Number of Jobs with Interview status         |
| offer        | Number of Jobs with Offer status             |
| rejected     | Number of Jobs with Rejected status          |
| monthlyStats | Monthly Job creation statistics              |

### Notes

Monthly statistics are calculated from the Job `createdAt` field using MongoDB aggregation.

---

# HTTP Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Success               |
| 201         | Resource Created      |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Resource Not Found    |
| 500         | Internal Server Error |
