# Career Companion API Documentation

## Overview

The Career Companion API provides backend services for authentication, user profiles, career goals, job applications, and dashboard statistics.

---

## Base URL

```text
/api
```

---

## Authentication

Protected endpoints require the following request header:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

# Authentication API

## Register User

Creates a new Career Companion user account.

### Endpoint

```http
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

Authenticates an existing user and returns a JWT token.

### Endpoint

```http
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

Returns the authenticated user's profile.

### Endpoint

```http
GET /auth/profile
```

### Authentication

Bearer Token Required

### Success Response (200)

Returns the authenticated user's profile.

---

## Update Profile

Updates the authenticated user's profile.

### Endpoint

```http
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

Changes the authenticated user's password.

### Endpoint

```http
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

# Applications API

## Application Model

### Status Values

- Applied
- Interview
- Offer
- Rejected
- Accepted

---

## Create Application

### Endpoint

```http
POST /Applications
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
| ApplicationType | String | No |
| salary | Number | No |
| notes | String | No |

### Example Request

```json
{
    "title": "Software Engineer",
    "company": "Google",
    "location": "Bangalore",
    "status": "Applied",
    "ApplicationType": "Internship",
    "salary": 30000,
    "notes": "Applied through careers page"
}
```

### Success Response (201)

Returns the created Application document.

---

## Get Applications

### Endpoint

```http
GET /Applications
```

### Authentication

Bearer Token Required

### Query Parameters

| Parameter | Description |
|----------|-------------|
| search | Search by title or company |
| status | Filter by application status |
| ApplicationType | Filter by application type |
| sort | newest, oldest, company-asc, company-desc |
| page | Page number |
| limit | Number of records per page |

### Success Response (200)

```json
{
    "Applications": [],
    "totalApplications": 0,
    "totalPages": 0,
    "currentPage": 1
}
```

---

## Get Application

### Endpoint

```http
GET /Applications/:id
```

### Authentication

Bearer Token Required

### Success Response (200)

Returns the requested Application document.

---

## Update Application

### Endpoint

```http
PUT /Applications/:id
```

### Authentication

Bearer Token Required

### Request Body

Any Application fields may be updated.

### Success Response (200)

Returns the updated Application document.

---

## Delete Application

### Endpoint

```http
DELETE /Applications/:id
```

### Authentication

Bearer Token Required

### Success Response (200)

```json
{
    "message": "Application deleted successfully"
}
```

---

# Goals API

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

```http
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

```text
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

```http
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

```http
GET /goals/:id
```

### Authentication

Bearer Token Required

### Success Response (200)

Returns the requested goal document.

---

## Update Goal

### Endpoint

```http
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

```http
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

# Dashboard API

## Get Statistics

### Endpoint

```http
GET /dashboard/stats
```

### Authentication

Bearer Token Required

### Success Response (200)

```json
{
    "totalApplications": 5,
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
| totalApplications | Total applications created by the authenticated user |
| applied | Number of applications with Applied status |
| interview | Number of applications with Interview status |
| offer | Number of applications with Offer status |
| rejected | Number of applications with Rejected status |
| monthlyStats | Monthly application statistics |

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
```