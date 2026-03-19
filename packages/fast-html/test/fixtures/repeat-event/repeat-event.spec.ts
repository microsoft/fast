import { expect, test } from "@playwright/test";
import type { RepeatEventElement } from "./main.js";

test.describe("f-repeat with event bindings and inner f-when", () => {
    test("@click on button inside f-repeat should fire after hydration", async ({
        page,
    }) => {
        await page.goto("/fixtures/repeat-event/");

        const element = page.locator("repeat-event-element");
        const buttons = element.locator("button.toggle");

        // All 3 buttons should be rendered from SSR
        await expect(buttons).toHaveCount(3);

        // Debug: inspect how the event binding resolved
        const debug = await element.evaluate((el) => {
            const sr = el.shadowRoot!;
            const btn = sr.querySelector("button.toggle") as any;
            // Collect all keys stored on the button by FAST
            const fastKeys = Object.keys(btn).filter(
                (k) => k.startsWith("fast") || k.startsWith("__") || k.length > 20,
            );
            // Check for the controller reference stored by event binding
            const allKeys = Object.getOwnPropertyNames(btn);
            const controllerKeys = allKeys.filter((k) => {
                try {
                    return btn[k] && typeof btn[k] === "object" && "source" in btn[k];
                } catch {
                    return false;
                }
            });
            return {
                fastKeys,
                controllerKeys,
                allNonStandardKeys: allKeys.filter(
                    (k) =>
                        !k.startsWith("on") &&
                        !HTMLButtonElement.prototype.hasOwnProperty(k) &&
                        k !== "constructor",
                ).slice(0, 10),
            };
        });
        console.log("Button FAST state:", JSON.stringify(debug));

        // Click the first button — event binding should work
        await buttons.nth(0).click();

        // Check for console messages
        const messages: string[] = [];
        page.on("console", (msg) => messages.push(msg.text()));

        await buttons.nth(0).click();
        await page.waitForTimeout(200);

        console.log("Console messages after click:", messages);

        // Verify the click handler fired
        const lastClicked = await element.evaluate(
            (el: RepeatEventElement) => el.lastClicked,
        );
        console.log("lastClicked:", lastClicked);
        expect(lastClicked).toBe("Alpha");
    });

    test("clicking button should toggle expanded and show detail via f-when", async ({
        page,
    }) => {
        await page.goto("/fixtures/repeat-event/");

        const element = page.locator("repeat-event-element");
        const buttons = element.locator("button.toggle");
        const details = element.locator("span.detail");

        // Initially no details visible (all expanded=false)
        await expect(details).toHaveCount(0);

        // Click Alpha toggle
        await buttons.nth(0).click();

        // f-when should re-evaluate: Alpha's detail should appear
        await expect(details).toHaveCount(1);
        await expect(details.nth(0)).toHaveText("Details for Alpha");

        // Verify the item's expanded state
        await expect(
            element.evaluate((el: RepeatEventElement) => {
                return el.items.map((i) => ({
                    name: i.name,
                    expanded: i.expanded,
                }));
            }),
        ).resolves.toEqual([
            { name: "Alpha", expanded: true },
            { name: "Beta", expanded: false },
            { name: "Charlie", expanded: false },
        ]);
    });

    test("clicking same button twice should toggle detail off", async ({
        page,
    }) => {
        await page.goto("/fixtures/repeat-event/");

        const element = page.locator("repeat-event-element");
        const buttons = element.locator("button.toggle");
        const details = element.locator("span.detail");

        // Click Alpha on
        await buttons.nth(0).click();
        await expect(details).toHaveCount(1);

        // Click Alpha off
        await buttons.nth(0).click();
        await expect(details).toHaveCount(0);
    });

    test("clicking different buttons should show multiple details", async ({
        page,
    }) => {
        await page.goto("/fixtures/repeat-event/");

        const element = page.locator("repeat-event-element");
        const buttons = element.locator("button.toggle");
        const details = element.locator("span.detail");

        // Expand Alpha and Charlie
        await buttons.nth(0).click();
        await buttons.nth(2).click();

        await expect(details).toHaveCount(2);
        await expect(details.nth(0)).toHaveText("Details for Alpha");
        await expect(details.nth(1)).toHaveText("Details for Charlie");
    });
});
