Software Requirements Specification (SRS)
Project Management Platform
Version: 1.1

Date: August 16, 2026

Status: Draft

Technology: Node.js + React.js

1. Overview
1.1 Purpose
The Project Management Platform is a web-based application that enables users and teams to create, organize, and manage projects and tasks in a centralized workspace.
The platform allows users to:
Register and authenticate
Create and manage projects
Create teams
Invite team members
Assign members to projects
Create and manage tasks
Track project and task progress
Collaborate with team members
Monitor project status and activity
1.2 Goals
The primary goals are:
Provide a simple project management experience.
Enable teams to collaborate on projects.
Provide clear task ownership and progress tracking.
Centralize project-related information.
Provide role-based access to projects and teams.
Deliver a Persian (فارسی) UI with a Notion-like minimal visual design.
Build a scalable architecture for future features.
1.3 Product Language & UI Direction
The product UI (dashboard and authenticated app shell) must be Persian by default.
The visual design must follow a Notion-inspired minimal aesthetic: clean surfaces, low visual noise, generous whitespace, subtle borders, and calm typography.
The UI must be RTL (right-to-left) throughout the authenticated application.

2. User Roles
The system should support the following roles.

A user may have different roles in different teams/projects.

3. Functional Requirements
3.1 Authentication
3.1.1 Registration
Users should be able to create an account.
Required fields:
First name
Last name
Email
Password
Confirm password
Acceptance Criteria
Email must be unique.
Password must meet minimum security requirements.
Password must be securely hashed.
User receives appropriate validation errors.
Successful registration creates a user account.
User can subsequently log in.

3.1.2 Login
Users should be able to authenticate using:
Email
Password
Acceptance Criteria
Invalid credentials must return an appropriate error.
Successful authentication returns a session/access token.
Authenticated users can access protected resources.
Passwords must never be returned through the API.

3.1.3 Logout
Users should be able to log out of their account.
The system should invalidate the user's active session/token where applicable.

3.1.4 Password Management
The system should support:
Forgot password
Reset password
Change password

4. User Profile
Authenticated users should be able to manage their profile.
Profile Fields
First name
Last name
Profile image
Email
Password
Timezone
Notification preferences
Requirements
Users can update their profile.
Users cannot change their email to an already registered email.
Sensitive operations should require authentication.

5. Team Management
5.1 Create Team
Users can create a team.
Required information:
Team name
Description
Optional logo
The creator automatically becomes the Team Owner.
Acceptance Criteria
Team name is required.
Team owner is automatically added as a team member.
Team receives a unique identifier.
Team appears in the user's workspace.

5.2 Team Members
Team admins should be able to:
View members
Invite members
Remove members
Change member roles
Team Member Roles
Owner
Admin
Member

6. Team Invitations
Users with appropriate permissions can invite other users.
Invitation Information
Email
Team
Role
Invited by
Invitation status
Expiration date
Invitation States
PENDING
ACCEPTED
REJECTED
EXPIRED
CANCELLED
Invitation Flow
Team Admin
    ↓
Enter email
    ↓
Create Invitation
    ↓
Send invitation
    ↓
User receives invitation
    ↓
Accept / Reject
    ↓
If accepted
    ↓
User becomes Team Member
Requirements
Invitation links must be unique.
Invitations should expire after a configurable period.
Duplicate active invitations should not be created.
Only authorized users can invite members.

7. Project Management
7.1 Create Project
Team members with appropriate permissions can create projects.
Project Fields
Name
Description
Team
Project owner
Status
Priority
Start date
Due date
Project members
Project Status
PLANNING
ACTIVE
ON_HOLD
COMPLETED
ARCHIVED
Project Priority
LOW
MEDIUM
HIGH
URGENT

7.2 Project List
Users should be able to view projects they have access to.
The project list should support:
Search
Filtering
Sorting
Pagination
Example filters:
Status
Priority
Owner
Due date
Team
 7.3 Project Details
