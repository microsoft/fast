import { expect, test } from "@playwright/test";

test.describe("The HTML binding directive", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test.describe("when binding text content", () => {
        test("initially sets the text of a node", async ({ page }) => {
            const textContent = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HTMLBindingDirective, Observable, Fake, DOM, nextId, oneWay } =
                    await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                }

                Observable.defineProperty(Model.prototype, "value");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Model("This is a test");
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                return node.textContent;
            });

            expect(textContent!.trim()).toBe("This is a test");
        });

        test("updates the text of a node when the expression changes", async ({
            page,
        }) => {
            const { initial, updated } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    Updates,
                    nextId,
                    oneWay,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                }

                Observable.defineProperty(Model.prototype, "value");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Model("This is a test");
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const initial = node.textContent;

                model.value = "This is another test, different from the first.";
                await Updates.next();

                const updated = node.textContent;

                return { initial, updated };
            });

            expect(initial).toBe("This is a test");
            expect(updated).toBe("This is another test, different from the first.");
        });

        test("should not throw if DOM stringified", async ({ page }) => {
            const didNotThrow = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HTMLBindingDirective, Observable, Fake, DOM, nextId, oneWay } =
                    await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                }

                Observable.defineProperty(Model.prototype, "value");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Model("This is a test");
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                try {
                    JSON.stringify(node);
                    return true;
                } catch {
                    return false;
                }
            });

            expect(didNotThrow).toBe(true);
        });
    });

    test.describe("when binding template content", () => {
        test("initially inserts a view based on the template", async ({ page }) => {
            const parentHTML = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    html,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    knownValue = "value";
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(x: any) => x.knownValue}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                return toHTML(parentNode);
            });

            expect(parentHTML.trim()).toBe("This is a template. value");
        });

        test("removes an inserted view when the value changes to plain text", async ({
            page,
        }) => {
            const { initial, updated } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    Updates,
                    html,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    knownValue = "value";
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(x: any) => x.knownValue}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const initial = toHTML(parentNode);

                model.value = "This is a test.";
                await Updates.next();

                const updated = toHTML(parentNode);
                return { initial, updated };
            });

            expect(initial.trim()).toBe("This is a template. value");
            expect(updated.trim()).toBe("This is a test.");
        });

        test("removes an inserted view when the value changes to null", async ({
            page,
        }) => {
            const { initial, updated } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    Updates,
                    html,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    knownValue = "value";
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(x: any) => x.knownValue}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const initial = toHTML(parentNode);

                model.value = null;
                await Updates.next();

                const updated = toHTML(parentNode);
                return { initial, updated };
            });

            expect(initial.trim()).toBe("This is a template. value");
            expect(updated.trim()).toBe("");
        });

        test("removes an inserted view when the value changes to undefined", async ({
            page,
        }) => {
            const { initial, updated } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    Updates,
                    html,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    knownValue = "value";
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(x: any) => x.knownValue}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const initial = toHTML(parentNode);

                model.value = void 0;
                await Updates.next();

                const updated = toHTML(parentNode);
                return { initial, updated };
            });

            expect(initial.trim()).toBe("This is a template. value");
            expect(updated.trim()).toBe("");
        });

        test("updates an inserted view when the value changes to a new template", async ({
            page,
        }) => {
            const { initial, updated } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    Updates,
                    html,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    knownValue = "value";
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(x: any) => x.knownValue}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const initial = toHTML(parentNode);

                const newTemplate = html`
                    This is a new template ${(x: any) => x.knownValue}
                `;
                model.value = newTemplate;
                await Updates.next();

                const updated = toHTML(parentNode);
                return { initial, updated };
            });

            expect(initial.trim()).toBe("This is a template. value");
            expect(updated.trim()).toBe("This is a new template value");
        });

        test("reuses a previous view when the value changes back from a string", async ({
            page,
        }) => {
            const {
                isHTMLView,
                templateMatches,
                initialHTML,
                stringHTML,
                restoredHTML,
                viewReused,
                templateReused,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    Updates,
                    html,
                    HTMLView,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    knownValue = "value";
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(x: any) => x.knownValue}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const view = (node as any).$fastView;
                const capturedTemplate = (node as any).$fastTemplate;

                const isHTMLView = view instanceof HTMLView;
                const templateMatches = capturedTemplate === template;
                const initialHTML = toHTML(parentNode);

                model.value = "This is a test string.";
                await Updates.next();
                const stringHTML = toHTML(parentNode);

                model.value = template;
                await Updates.next();

                const newView = (node as any).$fastView;
                const newCapturedTemplate = (node as any).$fastTemplate;

                return {
                    isHTMLView,
                    templateMatches,
                    initialHTML,
                    stringHTML,
                    restoredHTML: toHTML(parentNode),
                    viewReused: newView === view,
                    templateReused: newCapturedTemplate === capturedTemplate,
                };
            });

            expect(isHTMLView).toBe(true);
            expect(templateMatches).toBe(true);
            expect(initialHTML.trim()).toBe("This is a template. value");
            expect(stringHTML.trim()).toBe("This is a test string.");
            expect(viewReused).toBe(true);
            expect(templateReused).toBe(true);
            expect(restoredHTML.trim()).toBe("This is a template. value");
        });

        test("doesn't compose an already composed view", async ({ page }) => {
            const { initial, updated } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    Updates,
                    html,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    trigger = 0;
                    knownValue = "value";

                    forceComputedUpdate() {
                        this.trigger++;
                    }

                    get computedValue() {
                        const trigger = this.trigger;
                        return this.value;
                    }
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "trigger");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(
                    oneWay((x: any) => x.computedValue)
                );
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(x: any) => x.knownValue}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const initial = toHTML(parentNode);

                model.value = template;
                model.forceComputedUpdate();
                await Updates.next();

                const updated = toHTML(parentNode);
                return { initial, updated };
            });

            expect(initial.trim()).toBe("This is a template. value");
            expect(updated.trim()).toBe("This is a template. value");
        });

        test("pipes the existing execution context through to the new view", async ({
            page,
        }) => {
            const parentHTML = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    html,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    trigger = 0;
                    knownValue = "value";

                    get computedValue() {
                        const trigger = this.trigger;
                        return this.value;
                    }
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "trigger");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(
                    oneWay((x: any) => x.computedValue)
                );
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(_x: any, c: any) => c.parent.testProp}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                const context = Fake.executionContext();
                context.parent = { testProp: "testing..." };

                controller.bind(model, context);

                return toHTML(parentNode);
            });

            expect(parentHTML.trim()).toBe("This is a template. testing...");
        });

        test("allows interpolated HTML tags in templates using html.partial", async ({
            page,
        }) => {
            const { initial, updated } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    Updates,
                    html,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    knownValue = "value";
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    ${(x: any) =>
                        html`<${html.partial(x.knownValue)}>Hi there!</${html.partial(
                            x.knownValue
                        )}>`}
                `;
                const model = new Model(template);
                model.knownValue = "button";
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const initial = toHTML(parentNode);

                model.knownValue = "a";
                await Updates.next();

                const updated = toHTML(parentNode);
                return { initial, updated };
            });

            expect(initial.trim()).toBe("<button>Hi there!</button>");
            expect(updated.trim()).toBe("<a>Hi there!</a>");
        });

        test("target node should not stringify $fastView or $fastTemplate", async ({
            page,
        }) => {
            const { hasFastView, hasFastTemplate } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    html,
                    nextId,
                    oneWay,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    knownValue = "value";
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(x: any) => x.knownValue}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const clone = JSON.parse(JSON.stringify(node));

                return {
                    hasFastView: "$fastView" in clone,
                    hasFastTemplate: "$fastTemplate" in clone,
                };
            });

            expect(hasFastView).toBe(false);
            expect(hasFastTemplate).toBe(false);
        });
    });

    test.describe("when unbinding template content", () => {
        test("unbinds a composed view", async ({ page }) => {
            const { sourceBeforeUnbind, htmlBefore, sourceAfterUnbind } =
                await page.evaluate(async () => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        Observable,
                        Fake,
                        DOM,
                        html,
                        nextId,
                        oneWay,
                        toHTML,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                        knownValue = "value";
                    }

                    Observable.defineProperty(Model.prototype, "value");
                    Observable.defineProperty(Model.prototype, "knownValue");

                    const directive = new HTMLBindingDirective(
                        oneWay((x: any) => x.value)
                    );
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = null;
                    directive.policy = DOM.policy;

                    const node = document.createTextNode(" ");
                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const template = html`
                        This is a template. ${(x: any) => x.knownValue}
                    `;
                    const model = new Model(template);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    const newView = (node as any).$fastView;
                    const sourceBeforeUnbind = newView.source === model;
                    const htmlBefore = toHTML(parentNode);

                    controller.unbind();

                    const sourceAfterUnbind = newView.source;

                    return {
                        sourceBeforeUnbind,
                        htmlBefore,
                        sourceAfterUnbind,
                    };
                });

            expect(sourceBeforeUnbind).toBe(true);
            expect(htmlBefore.trim()).toBe("This is a template. value");
            expect(sourceAfterUnbind).toBe(null);
        });

        test("rebinds a previously unbound composed view", async ({ page }) => {
            const {
                sourceBeforeUnbind,
                htmlBefore,
                sourceAfterUnbind,
                sourceAfterRebind,
                htmlAfterRebind,
            } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    Observable,
                    Fake,
                    DOM,
                    html,
                    nextId,
                    oneWay,
                    toHTML,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    knownValue = "value";
                }

                Observable.defineProperty(Model.prototype, "value");
                Observable.defineProperty(Model.prototype, "knownValue");

                const directive = new HTMLBindingDirective(oneWay((x: any) => x.value));
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = null;
                directive.policy = DOM.policy;

                const node = document.createTextNode(" ");
                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const template = html`
                    This is a template. ${(x: any) => x.knownValue}
                `;
                const model = new Model(template);
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const view = (node as any).$fastView;
                const sourceBeforeUnbind = view.source === model;
                const htmlBefore = toHTML(parentNode);

                controller.unbind();
                const sourceAfterUnbind = view.source;

                controller.bind(model);

                const newView = (node as any).$fastView;
                const sourceAfterRebind = newView.source === model;
                const htmlAfterRebind = toHTML(parentNode);

                return {
                    sourceBeforeUnbind,
                    htmlBefore,
                    sourceAfterUnbind,
                    sourceAfterRebind,
                    htmlAfterRebind,
                };
            });

            expect(sourceBeforeUnbind).toBe(true);
            expect(htmlBefore.trim()).toBe("This is a template. value");
            expect(sourceAfterUnbind).toBe(null);
            expect(sourceAfterRebind).toBe(true);
            expect(htmlAfterRebind.trim()).toBe("This is a template. value");
        });
    });

    test.describe("when binding on-change", () => {
        const aspectScenarios = [
            {
                name: "content",
                sourceAspect: "",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
            {
                name: "attribute",
                sourceAspect: "test-attribute",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
            {
                name: "boolean attribute",
                sourceAspect: "?test-boolean-attribute",
                originalValue: true,
                newValue: false,
            },
            {
                name: "property",
                sourceAspect: ":testProperty",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
        ];

        for (const aspectScenario of aspectScenarios) {
            test(`sets the initial value of a ${aspectScenario.name} binding`, async ({
                page,
            }) => {
                const { nodeValue, modelValue } = await page.evaluate(async scenario => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        HTMLDirective,
                        Observable,
                        Fake,
                        DOM,
                        nextId,
                        oneWay,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                    }

                    Observable.defineProperty(Model.prototype, "value");

                    const directive = new HTMLBindingDirective(
                        oneWay((x: any) => x.value)
                    );
                    if (scenario.sourceAspect) {
                        HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                    }

                    const node = document.createElement("div");
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = node.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const model = new Model(scenario.originalValue);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    let nodeValue: any;
                    if (scenario.sourceAspect === "") {
                        nodeValue = node.textContent;
                    } else if (scenario.sourceAspect.startsWith("?")) {
                        nodeValue = node.hasAttribute(scenario.sourceAspect.slice(1));
                    } else if (scenario.sourceAspect.startsWith(":")) {
                        nodeValue = (node as any)[scenario.sourceAspect.slice(1)];
                    } else {
                        nodeValue = node.getAttribute(scenario.sourceAspect);
                    }

                    return { nodeValue, modelValue: model.value };
                }, aspectScenario);

                expect(nodeValue).toBe(modelValue);
            });

            test(`updates the ${aspectScenario.name} when the model changes`, async ({
                page,
            }) => {
                const { initialValue, updatedNodeValue, updatedModelValue } =
                    await page.evaluate(async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            nextId,
                            oneWay,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const directive = new HTMLBindingDirective(
                            oneWay((x: any) => x.value)
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        const initialValue = getValue(node);

                        model.value = scenario.newValue;
                        await Updates.next();

                        const updatedNodeValue = getValue(node);

                        return {
                            initialValue,
                            updatedNodeValue,
                            updatedModelValue: model.value,
                        };
                    }, aspectScenario);

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(updatedNodeValue).toBe(updatedModelValue);
            });

            test(`doesn't update the ${aspectScenario.name} after unbind`, async ({
                page,
            }) => {
                const { initialValue, afterUnbindValue } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            nextId,
                            oneWay,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const directive = new HTMLBindingDirective(
                            oneWay((x: any) => x.value)
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        const initialValue = getValue(node);

                        controller.unbind();
                        model.value = scenario.newValue;
                        await Updates.next();

                        const afterUnbindValue = getValue(node);

                        return { initialValue, afterUnbindValue };
                    },
                    aspectScenario
                );

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(afterUnbindValue).toBe(aspectScenario.originalValue);
            });

            test(`uses the dom policy when setting a ${aspectScenario.name} binding`, async ({
                page,
            }) => {
                const { nodeValue, modelValue, policyUsed } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            nextId,
                            oneWay,
                            createTrackableDOMPolicy,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const policy = createTrackableDOMPolicy();
                        const directive = new HTMLBindingDirective(
                            oneWay((x: any) => x.value, policy)
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        return {
                            nodeValue: getValue(node),
                            modelValue: model.value,
                            policyUsed: policy.used,
                        };
                    },
                    aspectScenario
                );

                expect(nodeValue).toBe(modelValue);
                expect(policyUsed).toBe(true);
            });

            test(`should not throw if DOM stringified (on-change ${aspectScenario.name})`, async ({
                page,
            }) => {
                const didNotThrow = await page.evaluate(async scenario => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        HTMLDirective,
                        Observable,
                        Fake,
                        DOM,
                        nextId,
                        oneWay,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                    }

                    Observable.defineProperty(Model.prototype, "value");

                    const directive = new HTMLBindingDirective(
                        oneWay((x: any) => x.value)
                    );
                    if (scenario.sourceAspect) {
                        HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                    }

                    const node = document.createElement("div");
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = node.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const model = new Model(scenario.originalValue);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    try {
                        JSON.stringify(node);
                        return true;
                    } catch {
                        return false;
                    }
                }, aspectScenario);

                expect(didNotThrow).toBe(true);
            });
        }
    });

    test.describe("when binding one-time", () => {
        const aspectScenarios = [
            {
                name: "content",
                sourceAspect: "",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
            {
                name: "attribute",
                sourceAspect: "test-attribute",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
            {
                name: "boolean attribute",
                sourceAspect: "?test-boolean-attribute",
                originalValue: true,
                newValue: false,
            },
            {
                name: "property",
                sourceAspect: ":testProperty",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
        ];

        for (const aspectScenario of aspectScenarios) {
            test(`sets the initial value of a ${aspectScenario.name} binding`, async ({
                page,
            }) => {
                const { nodeValue, modelValue } = await page.evaluate(async scenario => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        HTMLDirective,
                        Observable,
                        Fake,
                        DOM,
                        nextId,
                        oneTime,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                    }

                    Observable.defineProperty(Model.prototype, "value");

                    const directive = new HTMLBindingDirective(
                        oneTime((x: any) => x.value)
                    );
                    if (scenario.sourceAspect) {
                        HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                    }

                    const node = document.createElement("div");
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = node.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const model = new Model(scenario.originalValue);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    function getValue(n: any) {
                        if (scenario.sourceAspect === "") return n.textContent;
                        if (scenario.sourceAspect.startsWith("?"))
                            return n.hasAttribute(scenario.sourceAspect.slice(1));
                        if (scenario.sourceAspect.startsWith(":"))
                            return n[scenario.sourceAspect.slice(1)];
                        return n.getAttribute(scenario.sourceAspect);
                    }

                    return {
                        nodeValue: getValue(node),
                        modelValue: model.value,
                    };
                }, aspectScenario);

                expect(nodeValue).toBe(modelValue);
            });

            test(`does not update the ${aspectScenario.name} after the initial set`, async ({
                page,
            }) => {
                const { initialValue, afterUpdateValue } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            nextId,
                            oneTime,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const directive = new HTMLBindingDirective(
                            oneTime((x: any) => x.value)
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        const initialValue = getValue(node);

                        model.value = scenario.newValue;
                        await Updates.next();

                        const afterUpdateValue = getValue(node);

                        return { initialValue, afterUpdateValue };
                    },
                    aspectScenario
                );

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(afterUpdateValue).toBe(aspectScenario.originalValue);
            });

            test(`doesn't update the ${aspectScenario.name} after unbind`, async ({
                page,
            }) => {
                const { initialValue, afterUnbindValue } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            nextId,
                            oneTime,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const directive = new HTMLBindingDirective(
                            oneTime((x: any) => x.value)
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        const initialValue = getValue(node);

                        controller.unbind();
                        model.value = scenario.newValue;
                        await Updates.next();

                        const afterUnbindValue = getValue(node);

                        return { initialValue, afterUnbindValue };
                    },
                    aspectScenario
                );

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(afterUnbindValue).toBe(aspectScenario.originalValue);
            });

            test(`uses the dom policy when setting a ${aspectScenario.name} binding (one-time)`, async ({
                page,
            }) => {
                const { nodeValue, modelValue, policyUsed } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            nextId,
                            oneTime,
                            createTrackableDOMPolicy,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const policy = createTrackableDOMPolicy();
                        const directive = new HTMLBindingDirective(
                            oneTime((x: any) => x.value, policy)
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        return {
                            nodeValue: getValue(node),
                            modelValue: model.value,
                            policyUsed: policy.used,
                        };
                    },
                    aspectScenario
                );

                expect(nodeValue).toBe(modelValue);
                expect(policyUsed).toBe(true);
            });

            test(`should not throw if DOM stringified (one-time ${aspectScenario.name})`, async ({
                page,
            }) => {
                const didNotThrow = await page.evaluate(async scenario => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        HTMLDirective,
                        Observable,
                        Fake,
                        DOM,
                        nextId,
                        oneTime,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                    }

                    Observable.defineProperty(Model.prototype, "value");

                    const directive = new HTMLBindingDirective(
                        oneTime((x: any) => x.value)
                    );
                    if (scenario.sourceAspect) {
                        HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                    }

                    const node = document.createElement("div");
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = node.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const model = new Model(scenario.originalValue);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    try {
                        JSON.stringify(node);
                        return true;
                    } catch {
                        return false;
                    }
                }, aspectScenario);

                expect(didNotThrow).toBe(true);
            });
        }
    });

    test.describe("when binding with a signal", () => {
        const aspectScenarios = [
            {
                name: "content",
                sourceAspect: "",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
            {
                name: "attribute",
                sourceAspect: "test-attribute",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
            {
                name: "boolean attribute",
                sourceAspect: "?test-boolean-attribute",
                originalValue: true,
                newValue: false,
            },
            {
                name: "property",
                sourceAspect: ":testProperty",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
        ];

        for (const aspectScenario of aspectScenarios) {
            test(`sets the initial value of the ${aspectScenario.name} binding`, async ({
                page,
            }) => {
                const { nodeValue, modelValue } = await page.evaluate(async scenario => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        HTMLDirective,
                        Observable,
                        Fake,
                        DOM,
                        nextId,
                        signal,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                    }

                    Observable.defineProperty(Model.prototype, "value");

                    const directive = new HTMLBindingDirective(
                        signal((x: any) => x.value, "test-signal")
                    );
                    if (scenario.sourceAspect) {
                        HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                    }

                    const node = document.createElement("div");
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = node.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const model = new Model(scenario.originalValue);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    function getValue(n: any) {
                        if (scenario.sourceAspect === "") return n.textContent;
                        if (scenario.sourceAspect.startsWith("?"))
                            return n.hasAttribute(scenario.sourceAspect.slice(1));
                        if (scenario.sourceAspect.startsWith(":"))
                            return n[scenario.sourceAspect.slice(1)];
                        return n.getAttribute(scenario.sourceAspect);
                    }

                    return {
                        nodeValue: getValue(node),
                        modelValue: model.value,
                    };
                }, aspectScenario);

                expect(nodeValue).toBe(modelValue);
            });

            test(`updates the ${aspectScenario.name} only when the signal is sent`, async ({
                page,
            }) => {
                const {
                    initialValue,
                    afterModelChangeValue,
                    afterSignalValue,
                    modelValue,
                } = await page.evaluate(async scenario => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        HTMLDirective,
                        Observable,
                        Fake,
                        DOM,
                        Updates,
                        Signal,
                        nextId,
                        signal,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                    }

                    Observable.defineProperty(Model.prototype, "value");

                    const signalName = "test-signal";
                    const directive = new HTMLBindingDirective(
                        signal((x: any) => x.value, signalName)
                    );
                    if (scenario.sourceAspect) {
                        HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                    }

                    const node = document.createElement("div");
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = node.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const model = new Model(scenario.originalValue);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    function getValue(n: any) {
                        if (scenario.sourceAspect === "") return n.textContent;
                        if (scenario.sourceAspect.startsWith("?"))
                            return n.hasAttribute(scenario.sourceAspect.slice(1));
                        if (scenario.sourceAspect.startsWith(":"))
                            return n[scenario.sourceAspect.slice(1)];
                        return n.getAttribute(scenario.sourceAspect);
                    }

                    const initialValue = getValue(node);

                    model.value = scenario.newValue;
                    await Updates.next();

                    const afterModelChangeValue = getValue(node);

                    Signal.send(signalName);
                    await Updates.next();

                    const afterSignalValue = getValue(node);

                    return {
                        initialValue,
                        afterModelChangeValue,
                        afterSignalValue,
                        modelValue: model.value,
                    };
                }, aspectScenario);

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(afterModelChangeValue).toBe(aspectScenario.originalValue);
                expect(afterSignalValue).toBe(modelValue);
            });

            test(`doesn't respond to signals for a ${aspectScenario.name} binding after unbind`, async ({
                page,
            }) => {
                const { initialValue, afterUnbindValue } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            Signal,
                            nextId,
                            signal,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const signalName = "test-signal";
                        const directive = new HTMLBindingDirective(
                            signal((x: any) => x.value, signalName)
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        const initialValue = getValue(node);

                        controller.unbind();
                        model.value = scenario.newValue;
                        Signal.send(signalName);
                        await Updates.next();

                        const afterUnbindValue = getValue(node);

                        return { initialValue, afterUnbindValue };
                    },
                    aspectScenario
                );

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(afterUnbindValue).toBe(aspectScenario.originalValue);
            });

            test(`uses the dom policy when setting a ${aspectScenario.name} binding (signal)`, async ({
                page,
            }) => {
                const { nodeValue, modelValue, policyUsed } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            nextId,
                            signal,
                            createTrackableDOMPolicy,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const policy = createTrackableDOMPolicy();
                        const directive = new HTMLBindingDirective(
                            signal((x: any) => x.value, "test-signal", policy)
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        return {
                            nodeValue: getValue(node),
                            modelValue: model.value,
                            policyUsed: policy.used,
                        };
                    },
                    aspectScenario
                );

                expect(nodeValue).toBe(modelValue);
                expect(policyUsed).toBe(true);
            });

            test(`should not throw if DOM stringified (signal ${aspectScenario.name})`, async ({
                page,
            }) => {
                const didNotThrow = await page.evaluate(async scenario => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        HTMLDirective,
                        Observable,
                        Fake,
                        DOM,
                        nextId,
                        signal,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                    }

                    Observable.defineProperty(Model.prototype, "value");

                    const directive = new HTMLBindingDirective(
                        signal((x: any) => x.value, "test-signal")
                    );
                    if (scenario.sourceAspect) {
                        HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                    }

                    const node = document.createElement("div");
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = node.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const model = new Model(scenario.originalValue);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    try {
                        JSON.stringify(node);
                        return true;
                    } catch {
                        return false;
                    }
                }, aspectScenario);

                expect(didNotThrow).toBe(true);
            });
        }
    });

    test.describe("when binding two-way", () => {
        const aspectScenarios = [
            {
                name: "content",
                sourceAspect: "",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
            {
                name: "attribute",
                sourceAspect: "test-attribute",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
            {
                name: "boolean attribute",
                sourceAspect: "?test-boolean-attribute",
                originalValue: true,
                newValue: false,
            },
            {
                name: "property",
                sourceAspect: ":testProperty",
                originalValue: "This is a test",
                newValue: "This is another test",
            },
        ];

        for (const aspectScenario of aspectScenarios) {
            test(`sets the initial value of the ${aspectScenario.name} binding`, async ({
                page,
            }) => {
                const { nodeValue, modelValue } = await page.evaluate(async scenario => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        HTMLDirective,
                        Observable,
                        Fake,
                        DOM,
                        nextId,
                        twoWay,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                    }

                    Observable.defineProperty(Model.prototype, "value");

                    const directive = new HTMLBindingDirective(
                        twoWay((x: any) => x.value, {})
                    );
                    if (scenario.sourceAspect) {
                        HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                    }

                    const node = document.createElement("div");
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = node.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const model = new Model(scenario.originalValue);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    function getValue(n: any) {
                        if (scenario.sourceAspect === "") return n.textContent;
                        if (scenario.sourceAspect.startsWith("?"))
                            return n.hasAttribute(scenario.sourceAspect.slice(1));
                        if (scenario.sourceAspect.startsWith(":"))
                            return n[scenario.sourceAspect.slice(1)];
                        return n.getAttribute(scenario.sourceAspect);
                    }

                    return {
                        nodeValue: getValue(node),
                        modelValue: model.value,
                    };
                }, aspectScenario);

                expect(nodeValue).toBe(modelValue);
            });

            test(`updates the ${aspectScenario.name} when the model changes (two-way)`, async ({
                page,
            }) => {
                const { initialValue, updatedNodeValue, updatedModelValue } =
                    await page.evaluate(async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            nextId,
                            twoWay,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const directive = new HTMLBindingDirective(
                            twoWay((x: any) => x.value, {})
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        const initialValue = getValue(node);

                        model.value = scenario.newValue;
                        await Updates.next();

                        const updatedNodeValue = getValue(node);

                        return {
                            initialValue,
                            updatedNodeValue,
                            updatedModelValue: model.value,
                        };
                    }, aspectScenario);

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(updatedNodeValue).toBe(updatedModelValue);
            });

            test(`updates the model when a change event fires for the ${aspectScenario.name}`, async ({
                page,
            }) => {
                const { initialValue, modelValueAfterEvent } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            nextId,
                            twoWay,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const directive = new HTMLBindingDirective(
                            twoWay((x: any) => x.value, {})
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        function setValue(n: any, val: any) {
                            if (scenario.sourceAspect === "") {
                                n.textContent = val;
                            } else if (scenario.sourceAspect.startsWith("?")) {
                                DOM.setBooleanAttribute(
                                    n,
                                    scenario.sourceAspect.slice(1),
                                    val
                                );
                            } else if (scenario.sourceAspect.startsWith(":")) {
                                n[scenario.sourceAspect.slice(1)] = val;
                            } else {
                                DOM.setAttribute(n, scenario.sourceAspect, val);
                            }
                        }

                        const initialValue = getValue(node);

                        setValue(node, scenario.newValue);
                        node.dispatchEvent(new CustomEvent("change"));
                        await Updates.next();

                        return {
                            initialValue,
                            modelValueAfterEvent: model.value,
                        };
                    },
                    aspectScenario
                );

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(modelValueAfterEvent).toBe(aspectScenario.newValue);
            });

            test(`updates the model when a change event fires for the ${aspectScenario.name} with conversion`, async ({
                page,
            }) => {
                const { initialValue, modelValueAfterEvent } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            nextId,
                            twoWay,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const fromView = (_value: any) => "fixed value";
                        const directive = new HTMLBindingDirective(
                            twoWay((x: any) => x.value, { fromView })
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        function setValue(n: any, val: any) {
                            if (scenario.sourceAspect === "") {
                                n.textContent = val;
                            } else if (scenario.sourceAspect.startsWith("?")) {
                                DOM.setBooleanAttribute(
                                    n,
                                    scenario.sourceAspect.slice(1),
                                    val
                                );
                            } else if (scenario.sourceAspect.startsWith(":")) {
                                n[scenario.sourceAspect.slice(1)] = val;
                            } else {
                                DOM.setAttribute(n, scenario.sourceAspect, val);
                            }
                        }

                        const initialValue = getValue(node);

                        setValue(node, scenario.newValue);
                        node.dispatchEvent(new CustomEvent("change"));
                        await Updates.next();

                        return {
                            initialValue,
                            modelValueAfterEvent: model.value,
                        };
                    },
                    aspectScenario
                );

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(modelValueAfterEvent.trim()).toBe("fixed value");
            });

            test(`updates the model when a configured event fires for the ${aspectScenario.name}`, async ({
                page,
            }) => {
                const { initialValue, modelValueAfterEvent } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            nextId,
                            twoWay,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const changeEvent = "foo";
                        const directive = new HTMLBindingDirective(
                            twoWay((x: any) => x.value, { changeEvent })
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        function setValue(n: any, val: any) {
                            if (scenario.sourceAspect === "") {
                                n.textContent = val;
                            } else if (scenario.sourceAspect.startsWith("?")) {
                                DOM.setBooleanAttribute(
                                    n,
                                    scenario.sourceAspect.slice(1),
                                    val
                                );
                            } else if (scenario.sourceAspect.startsWith(":")) {
                                n[scenario.sourceAspect.slice(1)] = val;
                            } else {
                                DOM.setAttribute(n, scenario.sourceAspect, val);
                            }
                        }

                        const initialValue = getValue(node);

                        setValue(node, scenario.newValue);
                        node.dispatchEvent(new CustomEvent(changeEvent));
                        await Updates.next();

                        return {
                            initialValue,
                            modelValueAfterEvent: model.value,
                        };
                    },
                    aspectScenario
                );

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(modelValueAfterEvent).toBe(aspectScenario.newValue);
            });

            test(`doesn't update the ${aspectScenario.name} after unbind (two-way)`, async ({
                page,
            }) => {
                const { initialValue, afterUnbindValue } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            Updates,
                            nextId,
                            twoWay,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const directive = new HTMLBindingDirective(
                            twoWay((x: any) => x.value, {})
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        const initialValue = getValue(node);

                        controller.unbind();
                        model.value = scenario.newValue;
                        await Updates.next();

                        const afterUnbindValue = getValue(node);

                        return { initialValue, afterUnbindValue };
                    },
                    aspectScenario
                );

                expect(initialValue).toBe(aspectScenario.originalValue);
                expect(afterUnbindValue).toBe(aspectScenario.originalValue);
            });

            test(`uses the dom policy when setting a ${aspectScenario.name} binding (two-way)`, async ({
                page,
            }) => {
                const { nodeValue, modelValue, policyUsed } = await page.evaluate(
                    async scenario => {
                        // @ts-expect-error: Client module.
                        const {
                            HTMLBindingDirective,
                            HTMLDirective,
                            Observable,
                            Fake,
                            DOM,
                            nextId,
                            twoWay,
                            createTrackableDOMPolicy,
                        } = await import("/main.js");

                        class Model {
                            constructor(value: any) {
                                this.value = value;
                            }
                            value: any;
                        }

                        Observable.defineProperty(Model.prototype, "value");

                        const policy = createTrackableDOMPolicy();
                        const directive = new HTMLBindingDirective(
                            twoWay((x: any) => x.value, {}, policy)
                        );
                        if (scenario.sourceAspect) {
                            HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                        }

                        const node = document.createElement("div");
                        directive.id = nextId();
                        directive.targetNodeId = "r";
                        directive.targetTagName = node.tagName ?? null;
                        directive.policy = DOM.policy;

                        const targets = { r: node };
                        const behavior = directive.createBehavior();
                        const parentNode = document.createElement("div");
                        parentNode.appendChild(node);

                        const model = new Model(scenario.originalValue);
                        const controller = Fake.viewController(targets, behavior);
                        controller.bind(model);

                        function getValue(n: any) {
                            if (scenario.sourceAspect === "") return n.textContent;
                            if (scenario.sourceAspect.startsWith("?"))
                                return n.hasAttribute(scenario.sourceAspect.slice(1));
                            if (scenario.sourceAspect.startsWith(":"))
                                return n[scenario.sourceAspect.slice(1)];
                            return n.getAttribute(scenario.sourceAspect);
                        }

                        return {
                            nodeValue: getValue(node),
                            modelValue: model.value,
                            policyUsed: policy.used,
                        };
                    },
                    aspectScenario
                );

                expect(nodeValue).toBe(modelValue);
                expect(policyUsed).toBe(true);
            });

            test(`should not throw if DOM stringified (two-way ${aspectScenario.name})`, async ({
                page,
            }) => {
                const didNotThrow = await page.evaluate(async scenario => {
                    // @ts-expect-error: Client module.
                    const {
                        HTMLBindingDirective,
                        HTMLDirective,
                        Observable,
                        Fake,
                        DOM,
                        nextId,
                        twoWay,
                    } = await import("/main.js");

                    class Model {
                        constructor(value: any) {
                            this.value = value;
                        }
                        value: any;
                    }

                    Observable.defineProperty(Model.prototype, "value");

                    const directive = new HTMLBindingDirective(
                        twoWay((x: any) => x.value, {})
                    );
                    if (scenario.sourceAspect) {
                        HTMLDirective.assignAspect(directive, scenario.sourceAspect);
                    }

                    const node = document.createElement("div");
                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = node.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: node };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(node);

                    const model = new Model(scenario.originalValue);
                    const controller = Fake.viewController(targets, behavior);
                    controller.bind(model);

                    try {
                        JSON.stringify(node);
                        return true;
                    } catch {
                        return false;
                    }
                }, aspectScenario);

                expect(didNotThrow).toBe(true);
            });
        }
    });

    test.describe("when binding events", () => {
        test("does not invoke the method on bind", async ({ page }) => {
            const actionInvokeCount = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    HTMLDirective,
                    Observable,
                    Fake,
                    DOM,
                    nextId,
                    listener,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    actionInvokeCount = 0;
                    invokeAction() {
                        this.actionInvokeCount++;
                    }
                }

                Observable.defineProperty(Model.prototype, "value");

                const directive = new HTMLBindingDirective(
                    listener((x: any) => x.invokeAction(), {})
                );
                HTMLDirective.assignAspect(directive, "@my-event");

                const node = document.createElement("div");
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = node.tagName ?? null;
                directive.policy = DOM.policy;

                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Model("Test value.");
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                return model.actionInvokeCount;
            });

            expect(actionInvokeCount).toBe(0);
        });

        test("invokes the method each time the event is raised", async ({ page }) => {
            const { after0, after1, after2, after3 } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    HTMLDirective,
                    Observable,
                    Fake,
                    DOM,
                    nextId,
                    listener,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    actionInvokeCount = 0;
                    invokeAction() {
                        this.actionInvokeCount++;
                    }
                }

                Observable.defineProperty(Model.prototype, "value");

                const directive = new HTMLBindingDirective(
                    listener((x: any) => x.invokeAction(), {})
                );
                HTMLDirective.assignAspect(directive, "@my-event");

                const node = document.createElement("div");
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = node.tagName ?? null;
                directive.policy = DOM.policy;

                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Model("Test value.");
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const after0 = model.actionInvokeCount;

                node.dispatchEvent(new CustomEvent("my-event"));
                const after1 = model.actionInvokeCount;

                node.dispatchEvent(new CustomEvent("my-event"));
                const after2 = model.actionInvokeCount;

                node.dispatchEvent(new CustomEvent("my-event"));
                const after3 = model.actionInvokeCount;

                return { after0, after1, after2, after3 };
            });

            expect(after0).toBe(0);
            expect(after1).toBe(1);
            expect(after2).toBe(2);
            expect(after3).toBe(3);
        });

        test("invokes the method one time for a one time event", async ({ page }) => {
            const { after0, after1, after2 } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    HTMLDirective,
                    Observable,
                    Fake,
                    DOM,
                    nextId,
                    listener,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    actionInvokeCount = 0;
                    invokeAction() {
                        this.actionInvokeCount++;
                    }
                }

                Observable.defineProperty(Model.prototype, "value");

                const directive = new HTMLBindingDirective(
                    listener((x: any) => x.invokeAction(), { once: true })
                );
                HTMLDirective.assignAspect(directive, "@my-event");

                const node = document.createElement("div");
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = node.tagName ?? null;
                directive.policy = DOM.policy;

                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Model("Test value.");
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const after0 = model.actionInvokeCount;

                node.dispatchEvent(new CustomEvent("my-event"));
                const after1 = model.actionInvokeCount;

                node.dispatchEvent(new CustomEvent("my-event"));
                const after2 = model.actionInvokeCount;

                return { after0, after1, after2 };
            });

            expect(after0).toBe(0);
            expect(after1).toBe(1);
            expect(after2).toBe(1);
        });

        test("does not invoke the method when unbound", async ({ page }) => {
            const { after0, after1, afterUnbind } = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    HTMLDirective,
                    Observable,
                    Fake,
                    DOM,
                    nextId,
                    listener,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    actionInvokeCount = 0;
                    invokeAction() {
                        this.actionInvokeCount++;
                    }
                }

                Observable.defineProperty(Model.prototype, "value");

                const directive = new HTMLBindingDirective(
                    listener((x: any) => x.invokeAction(), {})
                );
                HTMLDirective.assignAspect(directive, "@my-event");

                const node = document.createElement("div");
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = node.tagName ?? null;
                directive.policy = DOM.policy;

                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Model("Test value.");
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                const after0 = model.actionInvokeCount;

                node.dispatchEvent(new CustomEvent("my-event"));
                const after1 = model.actionInvokeCount;

                controller.unbind();

                node.dispatchEvent(new CustomEvent("my-event"));
                const afterUnbind = model.actionInvokeCount;

                return { after0, after1, afterUnbind };
            });

            expect(after0).toBe(0);
            expect(after1).toBe(1);
            expect(afterUnbind).toBe(1);
        });

        test("should not throw if DOM stringified (events)", async ({ page }) => {
            const didNotThrow = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const {
                    HTMLBindingDirective,
                    HTMLDirective,
                    Observable,
                    Fake,
                    DOM,
                    nextId,
                    listener,
                } = await import("/main.js");

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                    actionInvokeCount = 0;
                    invokeAction() {
                        this.actionInvokeCount++;
                    }
                }

                Observable.defineProperty(Model.prototype, "value");

                const directive = new HTMLBindingDirective(
                    listener((x: any) => x.invokeAction(), {})
                );
                HTMLDirective.assignAspect(directive, "@my-event");

                const node = document.createElement("div");
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = node.tagName ?? null;
                directive.policy = DOM.policy;

                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                const model = new Model("Test value.");
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                try {
                    JSON.stringify(node);
                    return true;
                } catch {
                    return false;
                }
            });

            expect(didNotThrow).toBe(true);
        });
    });

    test.describe("when binding classList", () => {
        test("adds and removes own classes", async ({ page }) => {
            const results = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HTMLBindingDirective, HTMLDirective, Fake, DOM, nextId, oneWay } =
                    await import("/main.js");

                function createClassBinding(element: any) {
                    const directive = new HTMLBindingDirective(oneWay(() => ""));
                    if (":classList") {
                        HTMLDirective.assignAspect(directive, ":classList");
                    }

                    directive.id = nextId();
                    directive.targetNodeId = "r";
                    directive.targetTagName = element.tagName ?? null;
                    directive.policy = DOM.policy;

                    const targets = { r: element };
                    const behavior = directive.createBehavior();
                    const parentNode = document.createElement("div");
                    parentNode.appendChild(element);

                    return { directive, behavior, targets, parentNode };
                }

                function updateTarget(target: any, directive: any, value: any) {
                    directive.updateTarget(
                        target,
                        directive.targetAspect,
                        value,
                        Fake.viewController()
                    );
                }

                const element = document.createElement("div");
                element.classList.add("foo");
                element.classList.add("bar");

                const { directive: observerA } = createClassBinding(element);
                const { directive: observerB } = createClassBinding(element);
                const contains = element.classList.contains.bind(element.classList);

                const results: boolean[] = [];

                // initial
                results.push(contains("foo") && contains("bar")); // 0: true

                updateTarget(element, observerA, " xxx \t\r\n\v\f yyy  ");
                results.push(contains("foo") && contains("bar")); // 1: true
                results.push(contains("xxx") && contains("yyy")); // 2: true

                updateTarget(element, observerA, "");
                results.push(contains("foo") && contains("bar")); // 3: true
                results.push(contains("xxx") || contains("yyy")); // 4: false

                updateTarget(element, observerB, "bbb");
                results.push(contains("foo") && contains("bar")); // 5: true
                results.push(contains("bbb")); // 6: true

                updateTarget(element, observerB, "aaa");
                results.push(contains("foo") && contains("bar")); // 7: true
                results.push(contains("aaa") && !contains("bbb")); // 8: true

                updateTarget(element, observerA, "foo bar");
                results.push(contains("foo") && contains("bar")); // 9: true

                updateTarget(element, observerA, "");
                results.push(contains("foo") || contains("bar")); // 10: false

                updateTarget(element, observerA, "foo");
                results.push(contains("foo")); // 11: true

                updateTarget(element, observerA, null);
                results.push(contains("foo")); // 12: false

                updateTarget(element, observerA, "foo");
                results.push(contains("foo")); // 13: true

                updateTarget(element, observerA, undefined);
                results.push(contains("foo")); // 14: false

                return results;
            });

            expect(results[0]).toBe(true);
            expect(results[1]).toBe(true);
            expect(results[2]).toBe(true);
            expect(results[3]).toBe(true);
            expect(results[4]).toBe(false);
            expect(results[5]).toBe(true);
            expect(results[6]).toBe(true);
            expect(results[7]).toBe(true);
            expect(results[8]).toBe(true);
            expect(results[9]).toBe(true);
            expect(results[10]).toBe(false);
            expect(results[11]).toBe(true);
            expect(results[12]).toBe(false);
            expect(results[13]).toBe(true);
            expect(results[14]).toBe(false);
        });

        test("should not throw if DOM stringified (classList)", async ({ page }) => {
            const didNotThrow = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { HTMLBindingDirective, HTMLDirective, Fake, DOM, nextId, oneWay } =
                    await import("/main.js");

                const directive = new HTMLBindingDirective(oneWay(() => ""));
                HTMLDirective.assignAspect(directive, ":classList");

                const node = document.createElement("div");
                directive.id = nextId();
                directive.targetNodeId = "r";
                directive.targetTagName = node.tagName ?? null;
                directive.policy = DOM.policy;

                const targets = { r: node };
                const behavior = directive.createBehavior();
                const parentNode = document.createElement("div");
                parentNode.appendChild(node);

                class Model {
                    constructor(value: any) {
                        this.value = value;
                    }
                    value: any;
                }

                const model = new Model("Test value.");
                const controller = Fake.viewController(targets, behavior);
                controller.bind(model);

                try {
                    JSON.stringify(node);
                    return true;
                } catch {
                    return false;
                }
            });

            expect(didNotThrow).toBe(true);
        });
    });
});
