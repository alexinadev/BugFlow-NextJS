# Client Component Directive

Mark interactive UI components with 'use client' to enable hooks and interactivity.

## When to Use 'use client'

Add 'use client' at the top of component files that:
- Use React hooks (useState, useEffect, useContext, etc.)
- Require user interaction (forms, buttons, modals)
- Access browser APIs (localStorage, etc.)
- Bind to `onClick`, `onChange`, etc.

## Pattern

```tsx
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Click me</button>
}
```

## Note

All components in this codebase are client components because they require interactivity. Pure server components are not currently used.
