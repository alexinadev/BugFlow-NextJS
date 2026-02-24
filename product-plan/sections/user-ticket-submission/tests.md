# Test Instructions: User Ticket Submission

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Test the bug report submission form that captures comprehensive issue details with progressive disclosure.

## User Flow Tests

### Flow 1: Submit a New Bug Report

**Scenario:** User successfully submits a bug report with all required fields

**Setup:**
- User is on the submission form page

**Steps:**
1. User enters title "Test bug"
2. User enters description "This is a test description"
3. User adds step "Open the app"
4. User selects severity "Major"
5. User enters name "Test User"
6. User enters email "test@example.com"
7. User clicks "Submit Bug Report"

**Expected Results:**
- [ ] onSubmit callback is called with correct ticket data
- [ ] Form data includes all entered values
- [ ] Success message appears

### Flow 2: Validation Errors

**Scenario:** User tries to submit without required fields

**Setup:**
- User is on the submission form page

**Steps:**
1. User clicks "Submit Bug Report" without filling any fields

**Expected Results:**
- [ ] Error message appears for title: "Title is required"
- [ ] Error message appears for description: "Description is required"
- [ ] Error message appears for email: "Email is required"
- [ ] Form is not submitted

### Flow 3: Invalid Email

**Scenario:** User enters invalid email format

**Steps:**
1. User enters an invalid email "not-an-email"
2. User clicks "Submit Bug Report"

**Expected Results:**
- [ ] Error message appears: "Please enter a valid email address"

## Empty State Tests

Not applicable for submission form - users are creating new data.

## Component Tests

### TicketSubmissionForm

**Renders correctly:**
- [ ] Title input field is visible
- [ ] Description textarea is visible
- [ ] Steps to reproduce section is visible
- [ ] Severity dropdown shows all options
- [ ] Environment details section is collapsible
- [ ] Submit button is visible

**Form interactions:**
- [ ] Can add new step to reproduce
- [ ] Can remove step (when more than one)
- [ ] Can expand/collapse environment details
- [ ] Can upload attachments via drag-and-drop
- [ ] Can remove attachments

## Edge Cases

- [ ] Very long title text truncates properly
- [ ] Many steps to reproduce (10+) work correctly
- [ ] Large file upload shows progress
- [ ] Invalid file type shows error

## Sample Test Data

```typescript
const validSubmission = {
  title: "Login page fails to load",
  description: "The login page does not load correctly on mobile",
  stepsToReproduce: ["Open Chrome on Android", "Navigate to /login"],
  severity: "major" as const,
  userEmail: "user@example.com",
  userFullName: "Test User",
  environmentDetails: {
    browser: "Chrome",
    browserVersion: "121.0",
    os: "Android",
    osVersion: "13",
    deviceType: "Mobile" as const,
    screenResolution: "1080x2340",
    windowSize: "393x852"
  }
};
```
