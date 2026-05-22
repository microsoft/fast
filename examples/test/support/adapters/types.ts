import type { Page } from "@playwright/test";

export type FilterValue = "all" | "active" | "completed";

/**
 * Uniform interface for interacting with any of the example todo apps.
 *
 * Each adapter wraps the per-app DOM differences (e.g. CSR apps render
 * `<li class="todo">` inline, while the SSR app embeds a nested `<todo-item>`
 * shadow root per row) behind the same set of operations so the shared test
 * suite can run unchanged against every app.
 */
export interface TodoAppAdapter {
    readonly name: string;
    goto(page: Page): Promise<void>;
    waitForReady(page: Page): Promise<void>;
    addTodo(page: Page, text: string): Promise<void>;
    descriptions(page: Page): Promise<string[]>;
    isDoneByDescription(page: Page, description: string): Promise<boolean>;
    toggleByDescription(page: Page, description: string): Promise<void>;
    deleteByDescription(page: Page, description: string): Promise<void>;
    setFilter(page: Page, value: FilterValue): Promise<void>;
    isAddDisabled(page: Page): Promise<boolean>;
    getCounts(page: Page): Promise<{ active: number; completed: number }>;
}