The project detail page should contain:
Project information
Project members
Tasks
Task progress
Activity
Project statistics
Example:
Project
 ├── Overview
 ├── Tasks
 ├── Members
 ├── Activity
 └── Settings

8. Project Members
Project owners/admins can manage project members.
Actions:
Add member
Remove member
Change project role
A project member must belong to the associated team unless the system explicitly supports external collaborators.

9. Task Management
Tasks are the primary work unit inside a project.
9.1 Create Task
Users with appropriate permissions can create tasks.
Task Fields
Title
Description
Project
Assignee
Creator
Status
Priority
Due date
Start date
Labels
Estimated effort
Attachments

9.2 Task Status
The MVP should support:
TODO
IN_PROGRESS
IN_REVIEW
DONE
CANCELLED
The system should allow future customization of workflow statuses.

9.3 Task Priority
LOW
MEDIUM
HIGH
URGENT

9.4 Task Assignment
A task can be assigned to a project member.
Requirements:
Only project members can be assigned.
Users can change the assignee if they have permission.
The assignee should receive a notification.

9.5 Task Management
Users should be able to:
Create tasks
View tasks
Edit tasks
Delete tasks
Assign tasks
Change status
Change priority
Set due dates
Add labels
Add comments
Add attachments

10. Task Comments
Users with access to a project can comment on tasks.
Comments should contain:
Author
Content
Created date
Updated date
Users should be able to edit or delete their own comments.
Administrators may have permission to moderate comments.

11. Task Labels
Projects should support labels such as:
bug
feature
backend
frontend
documentation
urgent
Users can:
Create labels
Edit labels
Delete labels
Assign labels to tasks
Filter tasks by labels

12. Task Attachments
Users should be able to attach files to tasks.
Requirements:
File type validation
File size limitation
Secure file storage
Access control
File download authorization
The storage implementation should be abstracted so the system can support:
S3
MinIO
Cloud storage

13. Task Views
The platform should provide multiple ways to view tasks.
13.1 List View
Task | Assignee | Priority | Status | Due Date
13.2 Kanban View
TODO
 ├── Task A
 └── Task B

IN PROGRESS
 ├── Task C

IN REVIEW
 └── Task D

DONE
 └── Task E
13.3 Future Views
Potential future features:
Calendar
Gantt chart
Timeline

14. Notifications
The system should notify users about important events.
Examples:
Team invitation
Project invitation
Task assignment
Task status change
Task mention
New comment
Upcoming deadline
Notification channels:
MVP
In-app notifications
Future
Email
Push notifications
Slack
Microsoft Teams

15. Activity / Audit Log
The system should maintain an activity history for important actions.
Example:
John created task "Implement authentication"
Sarah assigned task to Ali
Ali changed task status from TODO → IN_PROGRESS
John added a comment
Activity events should contain:
Actor
Action
Entity
Entity ID
Timestamp
Metadata

16. Dashboard
The dashboard should provide an overview of the user's work.
The dashboard UI must be fully Persian (فارسی), RTL, and styled with the Notion-like minimal theme defined in section 16.1.
Dashboard Information
پروژه‌های من (My projects)
وظایف اختصاص‌داده‌شده (Assigned tasks)
وظایف با سررسید نزدیک (Tasks due soon)
وظایف عقب‌افتاده (Overdue tasks)
پروژه‌های اخیراً به‌روزرسانی‌شده (Recently updated projects)
فعالیت‌های اخیر (Recent activity)
Example (Persian labels):
داشبورد

پروژه‌ها: ۸

وظایف من
 ├── انجام نشده: ۱۲
 ├── در حال انجام: ۵
 ├── در حال بررسی: ۳
 └── انجام‌شده: ۲۴

عقب‌افتاده: ۲
سررسید امروز: ۴

