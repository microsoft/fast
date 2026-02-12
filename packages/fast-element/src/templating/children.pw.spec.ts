import { expect, test } from "@playwright/test";

test.describe("The children", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test.describe("template function", () => {
        test("returns an ChildrenDirective", async ({ page }) => {
            const isInstance = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { children, ChildrenDirective } = await import("/main.js");

                const directive = children("test");
                return directive instanceof ChildrenDirective;
            });

            expect(isInstance).toBe(true);
        });
    });

    test.describe("directive", () => {
        test("creates a behavior by returning itself", async ({ page }) => {
            const isSame = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { children, ChildrenDirective } = await import("/main.js");

                const directive = children("test") as InstanceType<
                    typeof ChildrenDirective
                >;
                const behavior = directive.createBehavior();
                return behavior === behavior;
            });

            expect(isSame).toBe(true);
        });
    });

    test.describe("behavior", () => {
        test("gathers child nodes", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { ChildrenDirective, Observable, Fake } = await import("/main.js");

                class Model {
                    nodes: any;
                    reference: any;
                }

                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host: HTMLElement, elementName = "div") {
                    const children = new Array(10);
                    for (let i = 0, ii = children.length; i < ii; ++i) {
                        const child = document.createElement(
                            i % 1 === 0 ? elementName : "div"
                        );
                        children[i] = child;
                        host.appendChild(child);
                    }
                    return children;
                }

                const host = document.createElement("div");
                const children = createAndAppendChildren(host);
                const nodeId = "r";
                const targets = { [nodeId]: host };

                const behavior = new ChildrenDirective({
                    property: "nodes",
                });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = Fake.viewController(targets, behavior);

                controller.bind(model);

                const nodesLength = model.nodes.length;
                const childrenLength = children.length;
                const allMatch = children.every(
                    (c: any, i: number) => model.nodes[i] === c
                );

                return { nodesLength, childrenLength, allMatch };
            });

            expect(result.nodesLength).toBe(result.childrenLength);
            expect(result.allMatch).toBe(true);
        });

        test("gathers child nodes with a filter", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { ChildrenDirective, Observable, Fake, elements } = await import(
                    "/main.js"
                );

                class Model {
                    nodes: any;
                    reference: any;
                }

                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host: HTMLElement, elementName = "div") {
                    const children = new Array(10);
                    for (let i = 0, ii = children.length; i < ii; ++i) {
                        const child = document.createElement(
                            i % 1 === 0 ? elementName : "div"
                        );
                        children[i] = child;
                        host.appendChild(child);
                    }
                    return children;
                }

                const host = document.createElement("div");
                const children = createAndAppendChildren(host, "foo-bar");
                const nodeId = "r";
                const targets = { [nodeId]: host };

                const behavior = new ChildrenDirective({
                    property: "nodes",
                    filter: elements("foo-bar"),
                });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = Fake.viewController(targets, behavior);

                controller.bind(model);

                const filtered = children.filter(elements("foo-bar"));
                const nodesLength = model.nodes.length;
                const filteredLength = filtered.length;
                const allMatch = filtered.every(
                    (c: any, i: number) => model.nodes[i] === c
                );

                return { nodesLength, filteredLength, allMatch };
            });

            expect(result.nodesLength).toBe(result.filteredLength);
            expect(result.allMatch).toBe(true);
        });

        test("updates child nodes when they change", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { ChildrenDirective, Observable, Fake, Updates } = await import(
                    "/main.js"
                );

                class Model {
                    nodes: any;
                    reference: any;
                }

                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host: HTMLElement, elementName = "div") {
                    const children = new Array(10);
                    for (let i = 0, ii = children.length; i < ii; ++i) {
                        const child = document.createElement(
                            i % 1 === 0 ? elementName : "div"
                        );
                        children[i] = child;
                        host.appendChild(child);
                    }
                    return children;
                }

                const host = document.createElement("div");
                const children = createAndAppendChildren(host, "foo-bar");
                const nodeId = "r";
                const targets = { [nodeId]: host };

                const behavior = new ChildrenDirective({
                    property: "nodes",
                });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = Fake.viewController(targets, behavior);

                controller.bind(model);

                const initialMatch = children.every(
                    (c: any, i: number) => model.nodes[i] === c
                );
                const initialLength = model.nodes.length;

                const updatedChildren = children.concat(createAndAppendChildren(host));

                await Updates.next();

                const updatedMatch = updatedChildren.every(
                    (c: any, i: number) => model.nodes[i] === c
                );
                const updatedLength = model.nodes.length;

                return {
                    initialMatch,
                    initialLength,
                    updatedMatch,
                    updatedLength,
                    expectedUpdatedLength: updatedChildren.length,
                };
            });

            expect(result.initialMatch).toBe(true);
            expect(result.initialLength).toBe(10);
            expect(result.updatedMatch).toBe(true);
            expect(result.updatedLength).toBe(result.expectedUpdatedLength);
        });

        test("updates child nodes when they change with a filter", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { ChildrenDirective, Observable, Fake, Updates, elements } =
                    await import("/main.js");

                class Model {
                    nodes: any;
                    reference: any;
                }

                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host: HTMLElement, elementName = "div") {
                    const children = new Array(10);
                    for (let i = 0, ii = children.length; i < ii; ++i) {
                        const child = document.createElement(
                            i % 1 === 0 ? elementName : "div"
                        );
                        children[i] = child;
                        host.appendChild(child);
                    }
                    return children;
                }

                const host = document.createElement("div");
                const children = createAndAppendChildren(host, "foo-bar");
                const nodeId = "r";
                const targets = { [nodeId]: host };

                const behavior = new ChildrenDirective({
                    property: "nodes",
                    filter: elements("foo-bar"),
                });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = Fake.viewController(targets, behavior);

                controller.bind(model);

                const initialFiltered = children.filter(elements("foo-bar"));
                const initialMatch = initialFiltered.every(
                    (c: any, i: number) => model.nodes[i] === c
                );
                const initialLength = model.nodes.length;

                const updatedChildren = children.concat(createAndAppendChildren(host));

                await Updates.next();

                const updatedFiltered = updatedChildren.filter(elements("foo-bar"));
                const updatedMatch = updatedFiltered.every(
                    (c: any, i: number) => model.nodes[i] === c
                );
                const updatedLength = model.nodes.length;

                return {
                    initialMatch,
                    initialLength,
                    expectedInitialLength: initialFiltered.length,
                    updatedMatch,
                    updatedLength,
                    expectedUpdatedLength: updatedFiltered.length,
                };
            });

            expect(result.initialMatch).toBe(true);
            expect(result.initialLength).toBe(result.expectedInitialLength);
            expect(result.updatedMatch).toBe(true);
            expect(result.updatedLength).toBe(result.expectedUpdatedLength);
        });

        test("updates subtree nodes when they change with a selector", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { ChildrenDirective, Observable, Fake, Updates } = await import(
                    "/main.js"
                );

                class Model {
                    nodes: any;
                    reference: any;
                }

                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host: HTMLElement, elementName = "div") {
                    const children = new Array(10);
                    for (let i = 0, ii = children.length; i < ii; ++i) {
                        const child = document.createElement(
                            i % 1 === 0 ? elementName : "div"
                        );
                        children[i] = child;
                        host.appendChild(child);
                    }
                    return children;
                }

                const host = document.createElement("div");
                const children = createAndAppendChildren(host, "foo-bar");
                const nodeId = "r";
                const targets = { [nodeId]: host };

                const subtreeElement = "foo-bar-baz";
                const subtreeChildren: HTMLElement[] = [];

                for (let child of children) {
                    for (let i = 0; i < 3; ++i) {
                        const subChild = document.createElement("foo-bar-baz");
                        subtreeChildren.push(subChild);
                        child.appendChild(subChild);
                    }
                }

                const behavior = new ChildrenDirective({
                    property: "nodes",
                    subtree: true,
                    selector: subtreeElement,
                });
                behavior.targetNodeId = nodeId;

                const model = new Model();
                const controller = Fake.viewController(targets, behavior);

                controller.bind(model);

                const initialMatch = subtreeChildren.every(
                    (c: any, i: number) => model.nodes[i] === c
                );
                const initialLength = model.nodes.length;

                const newChildren = createAndAppendChildren(host);

                for (let child of newChildren) {
                    for (let i = 0; i < 3; ++i) {
                        const subChild = document.createElement("foo-bar-baz");
                        subtreeChildren.push(subChild);
                        child.appendChild(subChild);
                    }
                }

                await Updates.next();

                const updatedMatch = subtreeChildren.every(
                    (c: any, i: number) => model.nodes[i] === c
                );
                const updatedLength = model.nodes.length;

                return {
                    initialMatch,
                    initialLength,
                    expectedInitialLength: 30,
                    updatedMatch,
                    updatedLength,
                    expectedUpdatedLength: subtreeChildren.length,
                };
            });

            expect(result.initialMatch).toBe(true);
            expect(result.initialLength).toBe(result.expectedInitialLength);
            expect(result.updatedMatch).toBe(true);
            expect(result.updatedLength).toBe(result.expectedUpdatedLength);
        });

        test("clears and unwatches when unbound", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { ChildrenDirective, Observable, Fake, Updates } = await import(
                    "/main.js"
                );

                class Model {
                    nodes: any;
                    reference: any;
                }

                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host: HTMLElement, elementName = "div") {
                    const children = new Array(10);
                    for (let i = 0, ii = children.length; i < ii; ++i) {
                        const child = document.createElement(
                            i % 1 === 0 ? elementName : "div"
                        );
                        children[i] = child;
                        host.appendChild(child);
                    }
                    return children;
                }

                const host = document.createElement("div");
                const children = createAndAppendChildren(host, "foo-bar");
                const nodeId = "r";
                const targets = { [nodeId]: host };

                const behavior = new ChildrenDirective({
                    property: "nodes",
                });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = Fake.viewController(targets, behavior);

                controller.bind(model);

                const initialMatch = children.every(
                    (c: any, i: number) => model.nodes[i] === c
                );
                const initialLength = model.nodes.length;

                behavior.unbind(controller);

                const afterUnbindLength = model.nodes.length;

                host.appendChild(document.createElement("div"));

                await Updates.next();

                const afterMutationLength = model.nodes.length;

                return {
                    initialMatch,
                    initialLength,
                    afterUnbindLength,
                    afterMutationLength,
                };
            });

            expect(result.initialMatch).toBe(true);
            expect(result.initialLength).toBe(10);
            expect(result.afterUnbindLength).toBe(0);
            expect(result.afterMutationLength).toBe(0);
        });

        test("should not throw if DOM stringified", async ({ page }) => {
            const didNotThrow = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { children, Observable, html, ref } = await import("/main.js");

                class Model {
                    nodes: any;
                    reference: any;
                }

                Observable.defineProperty(Model.prototype, "nodes");

                const template = html`
                    <div id="test" ${children("nodes")} ${ref("reference")}></div>
                `;

                const view = template.create();
                const model = new Model();

                view.bind(model);

                try {
                    JSON.stringify(model.reference);
                    return true;
                } catch {
                    return false;
                } finally {
                    view.unbind();
                }
            });

            expect(didNotThrow).toBe(true);
        });

        test("supports multiple directives for the same element", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { ChildrenDirective, Observable, Fake, Updates, elements } =
                    await import("/main.js");

                class Model {
                    nodes: any;
                    reference: any;
                }

                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host: HTMLElement, elementName = "div") {
                    const children = new Array(10);
                    for (let i = 0, ii = children.length; i < ii; ++i) {
                        const child = document.createElement(
                            i % 1 === 0 ? elementName : "div"
                        );
                        children[i] = child;
                        host.appendChild(child);
                    }
                    return children;
                }

                const host = document.createElement("div");
                createAndAppendChildren(host, "foo-bar");
                const nodeId = "r";
                const targets = { [nodeId]: host };

                class MultipleDirectivesModel {
                    elements: Element[] = [];
                    text: Text[] = [];
                }

                Observable.defineProperty(MultipleDirectivesModel.prototype, "elements");
                Observable.defineProperty(MultipleDirectivesModel.prototype, "text");

                const elementsDirective = new ChildrenDirective({
                    property: "elements",
                    filter: elements(),
                });

                const textDirective = new ChildrenDirective({
                    property: "text",
                    filter: (value: any) => value.nodeType === Node.TEXT_NODE,
                });
                elementsDirective.targetNodeId = nodeId;
                textDirective.targetNodeId = nodeId;
                const model = new MultipleDirectivesModel();
                const controller = Fake.viewController(
                    targets,
                    elementsDirective,
                    textDirective
                );

                controller.bind(model);

                elementsDirective.bind(controller);
                textDirective.bind(controller);
                const element = document.createElement("div");
                const text = document.createTextNode("text");

                host.appendChild(element);
                host.appendChild(text);

                await Updates.next();

                return {
                    elementsIncludesElement: model.elements.includes(element),
                    elementsIncludesText: model.elements.includes(text as any),
                    textIncludesText: model.text.includes(text),
                    textIncludesElement: model.text.includes(element as any),
                };
            });

            expect(result.elementsIncludesElement).toBe(true);
            expect(result.elementsIncludesText).toBe(false);
            expect(result.textIncludesText).toBe(true);
            expect(result.textIncludesElement).toBe(false);
        });
    });
});
