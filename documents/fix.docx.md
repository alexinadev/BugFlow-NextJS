

| Role | Description | Permissions |
| :---- | :---- | :---- |
| Employee (Reporter) | Any staff member experiencing an IT issue | Submit bugs, view own tickets, add comments, mark resolved |
| IT Agent | Technical support staff member | View assigned tickets, update status, add resolution notes |
| IT Manager | Head of IT department | Full access: all tickets, assign agents, configure categories, view analytics, manage users |
| System Admin | Platform administrator | User management, system settings, access logs |

.pelase conside below ability

* Send automated notifications to reporters when their ticket status changes

* Send note  every user with step change

* With every note can upload images

* 

# **4\. User Stories**

## **4.1 Employee (Reporter) Stories**

| ID | As a... | I want to... | So that... | Priority |
| :---- | :---- | :---- | :---- | :---- |
| US-001 | Employee | Submit a bug report with title, description, category, and screenshots | IT is informed clearly about my issue | High |
| US-002 | Employee | See the current status of my submitted tickets | I know if my issue is being handled | High |
| US-003 | Employee | Receive a notification when my ticket status changes | I am kept informed without checking manually | High |
| US-004 | Employee | Add follow-up comments to my ticket | I can provide additional information if needed | Medium |
| US-005 | Employee | Mark my ticket as resolved if the issue was fixed | The IT team knows it can be closed | Medium |
| US-006 | Employee | Filter and search my past tickets | I can find previous issues easily | Low |

## **4.2 IT Manager Stories**

| ID | As a... | I want to... | So that... | Priority |
| :---- | :---- | :---- | :---- | :---- |
| US-007 | IT Manager | View all submitted tickets in a dashboard with filters | I can triage and prioritize efficiently | High |
| US-008 | IT Manager | Assign a ticket to a specific IT Agent | Workload is distributed appropriately | High |
| US-009 | IT Manager | Change the priority and status of any ticket | Critical issues are escalated immediately | High |
| US-010 | IT Manager | View analytics: open/closed tickets, avg resolution time, by department | I can identify trends and resource needs | High |
| US-011 | IT Manager | Add internal notes visible only to IT staff | Team communication stays in context | Medium |
| US-012 | IT Manager | Export ticket data to CSV or PDF | I can prepare management reports | Medium |
| US-013 | IT Manager | Configure bug categories and SLA rules | The system matches our processes | Medium |

## **4.3 IT Agent Stories**

| ID | As a... | I want to... | So that... | Priority |
| :---- | :---- | :---- | :---- | :---- |
| US-014 | IT Agent | See tickets assigned to me | I know what I need to work on | High |
| US-015 | IT Agent | Update the status and add resolution notes | The reporter and manager are informed of progress | High |
| US-016 | IT Agent | Request additional info from the reporter via comments | I have everything needed to solve the issue | Medium |

## **5.2 Ticket Management**

* Create ticket: title (required), description (required), category (required), subcategory, priority, attachments (images/logs up to 10MB each, max 5 files), affected device/location

* Ticket statuses: Open, In Progress, Pending Info, Resolved, Closed

* Auto-generate unique ticket ID (e.g., BUG-2026-00142)

* Full comment thread per ticket visible to relevant parties

* Internal notes visible only to IT staff

* Ticket history/audit log showing all status changes with timestamps and actors

