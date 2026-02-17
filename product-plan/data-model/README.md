# Data Model

## Entities

### Ticket
The core entity representing a bug report submitted by a user. Contains details about the issue, current status, and resolution information. Tracks the entire lifecycle from submission to resolution.

### User
A person who interacts with the system, either as an end-user submitting bug reports or as an administrator managing tickets. Users have roles that determine their permissions and access levels.

### Comment
A piece of communication related to a ticket. Can be internal notes between administrators or public comments visible to the user who submitted the ticket. Provides context and updates about the ticket's progress.

### Notification
An automated message sent to users about changes to their tickets. Includes status updates, assignment notifications, and resolution summaries to keep users informed throughout the process.

## Relationships

- User submits many Tickets
- Ticket belongs to one User (the submitter)
- Ticket can be assigned to many Administrators (role-based Users)
- Many Administrators can manage many Tickets
- Ticket has many Comments
- Comment belongs to one Ticket
- Comment is created by one User (either end-user or administrator)
- Ticket generates many Notifications
- Notification belongs to one Ticket
- Notification is sent to one User
