# Domain Model

## Entity Relationships

Although each entity can exist independently, the primary workflow follows the relationship below.

Career Journey
→ Primary Goal
→ Secondary Goals
→ Skills
→ Resources
→ Topics
→ Applications
→ Selection Stages

Standalone goals, skills, and resources are supported for personal organization but are considered part of the user's personal library rather than the guided career journey.

## User

Represents the owner of the account.

---

## Primary Goal

The main career objective.

Examples:

* Software Engineer (8+ LPA)
* Backend Engineer
* AI Engineer

---

## Secondary Goal

Smaller objectives that support the primary goal.

Examples:

* Finish DSA
* Build Portfolio
* Complete Projects

---

Skill

A capability required to achieve a secondary goal.

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
* Drive Link

---

## Job Application

Represents an application to a company.

May optionally belong to a primary goal.

Examples:

* Zoho
* Infosys
* Cognizant

---

## Selection Stage

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
