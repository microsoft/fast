import { expect, test } from "@playwright/test";

test.describe("The render", () => {
    test.describe("template function", () => {
        test("returns a RenderDirective", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html } = await import(
                    "/main.js"
                );

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const directive = render();
                return directive instanceof RenderDirective;
            });

            expect(result).toBe(true);
        });

        test("creates a data binding that points to the source when no data binding is provided", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const directive = render();

                const data = directive.dataBinding.evaluate(
                    source,
                    Fake.executionContext()
                );

                return data === source;
            });

            expect(result).toBe(true);
        });

        test("creates a data binding that evaluates the provided binding", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const directive = render(x => x.child);

                const data = directive.dataBinding.evaluate(
                    source,
                    Fake.executionContext()
                );

                return data === source.child;
            });

            expect(result).toBe(true);
        });

        test("creates a data binding that evaluates to a provided node", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const node = document.createElement("div");
                const directive = render(node);

                const data = directive.dataBinding.evaluate(
                    source,
                    Fake.executionContext()
                );

                return data === node;
            });

            expect(result).toBe(true);
        });

        test("creates a data binding that evaluates to a provided object", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const obj = {};
                const directive = render(obj);

                const data = directive.dataBinding.evaluate(
                    source,
                    Fake.executionContext()
                );

                return data === obj;
            });

            expect(result).toBe(true);
        });

        test("creates a template binding when a template is provided", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const childEditTemplate = html`
                    <p>Child Edit Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestChild,
                    template: childEditTemplate,
                    name: "edit",
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const directive = render(x => x.child, childEditTemplate);
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
                );
                return template === childEditTemplate;
            });

            expect(result).toBe(true);
        });

        test("creates a template binding based on the data binding when no template binding is provided - for no binding", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const directive = render();
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
                );
                return template === parentTemplate;
            });

            expect(result).toBe(true);
        });

        test("creates a template binding based on the data binding when no template binding is provided - for normal binding", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const directive = render(x => x.child);
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
                );
                return template === childTemplate;
            });

            expect(result).toBe(true);
        });

        test("creates a template binding based on the data binding when no template binding is provided - for node binding", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    render,
                    RenderDirective,
                    RenderInstruction,
                    NodeTemplate,
                    html,
                    Fake,
                } = await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const node = document.createElement("div");
                const directive = render(() => node);
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
                );
                return template instanceof NodeTemplate && template.node === node;
            });

            expect(result).toBe(true);
        });

        test("creates a template using the template binding that was provided - when the template binding returns a string", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const childEditTemplate = html`
                    <p>Child Edit Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestChild,
                    template: childEditTemplate,
                    name: "edit",
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const directive = render(
                    x => x.child,
                    () => "edit"
                );
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
                );
                return template === childEditTemplate;
            });

            expect(result).toBe(true);
        });

        test("creates a template using the template binding that was provided - when the template binding returns a node", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    render,
                    RenderDirective,
                    RenderInstruction,
                    NodeTemplate,
                    html,
                    Fake,
                } = await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const node = document.createElement("div");
                const directive = render(
                    x => x.child,
                    () => node
                );
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
                );
                return template instanceof NodeTemplate && template.node === node;
            });

            expect(result).toBe(true);
        });

        test("creates a template using the template binding that was provided - when the template binding returns a template", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const childEditTemplate = html`
                    <p>Child Edit Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestChild,
                    template: childEditTemplate,
                    name: "edit",
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const directive = render(
                    x => x.child,
                    () => childEditTemplate
                );
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
                );
                return template === childEditTemplate;
            });

            expect(result).toBe(true);
        });

        test("creates a template when a view name was specified - when the data binding returns a node", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    render,
                    RenderDirective,
                    RenderInstruction,
                    NodeTemplate,
                    html,
                    Fake,
                } = await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const childEditTemplate = html`
                    <p>Child Edit Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestChild,
                    template: childEditTemplate,
                    name: "edit",
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const node = document.createElement("div");
                const directive = render(() => node, "edit");
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
                );
                return template instanceof NodeTemplate && template.node === node;
            });

            expect(result).toBe(true);
        });

        test("creates a template when a view name was specified - when the data binding returns a value", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, RenderInstruction, html, Fake } =
                    await import("/main.js");

                const childTemplate = html`
                    <p>Child Template</p>
                `;
                const childEditTemplate = html`
                    <p>Child Edit Template</p>
                `;
                const parentTemplate = html`
                    <p>Parent Template</p>
                `;

                class TestChild {
                    name = "FAST";
                }

                class TestParent {
                    child = new TestChild();
                }

                RenderInstruction.register({
                    type: TestChild,
                    template: childTemplate,
                });

                RenderInstruction.register({
                    type: TestChild,
                    template: childEditTemplate,
                    name: "edit",
                });

                RenderInstruction.register({
                    type: TestParent,
                    template: parentTemplate,
                });

                const source = new TestParent();
                const directive = render(x => x.child, "edit");
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
                );
                return template === childEditTemplate;
            });

            expect(result).toBe(true);
        });
    });

    test.describe("instruction gateway", () => {
        const operations = ["create", "register"] as const;

        for (const operation of operations) {
            test(`can ${operation} an instruction from type and template`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const { RenderInstruction, html } = await import("/main.js");

                    const parentTemplate = html`
                        <p>Parent Template</p>
                    `;
                    class TestClass {}

                    const instruction = RenderInstruction[op]({
                        type: TestClass,
                        template: parentTemplate,
                    });

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        templateMatch: instruction.template === parentTemplate,
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.templateMatch).toBe(true);
            });

            test(`can ${operation} an instruction from type, template, and name`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const { RenderInstruction, html } = await import("/main.js");

                    const parentTemplate = html`
                        <p>Parent Template</p>
                    `;
                    class TestClass {}

                    const instruction = RenderInstruction[op]({
                        type: TestClass,
                        template: parentTemplate,
                        name: "test",
                    });

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        templateMatch: instruction.template === parentTemplate,
                        name: instruction.name,
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.templateMatch).toBe(true);
                expect(result.name).toBe("test");
            });

            test(`can ${operation} an instruction from type and element`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const {
                        RenderInstruction,
                        ViewTemplate,
                        uniqueElementName,
                        customElement,
                        FASTElement,
                    } = await import("/main.js");

                    class TestClass {}
                    const tagName = uniqueElementName();

                    const TestElement = class extends FASTElement {};
                    customElement(tagName)(TestElement);

                    const instruction = RenderInstruction[op]({
                        element: TestElement,
                        type: TestClass,
                    });

                    const template = instruction.template;

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        isViewTemplate: template instanceof ViewTemplate,
                        includesTag: template.html.includes(`</${tagName}>`),
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.isViewTemplate).toBe(true);
                expect(result.includesTag).toBe(true);
            });

            test(`can ${operation} an instruction from type, element, and name`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const {
                        RenderInstruction,
                        ViewTemplate,
                        uniqueElementName,
                        customElement,
                        FASTElement,
                    } = await import("/main.js");

                    class TestClass {}
                    const tagName = uniqueElementName();

                    const TestElement = class extends FASTElement {};
                    customElement(tagName)(TestElement);

                    const instruction = RenderInstruction[op]({
                        element: TestElement,
                        type: TestClass,
                        name: "test",
                    });

                    const template = instruction.template;

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        isViewTemplate: template instanceof ViewTemplate,
                        includesTag: template.html.includes(`</${tagName}>`),
                        name: instruction.name,
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.isViewTemplate).toBe(true);
                expect(result.includesTag).toBe(true);
                expect(result.name).toBe("test");
            });

            test(`can ${operation} an instruction from type, element, and content`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const {
                        RenderInstruction,
                        ViewTemplate,
                        uniqueElementName,
                        customElement,
                        FASTElement,
                    } = await import("/main.js");

                    class TestClass {}
                    const tagName = uniqueElementName();
                    const content = "Hello World!";

                    const TestElement = class extends FASTElement {};
                    customElement(tagName)(TestElement);

                    const instruction = RenderInstruction[op]({
                        element: TestElement,
                        type: TestClass,
                        content,
                    });

                    const template = instruction.template;

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        isViewTemplate: template instanceof ViewTemplate,
                        includesContent: template.html.includes(
                            `${content}</${tagName}>`
                        ),
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.isViewTemplate).toBe(true);
                expect(result.includesContent).toBe(true);
            });

            test(`can ${operation} an instruction from type, element, content, and attributes`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const {
                        RenderInstruction,
                        ViewTemplate,
                        uniqueElementName,
                        customElement,
                        FASTElement,
                    } = await import("/main.js");

                    class TestClass {}
                    const tagName = uniqueElementName();
                    const content = "Hello World!";

                    const TestElement = class extends FASTElement {};
                    customElement(tagName)(TestElement);

                    const instruction = RenderInstruction[op]({
                        element: TestElement,
                        type: TestClass,
                        content,
                        attributes: {
                            foo: "bar",
                            baz: "qux",
                        },
                    });

                    const template = instruction.template;

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        isViewTemplate: template instanceof ViewTemplate,
                        includesContent: template.html.includes(
                            `${content}</${tagName}>`
                        ),
                        includesFoo: template.html.includes(`foo="`),
                        includesBaz: template.html.includes(`baz="`),
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.isViewTemplate).toBe(true);
                expect(result.includesContent).toBe(true);
                expect(result.includesFoo).toBe(true);
                expect(result.includesBaz).toBe(true);
            });

            test(`can ${operation} an instruction from type and tagName`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const { RenderInstruction, ViewTemplate, uniqueElementName } =
                        await import("/main.js");

                    class TestClass {}
                    const tagName = uniqueElementName();

                    const instruction = RenderInstruction[op]({
                        tagName,
                        type: TestClass,
                    });

                    const template = instruction.template;

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        isViewTemplate: template instanceof ViewTemplate,
                        includesTag: template.html.includes(`</${tagName}>`),
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.isViewTemplate).toBe(true);
                expect(result.includesTag).toBe(true);
            });

            test(`can ${operation} an instruction from type, tagName, and name`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const { RenderInstruction, ViewTemplate, uniqueElementName } =
                        await import("/main.js");

                    class TestClass {}
                    const tagName = uniqueElementName();

                    const instruction = RenderInstruction[op]({
                        tagName,
                        type: TestClass,
                        name: "test",
                    });

                    const template = instruction.template;

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        isViewTemplate: template instanceof ViewTemplate,
                        includesTag: template.html.includes(`</${tagName}>`),
                        name: instruction.name,
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.isViewTemplate).toBe(true);
                expect(result.includesTag).toBe(true);
                expect(result.name).toBe("test");
            });

            test(`can ${operation} an instruction from type, tagName, and content`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const { RenderInstruction, ViewTemplate, uniqueElementName } =
                        await import("/main.js");

                    class TestClass {}
                    const tagName = uniqueElementName();
                    const content = "Hello World!";

                    const instruction = RenderInstruction[op]({
                        tagName,
                        type: TestClass,
                        content,
                    });

                    const template = instruction.template;

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        isViewTemplate: template instanceof ViewTemplate,
                        includesContent: template.html.includes(
                            `${content}</${tagName}>`
                        ),
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.isViewTemplate).toBe(true);
                expect(result.includesContent).toBe(true);
            });

            test(`can ${operation} an instruction from type, tagName, content, and attributes`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async op => {
                    // @ts-expect-error: Client module.
                    const { RenderInstruction, ViewTemplate, uniqueElementName } =
                        await import("/main.js");

                    class TestClass {}
                    const tagName = uniqueElementName();
                    const content = "Hello World!";

                    const instruction = RenderInstruction[op]({
                        tagName,
                        type: TestClass,
                        content,
                        attributes: {
                            foo: "bar",
                            baz: "qux",
                        },
                    });

                    const template = instruction.template;

                    return {
                        isInstance: RenderInstruction.instanceOf(instruction),
                        typeMatch: instruction.type === TestClass,
                        isViewTemplate: template instanceof ViewTemplate,
                        includesContent: template.html.includes(
                            `${content}</${tagName}>`
                        ),
                        includesFoo: template.html.includes(`foo="`),
                        includesBaz: template.html.includes(`baz="`),
                    };
                }, operation);

                expect(result.isInstance).toBe(true);
                expect(result.typeMatch).toBe(true);
                expect(result.isViewTemplate).toBe(true);
                expect(result.includesContent).toBe(true);
                expect(result.includesFoo).toBe(true);
                expect(result.includesBaz).toBe(true);
            });
        }

        test("can register an existing instruction", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { RenderInstruction, html } = await import("/main.js");

                const parentTemplate = html`
                    <p>Parent Template</p>
                `;
                class TestClass {}

                const instruction = RenderInstruction.create({
                    type: TestClass,
                    template: parentTemplate,
                });

                const registered = RenderInstruction.register(instruction);

                return registered === instruction;
            });

            expect(result).toBe(true);
        });

        test("can get an instruction for an instance", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { RenderInstruction, html } = await import("/main.js");

                const parentTemplate = html`
                    <p>Parent Template</p>
                `;
                class TestClass {}

                const instruction = RenderInstruction.register({
                    type: TestClass,
                    template: parentTemplate,
                });

                const found = RenderInstruction.getForInstance(new TestClass());

                return found === instruction;
            });

            expect(result).toBe(true);
        });

        test("can get an instruction for a type", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { RenderInstruction, html } = await import("/main.js");

                const parentTemplate = html`
                    <p>Parent Template</p>
                `;
                class TestClass {}

                const instruction = RenderInstruction.register({
                    type: TestClass,
                    template: parentTemplate,
                });

                const found = RenderInstruction.getByType(TestClass);

                return found === instruction;
            });

            expect(result).toBe(true);
        });
    });

    test.describe("node template", () => {
        test("can add a node", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { NodeTemplate } = await import("/main.js");

                const parent = document.createElement("div");
                const location = document.createComment("");
                parent.appendChild(location);

                const child = document.createElement("div");
                const template = new NodeTemplate(child);

                const view = template.create();
                view.insertBefore(location);

                return {
                    parentMatch: child.parentElement === parent,
                    siblingMatch: child.nextSibling === location,
                };
            });

            expect(result.parentMatch).toBe(true);
            expect(result.siblingMatch).toBe(true);
        });

        test("can remove a node", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { NodeTemplate } = await import("/main.js");

                const parent = document.createElement("div");
                const child = document.createElement("div");
                parent.appendChild(child);

                const template = new NodeTemplate(child);

                const view = template.create();
                view.remove();

                return {
                    parentNull: child.parentElement === null,
                    siblingNull: child.nextSibling === null,
                };
            });

            expect(result.parentNull).toBe(true);
            expect(result.siblingNull).toBe(true);
        });
    });

    test.describe("directive", () => {
        test("adds itself to a template with a comment placeholder", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, Markup } = await import("/main.js");

                const directive = render();
                const id = "12345";
                let captured;
                const addViewBehaviorFactory = factory => {
                    captured = factory;
                    return id;
                };

                const html = directive.createHTML(addViewBehaviorFactory);

                return {
                    htmlMatch: html === Markup.comment(id),
                    capturedMatch: captured === directive,
                };
            });

            expect(result.htmlMatch).toBe(true);
            expect(result.capturedMatch).toBe(true);
        });

        test("creates a behavior", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderBehavior } = await import("/main.js");

                const directive = render();
                const behavior = directive.createBehavior();

                return behavior instanceof RenderBehavior;
            });

            expect(result).toBe(true);
        });

        test("can be interpolated in html", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, html } = await import("/main.js");

                const template = html`
                    hello${render()}world
                `;
                const keys = Object.keys(template.factories);
                const directive = template.factories[keys[0]];

                return directive instanceof RenderDirective;
            });

            expect(result).toBe(true);
        });
    });

    test.describe("decorator", () => {
        test("registers with tagName options", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { renderWith, RenderInstruction, ViewTemplate, uniqueElementName } =
                    await import("/main.js");

                const tagName = uniqueElementName();

                class Model {}
                renderWith({ tagName })(Model);

                const instruction = RenderInstruction.getByType(Model);
                return {
                    typeMatch: instruction.type === Model,
                    includesTag: instruction.template.html.includes(`</${tagName}>`),
                };
            });

            expect(result.typeMatch).toBe(true);
            expect(result.includesTag).toBe(true);
        });

        test("registers with element options", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    renderWith,
                    RenderInstruction,
                    ViewTemplate,
                    uniqueElementName,
                    customElement,
                    FASTElement,
                } = await import("/main.js");

                const tagName = uniqueElementName();

                const TestElement = class extends FASTElement {};
                customElement(tagName)(TestElement);

                class Model {}
                renderWith({ element: TestElement })(Model);

                const instruction = RenderInstruction.getByType(Model);
                return {
                    typeMatch: instruction.type === Model,
                    includesTag: instruction.template.html.includes(`</${tagName}>`),
                };
            });

            expect(result.typeMatch).toBe(true);
            expect(result.includesTag).toBe(true);
        });

        test("registers with template options", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { renderWith, RenderInstruction, ViewTemplate, html } =
                    await import("/main.js");

                const template = html`
                    hello world
                `;

                class Model {}
                renderWith({ template })(Model);

                const instruction = RenderInstruction.getByType(Model);
                return {
                    typeMatch: instruction.type === Model,
                    includesContent: instruction.template.html.includes(`hello world`),
                };
            });

            expect(result.typeMatch).toBe(true);
            expect(result.includesContent).toBe(true);
        });

        test("registers with element", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    renderWith,
                    RenderInstruction,
                    ViewTemplate,
                    uniqueElementName,
                    customElement,
                    FASTElement,
                } = await import("/main.js");

                const tagName = uniqueElementName();

                const TestElement = class extends FASTElement {};
                customElement(tagName)(TestElement);

                class Model {}
                renderWith(TestElement)(Model);

                const instruction = RenderInstruction.getByType(Model);
                return {
                    typeMatch: instruction.type === Model,
                    includesTag: instruction.template.html.includes(`</${tagName}>`),
                };
            });

            expect(result.typeMatch).toBe(true);
            expect(result.includesTag).toBe(true);
        });

        test("registers with element and name", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    renderWith,
                    RenderInstruction,
                    ViewTemplate,
                    uniqueElementName,
                    customElement,
                    FASTElement,
                } = await import("/main.js");

                const tagName = uniqueElementName();

                const TestElement = class extends FASTElement {};
                customElement(tagName)(TestElement);

                class Model {}
                renderWith(TestElement, "test")(Model);

                const instruction = RenderInstruction.getByType(Model, "test");
                return {
                    typeMatch: instruction.type === Model,
                    includesTag: instruction.template.html.includes(`</${tagName}>`),
                    name: instruction.name,
                };
            });

            expect(result.typeMatch).toBe(true);
            expect(result.includesTag).toBe(true);
            expect(result.name).toBe("test");
        });

        test("registers with template", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { renderWith, RenderInstruction, ViewTemplate, html } =
                    await import("/main.js");

                const template = html`
                    hello world
                `;

                class Model {}
                renderWith(template)(Model);

                const instruction = RenderInstruction.getByType(Model);
                return {
                    typeMatch: instruction.type === Model,
                    includesContent: instruction.template.html.includes(`hello world`),
                };
            });

            expect(result.typeMatch).toBe(true);
            expect(result.includesContent).toBe(true);
        });

        test("registers with template and name", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { renderWith, RenderInstruction, ViewTemplate, html } =
                    await import("/main.js");

                const template = html`
                    hello world
                `;

                class Model {}
                renderWith(template, "test")(Model);

                const instruction = RenderInstruction.getByType(Model, "test");
                return {
                    typeMatch: instruction.type === Model,
                    includesContent: instruction.template.html.includes(`hello world`),
                    name: instruction.name,
                };
            });

            expect(result.typeMatch).toBe(true);
            expect(result.includesContent).toBe(true);
            expect(result.name).toBe("test");
        });
    });

    test.describe("behavior", () => {
        test("initially inserts a view based on the template", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, Observable, html, Fake, toHTML } =
                    await import("/main.js");

                const childTemplate = html`
                    This is a template. ${x => x.knownValue}
                `;

                class Child {}
                Observable.defineProperty(Child.prototype, "knownValue");
                Child.prototype.knownValue = "value";

                class Parent {}
                Observable.defineProperty(Parent.prototype, "child");
                Observable.defineProperty(Parent.prototype, "trigger");
                Observable.defineProperty(Parent.prototype, "innerTemplate");

                const directive = render(
                    x => x.child,
                    x => x.template
                );
                directive.targetNodeId = "r";

                const node = document.createComment("");
                const targets = { r: node };

                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Parent();
                model.child = new Child();
                model.trigger = 0;
                model.innerTemplate = childTemplate;
                model.template = model.innerTemplate;

                const unbindables = [];
                const controller = {
                    context: Fake.executionContext(),
                    onUnbind(object) {
                        unbindables.push(object);
                    },
                    source: model,
                    targets,
                    isBound: false,
                    unbind() {
                        unbindables.forEach(x => x.unbind(this));
                    },
                };

                Object.defineProperty(Parent.prototype, "template", {
                    get() {
                        const value = this.trigger;
                        return this.innerTemplate;
                    },
                    configurable: true,
                });

                behavior.bind(controller);

                return toHTML(parentNode);
            });

            expect(result).toBe("This is a template. value");
        });

        test("updates an inserted view when the value changes to a new template", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    render,
                    RenderDirective,
                    Observable,
                    html,
                    Fake,
                    toHTML,
                    Updates,
                } = await import("/main.js");

                const childTemplate = html`
                    This is a template. ${x => x.knownValue}
                `;

                class Child {}
                Observable.defineProperty(Child.prototype, "knownValue");
                Child.prototype.knownValue = "value";

                class Parent {}
                Observable.defineProperty(Parent.prototype, "child");
                Observable.defineProperty(Parent.prototype, "trigger");
                Observable.defineProperty(Parent.prototype, "innerTemplate");

                Object.defineProperty(Parent.prototype, "template", {
                    get() {
                        const value = this.trigger;
                        return this.innerTemplate;
                    },
                    configurable: true,
                });

                const directive = render(
                    x => x.child,
                    x => x.template
                );
                directive.targetNodeId = "r";

                const node = document.createComment("");
                const targets = { r: node };

                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Parent();
                model.child = new Child();
                model.trigger = 0;
                model.innerTemplate = childTemplate;

                const unbindables = [];
                const controller = {
                    context: Fake.executionContext(),
                    onUnbind(object) {
                        unbindables.push(object);
                    },
                    source: model,
                    targets,
                    isBound: false,
                    unbind() {
                        unbindables.forEach(x => x.unbind(this));
                    },
                };

                behavior.bind(controller);

                const before = toHTML(parentNode);

                model.innerTemplate = html`
                    This is a new template. ${x => x.knownValue}
                `;

                await Updates.next();

                const after = toHTML(parentNode);

                return { before, after };
            });

            expect(result.before).toBe("This is a template. value");
            expect(result.after).toBe("This is a new template. value");
        });

        test("doesn't compose an already composed view", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    render,
                    RenderDirective,
                    Observable,
                    html,
                    Fake,
                    toHTML,
                    Updates,
                } = await import("/main.js");

                const childTemplate = html`
                    This is a template. ${x => x.knownValue}
                `;

                class Child {}
                Observable.defineProperty(Child.prototype, "knownValue");
                Child.prototype.knownValue = "value";

                class Parent {}
                Observable.defineProperty(Parent.prototype, "child");
                Observable.defineProperty(Parent.prototype, "trigger");
                Observable.defineProperty(Parent.prototype, "innerTemplate");

                Object.defineProperty(Parent.prototype, "template", {
                    get() {
                        const value = this.trigger;
                        return this.innerTemplate;
                    },
                    configurable: true,
                });

                const directive = render(
                    x => x.child,
                    x => x.template
                );
                directive.targetNodeId = "r";

                const node = document.createComment("");
                const targets = { r: node };

                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Parent();
                model.child = new Child();
                model.trigger = 0;
                model.innerTemplate = childTemplate;

                const unbindables = [];
                const controller = {
                    context: Fake.executionContext(),
                    onUnbind(object) {
                        unbindables.push(object);
                    },
                    source: model,
                    targets,
                    isBound: false,
                    unbind() {
                        unbindables.forEach(x => x.unbind(this));
                    },
                };

                behavior.bind(controller);
                const inserted = node.previousSibling;

                const before = toHTML(parentNode);

                model.trigger++;

                await Updates.next();

                const after = toHTML(parentNode);
                const sameNode = node.previousSibling === inserted;

                return { before, after, sameNode };
            });

            expect(result.before).toBe("This is a template. value");
            expect(result.after).toBe("This is a template. value");
            expect(result.sameNode).toBe(true);
        });

        test("unbinds a composed view", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, Observable, html, Fake, toHTML } =
                    await import("/main.js");

                const childTemplate = html`
                    This is a template. ${x => x.knownValue}
                `;

                class Child {}
                Observable.defineProperty(Child.prototype, "knownValue");
                Child.prototype.knownValue = "value";

                class Parent {}
                Observable.defineProperty(Parent.prototype, "child");
                Observable.defineProperty(Parent.prototype, "trigger");
                Observable.defineProperty(Parent.prototype, "innerTemplate");

                Object.defineProperty(Parent.prototype, "template", {
                    get() {
                        const value = this.trigger;
                        return this.innerTemplate;
                    },
                    configurable: true,
                });

                const directive = render(
                    x => x.child,
                    x => x.template
                );
                directive.targetNodeId = "r";

                const node = document.createComment("");
                const targets = { r: node };

                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Parent();
                model.child = new Child();
                model.trigger = 0;
                model.innerTemplate = childTemplate;

                const unbindables = [];
                const controller = {
                    context: Fake.executionContext(),
                    onUnbind(object) {
                        unbindables.push(object);
                    },
                    source: model,
                    targets,
                    isBound: false,
                    unbind() {
                        unbindables.forEach(x => x.unbind(this));
                    },
                };

                behavior.bind(controller);
                const view = behavior.view;

                const sourceBefore = view.source === model.child;
                const htmlBefore = toHTML(parentNode);

                controller.unbind();

                const sourceAfter = view.source === null;

                return { sourceBefore, htmlBefore, sourceAfter };
            });

            expect(result.sourceBefore).toBe(true);
            expect(result.htmlBefore).toBe("This is a template. value");
            expect(result.sourceAfter).toBe(true);
        });

        test("rebinds a previously unbound composed view", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { render, RenderDirective, Observable, html, Fake, toHTML } =
                    await import("/main.js");

                const childTemplate = html`
                    This is a template. ${x => x.knownValue}
                `;

                class Child {}
                Observable.defineProperty(Child.prototype, "knownValue");
                Child.prototype.knownValue = "value";

                class Parent {}
                Observable.defineProperty(Parent.prototype, "child");
                Observable.defineProperty(Parent.prototype, "trigger");
                Observable.defineProperty(Parent.prototype, "innerTemplate");

                Object.defineProperty(Parent.prototype, "template", {
                    get() {
                        const value = this.trigger;
                        return this.innerTemplate;
                    },
                    configurable: true,
                });

                const directive = render(
                    x => x.child,
                    x => x.template
                );
                directive.targetNodeId = "r";

                const node = document.createComment("");
                const targets = { r: node };

                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Parent();
                model.child = new Child();
                model.trigger = 0;
                model.innerTemplate = childTemplate;

                const unbindables = [];
                const controller = {
                    context: Fake.executionContext(),
                    onUnbind(object) {
                        unbindables.push(object);
                    },
                    source: model,
                    targets,
                    isBound: false,
                    unbind() {
                        unbindables.forEach(x => x.unbind(this));
                    },
                };

                behavior.bind(controller);
                const view = behavior.view;

                const sourceBefore = view.source === model.child;
                const htmlBefore = toHTML(parentNode);

                behavior.unbind(controller);

                const sourceAfterUnbind = view.source === null;

                behavior.bind(controller);

                const newView = behavior.view;
                const sourceAfterRebind = newView.source === model.child;
                const sameView = newView === view;
                const htmlAfterRebind = toHTML(parentNode);

                return {
                    sourceBefore,
                    htmlBefore,
                    sourceAfterUnbind,
                    sourceAfterRebind,
                    sameView,
                    htmlAfterRebind,
                };
            });

            expect(result.sourceBefore).toBe(true);
            expect(result.htmlBefore).toBe("This is a template. value");
            expect(result.sourceAfterUnbind).toBe(true);
            expect(result.sourceAfterRebind).toBe(true);
            expect(result.sameView).toBe(true);
            expect(result.htmlAfterRebind).toBe("This is a template. value");
        });
    });

    test.describe("createElementTemplate function", () => {
        test("creates a template from a tag name", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { RenderInstruction } = await import("/main.js");

                const template = RenderInstruction.createElementTemplate("button");

                return template.html;
            });

            expect(result).toBe("<button></button>");
        });

        test("creates a template with attributes", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { RenderInstruction, Observable, toHTML } = await import(
                    "/main.js"
                );

                class RenderSource {}
                Observable.defineProperty(RenderSource.prototype, "knownValue");
                RenderSource.prototype.knownValue = "value";

                const templateAttributeOptions = {
                    attributes: { id: x => x.id },
                };

                const template = RenderInstruction.createElementTemplate(
                    "button",
                    templateAttributeOptions
                );

                const targetNode = document.createElement("div");
                const source = new RenderSource();
                source.id = "child-1";
                const view = template.create();

                view.bind(source);
                view.appendTo(targetNode);

                return {
                    sourceMatch: view.source === source,
                    html: toHTML(targetNode),
                };
            });

            expect(result.sourceMatch).toBe(true);
            expect(result.html).toBe('<button id="child-1"></button>');
        });

        test("creates a template with static content", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { RenderInstruction, toHTML } = await import("/main.js");

                const templateStaticViewOptions = {
                    content: "foo",
                };

                const template = RenderInstruction.createElementTemplate(
                    "button",
                    templateStaticViewOptions
                );
                const targetNode = document.createElement("div");
                const view = template.create();

                view.appendTo(targetNode);

                return {
                    sourceNull: view.source === null,
                    html: toHTML(targetNode.firstElementChild),
                };
            });

            expect(result.sourceNull).toBe(true);
            expect(result.html).toBe("foo");
        });

        test("creates a template with attributes and content ViewTemplate", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { RenderInstruction, Observable, html, toHTML } = await import(
                    "/main.js"
                );

                class RenderSource {}
                Observable.defineProperty(RenderSource.prototype, "knownValue");
                RenderSource.prototype.knownValue = "value";

                const sourceTemplate = html`
                    This is a template. ${x => x.knownValue}
                `;

                const templateAttributeOptions = {
                    attributes: { id: x => x.id },
                };

                const template = RenderInstruction.createElementTemplate("button", {
                    ...templateAttributeOptions,
                    content: sourceTemplate,
                });

                const targetNode = document.createElement("div");
                const source = new RenderSource();
                source.id = "child-1";
                const view = template.create();

                view.bind(source);
                view.appendTo(targetNode);

                return {
                    sourceMatch: view.source === source,
                    html: toHTML(targetNode.firstElementChild),
                };
            });

            expect(result.sourceMatch).toBe(true);
            expect(result.html).toBe("This is a template. value");
        });

        test("creates a template with content binding that can change when the source value changes", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { RenderInstruction, Observable, html, toHTML, Updates } =
                    await import("/main.js");

                class RenderSource {}
                Observable.defineProperty(RenderSource.prototype, "knownValue");
                RenderSource.prototype.knownValue = "value";

                const sourceTemplate = html`
                    This is a template. ${x => x.knownValue}
                `;

                const templateAttributeOptions = {
                    attributes: { id: x => x.id },
                };

                const template = RenderInstruction.createElementTemplate("button", {
                    ...templateAttributeOptions,
                    content: sourceTemplate,
                });

                const targetNode = document.createElement("div");
                const source = new RenderSource();
                source.id = "child-1";
                const view = template.create();

                view.bind(source);
                view.appendTo(targetNode);

                const before = toHTML(targetNode.firstElementChild);

                source.knownValue = "new-value";

                await Updates.next();

                const after = toHTML(targetNode.firstElementChild);

                return { sourceMatch: view.source === source, before, after };
            });

            expect(result.sourceMatch).toBe(true);
            expect(result.before).toBe("This is a template. value");
            expect(result.after).toBe("This is a template. new-value");
        });

        test("creates a template with a ref directive on the host tag", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { RenderInstruction, Observable, ref, toHTML, Updates } =
                    await import("/main.js");

                class RenderSource {}
                Observable.defineProperty(RenderSource.prototype, "knownValue");
                Observable.defineProperty(RenderSource.prototype, "ref");
                Observable.defineProperty(RenderSource.prototype, "childElements");
                RenderSource.prototype.knownValue = "value";

                const templateStaticViewOptions = {
                    content: "foo",
                };

                const template = RenderInstruction.createElementTemplate("button", {
                    directives: [ref("ref")],
                    ...templateStaticViewOptions,
                });

                const targetNode = document.createElement("div");
                const source = new RenderSource();
                const view = template.create();
                view.bind(source);
                view.appendTo(targetNode);

                await Updates.next();

                return {
                    sourceMatch: view.source === source,
                    isHTMLElement: source.ref instanceof HTMLElement,
                };
            });

            expect(result.sourceMatch).toBe(true);
            expect(result.isHTMLElement).toBe(true);
        });

        test("creates a template with ref and children directives on the host tag", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    RenderInstruction,
                    Observable,
                    ref,
                    children,
                    elements,
                    html,
                    toHTML,
                    Updates,
                } = await import("/main.js");

                class RenderSource {}
                Observable.defineProperty(RenderSource.prototype, "knownValue");
                Observable.defineProperty(RenderSource.prototype, "ref");
                Observable.defineProperty(RenderSource.prototype, "childElements");
                RenderSource.prototype.knownValue = "value";

                const template = RenderInstruction.createElementTemplate("ul", {
                    directives: [
                        ref("ref"),
                        children({ property: "childElements", filter: elements() }),
                    ],
                    content: html`
                        <li>item-1</li>
                        <li>item-1</li>
                        <li>item-1</li>
                    `,
                });

                const targetNode = document.createElement("div");
                const source = new RenderSource();
                const view = template.create();
                view.bind(source);
                view.appendTo(targetNode);

                await Updates.next();

                return {
                    sourceMatch: view.source === source,
                    isHTMLElement: source.ref instanceof HTMLElement,
                    childCount: source.childElements.length,
                };
            });

            expect(result.sourceMatch).toBe(true);
            expect(result.isHTMLElement).toBe(true);
            expect(result.childCount).toBe(3);
        });
    });
});
