import { expect, test } from "@playwright/test";

test.describe("declarative event modifiers", () => {
    test("rejects modifiers without an event name", async ({ page }) => {
        await page.goto("/");
        const message = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { TemplateParser, Schema } = await import("/main.js");
            const parser = new TemplateParser();
            const { strings, values } = parser.parse(
                '<button @.capture="{handleClick()}">Click</button>',
                new Schema("empty-event-name"),
            );
            try {
                parser.createTemplate(strings, values);
            } catch (error) {
                return error.message;
            }
            return null;
        });
        expect(message).toBe('Event binding "@.capture" must specify an event name.');
    });

    for (const attribute of ["@click.unknown", "@click.capture.", "@click.signal"]) {
        test(`rejects an unsupported modifier in ${attribute}`, async ({ page }) => {
            await page.goto("/");
            const message = await page.evaluate(async attribute => {
                // @ts-expect-error: Client module.
                const { TemplateParser, Schema } = await import("/main.js");
                const parser = new TemplateParser();
                const { strings, values } = parser.parse(
                    `<button ${attribute}="{handleClick()}">Click</button>`,
                    new Schema("event-modifier-errors"),
                );
                try {
                    parser.createTemplate(strings, values);
                } catch (error) {
                    return error.message;
                }
                return null;
            }, attribute);
            expect(message).toContain("Unknown event modifier");
            expect(message).toContain(attribute);
        });
    }
});
