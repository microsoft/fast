import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

for (const enableAfterRegistration of [false, true]) {
    test(`registrations before hydration tracking stay conservative: late enable ${enableAfterRegistration}`, async ({
        page,
    }) => {
        const result = await page.evaluate(async enableAfterRegistration => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                html,
                enableHydration,
                buildViewBindingTargets,
                uniqueElementName,
            } = await import("/main.js");
            class EarlyElement extends FASTElement {}
            const definition = await FASTElementDefinition.compose(EarlyElement, {
                name: uniqueElementName(),
                template: html``,
            });
            definition.define();
            if (enableAfterRegistration) {
                enableHydration();
                definition.define();
            }
            const element = document.createElement(definition.name);
            element.setAttribute("data-fe", "1");
            const root = document.createElement("div");
            root.append(element);
            const createRange = document.createRange;
            let ranges = 0;
            let identity = false;
            try {
                document.createRange = function () {
                    ranges++;
                    return createRange.call(this);
                };
                const { targets } = buildViewBindingTargets(element, element, [
                    { targetNodeId: "one" },
                ]);
                identity = targets.one === element;
            } finally {
                document.createRange = createRange;
            }
            return { ranges, identity, marker: element.hasAttribute("data-fe") };
        }, enableAfterRegistration);
        expect(result).toEqual({ ranges: 1, identity: true, marker: false });
    });
}

test("untracked FAST attribute accessors capture live boundaries before running", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const {
            FASTElement,
            html,
            enableHydration,
            buildViewBindingTargets,
            uniqueElementName,
        } = await import("/main.js");
        class EarlyElement extends FASTElement {}
        const name = uniqueElementName();
        await EarlyElement.define({ name, template: html`` });
        enableHydration();
        const root = document.createElement("div");
        root.innerHTML = `<${name} id="first" data-fe="1"></${name}><i id="middle" data-fe="1"></i><u id="last" data-fe="1"></u><s id="outside" data-fe="1"></s>`;
        const first = root.firstElementChild!;
        const last = root.querySelector("#last")!;
        let mutations = 0;
        Object.defineProperty(first, "getAttribute", {
            get() {
                mutations++;
                root.append(last);
                return Element.prototype.getAttribute;
            },
        });
        const { targets } = buildViewBindingTargets(
            first,
            last,
            ["one", "two", "three", "four"].map(targetNodeId => ({ targetNodeId })),
        );
        return {
            ids: Object.values(targets).map(node => (node as Element).id),
            mutations,
            outside: root.querySelector("#outside")!.getAttribute("data-fe"),
            last: last.getAttribute("data-fe"),
        };
    });
    expect(result).toEqual({
        ids: ["first", "middle"],
        mutations: 1,
        outside: "1",
        last: "1",
    });
});

test("repeated enablement preserves registration-time proof instead of rereading attributes", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const {
            FASTElement,
            html,
            enableHydration,
            buildViewBindingTargets,
            uniqueElementName,
        } = await import("/main.js");
        enableHydration();
        class KnownElement extends FASTElement {}
        const name = uniqueElementName();
        await KnownElement.define({ name, template: html`` });
        KnownElement.observedAttributes.push("data-fe");
        enableHydration();
        const element = document.createElement(name);
        element.setAttribute("data-fe", "1");
        const root = document.createElement("div");
        root.append(element);
        const createRange = document.createRange;
        let ranges = 0;
        try {
            document.createRange = function () {
                ranges++;
                return createRange.call(this);
            };
            buildViewBindingTargets(element, element, [{ targetNodeId: "one" }]);
        } finally {
            document.createRange = createRange;
        }
        return { ranges, marker: element.hasAttribute("data-fe") };
    });
    expect(result).toEqual({ ranges: 0, marker: false });
});

