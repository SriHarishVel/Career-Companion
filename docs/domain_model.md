**# Domain Model**

**## Primary Workflow**

Career Companion is centered around a guided career journey.

The typical workflow is:

Primary Goal

Secondary Goals

Skills

Learning Topics

Resources

Job Applications

Interview Rounds

Career Progress

Although standalone goals, skills, resources, and job applications can exist independently, the primary experience is built around helping users progress toward a defined career objective.

**---**

**## User**

Represents the owner of the account.

**---**

**## Goal**

Represents a career objective.

Goals are stored as a single entity and can be either:

- Primary Goal
- Secondary Goal

A Secondary Goal may reference a Primary Goal through a parent-child relationship.

Primary Goals represent larger career objectives.

Secondary Goals break Primary Goals into smaller objectives that contribute toward the larger goal.

Examples:

Primary Goals:

- Software Engineer (8+ LPA)
- Backend Engineer
- AI Engineer

Secondary Goals:

- Finish DSA
- Build Portfolio
- Complete Projects

**---**

**## Skill**

Represents a capability required to achieve a goal.

A Skill may be associated with a Secondary Goal and can be supported by relevant learning resources.

Examples:

- Node.js
- React
- SQL
- DSA

**---**

**## Learning Topic**

Represents a smaller unit or area within a Skill.

Learning Topics can help organize a Skill into more specific areas that can be studied or practiced.

Examples:

- Arrays
- Strings
- Trees

**---**

**## Resource**

Represents an external learning material or reference associated with a Skill or Learning Topic.

Resources are not hosted by Career Companion.

Examples:

- YouTube Playlist
- PDF
- Course
- Documentation
- Drive Link

Saving or associating a Resource does not automatically increase progress.

A Resource currently represents learning material rather than evidence that the user has completed or understood that material.

Future versions may track meaningful activity or evidence associated with Resources so that learning activity can contribute to Skill progress.

**---**

**## Job Application**

Represents an application submitted to a company.

A Job Application may optionally be associated with a career goal.

Examples:

- Zoho
- Infosys
- Cognizant

**---**

**## Interview Round**

Represents a stage within a Job Application.

Examples:

- Online Assessment
- Coding Test
- Aptitude Test
- Technical Interview
- HR Interview
- Assignment
- Group Discussion

**---**

**## Note**

Stores important information that should not be forgotten.

Examples:

- Questions asked
- Interview experience
- Important deadlines
- Preparation observations

**---**

**## Action Item**

Represents the next task that should be completed.

Examples:

- Practice SQL joins
- Revise OOP concepts
- Complete assignment
- Prepare for HR interview

**---**

**## Entity Relationships**

A Secondary Goal may be associated with a Primary Goal.

A Secondary Goal may be supported by one or more Skills.

A Skill may contain multiple Learning Topics.

A Skill or Learning Topic may have multiple associated Resources.

A Job Application may optionally be associated with a Primary Goal.

Interview Rounds belong to a Job Application.

Notes and Action Items can support the user's planning and career activities.

**---**

**## Progress Relationships**

Progress should eventually reflect the relationships between career entities.

Resource activity and evidence can contribute to Skill progress.

Skill progress can contribute to Secondary Goal progress.

Secondary Goal progress can contribute to Primary Goal progress.

Simply creating or saving a Resource does not increase progress.

Resources currently provide external learning material. Progress should only be derived from meaningful activity or evidence once the corresponding functionality is implemented.

The exact progress calculation and weighting rules will be defined separately from the domain model.
