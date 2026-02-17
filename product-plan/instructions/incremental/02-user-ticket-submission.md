---

# Milestone 2: User Ticket Submission

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

## Goal

Implement the User Ticket Submission feature — a bug report form with environment detection for end-users.

## Overview

A single-page bug report form that captures comprehensive issue details with progressive disclosure. Users submit reports with title, description, steps to reproduce, and optional attachments. The form includes auto-detected environment details and severity assessment.

**Key Functionality:**
- Submit bug reports with title, description, steps to reproduce
- Auto-detect and display environment details (browser, OS, device)
- Upload attachments (screenshots, videos)
- Select severity level (Blocking, Major, Minor, Suggestion)
- Form validation with inline error messages
- Preview submission before submitting

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/user-ticket-submission/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/user-ticket-submission/components/`:

- `TicketSubmissionForm.tsx` — Main submission form component

### Data Layer

The components expect these data shapes:

```typescript
interface EnvironmentDetails {
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  deviceType: 'Mobile' | 'Desktop' | 'Tablet'
  screenResolution: string
  windowSize: string
}

interface Ticket {
  id: string
  title: string
  description: string
  stepsToReproduce: string[]
  severity: 'blocking' | 'major' | 'minor' | 'suggestion'
  status: 'pending_verification' | 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
  userEmail: string
  userFullName: string
  environmentDetails: EnvironmentDetails
  attachments: Attachment[]
}
```

### Callbacks

Wire up these user actions:

- `onSubmit` — Called when user submits the form with ticket data
- `onCancel` — Called when user clicks cancel
- `onPreview` — Called when user wants to preview their submission

### Empty States

- **No data yet:** Not applicable for submission form (new submission)
- **Validation errors:** Show inline error messages for required fields
- **Submission success:** Redirect to ticket receipt/tacking page

## Files to Reference

- `product-plan/sections/user-ticket-submission/README.md` — Feature overview
- `product-plan/sections/user-ticket-submission/tests.md` — Test-writing instructions
- `product-plan/sections/user-ticket-submission/components/` — React components
- `product-plan/sections/user-ticket-submission/types.ts` — TypeScript interfaces
- `product-plan/sections/user-ticket-submission/sample-data.json` — Test data

## Expected User Flows

### Flow 1: Submit a New Bug Report

1. User navigates to `/submit`
2. User fills in the issue title
3. User enters a detailed description
4. User adds steps to reproduce (1+ steps)
5. User optionally expands Environment Details
6. User selects severity level
7. User optionally adds attachments
8. User fills in their name and email
9. User clicks "Submit Bug Report"
10. **Outcome:** Ticket is created, user sees confirmation with tracking link

### Flow 2: Validation Errors

1. User tries to submit without required fields
2. **Outcome:** Inline validation errors appear for missing fields

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Form renders correctly with all fields
- [ ] Form validation works for all required fields
- [ ] Environment details auto-detection works
- [ ] File upload works for images/videos
- [ ] Submission creates ticket and shows confirmation
- [ ] Responsive on mobile