for (const observesMarker of [false, true]) {
    test(`async registration captures proof after template resolution: observes ${observesMarker}`, async ({
        page,
    }) => {
        const result = await page.evaluate(async observesMarker => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                FASTElementDefinition,
                html,
                enableHydration,
                buildViewBindingTargets,
                uniqueElementName,
            } = await import("/main.js");
            let mutations = 0;
            class DeferredElement extends FASTElement {
                attributeChangedCallback(
                    name: string,
                    oldValue: string | null,
                    newValue: string | null,
                ) {
                    if (name === "data-fe" && oldValue !== null && newValue === null)
                        mutations++;
                    else super.attributeChangedCallback(name, oldValue, newValue);
                }
            }
            const template = html``;
            let resolveTemplate!: (value: typeof template) => void;
            const pending = new Promise<typeof template>(resolve => {
                resolveTemplate = resolve;
            });
            const definition = await FASTElementDefinition.compose(DeferredElement, {
                name: uniqueElementName(),
                template: async () => {
                    await pending;
                    if (observesMarker)
                        DeferredElement.observedAttributes.push("data-fe");
                    return template;
                },
            });
            definition.define();
            const initiallyPending = customElements.get(definition.name) === void 0;
            enableHydration();
            resolveTemplate(template);
            await customElements.whenDefined(definition.name);
            const element = document.createElement(definition.name);
            element.setAttribute("data-fe", "1");
            const root = document.createElement("div");
            root.append(element);
            const createRange = document.createRange;
            let ranges = 0;
            let identity = false;
            try {
                document.createRange = function () {
                    ranges++;
                    return createRange.call(this);
                };
                const { targets } = buildViewBindingTargets(element, element, [
                    { targetNodeId: "one" },
                ]);
                identity = targets.one === element;
            } finally {
                document.createRange = createRange;
            }
            return { ranges, mutations, initiallyPending, identity };
        }, observesMarker);
        expect(result).toEqual({
            ranges: observesMarker ? 1 : 0,
            mutations: observesMarker ? 1 : 0,
            initiallyPending: true,
            identity: true,
        });
    });
}

test("ordinary FAST marker cleanup avoids live ranges across 4,021 custom elements", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { createNativeHydrationWorkload, enableHydration } = await import(
            "/main.js"
        );
        enableHydration();
        const workload = await createNativeHydrationWorkload();
        const createRange = document.createRange;
        const createWalker = document.createTreeWalker;
        const comparePoint = Range.prototype.comparePoint;
        const intersectsNode = Range.prototype.intersectsNode;
        const counts = { ranges: 0, walkers: 0, comparePoint: 0, intersectsNode: 0 };
        try {
            document.createRange = function () {
                counts.ranges++;
                return createRange.call(this);
            };
            document.createTreeWalker = function (...args) {
                counts.walkers++;
                return createWalker.apply(this, args);
            };
            Range.prototype.comparePoint = function (...args) {
                counts.comparePoint++;
                return comparePoint.apply(this, args);
            };
            Range.prototype.intersectsNode = function (...args) {
                counts.intersectsNode++;
                return intersectsNode.apply(this, args);
            };
            workload.run();
        } finally {
            document.createRange = createRange;
            document.createTreeWalker = createWalker;
            Range.prototype.comparePoint = comparePoint;
            Range.prototype.intersectsNode = intersectsNode;
        }
        return { counts, ...workload.verify() };
    });
    expect(result).toEqual({
        counts: { ranges: 0, walkers: 0, comparePoint: 0, intersectsNode: 0 },
        customElements: 4021,
        markedElements: 4020,
        hydratedViews: 8041,
        elements: 7020,
        identity: true,
        remainingMarkers: 0,
    });
});

test("registration upgrades can discover native targets without live ranges", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const {
            FASTElement,
            html,
            enableHydration,
            buildViewBindingTargets,
            uniqueElementName,
        } = await import("/main.js");
        enableHydration();
        const name = uniqueElementName();
        const root = document.createElement("div");
        root.innerHTML = `<${name} data-fe="1"></${name}><span data-fe="1"></span>`;
        document.body.append(root);
        let preserved = false;
        class UpgradingElement extends FASTElement {
            connectedCallback() {
                const { targets } = buildViewBindingTargets(
                    root.firstChild!,
                    root.lastChild!,
                    [{ targetNodeId: "first" }, { targetNodeId: "last" }],
                );
                preserved =
                    targets.first === root.firstChild && targets.last === root.lastChild;
            }
        }
        const createRange = document.createRange;
        let ranges = 0;
        try {
            document.createRange = function () {
                ranges++;
                return createRange.call(this);
            };
            await UpgradingElement.define({ name, template: html`` });
        } finally {
            document.createRange = createRange;
            root.remove();
        }
        return { ranges, preserved };
    });
    expect(result).toEqual({ ranges: 0, preserved: true });
});

