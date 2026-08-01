# Database Schema

## User

Stores account information.

Fields:

* _id
* fullName
* email
* password
* createdAt
* updatedAt

---

## Goal

Stores both primary and secondary goals.

Fields:

* _id
* title
* category
* priority
* goalType
* parentGoal
* progress
* completed
* deadline
* lastUpdated
* user
* createdAt
* updatedAt

Notes:

* Primary goals have `goalType = "Primary"` and `parentGoal = null`.
* Secondary goals have `goalType = "Secondary"` and reference their parent through `parentGoal`.

---

## Skill

Stores skills required for the primary goal.

**Planned**

Fields:

* _id
* name
* level
* progress
* goal
* user
* createdAt
* updatedAt

---

## Resource

Stores learning resources.

**Planned**

Fields:

* _id
* title
* type
* url
* description
* favorite
* completed
* skill
* user
* createdAt
* updatedAt

---

## Job

Stores job applications.

Fields:

* _id
* title
* company
* location
* status
* jobType
* salary
* notes
* applicationDate
* user
* createdAt
* updatedAt

---

## Interview Round

Stores interview stages.

**Planned**

Fields:

* _id
* job
* roundName
* date
* status
* result
* notes
* createdAt
* updatedAt