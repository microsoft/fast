import { test as base } from "@playwright/test";
import { getAdapter } from "./adapters/index.js";
import type { TodoAppAdapter } from "./adapters/types.js";

/**
 * Playwright test fixture that resolves the per-project TodoAppAdapter so the
 * same `tests/todo.pw.spec.ts` suite can run against every example app.
 */
export const test = base.extend<{ adapter: TodoAppAdapter }>({
    adapter: async (
        // Playwright's fixture signature requires the destructured first
        // argument even when no upstream fixtures are consumed.
        // biome-ignore lint/correctness/noEmptyPattern: see comment above
        {},
        use,
        testInfo,
    ) => {
        await use(getAdapter(testInfo.project.name));
    },
});

export { expect } from "@playwright/test";