for (const mutation of [
    "observe",
    "insert",
    "remove",
    "move-first",
    "move-last",
    "before-registration",
    "after-registration",
    "lifecycle-getter",
    "observed-getter",
    "observed-iterator",
    "observed-index",
    "registry-wrapper",
    "registry-getter",
    "override-get",
    "get-getter",
    "override-remove",
    "remove-getter",
] as const) {
    test(`preserves immediate mutation-safe cleanup: ${mutation}`, async ({ page }) => {
        const result = await page.evaluate(async mutation => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                html,
                enableHydration,
                buildViewBindingTargets,
                uniqueElementName,
            } = await import("/main.js");
            enableHydration();
            let getterReads = 0;
            let mutations = 0;
            const root = document.createElement("div");
            function mutate() {
                mutations++;
                if (mutation === "observe") return;
                if (mutation === "remove") root.querySelector("#middle")!.remove();
                else if (mutation === "move-first") root.append(root.firstChild!);
                else if (mutation === "move-last")
                    root.append(root.querySelector("#last")!);
                else {
                    const inserted = document.createElement("b");
                    inserted.id = "inserted";
                    inserted.setAttribute("data-fe", "1");
                    root.insertBefore(inserted, root.querySelector("#middle"));
                }
            }
            class MarkerElement extends FASTElement {
                attributeChangedCallback(
                    name: string,
                    oldValue: string | null,
                    newValue: string | null,
                ) {
                    if (name === "data-fe" && oldValue !== null && newValue === null)
                        mutate();
                    else super.attributeChangedCallback(name, oldValue, newValue);
                }
            }
            const observes = [
                "observe",
                "insert",
                "remove",
                "move-first",
                "move-last",
                "after-registration",
            ].includes(mutation);
            if (mutation === "observed-getter") {
                Object.defineProperty(MarkerElement, "observedAttributes", {
                    get() {
                        getterReads++;
                        return getterReads === 1 ? ["data-fe"] : [];
                    },
                });
            }
            if (mutation === "lifecycle-getter") {
                const callback = MarkerElement.prototype.attributeChangedCallback;
                Object.defineProperty(
                    MarkerElement.prototype,
                    "attributeChangedCallback",
                    {
                        get() {
                            getterReads++;
                            MarkerElement.observedAttributes.push("data-fe");
                            return callback;
                        },
                    },
                );
            }
            const nativeDefine = customElements.define;
            if (mutation === "registry-wrapper") {
                customElements.define = function (name, type, options) {
                    type.observedAttributes.push("data-fe");
                    nativeDefine.call(this, name, type, options);
                };
            } else if (mutation === "registry-getter") {
                Object.defineProperty(customElements, "define", {
                    configurable: true,
                    get() {
                        getterReads++;
                        MarkerElement.observedAttributes.push("data-fe");
                        return nativeDefine;
                    },
                });
            }
            const name = uniqueElementName();
            try {
                await MarkerElement.define(
                    {
                        name,
                        template: html``,
                        attributes: observes
                            ? [{ name: "marker", attribute: "data-fe" }]
                            : [],
                    },
                    [
                        "before-registration",
                        "observed-iterator",
                        "observed-index",
                    ].includes(mutation)
                        ? [
                              (definition: {
                                  type: { observedAttributes: string[] };
                              }) => {
                                  const names = definition.type.observedAttributes;
                                  if (mutation === "observed-iterator") {
                                      names.push("data-fe");
                                      Object.defineProperty(names, Symbol.iterator, {
                                          value: function* () {
                                              yield "data-fe";
                                          },
                                      });
                                  } else if (mutation === "observed-index") {
                                      names.length = 1;
                                      Object.defineProperty(names, 0, {
                                          get() {
                                              getterReads++;
                                              return "data-fe";
                                          },
                                      });
                                  } else names.push("data-fe");
                              },
                          ]
                        : [],
                );
            } finally {
                Object.defineProperty(customElements, "define", {
                    configurable: true,
                    writable: true,
                    value: nativeDefine,
                });
            }
            if (mutation === "after-registration")
                MarkerElement.observedAttributes.length = 0;
            root.innerHTML = `<${name} id="first" data-fe="1"></${name}><i id="middle" data-fe="1"></i><u id="last" data-fe="1"></u><s id="outside" data-fe="1"></s>`;
            const first = root.firstElementChild!;
            const last = root.querySelector("#last")!;
            if (mutation === "override-get" || mutation === "override-remove") {
                const method =
                    mutation === "override-get" ? "getAttribute" : "removeAttribute";
                const original = first[method];
                Object.defineProperty(first, method, {
                    value(this: Element, attribute: string) {
                        if (attribute === "data-fe") mutate();
                        return original.call(this, attribute);
                    },
                });
            } else if (mutation === "remove-getter" || mutation === "get-getter") {
                const method =
                    mutation === "remove-getter" ? "removeAttribute" : "getAttribute";
                const original = first[method];
                Object.defineProperty(first, method, {
                    get() {
                        mutate();
                        return original;
                    },
                });
            }
            const createRange = document.createRange;
            let ranges = 0;
            let ids: string[] = [];
            try {
                document.createRange = function () {
                    ranges++;
                    return createRange.call(this);
                };
                const { targets } = buildViewBindingTargets(
                    first,
                    last,
                    ["one", "two", "three", "four"].map(targetNodeId => ({
                        targetNodeId,
                    })),
                );
                ids = Object.values(targets).map(node => (node as Element).id);
            } finally {
                document.createRange = createRange;
            }
            return {
                ids,
                ranges,
                mutations,
                getterReads,
                outside: root.querySelector("#outside")!.getAttribute("data-fe"),
                firstRetained: root.querySelector("#first") === first,
            };
        }, mutation);
        expect(result.ranges).toBe(1);
        expect(result.mutations).toBe(1);
        expect(result.outside).toBe("1");
        expect(result.firstRetained).toBe(true);
        expect(result.getterReads).toBe(
            [
                "observed-getter",
                "lifecycle-getter",
                "registry-getter",
                "observed-index",
            ].includes(mutation)
                ? 1
                : 0,
        );
        expect(result.ids).toEqual(
            mutation === "observe" || mutation === "move-last"
                ? ["first", "middle", "last"].slice(0, mutation === "observe" ? 3 : 2)
                : mutation === "remove"
                  ? ["first", "last"]
                  : mutation === "move-first"
                    ? ["first"]
                    : ["first", "inserted", "middle", "last"],
        );
    });
}

