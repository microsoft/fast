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

        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/deprecated-event-warning/");
        await hydrationCompleted;

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

        const hydrationCompleted = page.waitForFunction(
            () => (window as any).hydrationCompleted === true,
        );
        await page.goto("/fixtures/ecosystem/deprecated-event-warning/");
        await hydrationCompleted;

        const alphaWarning = warnings.find(w => w.includes("test-alpha"));

        expect(alphaWarning).toBeDefined();
        expect(alphaWarning).toContain("[fast-html]");
        expect(alphaWarning).toContain("deprecated");
        expect(alphaWarning).toContain("$e");
    });
});
