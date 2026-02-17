# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>` or CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Or import in CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
```

## Font Usage

- **Headings:** Inter (Bold, SemiBold)
  - H1: `text-3xl font-bold`
  - H2: `text-2xl font-semibold`
  - H3: `text-xl font-semibold`

- **Body text:** Inter (Regular, Medium)
  - Body: `text-base font-normal`
  - Small: `text-sm`
  - Caption: `text-xs`

- **Code/technical:** IBM Plex Mono
  - Code blocks: `font-mono text-sm`
  - Technical data: `font-mono`