test("customized built-ins retain conservative cleanup", async ({
    page,
    browserName,
}) => {
    test.skip(browserName === "webkit", "WebKit does not support customized built-ins.");
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const {
            FASTElement,
            html,
            enableHydration,
            buildViewBindingTargets,
            uniqueElementName,
        } = await import("/main.js");
        enableHydration();
        class ButtonElement extends FASTElement.from(HTMLButtonElement) {}
        const name = uniqueElementName();
        await FASTElement.define(ButtonElement, {
            name,
            template: html``,
            elementOptions: { extends: "button" },
        });

        const root = document.createElement("div");
        root.innerHTML = `<button is="${name}" data-fe="1"></button>`;
        const createRange = document.createRange;
        let ranges = 0;
        let identity = false;
        try {
            document.createRange = function () {
                ranges++;
                return createRange.call(this);
            };
            const { targets } = buildViewBindingTargets(
                root.firstChild!,
                root.firstChild!,
                [{ targetNodeId: "one" }],
            );
            identity =
                targets.one === root.firstChild && targets.one instanceof ButtonElement;
        } finally {
            document.createRange = createRange;
        }
        return { ranges, identity };
    });
    expect(result).toEqual({ ranges: 1, identity: true });
});

test("a failed registration preserves earlier observation metadata and surfaces the error", async ({
    page,
}) => {
    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const {
            FASTElement,
            FASTElementDefinition,
            html,
            enableHydration,
            buildViewBindingTargets,
            uniqueElementName,
        } = await import("/main.js");
        enableHydration();
        class RegisteredElement extends FASTElement {}
        const definition = await FASTElementDefinition.compose(RegisteredElement, {
            name: uniqueElementName(),
            template: html``,
        });
        definition.define();
        const registry = Object.create(customElements);
        Object.defineProperties(registry, {
            get: { value: () => undefined },
            define: {
                value: () => {
                    throw new Error("registration failed");
                },
            },
        });
        let error = "";
        try {
            definition.define(registry);
        } catch (caught) {
            error = (caught as Error).message;
        }
        const root = document.createElement("div");
        const element = document.createElement(definition.name);
        element.setAttribute("data-fe", "1");
        root.append(element);
        const createRange = document.createRange;
        let ranges = 0;
        try {
            document.createRange = function () {
                ranges++;
                return createRange.call(this);
            };
            buildViewBindingTargets(element, element, [{ targetNodeId: "one" }]);
        } finally {
            document.createRange = createRange;
        }
        return { error, ranges };
    });
    expect(result).toEqual({ error: "registration failed", ranges: 0 });
});

