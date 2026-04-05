# Testing Guide

## Philosophy: Classicist (Detroit-School) Testing

We follow the **classicist** style of TDD, not the mockist (London) style.

| Aspect | Classicist (our approach) | Mockist (avoid) |
|--------|--------------------------|-----------------|
| Collaborators | Use real implementations | Replace with mocks |
| Focus | Observable behavior | Interactions between objects |
| Coupling | Tests don't know internals | Tests know call sequences |
| Refactor safety | High — internals can change freely | Low — mocks break on refactors |

**Core rules:**
- Test what a unit *does*, not *how* it does it.
- Use real collaborators whenever they are fast and deterministic.
- Only mock at true system boundaries: network, database, external APIs, time.
- Never mock just to make a test easier to write. If setup is painful, the design is wrong.

---

## Test Pyramid

```
         /\
        /E2E\          few — critical user journeys only
       /------\
      /Integr. \       moderate — API routes, DB queries, multi-component flows
     /----------\
    /    Unit    \     many — pure functions, utils, hooks, isolated components
   /--------------\
```

Aim for roughly **70% unit / 20% integration / 10% E2E** by count.

---

## Tooling

| Layer | Tool |
|-------|------|
| Unit & integration | **Vitest** |
| Component rendering | **React Testing Library** |
| E2E | **Playwright** |

### Installation (reference)
```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom vite-tsconfig-paths
pnpm add -D playwright @playwright/test
```

### `vitest.config.ts`
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
});
```

### `tests/setup.ts`
```ts
import "@testing-library/jest-dom";
```

---

## File Naming & Location

| Test type | File pattern | Location |
|-----------|-------------|----------|
| Unit | `*.test.ts` / `*.test.tsx` | Next to the source file |
| Integration | `*.test.ts` | `tests/integration/` |
| E2E | `*.spec.ts` | `tests/e2e/` |

```
app/
  lib/
    format.ts
    format.test.ts          ← unit test lives next to source
  components/
    DiaryCard.tsx
    DiaryCard.test.tsx
tests/
  integration/
    diary-api.test.ts
  e2e/
    create-entry.spec.ts
```

---

## Unit Tests

Test pure functions, utilities, custom hooks, and single components with their real dependencies.

### Structure: Arrange — Act — Assert
```ts
// lib/format.test.ts
import { formatRelativeDate } from "./format";

describe("formatRelativeDate", () => {
  it("returns 'Today' for the current date", () => {
    // Arrange
    const today = new Date();

    // Act
    const result = formatRelativeDate(today);

    // Assert
    expect(result).toBe("Today");
  });

  it("returns 'Yesterday' for the previous day", () => {
    const yesterday = new Date(Date.now() - 86_400_000);
    expect(formatRelativeDate(yesterday)).toBe("Yesterday");
  });
});
```

### Component Tests (React Testing Library)
Test components through the user's perspective — rendered output, not internals.

```tsx
// components/DiaryCard.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DiaryCard } from "./DiaryCard";

describe("DiaryCard", () => {
  it("displays the entry content", () => {
    render(<DiaryCard content="Had a great day" date={new Date()} />);
    expect(screen.getByText("Had a great day")).toBeInTheDocument();
  });

  it("calls onDelete when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<DiaryCard content="..." date={new Date()} onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledOnce();
  });
});
```

### What NOT to query by
- Never query by CSS class or component implementation detail.
- Prefer (in order): `getByRole` → `getByLabelText` → `getByText` → `getByTestId`.

### Mocking time
Use Vitest's fake timers for date-sensitive tests:
```ts
beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });
```

---

## Integration Tests

Test multiple real units working together: API routes, database interactions, multi-step flows.

Use a **real test database** (local Supabase or a separate test project). Never mock the database.

### API Route Integration Test
```ts
// tests/integration/diary-api.test.ts
import { GET, POST } from "@/app/api/diary/route";
import { NextRequest } from "next/server";

describe("GET /api/diary", () => {
  it("returns an empty array when no entries exist", async () => {
    const request = new NextRequest("http://localhost/api/diary");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.entries).toEqual([]);
  });
});
```

### When to use mocks in integration tests
Only mock at true boundaries: Anthropic AI SDK calls, Supabase auth tokens, third-party webhooks. Mock at the module boundary, not inside implementations:
```ts
vi.mock("@anthropic-ai/sdk", () => ({
  Anthropic: vi.fn(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({ content: [{ text: "Nice entry!" }] }),
    },
  })),
}));
```

---

## E2E Tests (Playwright)

Test complete user journeys through a running browser against the actual app. Keep E2E tests narrow — only cover critical paths.

```ts
// tests/e2e/create-entry.spec.ts
import { test, expect } from "@playwright/test";

test("user can write and save a diary entry", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /new entry/i }).click();

  await page.getByLabel("Content").fill("Went for a walk today.");
  await page.getByRole("button", { name: /save/i }).click();

  await expect(page.getByText("Went for a walk today.")).toBeVisible();
});
```

### Playwright config
```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Test Naming

Write test names as sentences describing behavior, not implementation:

```ts
// Bad
it("handleSubmit calls API", ...);
it("test error state", ...);

// Good
it("shows a validation error when content is empty", ...);
it("redirects to the home page after successful submission", ...);
```

Use `describe` blocks to group by subject, then `it` for each behavior:
```ts
describe("DiaryForm", () => {
  describe("when the form is submitted with valid data", () => {
    it("calls the create action with the entry content", ...);
    it("resets the form after submission", ...);
  });

  describe("when the form is submitted with empty content", () => {
    it("shows an inline validation error", ...);
    it("does not call the create action", ...);
  });
});
```

---

## What Not to Test

- Implementation details: private functions, internal state, method call sequences.
- Third-party libraries: trust that React, Next.js, and Supabase work correctly.
- Purely static markup with no behavior.
- Trivial getters/setters with no logic.