16.1 UI / Theme Requirements (Notion-like Minimal)
Applies to the dashboard and the authenticated product UI.
Language & Direction
Default locale: fa-IR (Persian).
Layout direction: RTL.
All chrome UI strings (nav, buttons, empty states, filters, toasts, errors) must be Persian.
User-generated content remains as entered (no forced translation).
Dates/numbers should use Persian-friendly formatting where appropriate (e.g. locale-aware display).
Visual Style
Minimal, calm, content-first — similar to Notion.
Light neutral surfaces; avoid heavy gradients, glassmorphism, and loud accent colors.
Subtle 1px borders / soft dividers instead of heavy shadows.
Sparse use of color: status/priority accents only.
Clear hierarchy via typography and spacing, not decoration.
Layout
Sidebar + main content shell (Notion-like).
Generous whitespace; dense packing only where lists/tables require it.
Cards should be rare; prefer flat sections and simple lists.
Hover/focus states must remain understated.
Typography
Readable Persian font stack suitable for UI (e.g. Vazirmatn or equivalent).
Consistent type scale; no decorative display fonts in the product chrome.
Accessibility
Sufficient contrast for text and interactive controls.
Keyboard-focus visibility must not rely on flashy effects.
Acceptance Criteria
Dashboard loads in Persian with RTL layout.
Primary navigation and dashboard widgets use Persian labels.
Visual appearance matches a minimal Notion-like product feel (not a colorful dashboard kit).
No LTR layout regressions in the authenticated shell.

17. Search
The platform should provide global/project-level search.
Users should be able to search:
Projects
Tasks
Users
Comments
Labels
Search results must only contain resources the authenticated user has permission to access.

18. Authorization
The backend must enforce authorization at the API level.
Example:
User
 ↓
Team Membership
 ↓
Project Membership
 ↓
Resource Access
A user should not be able to access a project simply by knowing its ID.
Example
GET /projects/:projectId
The server must verify:
Authenticated?
      ↓
Member of Team?
      ↓
Has Project Access?
      ↓
Return Project
 19. Non-Functional Requirements
19.1 Performance
Target API response time:
Standard requests: < 300ms
Complex queries: < 1s
The system should support pagination for large datasets.

19.2 Security
The system must:
Hash passwords using a secure hashing algorithm.
Validate all input.
Protect against SQL/NoSQL injection.
Protect against XSS.
Protect against CSRF where applicable.
Implement rate limiting.
Validate uploaded files.
Enforce authorization server-side.
Avoid exposing sensitive information.
Store secrets in environment/configuration management.
Use HTTPS in production.

19.3 Availability
Target availability:
99.9%
The system should support:
Health checks
Graceful shutdown
Error handling
Logging
Monitoring

19.4 Scalability
The backend should be designed to support horizontal scaling.
Potential architecture:
┌──────────────┐
                 │ React Client │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ API / Nginx  │
                 └──────┬───────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      ┌─────────────┐       ┌─────────────┐
      │ Node.js API │       │ Node.js API │
      └──────┬──────┘       └──────┬──────┘
             │                     │
             └──────────┬──────────┘
                        ▼
                 ┌──────────────┐
                 │ PostgreSQL   │
                 └──────────────┘

20. Recommended Technology Stack
Frontend
React.js
TypeScript
React Router
TanStack Query
Zustand or Redux Toolkit
Tailwind CSS (RTL-aware utilities / logical properties)
Persian UI font (e.g. Vazirmatn)
i18n support if needed later; MVP may hardcode Persian UI strings
React Hook Form
Zod
Backend
Node.js
NestJS or Express.js
TypeScript
REST API
Prisma ORM
PostgreSQL
Infrastructure
Docker
Docker Compose
Nginx
Redis
S3/MinIO
Testing
Frontend:
Vitest
React Testing Library
Backend:
Jest
Supertest
E2E:
Playwright

21. High-Level Architecture
A modular monolith is recommended for the MVP rather than starting with microservices.
React.js
                       │
                       ▼
                  REST API
                       │
              ┌────────┴────────┐
              │                 │
        Authentication      Authorization
              │                 │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
     Users          Teams         Projects
                                      │
                                      ▼
                                    Tasks
                                      │
                         ┌────────────┼────────────┐
                         ▼            ▼            ▼
                     Comments      Labels      Attachments

