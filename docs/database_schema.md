# Database Schema

## User

Stores account information.

Fields:

* id
* name
* email
* password_hash
* created_at
* updated_at

---

## Primary Goal

Stores the user's main career objective.

Fields:

* id
* user_id
* title
* target_role
* target_package
* target_company
* status
* created_at
* updated_at

---

## Secondary Goal

Stores smaller goals that support the primary goal.

Fields:

* id
* primary_goal_id
* title
* status
* created_at
* updated_at

---

## Skill

Stores skills required for the primary goal.

Fields:

* id
* name
* status
* progress_percentage

---

## Resource

Stores learning resources.

Fields:

* id
* skill_id
* title
* type
* link
* trusted_source
* status
* progress_percentage

---

## Topic

Stores smaller learning units inside a resource.

Fields:

* id
* resource_id
* title
* status
* notes

---

## Application

Stores job applications.

Fields:

* id
* user_id
* company
* role
* date_applied
* status
* is_goal_aligned
* referral
* notes

---

## Interview Round

Stores interview stages.

Fields:

* id
* application_id
* round_name
* date
* status
* result
* notes
