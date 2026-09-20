# Database Schema

## User

Stores account information.

Fields:

- `_id`
- fullName
- email
- password
- createdAt
- updatedAt

---

## Goal

Stores both Primary and Secondary Goals.

Fields:

- `_id`
- title
- category
- priority
- goalType
- parentGoal
- progress
- completed
- deadline
- lastUpdated
- user
- createdAt
- updatedAt

Notes:

- Primary Goals have `goalType = "Primary"` and `parentGoal = null`.
- Secondary Goals have `goalType = "Secondary"` and reference their parent through `parentGoal`.
- Progress is currently stored directly on the Goal.

---

## Skill

Stores skills associated with Secondary Goals.

Fields:

- `_id`
- name
- level
- progress
- secondaryGoal
- user
- createdAt
- updatedAt

Notes:

- A Skill may be associated with a Secondary Goal.
- Progress is currently stored directly on the Skill.

---

## Learning Topic

Represents a specific area within a Skill.

Fields:

- `_id`
- name
- skill
- user
- createdAt
- updatedAt

Notes:

- Learning Topics organize a Skill into smaller areas for learning or practice.
- Resources may be associated with a Learning Topic.

**Status: Planned**

---

## Resource

Stores external learning resources associated with Skills or Learning Topics.

Fields:

- `_id`
- title
- type
- url
- description
- favorite
- completed
- skill
- learningTopic
- user
- createdAt
- updatedAt

Notes:

- Resources store references to external learning material.
- Resources are not hosted by Career Companion.
- A Resource does not automatically increase Skill or Goal progress.
- Future versions may use Resource activity or evidence to contribute to Skill progress.

---

## Resource Item

Represents an individual item or piece of content associated with a Resource.

Fields:

- `_id`
- resource
- title
- completed
- user
- createdAt
- updatedAt

Notes:

- Resource Items allow larger resources to be broken into smaller trackable items.
- Completing a Resource Item does not automatically represent Skill progress unless the future evidence/progress system defines it as meaningful evidence.

---

## Job Application

Stores job application information.

Fields:

- `_id`
- title
- company
- location
- status
- jobType
- salary
- notes
- applicationDate
- user
- createdAt
- updatedAt

Notes:

- A Job Application may optionally be associated with a Primary Goal.
- Job Applications represent the user's career opportunities and application pipeline.

---

## Interview Round

Stores interview stages belonging to a Job Application.

Fields:

- `_id`
- job
- roundName
- date
- time
- status
- result
- notes
- createdAt
- updatedAt

Notes:

- An Interview Round belongs to a Job Application.
- Multiple Interview Rounds can exist for the same Job Application.
- Interview date and time can later support upcoming interview functionality.

---

## Application Activity

Stores activities related to a Job Application.

Fields:

- `_id`
- job
- activity
- user
- createdAt
- updatedAt

Notes:

- Application Activities preserve the history of actions and events related to a Job Application.
- Activities may include application submission, status changes, interview activity, or follow-ups.

---

## Note

Stores important information that should not be forgotten.

Notes may eventually be associated with relevant career entities such as:

- Goals
- Skills
- Resources
- Job Applications
- Interview Rounds

**Status: Planned / Future Extension**

---

## Action Item

Stores a task that should be completed.

Examples:

- Practice SQL joins
- Revise OOP concepts
- Complete an assignment
- Prepare for an HR interview

Action Items may eventually be associated with:

- Goals
- Skills
- Resources
- Job Applications
- Interview Rounds

**Status: Planned / Future Extension**

---

## Relationships

- A User can have multiple Goals.
- A User can have multiple Skills.
- A User can have multiple Resources.
- A User can have multiple Job Applications.
- A Primary Goal can have multiple Secondary Goals.
- A Secondary Goal can be associated with multiple Skills.
- A Skill can contain multiple Learning Topics.
- A Skill can have multiple Resources.
- A Learning Topic can have multiple Resources.
- A Resource can have multiple Resource Items.
- A Job Application can optionally be associated with a Primary Goal.
- A Job Application can have multiple Interview Rounds.
- A Job Application can have multiple Application Activities.

---

## Current Progress Model

The current schema stores progress directly on:

- Goals
- Skills

Resources currently have learning-related state such as `completed`, but this does not automatically represent Skill or Goal progress.

The current model therefore does **not** automatically calculate:

```text
Resource
    ↓
Skill
    ↓
Secondary Goal
    ↓
Primary Goal
```
