import { expect, test } from "@playwright/test";

/**
 * Coverage for https://github.com/microsoft/fast/issues/7144
 *
 * When a host element that owns a repeat is disconnected and later reconnected,
 * the repeat must not resurrect the views it rendered before the disconnect, and
 * must not evaluate its bindings while it is unbound. It must, however, keep
 * reusing views when a recycled view is simply rebound to new data -- that is
 * the hot path for nested repeats and array splices.
 */
test.describe("The repeat directive when its host is disconnected and reconnected", () => {
    test("does not throw a binding error when an items dependency changes while unbound", async ({
        page,
    }) => {
        await page.goto("/");

        const errors = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, html, repeat, Observable, Updates } = await import(
                "/main.js"
            );

            // The update queue swallows a throwing task and rethrows it from a
            // `setTimeout(..., 0)`, so the failure only ever surfaces as an
            // uncaught error a macrotask later. Listen for it, and below, give
            // that timer a chance to run before asserting.
            const errors: string[] = [];
            const onError = (e: ErrorEvent) => {
                errors.push(String(e.message));
            };
            addEventListener("error", onError);

            class Host extends FASTElement {
                items: any = [{ name: "a" }, { name: "b" }];
            }
            Observable.defineProperty(Host.prototype, "items");
            Host.define({
                name: "unbound-notification-host",
                template: html`${repeat(
                    (x: any) => x.items,
                    html`<span>${(x: any) => x.name}</span>`,
                )}`,
            });

            const from = document.createElement("div");
            const to = document.createElement("div");
            document.body.appendChild(from);
            document.body.appendChild(to);

            const host: any = document.createElement("unbound-notification-host");
            from.appendChild(host);
            await Updates.next();

            // The first bind happens inside `render()`, before the element
            // controller marks the view's source lifetime as coupled, so the
            // items observer registers itself for unbind. Rebinding the view
            // once the lifetime *is* coupled makes `requiresUnbind()` false, so
            // the observer stops registering and keeps its subscription to
            // `host.items` through every later unbind.
            to.appendChild(host);
            await Updates.next();

            host.remove();
            await Updates.next();

            // The repeat is now unbound with a null source, but still subscribed.
            // Evaluating `x => x.items` against that null source throws.
            host.items = [{ name: "x" }];
            await Updates.next();

            // Let the queue's deferred rethrow actually run.
            await new Promise(resolve => setTimeout(resolve, 0));
            await new Promise(resolve => setTimeout(resolve, 0));

            removeEventListener("error", onError);

            return errors;
        });

        expect(errors).toEqual([]);
    });

    test("does not connect and immediately disconnect repeated elements when items are cleared while unbound", async ({
        page,
    }) => {
        await page.goto("/");

        const log = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, html, repeat, Observable, Updates } = await import(
                "/main.js"
            );

            const log: string[] = [];

            class Row extends FASTElement {
                label: any;
                connectedCallback() {
                    super.connectedCallback();
                    log.push(`connected:${this.label}`);
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    log.push(`disconnected:${this.label}`);
                }
            }
            Observable.defineProperty(Row.prototype, "label");
            Row.define({ name: "churn-row", template: html`${(x: any) => x.label}` });

            class Host extends FASTElement {
                items: any = [{ name: "a" }, { name: "b" }];
                disconnectedCallback() {
                    super.disconnectedCallback();
                    this.items = [];
                }
            }
            Observable.defineProperty(Host.prototype, "items");
            Host.define({
                name: "churn-host",
                template: html`${repeat(
                    (x: any) => x.items,
                    html`<churn-row :label="${(x: any) => x.name}"></churn-row>`,
                )}`,
            });

            const parent = document.createElement("div");
            document.body.appendChild(parent);

            const host: any = document.createElement("churn-host");
            parent.appendChild(host);
            await Updates.next();

            host.remove();
            await Updates.next();

            log.push("--- reconnect ---");
            parent.appendChild(host);
            await Updates.next();

            return log;
        });

        // Each row connects once and disconnects once. Nothing may happen after
        // the host comes back: the rows were removed while the host was detached.
        expect(log).toEqual([
            "connected:a",
            "connected:b",
            "disconnected:a",
            "disconnected:b",
            "--- reconnect ---",
        ]);
    });

    test("releases the DOM of its views when the host is disconnected", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, html, repeat, Observable, Updates } = await import(
                "/main.js"
            );

            class Host extends FASTElement {
                items: any = [{ name: "a" }, { name: "b" }, { name: "c" }];
            }
            Observable.defineProperty(Host.prototype, "items");
            Host.define({
                name: "release-dom-host",
                template: html`${repeat(
                    (x: any) => x.items,
                    html`<span>${(x: any) => x.name}</span>`,
                )}`,
            });

            const parent = document.createElement("div");
            document.body.appendChild(parent);

            const host: any = document.createElement("release-dom-host");
            parent.appendChild(host);
            await Updates.next();

            const connected = host.shadowRoot.querySelectorAll("span").length;

            host.remove();
            await Updates.next();

            const afterUnbind = host.shadowRoot.querySelectorAll("span").length;

            parent.appendChild(host);
            await Updates.next();

            return {
                connected,
                afterUnbind,
                afterRebind: host.shadowRoot.querySelectorAll("span").length,
                text: host.shadowRoot.textContent.replace(/\s+/g, ""),
            };
        });

        expect(result.connected).toBe(3);
        expect(result.afterUnbind).toBe(0);
        expect(result.afterRebind).toBe(3);
        expect(result.text).toBe("abc");
    });

    test("reuses the same repeated element instances across a DOM move", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, html, repeat, Observable, Updates } = await import(
                "/main.js"
            );

            class Row extends FASTElement {
                label: any;
            }
            Observable.defineProperty(Row.prototype, "label");
            Row.define({ name: "move-row", template: html`${(x: any) => x.label}` });

            class Host extends FASTElement {
                items: any = [{ name: "a" }, { name: "b" }];
            }
            Observable.defineProperty(Host.prototype, "items");
            Host.define({
                name: "move-host",
                template: html`${repeat(
                    (x: any) => x.items,
                    html`<move-row :label="${(x: any) => x.name}"></move-row>`,
                )}`,
            });

            const from = document.createElement("div");
            const to = document.createElement("div");
            document.body.appendChild(from);
            document.body.appendChild(to);

            const host: any = document.createElement("move-host");
            from.appendChild(host);
            await Updates.next();

            const before = Array.from(host.shadowRoot.querySelectorAll("move-row"));

            // A DOM move: disconnect and reconnect in one task.
            to.appendChild(host);
            await Updates.next();

            const after = Array.from(host.shadowRoot.querySelectorAll("move-row"));

            return {
                sameInstances:
                    before.length === after.length &&
                    before.every((el, i) => el === after[i]),
                count: after.length,
                labels: after.map((el: any) => el.label),
                allConnected: after.every((el: any) => el.isConnected === true),
            };
        });

        expect(result.count).toBe(2);
        expect(result.sameInstances).toBe(true);
        expect(result.allConnected).toBe(true);
        expect(result.labels).toEqual(["a", "b"]);
    });

    test("renders replacement items when the array changed while unbound", async ({
        page,
    }) => {
        await page.goto("/");

        const text = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, html, repeat, Observable, Updates } = await import(
                "/main.js"
            );

            class Host extends FASTElement {
                items: any = [{ name: "a" }, { name: "b" }];
            }
            Observable.defineProperty(Host.prototype, "items");
            Host.define({
                name: "replaced-items-host",
                template: html`${repeat(
                    (x: any) => x.items,
                    html`<span>${(x: any) => x.name}</span>`,
                )}`,
            });

            const parent = document.createElement("div");
            document.body.appendChild(parent);

            const host: any = document.createElement("replaced-items-host");
            parent.appendChild(host);
            await Updates.next();

            host.remove();
            await Updates.next();

            host.items = [{ name: "x" }, { name: "y" }, { name: "z" }];
            await Updates.next();

            parent.appendChild(host);
            await Updates.next();

            return host.shadowRoot.textContent.replace(/\s+/g, "");
        });

        expect(text).toBe("xyz");
    });

    test("keeps reusing nested repeat DOM when an outer view is recycled", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, html, repeat, Observable, Updates } = await import(
                "/main.js"
            );

            const innerTemplate = html`<span>${(x: any) => x}</span>`;
            const outerTemplate = html`<section>
                ${repeat((x: any) => x.children, innerTemplate)}
            </section>`;

            class Host extends FASTElement {
                groups: any = [{ children: ["a1", "a2"] }, { children: ["b1", "b2"] }];
            }
            Observable.defineProperty(Host.prototype, "groups");
            Host.define({
                name: "nested-recycle-host",
                template: html`${repeat((x: any) => x.groups, outerTemplate)}`,
            });

            const host: any = document.createElement("nested-recycle-host");
            document.body.appendChild(host);
            await Updates.next();

            const before = Array.from(host.shadowRoot.querySelectorAll("span"));

            // Recycles the first outer view against a new source. The nested
            // repeat is unbound and immediately rebound; its DOM must survive.
            host.groups.splice(0, 1, { children: ["c1", "c2"] });
            await Updates.next();

            const after = Array.from(host.shadowRoot.querySelectorAll("span"));

            return {
                reusedNodes:
                    before.length === after.length &&
                    before.every((el, i) => el === after[i]),
                text: host.shadowRoot.textContent.replace(/\s+/g, ""),
            };
        });

        expect(result.reusedNodes).toBe(true);
        expect(result.text).toBe("c1c2b1b2");
    });

    test("re-renders a nested repeat after the outer array is emptied and refilled", async ({
        page,
    }) => {
        const pageErrors: string[] = [];
        page.on("pageerror", e => pageErrors.push(String(e.message ?? e)));

        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, html, repeat, Observable, Updates } = await import(
                "/main.js"
            );

            const innerTemplate = html`<span class="item">${(x: any) => x}</span>`;
            const outerTemplate = html`${repeat((x: any) => x.items, innerTemplate)}`;

            class Host extends FASTElement {
                groups: any = [{ items: ["a"] }];
            }
            Observable.defineProperty(Host.prototype, "groups");
            Host.define({
                name: "outer-emptied-host",
                template: html`<div>
                    ${repeat((x: any) => x.groups, outerTemplate)}
                </div>`,
            });

            const host: any = document.createElement("outer-emptied-host");
            document.body.appendChild(host);
            await Updates.next();

            const initial = host.shadowRoot.querySelectorAll(".item").length;

            // Disposing the outer views detaches their nodes before unbinding
            // them, so the nested repeat must not try to detach that DOM again.
            host.groups = [];
            await Updates.next();

            const emptied = host.shadowRoot.querySelectorAll(".item").length;

            host.groups = [{ items: ["b", "c"] }];
            await Updates.next();

            return {
                initial,
                emptied,
                refilled: host.shadowRoot.querySelectorAll(".item").length,
                text: host.shadowRoot.textContent.replace(/\s+/g, ""),
            };
        });

        expect(pageErrors).toEqual([]);
        expect(result.initial).toBe(1);
        expect(result.emptied).toBe(0);
        expect(result.refilled).toBe(2);
        expect(result.text).toBe("bc");
    });

    test("survives an empty repeat, a double unbind, and a rebind", async ({ page }) => {
        const pageErrors: string[] = [];
        page.on("pageerror", e => pageErrors.push(String(e.message ?? e)));

        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { html, repeat, Observable, Updates, Fake, toHTML, removeWhitespace } =
                await import("/main.js");

            class ViewModel {
                items: any;
                constructor(items: any) {
                    this.items = items;
                }
            }
            Observable.defineProperty(ViewModel.prototype, "items");

            function createController(source: any, targets: any) {
                const unbindables: any[] = [];
                return {
                    isBound: false,
                    isUnbinding: false,
                    context: Fake.executionContext(),
                    onUnbind(object: any) {
                        unbindables.push(object);
                    },
                    source,
                    targets,
                    unbind() {
                        this.isUnbinding = true;
                        unbindables.forEach(x => x.unbind(this));
                        this.isUnbinding = false;
                        this.isBound = false;
                    },
                };
            }

            const results: string[] = [];

            for (const items of [null, undefined, [], [{ name: "a" }]]) {
                const parent = document.createElement("div");
                const location = document.createComment("");
                parent.appendChild(location);

                const directive: any = repeat(
                    (x: any) => x.items,
                    html`${(x: any) => x.name}`,
                );
                directive.targetNodeId = "r";

                const behavior: any = directive.createBehavior();
                const vm: any = new ViewModel(items);
                const controller: any = createController(vm, { r: location });

                behavior.bind(controller);
                controller.isBound = true;
                await Updates.next();

                controller.unbind();
                controller.unbind();
                await Updates.next();

                // A notification while unbound must be ignored, not evaluated.
                vm.items = null;
                await Updates.next();

                behavior.bind(controller);
                controller.isBound = true;
                await Updates.next();

                results.push(removeWhitespace(toHTML(parent)));
            }

            return results;
        });

        expect(pageErrors).toEqual([]);
        expect(result).toEqual(["", "", "", ""]);
    });

    test("reconnects correctly with positioning enabled and recycling disabled", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { FASTElement, html, repeat, Observable, Updates } = await import(
                "/main.js"
            );

            class Host extends FASTElement {
                items: any = ["a", "b", "c"];
            }
            Observable.defineProperty(Host.prototype, "items");
            Host.define({
                name: "options-host",
                template: html`${repeat(
                    (x: any) => x.items,
                    html`<span>${(x: any, c: any) => `${c.index}:${x}`}</span>`,
                    { positioning: true, recycle: false },
                )}`,
            });

            const parent = document.createElement("div");
            document.body.appendChild(parent);

            const host: any = document.createElement("options-host");
            parent.appendChild(host);
            await Updates.next();

            const before = host.shadowRoot.textContent.replace(/\s+/g, "");

            host.remove();
            await Updates.next();
            parent.appendChild(host);
            await Updates.next();

            return {
                before,
                after: host.shadowRoot.textContent.replace(/\s+/g, ""),
                count: host.shadowRoot.querySelectorAll("span").length,
            };
        });

        expect(result.before).toBe("0:a1:b2:c");
        expect(result.after).toBe("0:a1:b2:c");
        expect(result.count).toBe(3);
    });
});