22. Backend Modules
Recommended NestJS modules:
src/
├── auth/
├── users/
├── teams/
├── invitations/
├── projects/
├── project-members/
├── tasks/
├── comments/
├── labels/
├── attachments/
├── notifications/
├── activities/
├── dashboard/
└── common/

23. Core Data Model
High-level entities:
User
 │
 ├── TeamMember ─── Team
 │                    │
 │                    └── Project
 │                          │
 │                          ├── ProjectMember
 │                          │
 │                          └── Task
 │                                ├── Comment
 │                                ├── Label
 │                                └── Attachment
 │
 └── Notification
Main Entities
User
id
email
passwordHash
firstName
lastName
avatar
createdAt
updatedAt
Team
id
name
description
ownerId
createdAt
updatedAt
TeamMember
id
teamId
userId
role
joinedAt
Project
id
teamId
ownerId
name
description
status
priority
startDate
dueDate
createdAt
updatedAt
ProjectMember
id
projectId
userId
role
Task
id
projectId
creatorId
assigneeId
title
description
status
priority
dueDate
createdAt
updatedAt
Comment
id
taskId
authorId
content
createdAt
updatedAt
Invitation
id
teamId
email
invitedBy
role
token
status
expiresAt
createdAt
 24. API Requirements
Authentication
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
Users
GET    /api/v1/users/me
PATCH  /api/v1/users/me
PATCH  /api/v1/users/me/password
Teams
POST   /api/v1/teams
GET    /api/v1/teams
GET    /api/v1/teams/:id
PATCH  /api/v1/teams/:id
DELETE /api/v1/teams/:id
Team Members
GET    /api/v1/teams/:teamId/members
PATCH  /api/v1/teams/:teamId/members/:userId
DELETE /api/v1/teams/:teamId/members/:userId
Invitations
POST /api/v1/teams/:teamId/invitations
GET  /api/v1/invitations
POST /api/v1/invitations/:token/accept
POST /api/v1/invitations/:token/reject
Projects
POST   /api/v1/teams/:teamId/projects
GET    /api/v1/teams/:teamId/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
Tasks
POST   /api/v1/projects/:projectId/tasks
GET    /api/v1/projects/:projectId/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
Comments
GET    /api/v1/tasks/:taskId/comments
POST   /api/v1/tasks/:taskId/comments
PATCH  /api/v1/comments/:id
DELETE /api/v1/comments/:id

25. MVP Scope
The first release should focus on the core workflow:
Register
   ↓
Login
   ↓
Create Team
   ↓
Invite Members
   ↓
Create Project
   ↓
Add Project Members
   ↓
Create Tasks
   ↓
Assign Tasks
   ↓
Update Task Status
   ↓
Complete Project
MVP Features
[x] Registration
[x] Login
[x] User profile
[x] Team creation
[x] Team member management
[x] Team invitations
[x] Project creation
[x] Project management
[x] Project members
[x] Task CRUD
[x] Task assignment
[x] Task status
[x] Task priority
[x] Comments
[x] Labels
[x] Kanban board
[x] Basic notifications
[x] Activity log
[x] Dashboard (Persian UI, RTL)
[x] Notion-like minimal theme

26. Future Features
The following features are outside the initial MVP:
Gantt chart
Calendar
Time tracking
Recurring tasks
Custom workflows
Custom fields
File storage
Real-time collaboration
WebSocket notifications
Email notifications
Slack integration
GitHub integration
Microsoft Teams integration
Advanced reporting
Project templates
Automation/workflows
AI task assistant
Mobile application

27. Success Criteria
The MVP will be considered successful when a user can complete the following workflow without administrator intervention:
Register → Create Team → Invite Member → Create Project → Add Member → Create Task → Assign Task → Update Task → Complete Task
Additionally:
Unauthorized users cannot access private projects.
Team/project permissions are correctly enforced.
Dashboard and authenticated UI are Persian (RTL) with a Notion-like minimal theme.
Core APIs are tested.
Critical user flows have E2E coverage.
Application can be deployed using Docker.
Application provides basic logging and health monitoring.