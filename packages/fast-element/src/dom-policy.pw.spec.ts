import { expect, test } from "@playwright/test";
import { DOMPolicy, type DOMPolicyOptions } from "./dom-policy.js";

test.describe("the dom policy helper", () => {
    test("can create a policy with a custom trusted types policy", async () => {
        let invoked = false;
        function createTrustedType() {
            const createHTML = html => {
                invoked = true;
                return html;
            };

            return globalThis.trustedTypes
                ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML })
                : { createHTML };
        }

        const policy = DOMPolicy.create({ trustedType: createTrustedType() });
        policy.createHTML("Hello world");

        expect(invoked).toBe(true);
    });

    test("can create a policy with custom element guards", async ({ page }) => {
        await page.goto("/");

        const states = await page.evaluateHandle(() => ({
            created: false,
            invoked: false,
        }));

        const sink = await page.evaluateHandle(async states => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");

            const options = {
                guards: {
                    elements: {
                        a: {
                            [DOMAspect.attribute]: {
                                href: function safeURL(
                                    tagName,
                                    aspect,
                                    aspectName,
                                    sink
                                ) {
                                    states.created = true;
                                    return (target, name, value, ...rest) => {
                                        states.invoked = true;
                                        sink(target, name, value, ...rest);
                                    };
                                },
                            },
                        },
                    },
                },
            };

            const policy = DOMPolicy.create(options);
            return policy.protect("a", DOMAspect.attribute, "href", DOM.setAttribute);
        }, states);

        expect(await (await states.getProperty("created")).jsonValue()).toBe(true);
        expect(await (await states.getProperty("invoked")).jsonValue()).toBe(false);

        const href = await page.evaluate(sink => {
            const element = document.createElement("a");

            sink(element, "href", "test");

            return element.getAttribute("href");
        }, sink);

        expect(href).toBe("test");
        expect(await (await states.getProperty("created")).jsonValue()).toBe(true);
        expect(await (await states.getProperty("invoked")).jsonValue()).toBe(true);
    });

    test("creates policies that fallback to default element guards", async ({ page }) => {
        await page.goto("/");

        const states = await page.evaluateHandle(() => ({
            created: 0,
            invoked: 0,
        }));

        const policy = await page.evaluateHandle(async states => {
            // @ts-expect-error: Client modules.
            const { DOMAspect, DOMPolicy } = await import("./main.js");

            const options = {
                guards: {
                    elements: {
                        a: {
                            [DOMAspect.attribute]: {
                                href: function safeURL(
                                    tagName,
                                    aspect,
                                    aspectName,
                                    sink
                                ) {
                                    states.created++;
                                    return (target, name, value, ...rest) => {
                                        states.invoked++;
                                        sink(target, name, value, ...rest);
                                    };
                                },
                            },
                        },
                    },
                },
            };

            return DOMPolicy.create(options);
        }, states);

        const sink = await page.evaluateHandle(async policy => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect } = await import("./main.js");

            return policy.protect("a", DOMAspect.attribute, "href", DOM.setAttribute);
        }, policy);

        expect(await (await states.getProperty("created")).jsonValue()).toBe(1);
        expect(await (await states.getProperty("invoked")).jsonValue()).toBe(0);

        const href = await page.evaluate(sink => {
            const element = document.createElement("a");
            sink(element, "href", "test");

            return element.getAttribute("href");
        }, sink);

        expect(href).toBe("test");
        expect(await (await states.getProperty("created")).jsonValue()).toBe(1);
        expect(await (await states.getProperty("invoked")).jsonValue()).toBe(1);

        const href2 = await page.evaluate(async policy => {
            // @ts-expect-error: Client modules.
            const { DOMAspect } = await import("./main.js");

            function setProperty(node, name, value) {
                node[name] = value;
            }

            const sink2 = policy.protect("a", DOMAspect.property, "href", setProperty);

            const element2 = document.createElement("a");
            sink2(element2, "href", "https://fast.design/");

            return element2.href;
        }, policy);

        expect(href2).toBe("https://fast.design/");
        expect(await (await states.getProperty("created")).jsonValue()).toBe(1);
        expect(await (await states.getProperty("invoked")).jsonValue()).toBe(1);
    });

    test("can create a policy with custom aspect guards", async ({ page }) => {
        await page.goto("/");

        const states = await page.evaluateHandle(() => ({
            created: false,
            invoked: false,
        }));

        const sink = await page.evaluateHandle(async states => {
            // @ts-expect-error: Client modules.
            const { DOMAspect, DOMPolicy } = await import("./main.js");

            function setProperty(node, name, value) {
                node[name] = value;
            }

            const options: DOMPolicyOptions = {
                guards: {
                    aspects: {
                        [DOMAspect.property]: {
                            innerHTML: function safeURL(
                                tagName,
                                aspect,
                                aspectName,
                                sink
                            ) {
                                states.created = true;
                                return (target, name, value, ...rest) => {
                                    states.invoked = true;
                                    sink(target, name, value, ...rest);
                                };
                            },
                        },
                    },
                },
            };

            const policy = DOMPolicy.create(options);
            return policy.protect("div", DOMAspect.property, "innerHTML", setProperty);
        }, states);

        expect(await (await states.getProperty("created")).jsonValue()).toBe(true);
        expect(await (await states.getProperty("invoked")).jsonValue()).toBe(false);

        const innerHTML = await page.evaluate(sink => {
            const element = document.createElement("div");

            sink(element, "innerHTML", "test");

            return element.innerHTML;
        }, sink);

        expect(innerHTML).toBe("test");
        expect(await (await states.getProperty("created")).jsonValue()).toBe(true);
        expect(await (await states.getProperty("invoked")).jsonValue()).toBe(true);
    });

    test("creates policies that fallback to default aspect guards", async ({ page }) => {
        await page.goto("/");

        const states = await page.evaluateHandle(() => ({
            created: 0,
            invoked: 0,
        }));

        const policy = await page.evaluateHandle(async states => {
            // @ts-expect-error: Client modules.
            const { DOMAspect, DOMPolicy } = await import("./main.js");

            const options: DOMPolicyOptions = {
                guards: {
                    aspects: {
                        [DOMAspect.attribute]: {
                            foo: function safeURL(fagName, fspect, fspectName, sink) {
                                states.created++;
                                return (target, name, value, ...rest) => {
                                    states.invoked++;
                                    sink(target, name, value, ...rest);
                                };
                            },
                        },
                    },
                },
            };

            return DOMPolicy.create(options);
        }, states);

        const sink = await page.evaluateHandle(async policy => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect } = await import("./main.js");

            return policy.protect("a", DOMAspect.attribute, "foo", DOM.setAttribute);
        }, policy);

        expect(await (await states.getProperty("created")).jsonValue()).toBe(1);
        expect(await (await states.getProperty("invoked")).jsonValue()).toBe(0);

        const foo = await page.evaluate(sink => {
            const element = document.createElement("a");

            sink(element, "foo", "test");

            return element.getAttribute("foo");
        }, sink);

        expect(foo).toBe("test");
        expect(await (await states.getProperty("created")).jsonValue()).toBe(1);
        expect(await (await states.getProperty("invoked")).jsonValue()).toBe(1);

        const hasThrown = await page.evaluate(async policy => {
            // @ts-expect-error: Client modules.
            const { DOMAspect } = await import("./main.js");

            function setProperty(node, name, value) {
                node[name] = value;
            }

            try {
                policy.protect("div", DOMAspect.property, "innerHTML", setProperty);
                return false;
            } catch {
                return true;
            }
        }, policy);

        expect(hasThrown).toBe(true);
    });
});
