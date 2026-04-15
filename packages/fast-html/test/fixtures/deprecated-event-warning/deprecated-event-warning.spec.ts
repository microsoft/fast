import { expect, test } from "@playwright/test";

test.describe("deprecated event argument warning", async () => {
    test("should emit one warning per component that uses deprecated 'e'", async ({
        page,
    }) => {
        const warnings: string[] = [];
        page.on("console", msg => {
            if (msg.type() === "warning") {
                warnings.push(msg.text());
            }
        });

        await page.goto("/fixtures/deprecated-event-warning/");

        // Wait for both components to finish template processing
        await page.locator("test-alpha").waitFor();
        await page.locator("test-beta").waitFor();

        // Allow template processing to complete
        await page.waitForTimeout(500);

        const deprecationWarnings = warnings.filter(w => w.includes("deprecated"));

        // test-alpha has two event bindings with deprecated "e", but should
        // only produce one warning. test-beta has one binding with "e" and
        // should produce its own separate warning.
        expect(deprecationWarnings).toHaveLength(2);

        expect(deprecationWarnings).toContainEqual(
            expect.stringContaining('"test-alpha"'),
        );
        expect(deprecationWarnings).toContainEqual(
            expect.stringContaining('"test-beta"'),
        );
    });

    test("warning message should include component name and replacement syntax", async ({
        page,
    }) => {
        const warnings: string[] = [];
        page.on("console", msg => {
            if (msg.type() === "warning") {
                warnings.push(msg.text());
            }
        });

        await page.goto("/fixtures/deprecated-event-warning/");

        await page.locator("test-alpha").waitFor();
        await page.waitForTimeout(500);

        const alphaWarning = warnings.find(w => w.includes("test-alpha"));

        expect(alphaWarning).toBeDefined();
        expect(alphaWarning).toContain("[fast-html]");
        expect(alphaWarning).toContain("deprecated");
        expect(alphaWarning).toContain("$e");
    });
});
