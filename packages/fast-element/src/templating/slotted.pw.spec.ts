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
                            i % 1 === 0 ? elementName : "div",
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
                            i % 1 === 0 ? elementName : "div",
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
                            i % 1 === 0 ? elementName : "div",
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
                            i % 1 === 0 ? elementName : "div",
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
                            i % 1 === 0 ? elementName : "div",
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

    test.describe("behavior with the single option", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/");
        });

        test("assigns a single node rather than an array", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, elements } = await import(
                    "/main.js"
                );

                class Model {
                    node;
                }
                Observable.defineProperty(Model.prototype, "node");

                const host = document.createElement("div");
                const slot = document.createElement("slot");
                host.attachShadow({ mode: "open" }).appendChild(slot);
                const child = document.createElement("div");
                host.appendChild(child);

                const behavior = new SlottedDirective({
                    property: "node",
                    filter: elements(),
                    single: true,
                });
                behavior.targetNodeId = "r";
                const model = new Model();

                behavior.bind({
                    source: model,
                    targets: { r: slot },
                    context: Fake.executionContext(),
                    isBound: false,
                    onUnbind() {},
                });

                return {
                    isArray: Array.isArray(model.node),
                    isChild: model.node === child,
                };
            });

            expect(result.isArray).toBe(false);
            expect(result.isChild).toBe(true);
        });

        test("assigns null and notifies when the slot is empty", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, elements } = await import(
                    "/main.js"
                );

                class Model {
                    node;
                }
                Observable.defineProperty(Model.prototype, "node");

                const host = document.createElement("div");
                const slot = document.createElement("slot");
                host.attachShadow({ mode: "open" }).appendChild(slot);

                const behavior = new SlottedDirective({
                    property: "node",
                    filter: elements(),
                    single: true,
                });
                behavior.targetNodeId = "r";
                const model = new Model();
                const controller = {
                    source: model,
                    targets: { r: slot },
                    context: Fake.executionContext(),
                    isBound: false,
                    onUnbind() {},
                };

                let notifyCount = 0;
                Observable.getNotifier(model).subscribe(
                    { handleChange: () => notifyCount++ },
                    "node",
                );

                behavior.bind(controller);

                return {
                    isNull: model.node === null,
                    isUndefined: model.node === undefined,
                    isArray: Array.isArray(model.node),
                    notifyCount,
                };
            });

            expect(result.isNull).toBe(true);
            expect(result.isUndefined).toBe(false);
            expect(result.isArray).toBe(false);
            expect(result.notifyCount).toBe(1);
        });

        test("does not re-notify when the first match is unchanged", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, Updates, elements } =
                    await import("/main.js");

                class Model {
                    node;
                    nodes;
                }
                Observable.defineProperty(Model.prototype, "node");
                Observable.defineProperty(Model.prototype, "nodes");

                function createDOM() {
                    const host = document.createElement("div");
                    const slot = document.createElement("slot");
                    host.attachShadow({ mode: "open" }).appendChild(slot);
                    host.appendChild(document.createElement("div"));
                    document.body.appendChild(host);
                    return { host, slot };
                }

                function createController(source, slot) {
                    return {
                        source,
                        targets: { r: slot },
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    };
                }

                const single = createDOM();
                const singleBehavior = new SlottedDirective({
                    property: "node",
                    filter: elements(),
                    single: true,
                });
                singleBehavior.targetNodeId = "r";
                const singleModel = new Model();

                const array = createDOM();
                const arrayBehavior = new SlottedDirective({
                    property: "nodes",
                    filter: elements(),
                });
                arrayBehavior.targetNodeId = "r";
                const arrayModel = new Model();

                singleBehavior.bind(createController(singleModel, single.slot));
                arrayBehavior.bind(createController(arrayModel, array.slot));

                let singleNotifies = 0;
                let arrayNotifies = 0;
                Observable.getNotifier(singleModel).subscribe(
                    { handleChange: () => singleNotifies++ },
                    "node",
                );
                Observable.getNotifier(arrayModel).subscribe(
                    { handleChange: () => arrayNotifies++ },
                    "nodes",
                );

                // Appending leaves the first match untouched.
                single.host.appendChild(document.createElement("div"));
                array.host.appendChild(document.createElement("div"));

                await Updates.next();

                const afterAppend = { singleNotifies, arrayNotifies };

                // Prepending changes the first match.
                const prepended = document.createElement("div");
                single.host.insertBefore(prepended, single.host.firstChild);

                await Updates.next();

                return {
                    appendSingleNotifies: afterAppend.singleNotifies,
                    appendArrayNotifies: afterAppend.arrayNotifies,
                    prependSingleNotifies: singleNotifies - afterAppend.singleNotifies,
                    isPrepended: singleModel.node === prepended,
                };
            });

            expect(result.appendSingleNotifies).toBe(0);
            expect(result.appendArrayNotifies).toBe(1);
            expect(result.prependSingleNotifies).toBe(1);
            expect(result.isPrepended).toBe(true);
        });

        test("assigns null when the filter matches nothing", async ({ page }) => {
            const isNull = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, elements } = await import(
                    "/main.js"
                );

                class Model {
                    node;
                }
                Observable.defineProperty(Model.prototype, "node");

                const host = document.createElement("div");
                const slot = document.createElement("slot");
                host.attachShadow({ mode: "open" }).appendChild(slot);
                host.appendChild(document.createElement("div"));

                const behavior = new SlottedDirective({
                    property: "node",
                    filter: elements("does-not-match"),
                    single: true,
                });
                behavior.targetNodeId = "r";
                const model = new Model();

                behavior.bind({
                    source: model,
                    targets: { r: slot },
                    context: Fake.executionContext(),
                    isBound: false,
                    onUnbind() {},
                });

                return model.node === null;
            });

            expect(isNull).toBe(true);
        });

        test("assigns the first match in document order when many match", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, elements } = await import(
                    "/main.js"
                );

                class Model {
                    node;
                }
                Observable.defineProperty(Model.prototype, "node");

                const host = document.createElement("div");
                const slot = document.createElement("slot");
                host.attachShadow({ mode: "open" }).appendChild(slot);
                const matches = [0, 1, 2].map(() => {
                    const child = document.createElement("foo-bar");
                    host.appendChild(child);
                    return child;
                });

                const behavior = new SlottedDirective({
                    property: "node",
                    filter: elements("foo-bar"),
                    single: true,
                });
                behavior.targetNodeId = "r";
                const model = new Model();

                let didThrow = false;
                try {
                    behavior.bind({
                        source: model,
                        targets: { r: slot },
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    });
                } catch {
                    didThrow = true;
                }

                return { isFirst: model.node === matches[0], didThrow };
            });

            expect(result.didThrow).toBe(false);
            expect(result.isFirst).toBe(true);
        });

        test("assigns the leading text node when no filter is provided", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, elements } = await import(
                    "/main.js"
                );

                class Model {
                    node;
                }
                Observable.defineProperty(Model.prototype, "node");

                function createDOM() {
                    const host = document.createElement("div");
                    const slot = document.createElement("slot");
                    host.attachShadow({ mode: "open" }).appendChild(slot);
                    host.innerHTML = "\n    <div></div>\n";
                    return { host, slot };
                }

                function bind(options, slot) {
                    const behavior = new SlottedDirective(options);
                    behavior.targetNodeId = "r";
                    const model = new Model();
                    behavior.bind({
                        source: model,
                        targets: { r: slot },
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    });
                    return model;
                }

                const unfiltered = createDOM();
                const filtered = createDOM();

                const unfilteredModel = bind(
                    { property: "node", single: true },
                    unfiltered.slot,
                );
                const filteredModel = bind(
                    { property: "node", single: true, filter: elements() },
                    filtered.slot,
                );

                return {
                    unfilteredNodeType: unfilteredModel.node.nodeType,
                    filteredNodeType: filteredModel.node.nodeType,
                    filteredTagName: filteredModel.node.tagName,
                };
            });

            expect(result.unfilteredNodeType).toBe(3);
            expect(result.filteredNodeType).toBe(1);
            expect(result.filteredTagName).toBe("DIV");
        });

        test("resolves default content when combined with flatten", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, elements } = await import(
                    "/main.js"
                );

                class Model {
                    node;
                }
                Observable.defineProperty(Model.prototype, "node");

                const host = document.createElement("div");
                const shadowRoot = host.attachShadow({ mode: "open" });
                shadowRoot.innerHTML = "<slot>\n    <div></div>\n</slot>";
                const slot = shadowRoot.querySelector("slot");

                const behavior = new SlottedDirective({
                    property: "node",
                    filter: elements(),
                    flatten: true,
                    single: true,
                });
                behavior.targetNodeId = "r";
                const model = new Model();

                behavior.bind({
                    source: model,
                    targets: { r: slot },
                    context: Fake.executionContext(),
                    isBound: false,
                    onUnbind() {},
                });

                return {
                    isNull: model.node === null,
                    tagName: model.node ? model.node.tagName : null,
                };
            });

            // flatten falls back to the slot's default content, so an empty slot
            // does not resolve to null.
            expect(result.isNull).toBe(false);
            expect(result.tagName).toBe("DIV");
        });

        test("treats a false or undefined single option as absent", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, slotted } = await import(
                    "/main.js"
                );

                class Model {
                    node;
                }
                Observable.defineProperty(Model.prototype, "node");

                function bind(behavior) {
                    const host = document.createElement("div");
                    const slot = document.createElement("slot");
                    host.attachShadow({ mode: "open" }).appendChild(slot);
                    host.appendChild(document.createElement("div"));

                    behavior.targetNodeId = "r";
                    const model = new Model();
                    behavior.bind({
                        source: model,
                        targets: { r: slot },
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    });
                    return model;
                }

                const explicitFalse = bind(
                    new SlottedDirective({ property: "node", single: false }),
                );
                const explicitUndefined = bind(
                    new SlottedDirective({ property: "node", single: undefined }),
                );
                const absent = bind(new SlottedDirective({ property: "node" }));
                const shorthand = bind(slotted("node"));

                return {
                    explicitFalse: Array.isArray(explicitFalse.node),
                    explicitUndefined: Array.isArray(explicitUndefined.node),
                    absent: Array.isArray(absent.node),
                    shorthand: Array.isArray(shorthand.node),
                };
            });

            expect(result.explicitFalse).toBe(true);
            expect(result.explicitUndefined).toBe(true);
            expect(result.absent).toBe(true);
            expect(result.shorthand).toBe(true);
        });

        test("clears to null when unbound and repopulates when rebound", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Observable, Fake, elements } = await import(
                    "/main.js"
                );

                class Model {
                    node;
                }
                Observable.defineProperty(Model.prototype, "node");

                const host = document.createElement("div");
                const slot = document.createElement("slot");
                host.attachShadow({ mode: "open" }).appendChild(slot);
                const child = document.createElement("div");
                host.appendChild(child);

                const behavior = new SlottedDirective({
                    property: "node",
                    filter: elements(),
                    single: true,
                });
                behavior.targetNodeId = "r";
                const model = new Model();
                const controller = {
                    source: model,
                    targets: { r: slot },
                    context: Fake.executionContext(),
                    isBound: false,
                    onUnbind() {},
                };

                behavior.bind(controller);
                const bound = model.node === child;

                behavior.unbind(controller);
                const unbound = model.node === null;

                behavior.bind(controller);
                const rebound = model.node === child;

                return { bound, unbound, rebound };
            });

            expect(result.bound).toBe(true);
            expect(result.unbound).toBe(true);
            expect(result.rebound).toBe(true);
        });

        test("assigns to a non-observable property", async ({ page }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { SlottedDirective, Fake, elements } = await import("/main.js");

                class Model {
                    node;
                }

                const host = document.createElement("div");
                const slot = document.createElement("slot");
                host.attachShadow({ mode: "open" }).appendChild(slot);
                const child = document.createElement("div");
                host.appendChild(child);

                const behavior = new SlottedDirective({
                    property: "node",
                    filter: elements(),
                    single: true,
                });
                behavior.targetNodeId = "r";
                const model = new Model();

                let didThrow = false;
                try {
                    behavior.bind({
                        source: model,
                        targets: { r: slot },
                        context: Fake.executionContext(),
                        isBound: false,
                        onUnbind() {},
                    });
                } catch {
                    didThrow = true;
                }

                return { didThrow, isChild: model.node === child };
            });

            expect(result.didThrow).toBe(false);
            expect(result.isChild).toBe(true);
        });

        test("assigns per view when one template creates many views", async ({
            page,
        }) => {
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { Observable, elements, html, slotted } = await import("/main.js");

                class Model {
                    node;
                }
                Observable.defineProperty(Model.prototype, "node");

                const template = html`<slot
                    ${slotted({ property: "node", filter: elements(), single: true })}
                ></slot>`;

                function createView(tagName) {
                    const host = document.createElement("div");
                    const shadowRoot = host.attachShadow({ mode: "open" });
                    const child = document.createElement(tagName);
                    host.appendChild(child);
                    document.body.appendChild(host);

                    const view = template.create();
                    view.appendTo(shadowRoot);
                    const model = new Model();
                    view.bind(model);

                    return { model, child };
                }

                const first = createView("foo-one");
                const second = createView("foo-two");

                return {
                    first: first.model.node === first.child,
                    second: second.model.node === second.child,
                    distinct: first.model.node !== second.model.node,
                };
            });

            expect(result.first).toBe(true);
            expect(result.second).toBe(true);
            expect(result.distinct).toBe(true);
        });
    });
});
