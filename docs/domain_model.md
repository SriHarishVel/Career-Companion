# Domain Model

## Primary Workflow

Career Companion is centered around a guided career journey.

The typical workflow is:

Primary Goal
→ Secondary Goals
→ Skills
→ Resources
→ Job Applications
→ Interview Rounds
→ Career Progress

Although standalone goals, skills, resources, and job applications can exist independently, the primary experience is built around helping users progress toward a defined career objective.

---

## User

Represents the owner of the account.

---

## Goal

Represents a career objective.

Goals are stored as a single entity and can be either:

* Primary Goal
* Secondary Goal

A Secondary Goal may reference a Primary Goal through a parent-child relationship.

Examples:

Primary Goals:

* Software Engineer (8+ LPA)
* Backend Engineer
* AI Engineer

Secondary Goals:

* Finish DSA
* Build Portfolio
* Complete Projects

---

## Skill

A capability required to achieve a goal.

Examples:

* Node.js
* React
* SQL
* DSA

---

## Learning Topic

A smaller unit of a skill.

Examples:

* Arrays
* Strings
* Trees

---

## Resource

A trusted learning material.

Examples:

* YouTube Playlist
* PDF
* Course
* Documentation
* Drive Link

---

## Job Application

Represents an application submitted to a company.

May optionally be associated with a career goal.

Examples:

* Zoho
* Infosys
* Cognizant

---

## Interview Round

Represents a stage within a job application.

Examples:

* Online Assessment
* Coding Test
* Aptitude Test
* Technical Interview
* HR Interview
* Assignment
* Group Discussion

---

## Note

Stores important information that should not be forgotten.

Examples:

* Questions asked
* Interview experience
* Important deadlines
* Preparation observations

---

## Action Item

Represents the next task that should be completed.

Examples:

* Practice SQL joins
* Revise OOP concepts
* Complete assignment
* Prepare for HR interview