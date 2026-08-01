# API Documentation

## Base URL

```
/api
```

---

## Authentication

Protected endpoints require the following request header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Authentication

## Register User

### Endpoint

```
POST /auth/register
```

### Authentication

Not Required

### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| fullName | String | Yes | Required |
| email | String | Yes | Unique, lowercase |
| password | String | Yes | Minimum 6 characters |

### Example Request

```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

### Success Response (201)

```json
{
    "message": "User registered successfully",
    "user": {
        "id": "USER_ID",
        "fullName": "John Doe",
        "email": "john@example.com"
    }
}
```

---

## Login

### Endpoint

```
POST /auth/login
```

### Authentication

Not Required

### Request Body

| Field | Type | Required |
|-------|------|----------|
| email | String | Yes |
| password | String | Yes |

### Example Request

```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Success Response (200)

```json
{
    "message": "Login successful",
    "token": "JWT_TOKEN",
    "user": {
        "id": "USER_ID",
        "fullName": "John Doe",
        "email": "john@example.com"
    }
}
```

---

## Get Profile

### Endpoint

```
GET /auth/profile
```

### Authentication

Bearer Token Required

### Success Response (200)

Returns the authenticated user's profile.

---

## Update Profile

### Endpoint

```
PUT /auth/profile
```

### Authentication

Bearer Token Required

### Request Body

| Field | Type | Required |
|-------|------|----------|
| fullName | String | No |
| email | String | No |

### Example Request

```json
{
    "fullName": "John Doe",
    "email": "john@example.com"
}
```

### Success Response (200)

Returns the updated user document.

---

## Change Password

### Endpoint

```
PUT /auth/change-password
```

### Authentication

Bearer Token Required

### Request Body

| Field | Type | Required |
|-------|------|----------|
| currentPassword | String | Yes |
| newPassword | String | Yes |

### Validation

- Current password must be correct.
- New password must contain at least 6 characters.
- New password must be different from the current password.

### Example Request

```json
{
    "currentPassword": "oldPassword",
    "newPassword": "newPassword123"
}
```

### Success Response (200)

```json
{
    "message": "Password updated successfully"
}
```

---

# Jobs

## Job Model

### Status Values

- Applied
- Interview
- Offer
- Rejected
- Accepted

### Job Type Values

- Full-time
- Part-time
- Internship
- Remote

---

## Create Job

### Endpoint

```
POST /jobs
```

### Authentication

Bearer Token Required

### Request Body

| Field | Type | Required |
|-------|------|----------|
| title | String | Yes |
| company | String | Yes |
| location | String | No |
| status | String | No |
| jobType | String | No |
| salary | Number | No |
| notes | String | No |

### Example Request

```json
{
    "title": "Software Engineer",
    "company": "Google",
    "location": "Bangalore",
    "status": "Applied",
    "jobType": "Internship",
    "salary": 30000,
    "notes": "Applied through careers page"
}
```

### Success Response (201)

Returns the created job document.

---

## Get Jobs

### Endpoint

```
GET /jobs
```

### Authentication

Bearer Token Required

### Query Parameters

| Parameter | Description |
|----------|-------------|
| search | Search by title or company |
| status | Filter by status |
| jobType | Filter by job type |
| sort | newest, oldest, company-asc, company-desc |
| page | Page number |
| limit | Number of records per page |

### Success Response (200)

```json
{
    "jobs": [],
    "totalJobs": 0,
    "totalPages": 0,
    "currentPage": 1
}
```

---

## Get Job

### Endpoint

```
GET /jobs/:id
```

### Authentication

Bearer Token Required

### Success Response (200)

Returns the requested job document.

---

## Update Job

### Endpoint

```
PUT /jobs/:id
```

### Authentication

Bearer Token Required

### Request Body

Any job fields may be updated.

### Success Response (200)

Returns the updated job document.

---

## Delete Job

### Endpoint

```
DELETE /jobs/:id
```

### Authentication

Bearer Token Required

### Success Response (200)

```json
{
    "message": "Job deleted successfully"
}
```

---

# Goals

## Goal Model

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

### Endpoint

```
POST /goals
```

### Authentication

Bearer Token Required

### Request Body

| Field | Type | Required |
|-------|------|----------|
| title | String | Yes |
| category | String | No |
| priority | String | No |
| goalType | String | No |
| parentGoal | ObjectId | Only for Secondary goals |
| progress | Number | No |
| completed | Boolean | No |
| deadline | Date | No |

### Notes

Secondary goals must include a valid `parentGoal`.

Primary goals automatically store:

```
parentGoal = null
```

### Example Request

```json
{
    "title": "Become Backend Developer",
    "category": "Career",
    "priority": "High",
    "goalType": "Primary",
    "progress": 20,
    "completed": false,
    "deadline": "2026-12-31"
}
```

### Success Response (201)

Returns the created goal document.

---

## Get Goals

### Endpoint

```
GET /goals
```

### Authentication

Bearer Token Required

### Query Parameters

| Parameter | Description |
|----------|-------------|
| search | Search by goal title |
| category | Learning, Career, Health, Personal |
| priority | High, Medium, Low |
| goalType | Primary, Secondary |
| status | Active, Completed |
| sort | az, za, high, low, recent, priorityHigh, priorityLow |

### Success Response (200)

Returns an array of goals.

---

## Get Goal

### Endpoint

```
GET /goals/:id
```

### Authentication

Bearer Token Required

### Success Response (200)

Returns the requested goal document.

---

## Update Goal

### Endpoint

```
PUT /goals/:id
```

### Authentication

Bearer Token Required

### Request Body

Any goal field may be updated.

### Notes

Updating a goal also updates the `lastUpdated` timestamp.

### Success Response (200)

Returns the updated goal document.

---

## Delete Goal

### Endpoint

```
DELETE /goals/:id
```

### Authentication

Bearer Token Required

### Success Response (200)

```json
{
    "message": "Goal deleted successfully"
}
```

---

# Dashboard

## Get Statistics

### Endpoint

```
GET /dashboard/stats
```

### Authentication

Bearer Token Required

### Success Response (200)

```json
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
```

### Response Fields

| Field | Description |
|------|-------------|
| totalJobs | Total jobs created by the authenticated user |
| applied | Number of jobs with Applied status |
| interview | Number of jobs with Interview status |
| offer | Number of jobs with Offer status |
| rejected | Number of jobs with Rejected status |
| monthlyStats | Monthly job application statistics |

---

# HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 500 | Internal Server Error |