**# Database Schema**

**## User**

Stores account information.

Fields:

- _id
- fullName
- email
- password
- createdAt
- updatedAt

**---**

**## Goal**

Stores both primary and secondary goals.

Fields:

- \_id
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

- Primary goals have `goalType = "Primary"` and `parentGoal = null`.
- Secondary goals have `goalType = "Secondary"` and reference their parent through `parentGoal`.

**---**

**## Skill**

Stores skills associated with secondary goals.

Fields:

- \_id
- name
- level
- progress
- secondaryGoal
- user
- createdAt
- updatedAt

**---**

**## Resource**

Stores external learning resources associated with skills.

Fields:

- \_id
- title
- type
- url
- description
- favorite
- completed
- skill
- user
- createdAt
- updatedAt

Notes:

- Resources currently store references to external learning material.
- A Resource does not automatically increase Skill or Goal progress.
- Future versions may use resource activity or evidence to contribute to Skill progress.

**---**

**## Job**

Stores job applications.

Fields:

- \_id
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

**---**

**## Interview Round**

Stores interview stages.

**\*\*Planned\*\***

Fields:

- \_id
- job
- roundName
- date
- status
- result
- notes
- createdAt
- updatedAt

**---**

**## Relationships**

- A User can have multiple Goals.
- A User can have multiple Skills.
- A User can have multiple Resources.
- A Primary Goal can have multiple Secondary Goals.
- A Secondary Goal can be associated with multiple Skills.
- A Skill can have multiple Resources.
- A Job can have multiple Interview Rounds.

**---**

**## Future Progress Model**

The current schema stores progress directly on Goals and Skills.

The planned direction is:

- Resource activity and evidence can contribute to Skill progress.
- Skill progress can contribute to Secondary Goal progress.
- Secondary Goal progress can contribute to Primary Goal progress.

The exact calculation and weighting rules are not yet defined.

A saved Resource or linked external resource should not by itself be treated as evidence of learning.
