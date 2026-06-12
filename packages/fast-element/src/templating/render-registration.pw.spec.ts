import { expect, test } from "@playwright/test";

const testServerUrl = process.env.FAST_TEST_SERVER_URL ?? "/";

test.describe("RenderInstruction registration", () => {
    test("warns when registering over an existing instruction", async ({ page }) => {
        await page.goto(testServerUrl);

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FAST, RenderInstruction, html } = await import("/main.js");

            const currentWarn = FAST.warn;
            const warnings: { code: number; values?: Record<string, any> }[] = [];
            class TestClass {}

            try {
                FAST.warn = function (code: number, values?: Record<string, any>) {
                    warnings.push({ code, values });
                };

                const first = RenderInstruction.register({
                    type: TestClass,
                    template: html`
                        <p>First Template</p>
                    `,
                    name: "test",
                });
                const second = RenderInstruction.register({
                    type: TestClass,
                    template: html`
                        <p>Second Template</p>
                    `,
                    name: "test",
                });
                const found = RenderInstruction.getByType(TestClass, "test");

                return {
                    count: warnings.length,
                    code: warnings[0]?.code,
                    name: warnings[0]?.values?.name,
                    type: warnings[0]?.values?.type,
                    replaced: found === second && found !== first,
                };
            } finally {
                FAST.warn = currentWarn;
            }
        });

        expect(result.count).toBe(1);
        expect(result.code).toBe(1211);
        expect(result.name).toBe("test");
        expect(result.type).toBe("TestClass");
        expect(result.replaced).toBe(true);
    });

    test("does not warn when registering a different instruction name", async ({
        page,
    }) => {
        await page.goto(testServerUrl);

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FAST, RenderInstruction, html } = await import("/main.js");

            const currentWarn = FAST.warn;
            const warnings: { code: number; values?: Record<string, any> }[] = [];
            class TestClass {}

            try {
                FAST.warn = function (code: number, values?: Record<string, any>) {
                    warnings.push({ code, values });
                };

                RenderInstruction.register({
                    type: TestClass,
                    template: html`
                        <p>Default Template</p>
                    `,
                });
                RenderInstruction.register({
                    type: TestClass,
                    template: html`
                        <p>Named Template</p>
                    `,
                    name: "test",
                });

                return warnings.length;
            } finally {
                FAST.warn = currentWarn;
            }
        });

        expect(result).toBe(0);
    });
});
