import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { build } from "esbuild";
import { DOMPolicy, type DOMPolicyOptions } from "./dom-policy.js";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));

test.describe("the shared default dom policy", () => {
    for (const entrypoint of [
        "index.ts",
        "index.debug.ts",
        "dom.ts",
        "dom-policy.ts",
        "templating/html.ts",
        "declarative/index.ts",
        "index.rollup.ts",
        "index.rollup.debug.ts",
    ]) {
        test(`guards bindings and allows application configuration through ${entrypoint}`, async ({
            page,
        }) => {
            const bundle = await build({
                stdin: {
                    contents: `
                        import * as entrypoint from "./src/${entrypoint}";
                        export { entrypoint };
                        export { DOM, DOMAspect } from "./src/dom.ts";
                        export { DOMPolicy } from "./src/dom-policy.ts";
                        export { html } from "./src/templating/template.ts";
                    `,
                    resolveDir: packageRoot,
                },
                bundle: true,
                format: "esm",
                write: false,
            });

            await page.route("**/", route =>
                route.fulfill({
                    contentType: "text/html",
                    body: `<!doctype html>
                        <meta http-equiv="Content-Security-Policy"
                            content="trusted-types fast-html app-fast-html">
                        <body></body>`,
                }),
            );
            await page.goto("/");

            const result = await page.evaluate(async code => {
                const url = URL.createObjectURL(
                    new Blob([code], { type: "text/javascript" }),
                );

                try {
                    const { DOM, DOMAspect, DOMPolicy, html } = await import(url);
                    const model = {
                        url: "javascript:void(0)",
                        text: "<b>plain text</b>",
                        clicked: false,
                    };
                    const host = document.createElement("div");
                    const template = html`
                        <a href=${x => x.url}>attribute</a>
                        <a :href=${x => x.url}>property</a>
                        <p title=${x => x.text}>${x => x.text}</p>
                        <button @click=${x => {
                            x.clicked = true;
                        }}>click</button>
                    `;
                    const view = template.render(model, host);
                    const unsafeHrefs = Array.from(host.querySelectorAll("a"), a =>
                        a.getAttribute("href"),
                    );
                    host.querySelector("button")!.click();

                    view.bind({ ...model, url: "https://fast.design/" });
                    const safeHrefs = Array.from(host.querySelectorAll("a"), a =>
                        a.getAttribute("href"),
                    );
                    const text = host.querySelector("p")!;
                    const blockedErrors = [
                        html`<div :innerHTML=${x => x.text}></div>`,
                        html`<button onclick=${x => x.text}></button>`,
                        html`<button :onclick=${x => x.text}></button>`,
                    ].map(template => {
                        try {
                            template.render(model, document.createElement("div"));
                            return null;
                        } catch (error) {
                            return error instanceof Error ? error.message : String(error);
                        }
                    });

                    const customPolicy = DOMPolicy.create({
                        trustedType: globalThis.trustedTypes?.createPolicy(
                            "app-fast-html",
                            { createHTML: value => value },
                        ) ?? { createHTML: value => value },
                        guards: {
                            aspects: {
                                [DOMAspect.attribute]: {
                                    title(_tagName, _aspect, _aspectName, sink) {
                                        return (target, name, value, ...rest) =>
                                            sink(target, name, `app:${value}`, ...rest);
                                    },
                                },
                            },
                        },
                    });
                    DOM.setPolicy(customPolicy);
                    const customHost = document.createElement("div");
                    html`<div title=${x => x.text}></div>`.render(model, customHost);

                    let duplicateError: string | null = null;
                    try {
                        DOM.setPolicy(customPolicy);
                    } catch (error) {
                        duplicateError =
                            error instanceof Error ? error.message : String(error);
                    }

                    view.dispose();

                    return {
                        unsafeHrefs,
                        safeHrefs,
                        text: text.textContent,
                        title: text.getAttribute("title"),
                        hasMarkup: text.querySelector("b") !== null,
                        clicked: model.clicked,
                        blockedErrors,
                        customTitle: customHost.firstElementChild!.getAttribute("title"),
                        duplicateError,
                    };
                } finally {
                    URL.revokeObjectURL(url);
                }
            }, bundle.outputFiles[0].text);

            expect(result).toEqual({
                unsafeHrefs: ["", ""],
                safeHrefs: ["https://fast.design/", "https://fast.design/"],
                text: "<b>plain text</b>",
                title: "<b>plain text</b>",
                hasMarkup: false,
                clicked: true,
                blockedErrors: Array.from({ length: 3 }, () =>
                    expect.stringMatching(/1209|blocked by the current DOMPolicy/),
                ),
                customTitle: "app:<b>plain text</b>",
                duplicateError: expect.stringMatching(
                    /1201|DOM Policy can only be set once/,
                ),
            });
        });
    }
});

