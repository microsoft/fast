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
                    `
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
                    `
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
                    { positioning: true }
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
                    { recycle: false }
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
                    { positioning: true, recycle: false }
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
                    `
                );

                const data = directive.dataBinding.evaluate(
                    source,
                    Fake.executionContext()
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
                    Fake.executionContext()
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
                    () => itemTemplate
                );
                const template = directive.templateBinding.evaluate(
                    source,
                    Fake.executionContext()
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
                    `
                );
                directive.targetNodeId = nodeId;

                const behavior = directive.createBehavior();

                return behavior instanceof RepeatBehavior;
            });

            expect(result).toBe(true);
        });
    });

    test.describe("behavior", () => {
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                            input => `<div>${input}</div>`
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
                            input => `<div>${input}</div>`
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
                        fromIndex = 0
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
                                randomizedOneThroughTen
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                            mid + 1
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
                        fromIndex = 0
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
                            mid + 1
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
                        fromIndex = 0
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
                            mid + 2
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
                        fromIndex = 0
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
                            mid + 2
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        x => vm.template
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
                            `
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                        fromIndex = 0
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
                            1
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
                        fromIndex = 0
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
