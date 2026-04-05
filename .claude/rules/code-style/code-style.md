# Code Style Guide

This project uses Next.js 16.2.2, React 19.2.4, TypeScript 6.0.2, and Tailwind CSS v4. Follow these rules precisely.

---

## TypeScript

### Strict Mode
`strict: true` is always enabled. Never disable it or suppress errors with `@ts-ignore` / `@ts-expect-error` without a comment explaining why.

### No `any`
- Never use `any`. Use `unknown` for values of unknown shape, then narrow with type guards.
- Use `satisfies` to validate literal types while preserving the inferred type:
  ```ts
  const palette = {
    primary: "#4ade80",
    secondary: "#a3e635",
  } satisfies Record<string, string>;
  ```

### `NoInfer` for Generic Constraints
Use `NoInfer<T>` to prevent unintended type widening in generic functions:
```ts
function createStore<T>(initial: T, fallback: NoInfer<T>): T { ... }
```

### Discriminated Unions over Optional Properties
```ts
// Bad
type Result = { data?: User; error?: string };

// Good
type Result = { status: "ok"; data: User } | { status: "error"; error: string };
```

### Const Assertions
Use `as const` for fixed literal data:
```ts
const ROLES = ["admin", "member", "guest"] as const;
type Role = (typeof ROLES)[number];
```

### Template Literal Types
Use for typed string composition:
```ts
type Route = `/diary/${string}` | `/settings`;
```

### Naming
| Entity | Convention |
|--------|-----------|
| Components | `PascalCase` |
| Functions / variables | `camelCase` |
| Constants | `UPPER_SNAKE_CASE` |
| Types / Interfaces | `PascalCase` |
| Files (components) | `PascalCase.tsx` |
| Files (utilities) | `kebab-case.ts` |

---

## React 19

### Server Components by Default
Every component is a Server Component unless it needs interactivity. Add `"use client"` only when necessary (event handlers, browser APIs, hooks).

### Async Server Components
Fetch data directly in Server Components:
```tsx
// app/diary/[id]/page.tsx
export default async function DiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getEntry(id);
  return <DiaryView entry={entry} />;
}
```

### `use()` Hook
Use `use()` to unwrap Promises or Context in Client Components:
```tsx
"use client";
import { use } from "react";

export function DiaryView({ entryPromise }: { entryPromise: Promise<Entry> }) {
  const entry = use(entryPromise);
  return <p>{entry.content}</p>;
}
```

### Form State: `useActionState`
```tsx
"use client";
import { useActionState } from "react";

const [state, action, isPending] = useActionState(submitEntry, null);
```

### Optimistic UI: `useOptimistic`
```tsx
"use client";
import { useOptimistic } from "react";

const [optimisticEntries, addOptimistic] = useOptimistic(entries, (state, newEntry) => [
  ...state,
  newEntry,
]);
```

### `useFormStatus`
```tsx
"use client";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Saving…" : "Save"}</button>;
}
```

### `ref` as Prop (no `forwardRef`)
React 19 passes `ref` directly as a prop — do not use `forwardRef`:
```tsx
function Input({ ref, ...props }: React.ComponentProps<"input">) {
  return <input ref={ref} {...props} />;
}
```

### Context Provider Syntax
```tsx
// Bad
<ThemeContext.Provider value={theme}>

// Good
<ThemeContext value={theme}>
```

---

## Next.js 16 App Router

### File Conventions
| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI wrapper (doesn't re-render on navigation) |
| `page.tsx` | Route leaf, always a Server Component |
| `loading.tsx` | Suspense fallback for the route segment |
| `error.tsx` | Error boundary for the route segment (`"use client"`) |
| `not-found.tsx` | 404 UI for `notFound()` calls |
| `route.ts` | Route Handler (REST API) |
| `proxy.ts` | Intercepts requests before they reach the route (renamed from `middleware.ts` in Next.js 16) |

### Server Actions
Define in `app/actions/` with `"use server"` at the top of the file (not inline):
```ts
// app/actions/diary.ts
"use server";

export async function createEntry(formData: FormData) {
  const content = formData.get("content") as string;
  // validate, write to DB
}
```

### Route Handlers
```ts
// app/api/diary/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ entries: [] });
}
```

### Caching — `use cache` Directive
Use the `use cache` directive for cached data fetching:
```ts
"use cache";
import { cacheLife, cacheTag } from "next/cache";

export async function getEntries() {
  cacheLife("hours");
  cacheTag("entries");
  return db.select().from(entries);
}
```
Invalidate with `revalidateTag("entries")` in Server Actions.

### Streaming with Suspense
Wrap async Server Components in `<Suspense>` with a fallback:
```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <DiaryList />
    </Suspense>
  );
}
```

### Images, Fonts, Links
- Always use `next/image` for images (never `<img>`)
- Always use `next/link` for internal navigation (never `<a>`)
- Load fonts via `next/font/google` in `layout.tsx` — never import font CSS files

### Metadata
Export `metadata` or `generateMetadata` from `page.tsx` / `layout.tsx`:
```ts
export const metadata: Metadata = {
  title: "Sogon",
  description: "A private diary with an AI secret friend.",
};
```

### Dynamic Routes
```
app/diary/[id]/page.tsx         → /diary/123
app/diary/[...slug]/page.tsx    → /diary/a/b/c
app/diary/[[...slug]]/page.tsx  → /diary or /diary/a/b
```

---

## Tailwind CSS v4

### CSS-First Configuration
Never use `tailwind.config.js`. Configure in `globals.css` using the `@theme` block:
```css
@import "tailwindcss";

@theme inline {
  --color-primary: #4ade80;
  --font-sans: "Geist", sans-serif;
}
```

### Dark Mode
Use the `dark:` variant; rely on the OS preference (`@media (prefers-color-scheme: dark)`):
```tsx
<div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
```

### No Inline Styles for Design Tokens
Never use `style={{ color: "#4ade80" }}`. Always reference Tailwind utilities or CSS variables.

---

## Imports & Module Structure

### Path Aliases
Use `@/*` for all project imports. Never use relative paths like `../../utils`:
```ts
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
```

### Barrel Exports
Avoid barrel `index.ts` files unless the directory is a deliberate public API (e.g., a `ui/` component library). Prefer direct imports.

### Co-location
Keep related files together:
```
app/diary/[id]/
  page.tsx
  DiaryCard.tsx       ← component used only here
  actions.ts          ← Server Actions for this route
```

Shared utilities go in:
```
lib/          ← pure functions, helpers
components/   ← shared UI components
app/actions/  ← shared Server Actions
```
