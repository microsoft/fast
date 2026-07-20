import { expect, test } from "@playwright/test";

// Vite serves local filesystem files under the /@fs/ prefix.
// Using .pathname (not fileURLToPath) mirrors the template-bridge pattern and
// correctly produces a leading slash on Windows (e.g. /@fs/E:/fast/...).
const pureDeclarativeEntrypointUrl = `/@fs${
    new URL("../../test/pure-declarative-main.ts", import.meta.url).pathname
}`;

test.describe("TemplateParser", () => {
    test.describe("f-children directive", () => {
        test("without filter produces a ChildrenDirective with the correct property", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async declarativeUrl => {
                // @ts-expect-error: Client module.
                const { Schema, TemplateParser } = await import(declarativeUrl);
                // @ts-expect-error: Client module.
                const { ChildrenDirective } = await import("/main.js");

                const parser = new TemplateParser();
                const schema = new Schema("test-element");
                const { values } = parser.parse(
                    '<ul f-children="{listItems}"></ul>',
                    schema,
                );
                const directive = values[0];

                return {
                    isChildrenDirective: directive instanceof ChildrenDirective,
                    property: directive.options.property,
                    hasFilter: "filter" in directive.options,
                };
            }, pureDeclarativeEntrypointUrl);

            expect(result.isChildrenDirective).toBe(true);
            expect(result.property).toBe("listItems");
            expect(result.hasFilter).toBe(false);
        });

        test("with filter elements() produces a ChildrenDirective with an element filter", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async declarativeUrl => {
                // @ts-expect-error: Client module.
                const { Schema, TemplateParser } = await import(declarativeUrl);
                // @ts-expect-error: Client module.
                const { ChildrenDirective } = await import("/main.js");

                const parser = new TemplateParser();
                const schema = new Schema("test-element");
                const { values } = parser.parse(
                    '<ul f-children="{childItems filter elements()}"></ul>',
                    schema,
                );
                const directive = values[0];
                const filter = directive.options.filter;

                // Use real DOM nodes so element.matches() is available.
                const elementNode = document.createElement("div");
                const textNode = document.createTextNode("hello");

                return {
                    isChildrenDirective: directive instanceof ChildrenDirective,
                    property: directive.options.property,
                    hasFilter: typeof filter === "function",
                    filterAcceptsElement: filter(elementNode),
                    filterRejectsText: filter(textNode),
                };
            }, pureDeclarativeEntrypointUrl);

            expect(result.isChildrenDirective).toBe(true);
            expect(result.property).toBe("childItems");
            expect(result.hasFilter).toBe(true);
            expect(result.filterAcceptsElement).toBe(true);
            expect(result.filterRejectsText).toBe(false);
        });

        test("with filter elements(li) produces a ChildrenDirective with a selector filter", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async declarativeUrl => {
                // @ts-expect-error: Client module.
                const { Schema, TemplateParser } = await import(declarativeUrl);
                // @ts-expect-error: Client module.
                const { ChildrenDirective } = await import("/main.js");

                const parser = new TemplateParser();
                const schema = new Schema("test-element");
                const { values } = parser.parse(
                    '<ul f-children="{childItems filter elements(li)}"></ul>',
                    schema,
                );
                const directive = values[0];
                const filter = directive.options.filter;

                const li = document.createElement("li");
                const div = document.createElement("div");
                const text = document.createTextNode("hello");

                return {
                    isChildrenDirective: directive instanceof ChildrenDirective,
                    property: directive.options.property,
                    hasFilter: typeof filter === "function",
                    filterAcceptsLi: filter(li),
                    filterResultDiv: filter(div),
                    filterResultText: filter(text),
                };
            }, pureDeclarativeEntrypointUrl);

            expect(result.isChildrenDirective).toBe(true);
            expect(result.property).toBe("childItems");
            expect(result.hasFilter).toBe(true);
            expect(result.filterAcceptsLi).toBe(true);
            expect(result.filterResultDiv).toBe(false);
            expect(result.filterResultText).toBe(false);
        });
    });
});
