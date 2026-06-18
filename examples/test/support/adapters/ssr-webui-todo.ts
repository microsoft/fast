import type { FilterValue, TodoAppAdapter } from "./types.js";

/**
 * Adapter for the SSR webui-todo-app. Layout:
 *
 *     <todo-app> #shadow
 *       <h1>FAST Todos</h1>
 *       <form><input/><button/></form>
 *       <select name="filter">
 *       <ul.todo-list>
 *         <li>
 *           <todo-item> #shadow
 *             <input type="checkbox" class="toggle"/>
 *             <span.description/>
 *             <button class="delete" aria-label="Remove item">×</button>
 */
export const ssrWebuiTodoAdapter: TodoAppAdapter = {
    name: "ssr-webui-todo",
    async goto(page) {
        await page.goto("/");
    },
    async waitForReady(page) {
        await page.locator("todo-app").waitFor();
        await page.locator("h1", { hasText: "FAST Todos" }).waitFor();
        await page.locator("form button[type=submit]", { hasText: "Add Todo" }).waitFor();
        // The SSR app hydrates asynchronously; wait for the flag set in
        // src/index.ts before issuing UI events that depend on event handlers.
        await page.waitForFunction(
            () => (window as unknown as { __todoHydrated?: boolean }).__todoHydrated,
            undefined,
            { timeout: 10_000 },
        );
    },
    async addTodo(page, text) {
        const input = page.locator("todo-app form input[type=text]");
        await input.fill(text);
        await input.dispatchEvent("input", { bubbles: true, composed: true });
        const addButton = page.locator("todo-app form button[type=submit]");
        await addButton.waitFor();
        await addButton.evaluate((button: HTMLButtonElement) => {
            if (button.disabled) {
                throw new Error("Add Todo button is still disabled after input.");
            }
        });
        await addButton.click();
        await page.locator("todo-item .description", { hasText: text }).waitFor();
    },
    async descriptions(page) {
        const raw = await page.locator("todo-item .description").allInnerTexts();
        return raw.map(s => s.trim());
    },
    async isDoneByDescription(page, description) {
        const item = page.locator("todo-item").filter({
            has: page.locator(".description", { hasText: description }),
        });
        return item.locator("input.toggle").isChecked();
    },
    async toggleByDescription(page, description) {
        const item = page.locator("todo-item").filter({
            has: page.locator(".description", { hasText: description }),
        });
        await item.locator("input.toggle").click();
    },
    async deleteByDescription(page, description) {
        const item = page.locator("todo-item").filter({
            has: page.locator(".description", { hasText: description }),
        });
        await item.locator("button.delete").click();
        await page
            .locator("todo-item .description", { hasText: description })
            .waitFor({ state: "detached" });
    },
    async setFilter(page, value: FilterValue) {
        await page.locator("select[name=filter]").selectOption(value);
    },
    async isAddDisabled(page) {
        return page.locator("todo-app form button[type=submit]").isDisabled();
    },
    async getCounts(page) {
        const active = await page.locator("todo-app footer .active-count").innerText();
        const completed = await page
            .locator("todo-app footer .completed-count")
            .innerText();
        return {
            active: parseLeadingInt(active),
            completed: parseLeadingInt(completed),
        };
    },
};

function parseLeadingInt(text: string): number {
    const match = text.trim().match(/^\d+/);
    return match ? Number(match[0]) : Number.NaN;
}
