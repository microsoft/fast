import { expect, test } from "@playwright/test";

test.describe("The repeat", () => {
    test.describe("template function", () => {
        test("returns a RepeatDirective", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, RepeatDirective, html } = await import("/main.js");

                const directive = repeat(
                    () => [],
                    html`
                        test
                    `,
                );
                return directive instanceof RepeatDirective;
            });

            expect(result).toBe(true);
        });

        test("returns a RepeatDirective with optional properties set to default values", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, RepeatDirective, html } = await import("/main.js");

                const directive = repeat(
                    () => [],
                    html`
                        test
                    `,
                );
                return {
                    isInstance: directive instanceof RepeatDirective,
                    options: JSON.stringify(directive.options),
                };
            });

            expect(result.isInstance).toBe(true);
            expect(JSON.parse(result.options)).toEqual({
                positioning: false,
                recycle: true,
            });
        });

        test("returns a RepeatDirective with recycle property set to default value when positioning is set to different value", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, RepeatDirective, html } = await import("/main.js");

                const directive = repeat(
                    () => [],
                    html`
                        test
                    `,
                    { positioning: true },
                );
                return {
                    isInstance: directive instanceof RepeatDirective,
                    options: JSON.stringify(directive.options),
                };
            });

            expect(result.isInstance).toBe(true);
            expect(JSON.parse(result.options)).toEqual({
                positioning: true,
                recycle: true,
            });
        });

        test("returns a RepeatDirective with positioning property set to default value when recycle is set to different value", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, RepeatDirective, html } = await import("/main.js");

                const directive = repeat(
                    () => [],
                    html`
                        test
                    `,
                    { recycle: false },
                );
                return {
                    isInstance: directive instanceof RepeatDirective,
                    options: JSON.stringify(directive.options),
                };
            });

            expect(result.isInstance).toBe(true);
            expect(JSON.parse(result.options)).toEqual({
                positioning: false,
                recycle: false,
            });
        });

        test("returns a RepeatDirective with optional properties set to different values", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, RepeatDirective, html } = await import("/main.js");

                const directive = repeat(
                    () => [],
                    html`
                        test
                    `,
                    { positioning: true, recycle: false },
                );
                return {
                    isInstance: directive instanceof RepeatDirective,
                    options: JSON.stringify(directive.options),
                };
            });

            expect(result.isInstance).toBe(true);
            expect(JSON.parse(result.options)).toEqual({
                positioning: true,
                recycle: false,
            });
        });

        test("creates a data binding that evaluates the provided binding", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, html, Fake } = await import("/main.js");

                class ViewModel {
                    items = ["a", "b", "c"];
                }

                const source = new ViewModel();
                const directive = repeat(
                    x => x.items,
                    html`
                        test
                    `,
                );

                const data = directive.dataBinding.evaluate(
                    source,
                    Fake.executionContext(),
                );

                return data === source.items;
            });

            expect(result).toBe(true);
        });

        test("creates a data binding that evaluates to a provided array", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, html, Fake } = await import("/main.js");

                const array = ["a", "b", "c"];
                const itemTemplate = html`
                    test
                `;
                const directive = repeat(array, itemTemplate);

                const data = directive.dataBinding.evaluate({}, Fake.executionContext());

                return data === array;
            });

            expect(result).toBe(true);
        });

        test("creates a template binding when a template is provided", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, html, Fake } = await import("/main.js");

                class ViewModel {
                    items = ["a", "b", "c"];
                }

                const source = new ViewModel();
                const itemTemplate = html`
                    test
                `;
                const directive = repeat(x => x.items, itemTemplate);
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext(),
                );
                return template === itemTemplate;
            });

            expect(result).toBe(true);
        });

        test("creates a template binding when a function is provided", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, html, Fake } = await import("/main.js");

                class ViewModel {
                    items = ["a", "b", "c"];
                }

                const source = new ViewModel();
                const itemTemplate = html`
                    test
                `;
                const directive = repeat(
                    x => x.items,
                    () => itemTemplate,
                );
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext(),
                );
                return template === itemTemplate;
            });

            expect(result).toBe(true);
        });
    });

    test.describe("directive", () => {
        test("creates a RepeatBehavior", async ({ page }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { repeat, RepeatBehavior, html } = await import("/main.js");

                const parent = document.createElement("div");
                const location = document.createComment("");
                const nodeId = "r";
                parent.appendChild(location);

                const directive = repeat(
                    () => [],
                    html`
                        test
                    `,
                );
                directive.targetNodeId = nodeId;

                const behavior = directive.createBehavior();

                return behavior instanceof RepeatBehavior;
            });

            expect(result).toBe(true);
        });
    });

    test.describe("HydrationRepeatError diagnostics", () => {
        for (const operation of ["refresh", "unbind"] as const) {
            for (const missingView of ["null", "undefined"] as const) {
                test(`reports a ${missingView} view during ${operation}`, async ({
                    page,
                }) => {
                    await page.goto("/");

                    const result = await page.evaluate(
                        async ({ operation, missingView }) => {
                            // @ts-expect-error: Client module.
                            const { repeat, html, Fake, HydrationRepeatError } =
                                await import("/main.js");
                            const host = document.createElement("repeat-error-host");
                            const root = host.attachShadow({ mode: "open" });
                            const location = document.createComment("repeat");
                            root.appendChild(location);
                            document.body.appendChild(host);

                            const template = html`<span data-repeat-item>${x => x.name}</span>`;
                            const directive = repeat(x => x.items, template);
                            directive.targetNodeId = "r";
                            const behavior = directive.createBehavior();
                            const controller = Fake.viewController(
                                { r: location },
                                behavior,
                            );
                            controller.hydrationStage = "hydrated";
                            controller.bind({
                                items: [{ name: "first" }, { name: "second" }],
                            });

                            const views = behavior.views.slice();
                            const rootContent = new XMLSerializer().serializeToString(
                                root,
                            );
                            const initiallyBound = views.every(view => view.isBound);
                            // Simulate an incomplete view list without changing the DOM snapshot.
                            behavior.views[1] = missingView === "null" ? null : undefined;

                            let diagnostic;
                            try {
                                if (operation === "refresh") {
                                    behavior.bind(controller);
                                } else {
                                    controller.unbind();
                                }
                            } catch (error) {
                                if (!(error instanceof HydrationRepeatError)) {
                                    throw error;
                                }
                                diagnostic = {
                                    message: error.message,
                                    ...error.propertyBag,
                                };
                            } finally {
                                behavior.views[1] = views[1];
                                controller.unbind();
                                views.forEach(view => view.dispose());
                                host.remove();
                            }

                            return {
                                diagnostic,
                                rootContent,
                                initiallyBound,
                                allUnbound: views.every(view => !view.isBound),
                            };
                        },
                        { operation, missingView },
                    );

                    expect(result.initiallyBound).toBe(true);
                    expect(result.allUnbound).toBe(true);
                    expect(result.diagnostic).toMatchObject({
                        message: 'View is null or undefined inside "REPEAT-ERROR-HOST".',
                        index: 1,
                        hydrationStage: "hydrated",
                        viewsState: ["hydrated", "empty"],
                        rootNodeContent: result.rootContent,
                    });
                    expect(result.diagnostic.rootNodeContent).toContain("first");
                    expect(result.diagnostic.rootNodeContent).toContain("second");

                    if (operation === "refresh") {
                        expect(result.diagnostic.itemsLength).toBe(2);
                        expect(result.diagnostic.viewTemplateString).toContain(
                            "data-repeat-item",
                        );
                    } else {
                        expect(result.diagnostic).not.toHaveProperty("itemsLength");
                        expect(result.diagnostic).not.toHaveProperty(
                            "viewTemplateString",
                        );
                    }
                });
            }
        }
    });

    test.describe("behavior", () => {
        for (const operation of ["reverse", "pop"] as const) {
            test(`preserves non-recycling views after ${operation} and an owner notification`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async operation => {
                    // @ts-expect-error: Client module.
                    const { html, Observable, repeat, Updates } = await import(
                        "/main.js"
                    );
                    const model = { items: ["A", "B", "C"] };
                    const items = model.items;
                    Observable.defineProperty(model, "items");
                    model.items = items;
                    const host = document.createElement("div");
                    document.body.append(host);
                    const view = html`
                        <output>${source => source.items.length}</output>
                        ${repeat(
                            source => source.items,
                            html`<input data-id=${item => item} value="initial">`,
                            { recycle: false },
                        )}
                    `.render(model, host);
                    const original = new Map(
                        Array.from(host.querySelectorAll("input"), input => [
                            input.dataset.id,
                            input,
                        ]),
                    );
                    original.get("A")!.value = "unsaved A";

                    model.items[operation]();
                    Observable.notify(model, "items");
                    Updates.process();

                    const current = Array.from(host.querySelectorAll("input"));
                    const result = {
                        order: current.map(input => input.dataset.id),
                        retained: current.every(
                            input => input === original.get(input.dataset.id),
                        ),
                        draft: host.querySelector<HTMLInputElement>('[data-id="A"]')!
                            .value,
                        count: host.querySelector("output")!.textContent,
                    };
                    view.dispose();
                    host.remove();
                    return result;
                }, operation);

                expect(result).toEqual({
                    order: operation === "reverse" ? ["C", "B", "A"] : ["A", "B"],
                    retained: true,
                    draft: "unsaved A",
                    count: operation === "reverse" ? "3" : "2",
                });
            });
        }

        for (const operation of [
            "replace",
            "prepend",
            "mixed",
            "no-recycling",
        ] as const) {
            test(`preserves keyed record identity after ${operation}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async operation => {
                    // @ts-expect-error: Client module.
                    const { html, Observable, repeat, Updates } = await import(
                        "/main.js"
                    );
                    const model = {
                        items: ["A", "B", "C"].map(id => ({ id, label: id })),
                    };
                    const initialItems = model.items;
                    Observable.defineProperty(model, "items");
                    model.items = initialItems;
                    const selected: string[] = [];
                    const host = document.createElement("div");
                    document.body.append(host);
                    const view = html`${repeat(
                        source => source.items,
                        html`<div data-id=${item => item.id}>
                            <button @click=${item => selected.push(item.id)}>
                                ${item => item.label}
                            </button>
                            <input value="draft">
                            <span>${(_item, context) => context.index}/${(_item, context) => context.length}</span>
                        </div>`,
                        {
                            key: item => item.id,
                            positioning: true,
                            recycle: operation !== "no-recycling",
                        },
                    )}`.render(model, host);
                    const rows = new Map(
                        Array.from(
                            host.querySelectorAll<HTMLDivElement>("[data-id]"),
                        ).map(row => [row.dataset.id, row]),
                    );
                    const focused = rows.get("B")!.querySelector("button")!;
                    rows.get("B")!.querySelector("input")!.value = "unsaved B";
                    focused.focus();

                    if (operation === "replace" || operation === "no-recycling") {
                        model.items = ["D", "A", "B", "C"].map(id => ({
                            id,
                            label: `new ${id}`,
                        }));
                    }

                    if (operation === "prepend") {
                        model.items.unshift({ id: "D", label: "D" });
                    }

                    if (operation === "mixed") {
                        model.items.reverse();
                        model.items.splice(1, 0, { id: "D", label: "D" });
                    }

                    Updates.process();
                    focused.click();
                    const current = Array.from(
                        host.querySelectorAll<HTMLDivElement>("[data-id]"),
                    );
                    const result = {
                        ids: current.map(row => row.dataset.id),
                        retained: current.every(
                            row =>
                                !rows.has(row.dataset.id) ||
                                rows.get(row.dataset.id) === row,
                        ),
                        focused: document.activeElement === focused,
                        selected,
                        draft: host.querySelector<HTMLInputElement>(
                            '[data-id="B"] input',
                        )!.value,
                        labels: current.map(row =>
                            row.querySelector("button")!.textContent!.trim(),
                        ),
                        positions: current.map(
                            row => row.querySelector("span")!.textContent,
                        ),
                    };
                    view.dispose();
                    host.remove();
                    return result;
                }, operation);

                const ids =
                    operation === "mixed" ? ["C", "D", "B", "A"] : ["D", "A", "B", "C"];
                expect(result.ids).toEqual(ids);
                expect(result.retained).toBe(true);
                expect(result.focused).toBe(true);
                expect(result.selected).toEqual(["B"]);
                expect(result.draft).toBe("unsaved B");
                expect(result.labels).toEqual(
                    ids.map(id =>
                        operation === "replace" || operation === "no-recycling"
                            ? `new ${id}`
                            : id,
                    ),
                );
                expect(result.positions).toEqual(["0/4", "1/4", "2/4", "3/4"]);
            });
        }

        test("validates keyed updates before changing views and recovers after removals", async ({
            page,
        }) => {
            await page.goto("/");
            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { html, repeat } = await import("/main.js");
                const host = document.createElement("div");
                document.body.append(host);
                const items = [{ id: "A" }, { id: "B" }];
                const view = html`${repeat(() => items, html`<b>${item => item.id}</b>`, {
                    key: item => item.id,
                })}`.render({}, host);
                const behavior = view.behaviors[0];
                const original = Array.from(host.querySelectorAll("b"));
                const update = (items: { id: string }[]) => {
                    behavior.items = items;
                    behavior.handleChange(null, [{ reset: true }]);
                };
                let duplicateError = "";
                try {
                    update([{ id: "A" }, { id: "A" }]);
                } catch (error) {
                    duplicateError = (error as Error).message;
                }
                const unchanged = original.every(
                    (node, index) => host.querySelectorAll("b")[index] === node,
                );
                items[0].id = "changed";
                update([{ id: "A" }]);
                const storedKey = host.querySelector("b") === original[0];
                const removed =
                    !original[1].isConnected &&
                    !behavior.views.some(itemView => itemView.source === items[1]);
                update([]);
                const empty = host.querySelectorAll("b").length === 0;
                update([{ id: "B" }]);
                const notRecycled = host.querySelector("b") !== original[1];
                behavior.template = html`<i>${item => item.id}</i>`;
                behavior.refreshAllViews(true);
                const changedTemplate =
                    host.querySelector("b") === null &&
                    host.querySelector("i")!.textContent === "B";
                view.dispose();
                host.remove();
                return {
                    duplicateError,
                    unchanged,
                    storedKey,
                    removed,
                    empty,
                    notRecycled,
                    changedTemplate,
                };
            });
            expect(result.duplicateError).toBe(
                "Repeat keys must be unique within the array.",
            );
            expect(result).toMatchObject({
                unchanged: true,
                storedKey: true,
                removed: true,
                empty: true,
                notRecycled: true,
                changedTemplate: true,
            });
        });

        for (const rendering of ["client", "hydrated", "shadow"] as const) {
            for (const fallback of [false, true]) {
                test(`preserves focus in moved ${rendering} views with fallback ${fallback}`, async ({
                    page,
                }) => {
                    await page.goto("/");

                    const result = await page.evaluate(
                        async ({ rendering, fallback }) => {
                            // @ts-expect-error: Client module.
                            const {
                                FASTElement,
                                enableHydration,
                                html,
                                repeat,
                                uniqueElementName,
                                Updates,
                            } = await import("/main.js");
                            let connections = 0;
                            let disconnections = 0;

                            class MovingElement extends FASTElement {
                                connectedCallback() {
                                    super.connectedCallback();
                                    connections++;
                                }

                                disconnectedCallback() {
                                    disconnections++;
                                    super.disconnectedCallback();
                                }
                            }

                            const name = uniqueElementName();
                            await MovingElement.define({
                                name,
                                template: html`<slot></slot>`,
                            });
                            const items = [0, 1, 2];
                            const host = document.createElement("div");
                            document.body.append(host);
                            const container =
                                rendering === "shadow"
                                    ? host.attachShadow({ mode: "open" })
                                    : host;
                            const itemTemplate = html`
                                <input value="draft">
                                ${html.partial(`<${name}></${name}>`)}
                            `;
                            const view =
                                html`${repeat(() => items, itemTemplate)}`.render(
                                    {},
                                    container,
                                );

                            if (rendering === "hydrated") {
                                enableHydration();
                                const behavior = view.behaviors[0];

                                for (let index = 0; index < items.length; index++) {
                                    const current = behavior.views[index];
                                    current.unbind();
                                    const hydrated = itemTemplate.hydrate(
                                        current.firstChild,
                                        current.lastChild,
                                    );
                                    hydrated.bind(items[index]);
                                    behavior.views[index] = hydrated;
                                }
                            }

                            const nodes = Array.from(container.querySelectorAll("input"));
                            const focused = nodes[2];
                            focused.focus();
                            focused.setSelectionRange(1, 4, "backward");
                            connections = 0;
                            disconnections = 0;
                            const descriptor = Object.getOwnPropertyDescriptor(
                                container,
                                "moveBefore",
                            );
                            const nativeMoves =
                                !fallback && typeof container.moveBefore === "function";

                            try {
                                if (fallback) {
                                    Object.defineProperty(container, "moveBefore", {
                                        configurable: true,
                                        value: undefined,
                                    });
                                }

                                items.reverse();
                                Updates.process();

                                return {
                                    nativeMoves,
                                    preservesFocus:
                                        (host.shadowRoot ?? document).activeElement ===
                                        focused,
                                    preservesNodes: Array.from(
                                        container.querySelectorAll("input"),
                                    ).every((node, index) => node === nodes[2 - index]),
                                    selection: [
                                        focused.selectionStart,
                                        focused.selectionEnd,
                                        focused.selectionDirection,
                                    ],
                                    connections,
                                    disconnections,
                                };
                            } finally {
                                if (descriptor) {
                                    Object.defineProperty(
                                        container,
                                        "moveBefore",
                                        descriptor,
                                    );
                                }

                                if (!descriptor) {
                                    Reflect.deleteProperty(container, "moveBefore");
                                }

                                view.dispose();
                                host.remove();
                            }
                        },
                        { rendering, fallback },
                    );

                    expect(result.preservesNodes).toBe(true);
                    expect(result.preservesFocus).toBe(true);
                    expect(result.selection).toEqual([1, 4, "backward"]);
                    expect(result.connections).toBe(result.nativeMoves ? 0 : 2);
                    expect(result.disconnections).toBe(result.nativeMoves ? 0 : 2);
                });
            }
        }

        for (const rotation of [
            "first-to-last",
            "last-to-first",
            "queued-reorders",
        ] as const) {
            test(`preserves focus in stable views during ${rotation}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async rotation => {
                    // @ts-expect-error: Client module.
                    const { html, repeat, Updates } = await import("/main.js");

                    const items = [0, 1, 2];
                    const host = document.createElement("div");
                    document.body.append(host);
                    const view = html`${repeat(
                        () => items,
                        html`<input :value=${item => item}>`,
                    )}`.render({}, host);
                    const nodes = Array.from(host.querySelectorAll("input"));
                    const focused = nodes[rotation === "first-to-last" ? 1 : 0];
                    const removedInputs: string[] = [];
                    const observer = new MutationObserver(records => {
                        for (const record of records) {
                            for (const node of record.removedNodes) {
                                if (node instanceof HTMLInputElement) {
                                    removedInputs.push(node.value);
                                }
                            }
                        }
                    });
                    observer.observe(host, { childList: true });
                    focused.focus();
                    focused.setSelectionRange(0, 1);

                    if (rotation === "queued-reorders") {
                        items.reverse();
                    }

                    const offset = rotation === "first-to-last" ? 2 : 1;
                    items.sort(
                        (first, second) =>
                            ((first + offset) % 3) - ((second + offset) % 3),
                    );
                    await Updates.next();

                    const rendered = Array.from(host.querySelectorAll("input"));
                    const result = {
                        order: rendered.map(node => node.value),
                        preservesFocus: document.activeElement === focused,
                        preservesNodes: rendered.every(
                            (node, index) => node === nodes[items[index]],
                        ),
                        selection: [focused.selectionStart, focused.selectionEnd],
                        removedInputs,
                    };
                    observer.disconnect();
                    view.dispose();
                    host.remove();
                    return result;
                }, rotation);

                expect(result).toEqual({
                    order:
                        rotation === "first-to-last" ? ["1", "2", "0"] : ["2", "0", "1"],
                    preservesFocus: true,
                    preservesNodes: true,
                    selection: [0, 1],
                    removedInputs: [rotation === "first-to-last" ? "0" : "2"],
                });
            });
        }

        test("reorders hydrated child views without replacing their nodes", async ({
            page,
        }) => {
            await page.goto("/");

            const result = await page.evaluate(async () => {
                // @ts-expect-error: Client module.
                const { enableHydration, html, repeat, Updates } = await import(
                    "/main.js"
                );
                enableHydration();

                const items = Array.from({ length: 12 }, (_, index) => index);
                const itemTemplate = html`<span>item</span>`;
                const host = document.createElement("div");
                document.body.append(host);
                const view = html`${repeat(() => items, itemTemplate)}`.render({}, host);
                const behavior = view.behaviors[0];
                const nodes = Array.from(host.querySelectorAll("span"));

                for (let index = 0; index < nodes.length; index++) {
                    const node = nodes[index];
                    node.textContent = String(index);
                    behavior.views[index].unbind();
                    const hydrated = itemTemplate.hydrate(node, node);
                    hydrated.bind(items[index]);
                    behavior.views[index] = hydrated;
                }

                items.reverse();
                await Updates.next();
                const reordered = Array.from(host.querySelectorAll("span"));
                const actual = reordered.map(node => node.textContent);
                const preservesNodes = reordered.every(
                    (node, index) => node === nodes[nodes.length - index - 1],
                );
                view.dispose();
                host.remove();
                return { actual, preservesNodes };
            });

            expect(result.actual).toEqual(
                Array.from({ length: 12 }, (_, index) => String(11 - index)),
            );
            expect(result.preservesNodes).toBe(true);
        });

        for (const operation of [
            "identity-sort",
            "reverse",
            "rotate",
            "consecutive-reorders",
            "sort-push",
            "push-sort",
            "sort-splice",
            "splice-sort",
            "prepend",
            "recycle-across-splices",
        ] as const) {
            test(`reconciles ${operation} in one batch`, async ({ page }) => {
                await page.goto("/");

                const result = await page.evaluate(async operation => {
                    // @ts-expect-error: Client module.
                    const { repeat, html, Updates } = await import("/main.js");

                    const items = Array.from({ length: 12 }, (_, id) => ({ id }));
                    const host = document.createElement("div");
                    document.body.append(host);
                    const view = html`${repeat(
                        (source: any) => source.items,
                        html`<span data-id=${(item: any) => item.id}>${(
                            item: any,
                            context: any,
                        ) => `${context.index}/${context.length}:${item.id}`}</span>`,
                        { positioning: true },
                    )}`.render({ items }, host);
                    const nodes = new Map(
                        Array.from(host.querySelectorAll("span"), node => [
                            Number(node.getAttribute("data-id")),
                            node,
                        ]),
                    );
                    const before = host.textContent;

                    switch (operation) {
                        case "identity-sort": {
                            items.sort((first, second) => first.id - second.id);
                            break;
                        }
                        case "reverse": {
                            items.reverse();
                            break;
                        }
                        case "rotate": {
                            items.sort(
                                (first, second) =>
                                    ((first.id + 5) % 12) - ((second.id + 5) % 12),
                            );
                            break;
                        }
                        case "consecutive-reorders": {
                            items.reverse();
                            items.sort((first, second) => first.id - second.id);
                            items.reverse();
                            break;
                        }
                        case "sort-push": {
                            items.sort((first, second) => second.id - first.id);
                            items.push({ id: 12 });
                            break;
                        }
                        case "push-sort": {
                            items.push({ id: 12 });
                            items.sort((first, second) => second.id - first.id);
                            break;
                        }
                        case "sort-splice": {
                            items.sort((first, second) => second.id - first.id);
                            items.splice(2, 3, { id: 12 });
                            break;
                        }
                        case "splice-sort": {
                            items.splice(2, 3, { id: 12 });
                            items.sort((first, second) => second.id - first.id);
                            break;
                        }
                        case "prepend": {
                            items.unshift(
                                ...Array.from({ length: 128 }, (_, index) => ({
                                    id: index + 12,
                                })),
                            );
                            break;
                        }
                        case "recycle-across-splices": {
                            items.splice(0, 3, { id: 12 });
                            items.splice(5, 1, { id: 13 }, { id: 14 }, { id: 15 });
                            break;
                        }
                        default: {
                            throw new Error(`Unknown operation: ${operation}`);
                        }
                    }

                    const deferred = host.textContent === before;
                    await Updates.next();
                    const rendered = Array.from(host.querySelectorAll("span"));
                    const actual = rendered.map(node => node.textContent);
                    const expected = items.map(
                        (item, index) => `${index}/${items.length}:${item.id}`,
                    );
                    const preservesNodes = rendered.every(
                        (node, index) => nodes.get(items[index].id) === node,
                    );
                    view.dispose();
                    host.remove();
                    return { deferred, actual, expected, preservesNodes };
                }, operation);

                expect(result.deferred).toBe(true);
                expect(result.actual).toEqual(result.expected);
                if (
                    [
                        "identity-sort",
                        "reverse",
                        "rotate",
                        "consecutive-reorders",
                    ].includes(operation)
                ) {
                    expect(result.preservesNodes).toBe(true);
                }
            });
        }

        const oneThroughTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const randomizedOneThroughTen = [5, 4, 6, 1, 7, 3, 2, 10, 9, 8];
        const zeroThroughTen = [0].concat(oneThroughTen);

        for (const size of zeroThroughTen) {
            test(`renders a template for each item in array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const { repeat, Observable, html, Fake, toHTML, removeWhitespace } =
                        await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        template = itemTemplate;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");
                    Observable.defineProperty(ViewModel.prototype, "template");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;

                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    return removeWhitespace(toHTML(parent)) === createOutput(s);
                }, size);

                expect(result).toBe(true);
            });

            test(`renders a template for each item in array of size ${size} with recycle property set to false`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const { repeat, Observable, html, Fake, toHTML, removeWhitespace } =
                        await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        template = itemTemplate;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");
                    Observable.defineProperty(ViewModel.prototype, "template");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    function expectViewPositionToBeCorrect(behavior) {
                        for (let i = 0, ii = behavior.views.length; i < ii; ++i) {
                            const context = behavior.views[i].context;
                            if (context.index !== i || context.length !== ii)
                                return false;
                        }
                        return true;
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate, {
                        positioning: true,
                        recycle: false,
                    });
                    directive.targetNodeId = nodeId;

                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    const posCorrect = expectViewPositionToBeCorrect(behavior);
                    const htmlCorrect =
                        removeWhitespace(toHTML(parent)) === createOutput(s);

                    return posCorrect && htmlCorrect;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of zeroThroughTen) {
            test(`renders empty when an array of size ${size} is replaced with an empty array`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const wrappedItemTemplate = html`
                        <div>${x => x.name}</div>
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, wrappedItemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const data = new ViewModel(s);
                    const controller = createController(data, targets);

                    behavior.bind(controller);

                    const before =
                        removeWhitespace(toHTML(parent)) ===
                        createOutput(
                            s,
                            undefined,
                            undefined,
                            input => `<div>${input}</div>`,
                        );

                    data.items = [];

                    await Updates.next();

                    const empty = removeWhitespace(toHTML(parent)) === "";

                    data.items = createArray(s);

                    await Updates.next();

                    const after =
                        removeWhitespace(toHTML(parent)) ===
                        createOutput(
                            s,
                            undefined,
                            undefined,
                            input => `<div>${input}</div>`,
                        );

                    return before && empty && after;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of zeroThroughTen) {
            test(`updates rendered HTML when a new item is pushed into an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);
                    vm.items.push({ name: "newitem" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) === `${createOutput(s)}newitem`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`updates rendered HTML when items are reversed in an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);
                    vm.items.reverse();

                    await Updates.next();

                    const htmlString = new Array(s)
                        .fill(undefined)
                        .map((item, index) => {
                            return `item${index + 1}`;
                        })
                        .reverse()
                        .join("");

                    return removeWhitespace(toHTML(parent)) === htmlString;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of randomizedOneThroughTen) {
            test(`updates rendered HTML when items are sorted in an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const randomizedOneThroughTen = [5, 4, 6, 1, 7, 3, 2, 10, 9, 8];
                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createRandomizedArray(sz, randomized) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({
                                name: `item${randomized[i]}`,
                                index: randomized[i],
                            });
                        }
                        return items;
                    }

                    class RandomizedViewModel {
                        items;
                        template = itemTemplate;
                        constructor(sz) {
                            this.items = createRandomizedArray(
                                sz,
                                randomizedOneThroughTen,
                            );
                        }
                    }
                    Observable.defineProperty(RandomizedViewModel.prototype, "items");
                    Observable.defineProperty(RandomizedViewModel.prototype, "template");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new RandomizedViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);
                    const sortAlgo = (a, b) => b.index - a.index;
                    vm.items.sort(sortAlgo);

                    await Updates.next();

                    const htmlString = new Array(s)
                        .fill(undefined)
                        .map((item, index) => {
                            return {
                                name: `item${randomizedOneThroughTen[index]}`,
                                index: randomizedOneThroughTen[index],
                            };
                        })
                        .sort(sortAlgo)
                        .map(item => {
                            return item.name;
                        })
                        .join("");

                    return removeWhitespace(toHTML(parent)) === htmlString;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`updates rendered HTML when a single item is spliced from the end of an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    const index = s - 1;
                    vm.items.splice(index, 1);

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(s, x => x !== index)}`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`updates rendered HTML when a single item is spliced from the beginning of an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.splice(0, 1);

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(s, x => x !== 0)}`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`updates rendered HTML when a single item is replaced from the end of an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    const index = s - 1;
                    vm.items.splice(index, 1, { name: "newitem1" }, { name: "newitem2" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(s, x => x !== index)}newitem1newitem2`
                    );
                }, size);

                expect(result).toBe(true);
            });

            test(`updates rendered HTML when a single item is replaced from the end of an array of size ${size} with recycle property set to false`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    function expectViewPositionToBeCorrect(behavior) {
                        for (let i = 0, ii = behavior.views.length; i < ii; ++i) {
                            const context = behavior.views[i].context;
                            if (context.index !== i || context.length !== ii)
                                return false;
                        }
                        return true;
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate, {
                        positioning: true,
                        recycle: false,
                    });
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);
                    const posBefore = expectViewPositionToBeCorrect(behavior);

                    const index = s - 1;
                    vm.items.splice(index, 1, { name: "newitem1" }, { name: "newitem2" });

                    await Updates.next();

                    const posAfter = expectViewPositionToBeCorrect(behavior);
                    const htmlCorrect =
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(s, x => x !== index)}newitem1newitem2`;

                    return posBefore && posAfter && htmlCorrect;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`updates rendered HTML when a single item is spliced from the middle of an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    const mid = Math.floor(vm.items.length / 2);
                    vm.items.splice(mid, 1, { name: "newitem1" });
                    await Updates.next();
                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(mid)}newitem1${createOutput(
                            vm.items.slice(mid + 1).length,
                            undefined,
                            undefined,
                            undefined,
                            mid + 1,
                        )}`
                    );
                }, size);

                expect(result).toBe(true);
            });

            test(`updates rendered HTML when a single item is spliced from the middle of an array of size ${size} with recycle property set to false`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    function expectViewPositionToBeCorrect(behavior) {
                        for (let i = 0, ii = behavior.views.length; i < ii; ++i) {
                            const context = behavior.views[i].context;
                            if (context.index !== i || context.length !== ii)
                                return false;
                        }
                        return true;
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate, {
                        positioning: true,
                        recycle: false,
                    });
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);
                    const posBefore = expectViewPositionToBeCorrect(behavior);

                    const mid = Math.floor(vm.items.length / 2);
                    vm.items.splice(mid, 1, { name: "newitem1" });
                    await Updates.next();

                    const posAfter = expectViewPositionToBeCorrect(behavior);
                    const htmlCorrect =
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(mid)}newitem1${createOutput(
                            vm.items.slice(mid + 1).length,
                            undefined,
                            undefined,
                            undefined,
                            mid + 1,
                        )}`;

                    return posBefore && posAfter && htmlCorrect;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`updates rendered HTML when a 2 items are spliced from the middle of an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    const mid = Math.floor(vm.items.length / 2);
                    vm.items.splice(mid, 2, { name: "newitem1" }, { name: "newitem2" });
                    await Updates.next();
                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(mid)}newitem1newitem2${createOutput(
                            vm.items.slice(mid + 2).length,
                            undefined,
                            undefined,
                            undefined,
                            mid + 2,
                        )}`
                    );
                }, size);

                expect(result).toBe(true);
            });

            test(`updates rendered HTML when 2 items are spliced from the middle of an array of size ${size} with recycle property set to false`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate, {
                        recycle: false,
                    });
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    const mid = Math.floor(vm.items.length / 2);
                    vm.items.splice(mid, 2, { name: "newitem1" }, { name: "newitem2" });
                    await Updates.next();
                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(mid)}newitem1newitem2${createOutput(
                            vm.items.slice(mid + 2).length,
                            undefined,
                            undefined,
                            undefined,
                            mid + 2,
                        )}`
                    );
                }, size);

                expect(result).toBe(true);
            });

            test(`updates rendered HTML when all items are spliced to replace entire array with an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    function expectViewPositionToBeCorrect(behavior) {
                        for (let i = 0, ii = behavior.views.length; i < ii; ++i) {
                            const context = behavior.views[i].context;
                            if (context.index !== i || context.length !== ii)
                                return false;
                        }
                        return true;
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate, {
                        positioning: true,
                    });
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    const pos1 = expectViewPositionToBeCorrect(behavior);

                    vm.items.splice(0, vm.items.length, ...vm.items);
                    await Updates.next();
                    const pos2 = expectViewPositionToBeCorrect(behavior);
                    const html1 = removeWhitespace(toHTML(parent)) === createOutput(s);

                    vm.items.splice(0, vm.items.length, ...vm.items);
                    await Updates.next();
                    const pos3 = expectViewPositionToBeCorrect(behavior);
                    const html2 = removeWhitespace(toHTML(parent)) === createOutput(s);

                    return pos1 && pos2 && html1 && pos3 && html2;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`updates rendered HTML when a single item is replaced from the beginning of an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.splice(0, 1, { name: "newitem1" }, { name: "newitem2" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `newitem1newitem2${createOutput(s, x => x !== 0)}`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`updates all when the template changes for an array of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;
                    const altItemTemplate = html`
                        *${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        template = itemTemplate;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");
                    Observable.defineProperty(ViewModel.prototype, "template");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const vm = new ViewModel(s);
                    const directive = repeat(
                        x => x.items,
                        x => vm.template,
                    );
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    const before = removeWhitespace(toHTML(parent)) === createOutput(s);

                    vm.template = altItemTemplate;

                    await Updates.next();

                    const after =
                        removeWhitespace(toHTML(parent)) ===
                        createOutput(s, () => true, "*");

                    return before && after;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`renders grandparent values from nested arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const { repeat, Observable, html, Fake, toHTML, removeWhitespace } =
                        await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    class ViewModel {
                        name = "root";
                        items;
                        template = itemTemplate;
                        constructor(sz, nested = false) {
                            this.items = createArray(sz);
                            if (nested) {
                                this.items.forEach(x => (x.items = createArray(sz)));
                            }
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");
                    Observable.defineProperty(ViewModel.prototype, "template");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const deepItemTemplate = html`
                        parent-${x => x.name}${repeat(
                            x => x.items,
                            html`
                                child-${x => x.name}root-${(x, c) =>
                                    c.parentContext.parent.name}
                            `,
                        )}
                    `;

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, deepItemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s, true);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    const text = removeWhitespace(toHTML(parent));

                    for (let i = 0; i < s; ++i) {
                        const str = `child-item${i + 1}root-root`;
                        if (text.indexOf(str) === -1) return false;
                    }
                    return true;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back shift operations for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.shift();
                    vm.items.unshift({ name: "shift" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `shift${createOutput(s, index => index !== 0)}`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back shift operations with multiple unshift items for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.shift();
                    vm.items.unshift({ name: "shift" }, { name: "shift" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `shiftshift${createOutput(s, index => index !== 0)}`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back shift and unshift operations with multiple unshift items for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.shift();
                    vm.items.unshift({ name: "shift1" }, { name: "shift2" });
                    vm.items.shift();

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `shift2${createOutput(s, index => index !== 0)}`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back shift and push operations for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.shift();
                    vm.items.push({ name: "shift3" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(s, index => index !== 0)}shift3`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back push and shift operations for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.push({ name: "shift3" });
                    vm.items.shift();

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(s, index => index !== 0)}shift3`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back push and pop operations for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.push({ name: "shift3" });
                    vm.items.pop();

                    await Updates.next();

                    return removeWhitespace(toHTML(parent)) === `${createOutput(s)}`;
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back pop and push operations for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.pop();
                    vm.items.push({ name: "shift3" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `${createOutput(s - 1)}shift3`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back array modification operations for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.pop();
                    vm.items.push({ name: "shift3" });
                    vm.items.unshift({ name: "shift1" }, { name: "shift2" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `shift1shift2${createOutput(s - 1)}shift3`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back array modification 2 operations for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.push({ name: "shift3" });
                    vm.items.pop();
                    vm.items.unshift({ name: "shift1" }, { name: "shift2" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `shift1shift2${createOutput(s)}`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of oneThroughTen) {
            test(`handles back to back multiple shift operations with unshift with multiple items for arrays of size ${size}`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    vm.items.shift();
                    vm.items.shift();
                    vm.items.unshift({ name: "shift1" }, { name: "shift2" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) ===
                        `shift1shift2${createOutput(
                            s - 1,
                            index => index !== 0,
                            undefined,
                            undefined,
                            1,
                        )}`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }

        for (const size of zeroThroughTen) {
            test(`updates rendered HTML when a new item is pushed into an array of size ${size} after it has been unbound and rebound`, async ({
                page,
            }) => {
                await page.goto("/");

                const result = await page.evaluate(async s => {
                    // @ts-expect-error: Client module.
                    const {
                        repeat,
                        Observable,
                        html,
                        Fake,
                        toHTML,
                        Updates,
                        removeWhitespace,
                    } = await import("/main.js");

                    const itemTemplate = html`
                        ${x => x.name}
                    `;

                    function createArray(sz) {
                        const items = [];
                        for (let i = 0; i < sz; ++i) {
                            items.push({ name: `item${i + 1}` });
                        }
                        return items;
                    }

                    function createOutput(
                        sz,
                        filter = () => true,
                        prefix = "",
                        wrapper = input => input,
                        fromIndex = 0,
                    ) {
                        let output = "";
                        const delta = fromIndex > 0 ? fromIndex : 0;
                        for (let i = 0; i < sz; ++i) {
                            if (filter(i)) {
                                output += wrapper(`${prefix}item${i + 1 + delta}`);
                            }
                        }
                        return output;
                    }

                    class ViewModel {
                        items;
                        constructor(sz) {
                            this.items = createArray(sz);
                        }
                    }
                    Observable.defineProperty(ViewModel.prototype, "items");

                    function createLocation() {
                        const parent = document.createElement("div");
                        const location = document.createComment("");
                        const nodeId = "r";
                        const targets = { [nodeId]: location };
                        parent.appendChild(location);
                        return { parent, targets, nodeId };
                    }

                    function createController(source, targets) {
                        const unbindables = [];
                        return {
                            isBound: false,
                            context: Fake.executionContext(),
                            onUnbind(object) {
                                unbindables.push(object);
                            },
                            source,
                            targets,
                            unbind() {
                                unbindables.forEach(x => x.unbind(this));
                            },
                        };
                    }

                    const { parent, targets, nodeId } = createLocation();
                    const directive = repeat(x => x.items, itemTemplate);
                    directive.targetNodeId = nodeId;
                    const behavior = directive.createBehavior();
                    const vm = new ViewModel(s);
                    const controller = createController(vm, targets);

                    behavior.bind(controller);

                    await Updates.next();

                    controller.unbind();

                    await Updates.next();

                    behavior.bind(controller);

                    await Updates.next();

                    vm.items.push({ name: "newitem" });

                    await Updates.next();

                    return (
                        removeWhitespace(toHTML(parent)) === `${createOutput(s)}newitem`
                    );
                }, size);

                expect(result).toBe(true);
            });
        }
    });
});