for (const strategy of ["legacy", "custom"] as const) {
    test(`known FAST elements retain the ${strategy} strategy fallback`, async ({
        page,
    }) => {
        const result = await page.evaluate(async strategy => {
            // @ts-expect-error: Client module.
            const {
                FASTElement,
                html,
                buildViewBindingTargets,
                uniqueElementName,
                enableHydration,
                markers_v2,
                createHydrationMarkers,
                HydrationMarkup,
            } = await import("/main.js");
            enableHydration();
            class KnownElement extends FASTElement {}
            const name = uniqueElementName();
            await KnownElement.define({ name, template: html`` });
            const root = document.createElement("div");
            root.innerHTML =
                strategy === "legacy"
                    ? `<${name} id="first" data-fe-b="0"></${name}><i id="last" data-fe-b="1"></i>`
                    : `<${name} id="first" data-fe="1"></${name}><i id="last" data-fe="1"></i>`;
            const first = root.firstChild!;
            enableHydration({
                markers:
                    strategy === "legacy"
                        ? markers_v2
                        : createHydrationMarkers({
                              ...HydrationMarkup,
                              resolveAttributeBindings(
                                  element: Element,
                                  pointer: number,
                                  offset: number,
                              ) {
                                  const resolution =
                                      HydrationMarkup.resolveAttributeBindings(
                                          element,
                                          pointer,
                                          offset,
                                      );
                                  return resolution === null
                                      ? null
                                      : {
                                            ...resolution,
                                            cleanup() {
                                                resolution.cleanup?.();
                                                if (element === first) {
                                                    const inserted =
                                                        document.createElement("b");
                                                    inserted.id = "inserted";
                                                    inserted.setAttribute("data-fe", "1");
                                                    element.after(inserted);
                                                }
                                            },
                                        };
                              },
                          }),
            });
            const createRange = document.createRange;
            let ranges = 0;
            let ids: string[] = [];
            try {
                document.createRange = function () {
                    ranges++;
                    return createRange.call(this);
                };
                const { targets } = buildViewBindingTargets(first, root.lastChild!, [
                    { targetNodeId: "one" },
                    { targetNodeId: "two" },
                    { targetNodeId: "three" },
                ]);
                ids = Object.values(targets).map(node => (node as Element).id);
            } finally {
                document.createRange = createRange;
            }
            return { ranges, ids };
        }, strategy);
        expect(result).toEqual({
            ranges: 1,
            ids:
                strategy === "legacy" ? ["first", "last"] : ["first", "inserted", "last"],
        });
    });
}
