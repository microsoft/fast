import type { Page } from "@playwright/test";
import type { FilterValue, TodoAppAdapter } from "./types.js";

/**
 * Adapter for the CSR apps (csr/todo-app and csr/todo-mobx-app) which share
 * the same shadow-DOM structure:
 *
 *     <todo-app> #shadow
 *       <h1>FAST Todos</h1>
 *       <todo-form> #shadow <form><input/><button/></form>
 *       <select name="filter">
 *       <ul.todo-list>
 *         <li.todo>
 *           <input type="checkbox"/>
 *           <span.description/>
 *           <button aria-label="Remove item">×</button>
 */
export function createCsrAdapter(name: string): TodoAppAdapter {
    const itemFor = (page: Page, description: string) =>
        page.locator("li.todo").filter({
            has: page.locator(".description", { hasText: description }),
        });

    return {
        name,
        async goto(page) {
            await page.goto("/");
        },
        async waitForReady(page) {
            await page.locator("todo-app").waitFor();
            await page.locator("h1", { hasText: "FAST Todos" }).waitFor();
            await page
                .locator("todo-form button[type=submit]", { hasText: "Add Todo" })
                .waitFor();
        },
        async addTodo(page, text) {
            const input = page.locator("todo-form input[type=text]");
            await input.fill(text);
            await page.locator("todo-form button[type=submit]").click();
            await page.locator("li.todo .description", { hasText: text }).waitFor();
        },
        async descriptions(page) {
            const raw = await page.locator("li.todo .description").allInnerTexts();
            return raw.map(s => s.trim());
        },
        async isDoneByDescription(page, description) {
            return itemFor(page, description).locator("input[type=checkbox]").isChecked();
        },
        async toggleByDescription(page, description) {
            await itemFor(page, description).locator("input[type=checkbox]").click();
        },
        async deleteByDescription(page, description) {
            const item = itemFor(page, description);
            await item.locator("button[aria-label='Remove item']").click();
            await page
                .locator("li.todo .description", { hasText: description })
                .waitFor({ state: "detached" });
        },
        async setFilter(page, value: FilterValue) {
            await page.locator("select[name=filter]").selectOption(value);
        },
        async isAddDisabled(page) {
            return page.locator("todo-form button[type=submit]").isDisabled();
        },
        async getCounts(page) {
            return readCounterFooter(page, "todo-app");
        },
    };
}

async function readCounterFooter(
    page: Page,
    rootSelector: string,
): Promise<{ active: number; completed: number }> {
    const active = await page.locator(`${rootSelector} footer .active-count`).innerText();
    const completed = await page
        .locator(`${rootSelector} footer .completed-count`)
        .innerText();
    return {
        active: parseLeadingInt(active),
        completed: parseLeadingInt(completed),
    };
}

function parseLeadingInt(text: string): number {
    const match = text.trim().match(/^\d+/);
    return match ? Number(match[0]) : Number.NaN;
}