test.describe("the dom policy helper", () => {
    test("can create a policy with a custom trusted types policy", async () => {
        let invoked = false;
        function createTrustedType() {
            const createHTML = html => {
                invoked = true;
                return html;
            };

            return globalThis.trustedTypes
                ? globalThis.trustedTypes.createPolicy("app-fast-html", { createHTML })
                : { createHTML };
        }

        const policy = DOMPolicy.create({ trustedType: createTrustedType() });
        policy.createHTML("Hello world");

        expect(invoked).toBe(true);
    });

    test("uses the fast-html trusted types policy name by default", async ({ page }) => {
        await page.addInitScript(() => {
            const policyNames: string[] = [];
            const trustedTypes = globalThis.trustedTypes;
            const createPolicy = (name: string, rules: TrustedTypePolicyOptions) => {
                policyNames.push(name);
                return rules;
            };

            Object.defineProperty(globalThis, "fastPolicyNames", {
                value: policyNames,
            });

            if (trustedTypes) {
                Object.defineProperty(trustedTypes, "createPolicy", {
                    value: createPolicy,
                });
            } else {
                Object.defineProperty(globalThis, "trustedTypes", {
                    value: { createPolicy },
                });
            }
        });
        await page.goto("/");

        const policyNames = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { DOMPolicy } = await import("./main.js");
            const names = Reflect.get(globalThis, "fastPolicyNames");

            DOMPolicy.create();

            return names;
        });

        expect(policyNames).toEqual(["fast-html", "fast-html"]);
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
                                    sink,
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
                                    sink,
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

    test("preserves default element guards when applying partial element guard configs", async ({
        page,
    }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");

            const policy = DOMPolicy.create({
                guards: {
                    elements: {
                        a: {
                            [DOMAspect.attribute]: {
                                title(tagName, aspect, aspectName, sink) {
                                    return sink;
                                },
                            },
                        },
                    },
                },
            });

            function setProperty(node, name, value) {
                node[name] = value;
            }

            let scriptSrcBlocked = false;

            try {
                policy.protect("script", DOMAspect.property, "src", setProperty);
            } catch {
                scriptSrcBlocked = true;
            }

            const area = document.createElement("area");
            const areaHrefSink = policy.protect(
                "area",
                DOMAspect.attribute,
                "href",
                DOM.setAttribute,
            );

            areaHrefSink(area, "href", " JaVaScRiPt:alert(1) ");

            return {
                areaHref: area.getAttribute("href"),
                scriptSrcBlocked,
            };
        });

        expect(result).toEqual({
            areaHref: "",
            scriptSrcBlocked: true,
        });
    });

    test("blocks iframe srcdoc attributes and properties", async ({ page }) => {
        await page.goto("/");

        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");
            const policy = DOMPolicy.create();

            function setProperty(node, name, value) {
                node[name] = value;
            }

            let attributeBlocked = false;
            let propertyBlocked = false;

            try {
                policy.protect("iframe", DOMAspect.attribute, "srcdoc", DOM.setAttribute);
            } catch {
                attributeBlocked = true;
            }

            try {
                policy.protect("iframe", DOMAspect.property, "srcdoc", setProperty);
            } catch {
                propertyBlocked = true;
            }

            return { attributeBlocked, propertyBlocked };
        });

        expect(result).toEqual({
            attributeBlocked: true,
            propertyBlocked: true,
        });
    });

    test("filters unsafe URL protocols with case, whitespace, controls, and encoding", async ({
        page,
    }) => {
        await page.goto("/");

        const results = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");

            const policy = DOMPolicy.create();
            const hrefSink = policy.protect(
                "a",
                DOMAspect.attribute,
                "href",
                DOM.setAttribute,
            );

            return [
                "javascript:alert(1)",
                " JaVaScRiPt:alert(1) ",
                "\u0000java\u000Ascript:alert(1)",
                "java%0Ascript:alert(1)",
                "%6Aava%73cript%3Aalert(1)",
                "vbscript:msgbox(1)",
                "data:text/html,<svg onload=alert(1)>",
            ].map(value => {
                const element = document.createElement("a");
                hrefSink(element, "href", value);
                return element.getAttribute("href");
            });
        });

        expect(results).toEqual(["", "", "", "", "", "", ""]);
    });

    test("preserves safe and protocol-relative URL values after trimming", async ({
        page,
    }) => {
        await page.goto("/");

        const results = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");

            const policy = DOMPolicy.create();
            const hrefSink = policy.protect(
                "a",
                DOMAspect.attribute,
                "href",
                DOM.setAttribute,
            );

            return [
                " https://fast.design/docs ",
                "//fast.design/assets/logo.svg",
                "/docs/data:text/plain",
            ].map(value => {
                const element = document.createElement("a");
                hrefSink(element, "href", value);
                return element.getAttribute("href");
            });
        });

        expect(results).toEqual([
            "https://fast.design/docs",
            "//fast.design/assets/logo.svg",
            "/docs/data:text/plain",
        ]);
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
                                sink,
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
