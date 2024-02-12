import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";

test.describe("Progress ring", () => {
    test("should include a role of progressbar", async ({ page }) => {
        const element = page.locator("fast-progress-ring");

        const root = page.locator("#root");

        await page.goto(fixtureURL("progress-progress-ring--progress-ring"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress-ring></fast-progress-ring>
            `;
        });

        await expect(element).toHaveAttribute("role", "progressbar");
    });

    test("should set the `aria-valuenow` attribute with the `value` property when provided", async ({
        page,
    }) => {
        const element = page.locator("fast-progress-ring");

        const root = page.locator("#root");

        await page.goto(fixtureURL("progress-progress-ring--progress-ring"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress-ring value="50"></fast-progress-ring>
            `;
        });

        await expect(element).toHaveAttribute("aria-valuenow", "50");
    });

    test("should set the `aria-valuemin` attribute with the `min` property when provided", async ({
        page,
    }) => {
        const element = page.locator("fast-progress-ring");

        const root = page.locator("#root");

        await page.goto(fixtureURL("progress-progress-ring--progress-ring"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress-ring min="10"></fast-progress-ring>
            `;
        });

        await expect(element).toHaveAttribute("aria-valuemin", "10");
    });

    test("should set the `aria-valuemax` attribute with the `max` property when provided", async ({
        page,
    }) => {
        const element = page.locator("fast-progress-ring");

        const root = page.locator("#root");

        await page.goto(fixtureURL("progress-progress-ring--progress-ring"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress-ring max="75"></fast-progress-ring>
            `;
        });

        await expect(element).toHaveAttribute("aria-valuemax", "75");
    });

    test("should render an element with a `determinate` slot when a value is provided", async ({
        page,
    }) => {
        const element = page.locator("fast-progress-ring");

        const root = page.locator("#root");

        await page.goto(fixtureURL("progress-progress-ring--progress-ring"));

        await root.evaluate(node => {
            node.innerHTML = /* html */ `
                <fast-progress-ring value="50"></fast-progress-ring>
            `;
        });

        const progress = element.locator(".progress");

        await expect(progress).toHaveAttribute("slot", "determinate");
    });
});
