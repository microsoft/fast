import { expect, test } from "@playwright/test";

test.describe("The composedParent function", () => {
    test("returns the parent of an element, if it has one", async ({ page }) => {
        await page.goto("/");

        const isParent = await page.evaluate(async () => {
            // @ts-expect-error Client side module.
            const { composedParent } = await import("./main.js");

            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.appendChild(child);

            return composedParent(child) === parent;
        });

        expect(isParent).toBe(true);
    });
});

test.describe("The composedContains function", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("returns true if the test and reference are the same element", async ({
        page,
    }) => {
        const contains = await page.evaluate(async () => {
            // @ts-expect-error Client side module.
            const { composedContains } = await import("./main.js");

            // This matches the behavior of Node.contains()
            const target = document.createElement("div");

            return composedContains(target, target);
        });

        expect(contains).toBe(true);
    });

    test.describe("that are in the same DOM", () => {
        test("returns true if the test is a child of the reference", async ({ page }) => {
            const contains = await page.evaluate(async () => {
                // @ts-expect-error Client side module.
                const { composedContains } = await import("./main.js");

                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.appendChild(child);

                return composedContains(parent, child);
            });

            expect(contains).toBe(true);
        });

        test("returns false if the test is not a child of the reference", async ({
            page,
        }) => {
            const contains = await page.evaluate(async () => {
                // @ts-expect-error Client side module.
                const { composedContains } = await import("./main.js");

                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.appendChild(child);

                return composedContains(child, parent);
            });

            expect(contains).toBe(false);
        });
    });

    test.describe("that are not in the same DOM", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/");
            await page.evaluate(async () => {
                // @ts-expect-error Client side module.
                const { html, ref, FASTElement } = await import("./main.js");

                class TestElement extends FASTElement {
                    root;
                }

                TestElement.define({
                    name: "composed-contains-element",
                    template: html<TestElement>`
                        <div ${ref("root")} data-foo="bar"><slot></slot></div>
                    `,
                });
            });
        });

        test("should return true if the element being tested is in a shadow DOM of a child element", async ({
            page,
        }) => {
            const contains = await page.evaluate(async () => {
                // @ts-expect-error Client side module.
                const { Updates, composedContains } = await import("./main.js");

                const parent = document.createElement("div");
                const child = document.createElement("composed-contains-element");

                parent.appendChild(child);
                document.body.appendChild(parent);

                await Updates.next();

                // @ts-expect-error Client side code.
                return composedContains(parent, child.root);
            });

            expect(contains).toBe(true);
        });

        test("should return false if the element being tested is in a shadow DOM that is not attached to a child", async ({
            page,
        }) => {
            const contains = await page.evaluate(async () => {
                // @ts-expect-error Client side module.
                const { Updates, composedContains } = await import("./main.js");

                const parent = document.createElement("div");
                const child = document.createElement("composed-contains-element");

                document.body.appendChild(parent);
                document.body.appendChild(child);

                await Updates.next();

                // @ts-expect-error Client side code.
                return composedContains(parent, child.root);
            });

            expect(contains).toBe(false);
        });
    });
});
