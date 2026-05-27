import { expect, test } from "../support/fixtures.js";

function uniqueText(prefix: string): string {
    return `${prefix} ${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}

test.describe("Todo app", () => {
    test.beforeEach(async ({ page, adapter }) => {
        await adapter.goto(page);
        await adapter.waitForReady(page);
    });

    test("renders the 'FAST Todos' heading", async ({ page }) => {
        await expect(page.locator("h1")).toHaveText("FAST Todos");
    });

    test("disables the Add Todo button when the input is empty", async ({
        page,
        adapter,
    }) => {
        await expect(page.locator("todo-app").first()).toBeVisible();
        expect(await adapter.isAddDisabled(page)).toBe(true);
    });

    test("adds a new todo via the form", async ({ page, adapter }) => {
        const text = uniqueText("add");
        try {
            await adapter.addTodo(page, text);
            expect(await adapter.descriptions(page)).toContain(text);
        } finally {
            await adapter.deleteByDescription(page, text).catch(() => {});
        }
    });

    test("toggles a todo's done state", async ({ page, adapter }) => {
        const text = uniqueText("toggle");
        try {
            await adapter.addTodo(page, text);
            expect(await adapter.isDoneByDescription(page, text)).toBe(false);

            await adapter.toggleByDescription(page, text);
            await expect.poll(() => adapter.isDoneByDescription(page, text)).toBe(true);

            await adapter.toggleByDescription(page, text);
            await expect.poll(() => adapter.isDoneByDescription(page, text)).toBe(false);
        } finally {
            await adapter.deleteByDescription(page, text).catch(() => {});
        }
    });

    test("deletes a todo", async ({ page, adapter }) => {
        const text = uniqueText("delete");
        await adapter.addTodo(page, text);
        expect(await adapter.descriptions(page)).toContain(text);

        await adapter.deleteByDescription(page, text);
        expect(await adapter.descriptions(page)).not.toContain(text);
    });

    test("filters items by active and completed state", async ({ page, adapter }) => {
        const activeText = uniqueText("active");
        const completedText = uniqueText("completed");
        try {
            await adapter.addTodo(page, activeText);
            await adapter.addTodo(page, completedText);
            await adapter.toggleByDescription(page, completedText);
            await expect
                .poll(() => adapter.isDoneByDescription(page, completedText))
                .toBe(true);

            await adapter.setFilter(page, "active");
            await expect
                .poll(() => adapter.descriptions(page))
                .toEqual(expect.arrayContaining([activeText]));
            await expect
                .poll(() => adapter.descriptions(page))
                .not.toContain(completedText);

            await adapter.setFilter(page, "completed");
            await expect
                .poll(() => adapter.descriptions(page))
                .toEqual(expect.arrayContaining([completedText]));
            await expect.poll(() => adapter.descriptions(page)).not.toContain(activeText);

            await adapter.setFilter(page, "all");
            await expect
                .poll(() => adapter.descriptions(page))
                .toEqual(expect.arrayContaining([activeText, completedText]));
        } finally {
            await adapter.setFilter(page, "all").catch(() => {});
            await adapter.deleteByDescription(page, activeText).catch(() => {});
            await adapter.deleteByDescription(page, completedText).catch(() => {});
        }
    });

    test("updates the footer active and completed counts", async ({ page, adapter }) => {
        const first = uniqueText("count-1");
        const second = uniqueText("count-2");
        let firstDeleted = false;
        try {
            const baseline = await adapter.getCounts(page);

            await adapter.addTodo(page, first);
            await adapter.addTodo(page, second);
            await expect
                .poll(() => adapter.getCounts(page))
                .toEqual({
                    active: baseline.active + 2,
                    completed: baseline.completed,
                });

            await adapter.toggleByDescription(page, first);
            await expect
                .poll(() => adapter.getCounts(page))
                .toEqual({
                    active: baseline.active + 1,
                    completed: baseline.completed + 1,
                });

            await adapter.deleteByDescription(page, first);
            firstDeleted = true;
            await expect
                .poll(() => adapter.getCounts(page))
                .toEqual({
                    active: baseline.active + 1,
                    completed: baseline.completed,
                });
        } finally {
            if (!firstDeleted) {
                await adapter.deleteByDescription(page, first).catch(() => {});
            }
            await adapter.deleteByDescription(page, second).catch(() => {});
        }
    });
});
