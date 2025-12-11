import { expect, test } from "@playwright/test";
import { DOMPolicy, DOMPolicyOptions } from "./dom-policy.js";
import { DOM, DOMAspect, DOMSink } from "./dom.js";

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

        const created = false;
        const invoked = false;

        const newStates = JSON.parse(
            await page.evaluate(async data => {
                // @ts-expect-error: Client modules.
                const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");

                // @ts-expect-error Client side code.
                window.returnData = JSON.parse(data);

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
                                        // @ts-expect-error Client side code.
                                        window.returnData.created = true;
                                        return (target, name, value, ...rest) => {
                                            // @ts-expect-error Client side code.
                                            window.returnData.invoked = true;
                                            sink(target, name, value, ...rest);
                                        };
                                    },
                                },
                            },
                        },
                    },
                };

                const policy = DOMPolicy.create(options);
                // @ts-expect-error Client side code.
                window.sink = policy.protect(
                    "a",
                    DOMAspect.attribute,
                    "href",
                    DOM.setAttribute
                );

                // @ts-expect-error Client side code.
                return JSON.stringify(window.returnData);
            }, JSON.stringify({ created, invoked }))
        );

        expect(newStates.created).toBe(true);
        expect(newStates.invoked).toBe(false);

        const newStatesAfterSink = JSON.parse(
            await page.evaluate(() => {
                const element = document.createElement("a");

                // @ts-expect-error Client side code.
                window.sink(element, "href", "test");

                // @ts-expect-error Client side code.
                window.returnData.href = element.getAttribute("href");

                // @ts-expect-error Client side code.
                return JSON.stringify(window.returnData);
            })
        );

        expect(newStatesAfterSink.href).toBe("test");
        expect(newStatesAfterSink.created).toBe(true);
        expect(newStatesAfterSink.invoked).toBe(true);
    });

    test("creates policies that fallback to default element guards", async ({ page }) => {
        await page.goto("/");

        const created = 0;
        const invoked = 0;

        const newStates = JSON.parse(
            await page.evaluate(async data => {
                // @ts-expect-error: Client modules.
                const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");

                // @ts-expect-error Client side code.
                window.returnData = JSON.parse(data);

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
                                        // @ts-expect-error Client side code.
                                        window.returnData.created++;
                                        return (target, name, value, ...rest) => {
                                            // @ts-expect-error Client side code.
                                            window.returnData.invoked++;
                                            sink(target, name, value, ...rest);
                                        };
                                    },
                                },
                            },
                        },
                    },
                };

                // @ts-expect-error Client side code.
                window.policy = DOMPolicy.create(options);
                // @ts-expect-error Client side code.
                window.sink = window.policy.protect(
                    "a",
                    DOMAspect.attribute,
                    "href",
                    DOM.setAttribute
                );

                // @ts-expect-error Client side code.
                return JSON.stringify(window.returnData);
            }, JSON.stringify({ created, invoked }))
        );

        expect(newStates.created).toBe(1);
        expect(newStates.invoked).toBe(0);

        const newStates2 = JSON.parse(
            await page.evaluate(() => {
                const element = document.createElement("a");
                // @ts-expect-error Client side code.
                window.sink(element, "href", "test");

                // @ts-expect-error Client side code.
                window.returnData.href = element.getAttribute("href");

                // @ts-expect-error Client side code.
                return JSON.stringify(window.returnData);
            })
        );

        expect(newStates2.href).toBe("test");
        expect(newStates2.created).toBe(1);
        expect(newStates2.invoked).toBe(1);

        const newStates3 = JSON.parse(
            await page.evaluate(async () => {
                // @ts-expect-error: Client modules.
                const { DOMAspect } = await import("./main.js");

                function setProperty(node, name, value) {
                    node[name] = value;
                }

                // @ts-expect-error Client side code.
                const sink2 = window.policy.protect(
                    "a",
                    DOMAspect.property,
                    "href",
                    setProperty
                );

                const element2 = document.createElement("a");
                sink2(element2, "href", "https://fast.design/");

                // @ts-expect-error Client side code.
                window.returnData.href = element2.href;

                // @ts-expect-error Client side code.
                return JSON.stringify(window.returnData);
            })
        );

        expect(newStates3.href).toBe("https://fast.design/");
        expect(newStates3.created).toBe(1);
        expect(newStates3.invoked).toBe(1);
    });

    test("can create a policy with custom aspect guards", async ({ page }) => {
        await page.goto("/");

        const created = false;
        const invoked = false;

        const newStates = JSON.parse(
            await page.evaluate(async data => {
                // @ts-expect-error: Client modules.
                const { DOMAspect, DOMPolicy } = await import("./main.js");

                function setProperty(node, name, value) {
                    node[name] = value;
                }

                // @ts-expect-error Client side code.
                window.returnData = JSON.parse(data);

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
                                    // @ts-expect-error Client side code.
                                    window.returnData.created = true;
                                    return (target, name, value, ...rest) => {
                                        // @ts-expect-error Client side code.
                                        window.returnData.invoked = true;
                                        sink(target, name, value, ...rest);
                                    };
                                },
                            },
                        },
                    },
                };

                const policy = DOMPolicy.create(options);
                // @ts-expect-error Client side code.
                window.sink = policy.protect(
                    "div",
                    DOMAspect.property,
                    "innerHTML",
                    setProperty
                );

                // @ts-expect-error Client side code.
                return JSON.stringify(window.returnData);
            }, JSON.stringify({ created, invoked }))
        );

        expect(newStates.created).toBe(true);
        expect(newStates.invoked).toBe(false);

        const newStates2 = JSON.parse(
            await page.evaluate(() => {
                const element = document.createElement("div");

                // @ts-expect-error Client side code.
                window.sink(element, "innerHTML", "test");

                // @ts-expect-error Client side code.
                window.returnData.innerHTML = element.innerHTML;

                // @ts-expect-error Client side code.
                return JSON.stringify(window.returnData);
            })
        );

        expect(newStates2.innerHTML).toBe("test");
        expect(newStates2.created).toBe(true);
        expect(newStates2.invoked).toBe(true);
    });

    test("creates policies that fallback to default aspect guards", async ({ page }) => {
        await page.goto("/");

        const created = 0;
        const invoked = 0;

        const newStates = JSON.parse(
            await page.evaluate(async data => {
                // @ts-expect-error: Client modules.
                const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");

                // @ts-expect-error Client side code.
                window.returnData = JSON.parse(data);

                const options: DOMPolicyOptions = {
                    guards: {
                        aspects: {
                            [DOMAspect.attribute]: {
                                foo: function safeURL(fagName, fspect, fspectName, sink) {
                                    // @ts-expect-error Client side code.
                                    window.returnData.created++;
                                    return (target, name, value, ...rest) => {
                                        // @ts-expect-error Client side code.
                                        window.returnData.invoked++;
                                        sink(target, name, value, ...rest);
                                    };
                                },
                            },
                        },
                    },
                };

                // @ts-expect-error Client side code.
                window.policy = DOMPolicy.create(options);

                // @ts-expect-error Client side code.
                window.sink = policy.protect(
                    "a",
                    DOMAspect.attribute,
                    "foo",
                    DOM.setAttribute
                );

                // @ts-expect-error Client side code.
                return JSON.stringify(window.returnData);
            }, JSON.stringify({ created, invoked }))
        );

        expect(newStates.created).toBe(1);
        expect(newStates.invoked).toBe(0);

        const newStates2 = JSON.parse(
            await page.evaluate(() => {
                const element = document.createElement("a");

                // @ts-expect-error Client side code.
                window.sink(element, "foo", "test");

                // @ts-expect-error Client side code.
                window.returnData.foo = element.getAttribute("foo");

                // @ts-expect-error Client side code.
                return JSON.stringify(window.returnData);
            })
        );

        expect(newStates2.foo).toBe("test");
        expect(newStates2.created).toBe(1);
        expect(newStates2.invoked).toBe(1);

        const hasThrown = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { DOMAspect } = await import("./main.js");

            function setProperty(node, name, value) {
                node[name] = value;
            }

            try {
                // @ts-expect-error Client side code.
                window.policy.protect(
                    "div",
                    DOMAspect.property,
                    "innerHTML",
                    setProperty
                );
                return false;
            } catch {
                return true;
            }
        });

        expect(hasThrown).toBe(true);
    });
});
