# User Ticket Submission

## Overview

A single-page bug report form that captures comprehensive issue details with progressive disclosure. Users submit reports with title, description, steps to reproduce, and optional attachments. The form includes auto-detected environment details and severity assessment, followed by email verification.

## User Flows

- User navigates to User Ticket Submission section via top navigation
- Form loads with auto-detected environment details (browser, OS, window size)
- User fills required fields: Title, Description, Steps to Reproduce, and optional Attachments
- User optionally expands Environment Details to review/edit auto-detected info
- User selects severity level (Blocking, Major, Minor, Suggestion) and submits
- System sends verification email to user's provided email address
- User is redirected to unique ticket receipt page showing Ticket ID and tracking link
- User can return to this page anytime to view updates on their ticket

## Data Used

**Entities:** Ticket, User, Attachment, EnvironmentDetails

**From global model:**
- Ticket — Core entity for bug reports
- User — End users submitting tickets

## Components Provided

- `TicketSubmissionForm.tsx` — Main submission form with all fields

## Callback Props

| Callback | Description |
|----------|-------------|
| `onSubmit` | Called when user submits the form with ticket data |
| `onCancel` | Called when user clicks cancel |
| `onPreview` | Called when user wants to preview their submission |
