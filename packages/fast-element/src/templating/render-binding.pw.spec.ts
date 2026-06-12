import { expect, test } from "@playwright/test";

test.describe("The render template binding", () => {
    test("does not mutate a provided template binding so it can be reused", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { render, RenderInstruction, html, oneWay, Fake } = await import(
                "/main.js"
            );

            const childEditTemplate = html`
                <p>Child Edit Template</p>
            `;
            const parentEditTemplate = html`
                <p>Parent Edit Template</p>
            `;

            class TestChild {
                name = "FAST";
            }

            class TestParent {
                name = "FAST";
            }

            RenderInstruction.register({
                type: TestChild,
                template: childEditTemplate,
                name: "edit",
            });

            RenderInstruction.register({
                type: TestParent,
                template: parentEditTemplate,
                name: "edit",
            });

            const source = {
                child: new TestChild(),
                parent: new TestParent(),
                viewName: "edit",
            };
            const context = Fake.executionContext();
            const templateBinding = oneWay((x: any) => x.viewName);
            const originalEvaluate = templateBinding.evaluate;
            const childDirective = render((x: any) => x.child, templateBinding);
            const parentDirective = render((x: any) => x.parent, templateBinding);

            return {
                bindingEvaluateUnchanged: templateBinding.evaluate === originalEvaluate,
                bindingValueUnchanged:
                    templateBinding.evaluate(source, context) === "edit",
                childTemplate:
                    childDirective.templateBinding.evaluate(source, context) ===
                    childEditTemplate,
                parentTemplate:
                    parentDirective.templateBinding.evaluate(source, context) ===
                    parentEditTemplate,
            };
        });

        expect(result.bindingEvaluateUnchanged).toBe(true);
        expect(result.bindingValueUnchanged).toBe(true);
        expect(result.childTemplate).toBe(true);
        expect(result.parentTemplate).toBe(true);
    });
});
