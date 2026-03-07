import { expect, test } from "@playwright/test";

test.describe("The slotted", () => {
    test.describe("template function", () => {
        test("returns an ChildrenDirective", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { slotted, SlottedDirective } = await import("/main.js");

                const directive = slotted("test");
                return directive instanceof SlottedDirective;
            });

            expect(result).toBe(true);
        });
    });

    test.describe("directive", () => {
        test("creates a behavior by returning itself", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { slotted, SlottedDirective } = await import("/main.js");

                const nodeId = "r";
                const directive = slotted("test");
                directive.targetNodeId = nodeId;
                const behavior = directive.createBehavior();

                return behavior === directive;
            });

            expect(result).toBe(true);
        });
    });

    test.describe("behavior", () => {
        test("gathers nodes from a slot", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake } = await import("/main.js");

                class Model {
                    nodes;
                    reference;
                }
                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host, elementName = "div") {
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

                function createDOM(elementName = "div") {
                    const host = document.createElement("div");
                    const slot = document.createElement("slot");
                    const shadowRoot = host.attachShadow({ mode: "open" });
                    const children = createAndAppendChildren(host, elementName);
                    const nodeId = "r";
                    const targets = { [nodeId]: slot };
                    shadowRoot.appendChild(slot);
                    return { host, slot, children, targets, nodeId };
                }

                function createController(source, targets) {
                    return {
                        source,
                        targets,
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    };
                }

                const { children, targets, nodeId } = createDOM();
                const behavior = new SlottedDirective({ property: "nodes" });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = createController(model, targets);

                behavior.bind(controller);

                if (model.nodes.length !== children.length) return false;
                for (let i = 0; i < children.length; i++) {
                    if (model.nodes[i] !== children[i]) return false;
                }
                return true;
            });

            expect(result).toBe(true);
        });

        test("gathers nodes from a slot with a filter", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, elements } = await import(
                    "/main.js"
                );

                class Model {
                    nodes;
                    reference;
                }
                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host, elementName = "div") {
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

                function createDOM(elementName = "div") {
                    const host = document.createElement("div");
                    const slot = document.createElement("slot");
                    const shadowRoot = host.attachShadow({ mode: "open" });
                    const children = createAndAppendChildren(host, elementName);
                    const nodeId = "r";
                    const targets = { [nodeId]: slot };
                    shadowRoot.appendChild(slot);
                    return { host, slot, children, targets, nodeId };
                }

                function createController(source, targets) {
                    return {
                        source,
                        targets,
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    };
                }

                const { targets, nodeId, children } = createDOM("foo-bar");
                const behavior = new SlottedDirective({
                    property: "nodes",
                    filter: elements("foo-bar"),
                });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = createController(model, targets);

                behavior.bind(controller);

                const filtered = children.filter(elements("foo-bar"));
                if (model.nodes.length !== filtered.length) return false;
                for (let i = 0; i < filtered.length; i++) {
                    if (model.nodes[i] !== filtered[i]) return false;
                }
                return true;
            });

            expect(result).toBe(true);
        });

        test("updates when slotted nodes change", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, Updates } = await import(
                    "/main.js"
                );

                class Model {
                    nodes;
                    reference;
                }
                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host, elementName = "div") {
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

                function createDOM(elementName = "div") {
                    const host = document.createElement("div");
                    const slot = document.createElement("slot");
                    const shadowRoot = host.attachShadow({ mode: "open" });
                    const children = createAndAppendChildren(host, elementName);
                    const nodeId = "r";
                    const targets = { [nodeId]: slot };
                    shadowRoot.appendChild(slot);
                    return { host, slot, children, targets, nodeId };
                }

                function createController(source, targets) {
                    return {
                        source,
                        targets,
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    };
                }

                const { host, slot, children, targets, nodeId } = createDOM("foo-bar");
                const behavior = new SlottedDirective({ property: "nodes" });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = createController(model, targets);

                behavior.bind(controller);

                const beforeMatch =
                    model.nodes.length === children.length &&
                    children.every((c, i) => model.nodes[i] === c);

                const updatedChildren = children.concat(createAndAppendChildren(host));

                await Updates.next();

                const afterMatch =
                    model.nodes.length === updatedChildren.length &&
                    updatedChildren.every((c, i) => model.nodes[i] === c);

                return beforeMatch && afterMatch;
            });

            expect(result).toBe(true);
        });

        test("updates when slotted nodes change with a filter", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, Updates, elements } =
                    await import("/main.js");

                class Model {
                    nodes;
                    reference;
                }
                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host, elementName = "div") {
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

                function createDOM(elementName = "div") {
                    const host = document.createElement("div");
                    const slot = document.createElement("slot");
                    const shadowRoot = host.attachShadow({ mode: "open" });
                    const children = createAndAppendChildren(host, elementName);
                    const nodeId = "r";
                    const targets = { [nodeId]: slot };
                    shadowRoot.appendChild(slot);
                    return { host, slot, children, targets, nodeId };
                }

                function createController(source, targets) {
                    return {
                        source,
                        targets,
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    };
                }

                const { host, slot, children, targets, nodeId } = createDOM("foo-bar");
                const behavior = new SlottedDirective({
                    property: "nodes",
                    filter: elements("foo-bar"),
                });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = createController(model, targets);

                behavior.bind(controller);

                const beforeMatch =
                    model.nodes.length === children.length &&
                    children.every((c, i) => model.nodes[i] === c);

                const updatedChildren = children.concat(createAndAppendChildren(host));

                await Updates.next();

                const filtered = updatedChildren.filter(elements("foo-bar"));
                const afterMatch =
                    model.nodes.length === filtered.length &&
                    filtered.every((c, i) => model.nodes[i] === c);

                return beforeMatch && afterMatch;
            });

            expect(result).toBe(true);
        });

        test("clears and unwatches when unbound", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, Updates } = await import(
                    "/main.js"
                );

                class Model {
                    nodes;
                    reference;
                }
                Observable.defineProperty(Model.prototype, "nodes");

                function createAndAppendChildren(host, elementName = "div") {
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

                function createDOM(elementName = "div") {
                    const host = document.createElement("div");
                    const slot = document.createElement("slot");
                    const shadowRoot = host.attachShadow({ mode: "open" });
                    const children = createAndAppendChildren(host, elementName);
                    const nodeId = "r";
                    const targets = { [nodeId]: slot };
                    shadowRoot.appendChild(slot);
                    return { host, slot, children, targets, nodeId };
                }

                function createController(source, targets) {
                    return {
                        source,
                        targets,
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    };
                }

                const { host, slot, children, targets, nodeId } = createDOM("foo-bar");
                const behavior = new SlottedDirective({ property: "nodes" });
                behavior.targetNodeId = nodeId;
                const model = new Model();
                const controller = createController(model, targets);

                behavior.bind(controller);

                const beforeMatch =
                    model.nodes.length === children.length &&
                    children.every((c, i) => model.nodes[i] === c);

                behavior.unbind(controller);

                const afterUnbind = model.nodes.length === 0;

                host.appendChild(document.createElement("div"));

                await Updates.next();

                const stillEmpty = model.nodes.length === 0;

                return beforeMatch && afterUnbind && stillEmpty;
            });

            expect(result).toBe(true);
        });

        test("should not throw if DOM stringified", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, html, slotted, ref } =
                    await import("/main.js");

                class Model {
                    nodes;
                    reference;
                }
                Observable.defineProperty(Model.prototype, "nodes");

                const template = html`
                    <slot id="test"
                         ${slotted("nodes")}
                         ${ref("reference")}>
                    </div>
                `;

                const view = template.create();
                const model = new Model();

                view.bind(model);

                let didThrow = false;
                try {
                    JSON.stringify(model.reference);
                } catch (e) {
                    didThrow = true;
                }

                view.unbind();

                return !didThrow;
            });

            expect(result).toBe(true);
        });
    });
});
