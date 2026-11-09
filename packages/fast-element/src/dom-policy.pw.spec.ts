import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { build } from "esbuild";
import { DOMPolicy, type DOMPolicyOptions } from "./dom-policy.js";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));

test.describe("focused entrypoint policy dependencies", () => {
    for (const { name, module, forbidden } of [
        {
            name: "FASTElement",
            module: "components/fast-element.ts",
            forbidden: ["dom-policy.ts"],
        },
        {
            name: "html",
            module: "templating/html.ts",
            forbidden: ["dom-policy.ts"],
        },
        ...["ref", "children", "slotted"].map(name => ({
            name,
            module: `templating/${name}.ts`,
            forbidden: ["dom.ts", "dom-policy.ts"],
        })),
    ]) {
        test(`${name} excludes unnecessary policy modules`, async () => {
            const bundle = await build({
                stdin: {
                    contents: `export { ${name} } from "./src/${module}";`,
                    resolveDir: packageRoot,
                },
                bundle: true,
                format: "esm",
                write: false,
                metafile: true,
            });
            const unnecessaryModules = Object.keys(bundle.metafile.inputs).filter(input =>
                forbidden.some(module => input.endsWith(`/${module}`)),
            );

            expect(unnecessaryModules).toEqual([]);
        });
    }
});

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
    test("preserves the built-in element guard matrix", async ({ page }) => {
        await page.goto("/");

        const failures = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");
            const failures: string[] = [];
            const unsafe = "javascript:alert(1)";
            const urlRules = [
                ["a", "href", "href"],
                ["area", "href", "href"],
                ["button", "formaction", "formAction"],
                ["form", "action", "action"],
                ["frame", "src", "src"],
                ["iframe", "src", "src"],
                ["input", "formaction", "formAction"],
            ];
            const blockedRules: [string, string[], string[]][] = [
                ["embed", ["src"], ["src"]],
                ["iframe", ["srcdoc"], ["srcdoc"]],
                ["link", ["href"], ["href"]],
                ["object", ["codebase", "data"], ["codeBase", "data"]],
                ["script", ["src", "text"], ["src", "text", "innerText", "textContent"]],
                ["style", [], ["innerText", "textContent"]],
            ];

            function check(policy, tag, aspect, name, expected) {
                const element = document.createElement(tag);
                try {
                    const sink = policy.protect(
                        tag.toUpperCase(),
                        aspect,
                        name,
                        DOM.setAttribute,
                    );
                    sink(element, name, unsafe);
                    if (
                        expected === "blocked" ||
                        element.getAttribute(name) !== expected
                    ) {
                        failures.push(`${tag}/${aspect}/${name}: unexpected write`);
                    }
                } catch (error) {
                    if (expected !== "blocked") {
                        failures.push(`${tag}/${aspect}/${name}: ${error}`);
                    }
                }
            }

            for (const policy of [DOM.policy, DOMPolicy.create()]) {
                for (const [tag, attribute, property] of urlRules) {
                    check(policy, tag, DOMAspect.attribute, attribute, "");
                    check(policy, tag, DOMAspect.property, property, "");
                }
                for (const [tag, attributes, properties] of blockedRules) {
                    for (const name of attributes) {
                        check(policy, tag, DOMAspect.attribute, name, "blocked");
                    }
                    for (const name of properties) {
                        check(policy, tag, DOMAspect.property, name, "blocked");
                    }
                }
                check(policy, "button", DOMAspect.property, "formaction", unsafe);
                check(policy, "object", DOMAspect.property, "codebase", unsafe);
                check(policy, "script", DOMAspect.attribute, "textContent", unsafe);
                check(policy, "style", DOMAspect.attribute, "innerText", unsafe);
                check(policy, "div", DOMAspect.property, "onmadeup", unsafe);
            }
            return failures;
        });

        expect(failures).toEqual([]);
    });

    test("preserves guard removals and undefined default fallback", async ({ page }) => {
        await page.goto("/");

        const results = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");
            const attribute = DOMAspect.attribute;
            const property = DOMAspect.property;
            const globalGuard = (_tag, _aspect, _name, sink) => (target, name) =>
                sink(target, name, "/global");
            const results: (string | null)[] = [];

            for (const override of [
                null,
                { [attribute]: null },
                { [attribute]: { href: null } },
                undefined,
                { [attribute]: undefined },
                { [attribute]: { href: undefined } },
            ]) {
                const policy = DOMPolicy.create({
                    guards: {
                        elements: { a: override },
                        aspects: { [attribute]: { href: globalGuard } },
                    },
                });
                const element = document.createElement("a");
                policy.protect(
                    "a",
                    attribute,
                    "href",
                    DOM.setAttribute,
                )(element, "href", "javascript:alert(1)");
                results.push(element.getAttribute("href"));
            }

            for (const override of [null, { innerHTML: null }]) {
                const policy = DOMPolicy.create({
                    guards: { aspects: { [property]: override } },
                });
                const sink = () => {};
                results.push(
                    policy.protect("div", property, "innerHTML", sink) === sink
                        ? "removed"
                        : "guarded",
                );
                try {
                    policy.protect("script", property, "src", sink);
                    results.push("unblocked");
                } catch {
                    results.push("blocked");
                }
            }
            return results;
        });

        expect(results).toEqual([
            "/global",
            "/global",
            "/global",
            "",
            "",
            "",
            "removed",
            "blocked",
            "removed",
            "blocked",
        ]);
    });

    test("snapshots custom guard maps at every level", async ({ page }) => {
        await page.goto("/");

        const results = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");
            const attribute = DOMAspect.attribute;
            const guard = value => (_tag, _aspect, _name, sink) => (target, name) =>
                sink(target, name, value);
            const elementSinks = { href: guard("/element") };
            const elementAspects = { [attribute]: elementSinks };
            const elements = { a: elementAspects };
            const globalSinks = { title: guard("global") };
            const aspects = { [attribute]: globalSinks };
            const guards = { elements, aspects };
            const policy = DOMPolicy.create({ guards });
            const replacement = { href: guard("/mutated") };

            elementSinks.href = replacement.href;
            elementAspects[attribute] = replacement;
            elements.a = { [attribute]: replacement };
            globalSinks.title = guard("mutated");
            aspects[attribute] = { title: guard("mutated") };
            guards.elements = { a: { [attribute]: replacement } };
            guards.aspects = { [attribute]: { title: guard("mutated") } };

            const element = document.createElement("a");
            for (const name of ["href", "title"]) {
                policy.protect(
                    "a",
                    attribute,
                    name,
                    DOM.setAttribute,
                )(element, name, "ignored");
            }
            return [element.getAttribute("href"), element.getAttribute("title")];
        });

        expect(results).toEqual(["/element", "global"]);
    });

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

    for (const policySource of ["default", "custom"]) {
        test(`validates coerced URL values with the ${policySource} policy`, async ({
            page,
        }) => {
            await page.goto("/");

            const results = await page.evaluate(async policySource => {
                // @ts-expect-error: Client modules.
                const { DOM, DOMAspect, DOMPolicy } = await import("./main.js");
                const policy =
                    policySource === "default" ? DOM.policy : DOMPolicy.create();
                const sinks = [
                    policy.protect("a", DOMAspect.attribute, "href", DOM.setAttribute),
                    policy.protect(
                        "a",
                        DOMAspect.property,
                        "href",
                        (target: HTMLAnchorElement, _name: string, value: string) => {
                            target.href = value;
                        },
                    ),
                ];

                return sinks.map(sink => {
                    const values = [
                        ["javascript:alert(1)"],
                        new String("data:text/html,<svg onload=alert(1)>"),
                        { toString: () => " java%0Ascript:alert(1) " },
                        [" https://fast.design/ "],
                        new URL("https://fast.design/docs"),
                        0,
                        false,
                    ].map(value => {
                        const element = document.createElement("a");
                        sink(element, "href", value);
                        return element.getAttribute("href");
                    });
                    const nullish = [null, undefined].map(value => {
                        const element = document.createElement("a");
                        element.setAttribute("href", "/previous");
                        sink(element, "href", value);
                        return element.getAttribute("href");
                    });

                    let coercions = 0;
                    const element = document.createElement("a");
                    sink(element, "href", {
                        toString() {
                            return ++coercions === 1
                                ? " https://fast.design/ "
                                : "javascript:alert(1)";
                        },
                    });

                    return {
                        values,
                        nullish,
                        href: element.getAttribute("href"),
                        coercions,
                    };
                });
            }, policySource);

            expect(results).toEqual(
                Array.from({ length: 2 }, (_, index) => ({
                    values: [
                        "",
                        "",
                        "",
                        "https://fast.design/",
                        "https://fast.design/docs",
                        "0",
                        "false",
                    ],
                    nullish: index === 0 ? [null, null] : ["null", "undefined"],
                    href: "https://fast.design/",
                    coercions: 1,
                })),
            );
        });
    }

    test("validates coerced URL values on initial binding and later updates", async ({
        page,
    }) => {
        await page.goto("/");

        const results = await page.evaluate(async () => {
            // @ts-expect-error: Client modules.
            const { html } = await import("./main.js");
            const host = document.createElement("div");
            const template = html`
                <a href=${x => x.url}>attribute</a>
                <a :href=${x => x.url}>property</a>
            `;
            const view = template.render({ url: ["javascript:alert(1)"] }, host);
            const hrefs = () =>
                Array.from(host.querySelectorAll("a"), a => a.getAttribute("href"));
            const initial = hrefs();
            view.bind({ url: [" https://fast.design/ "] });
            const safe = hrefs();
            view.bind({ url: new String("javascript:alert(1)") });
            const unsafe = hrefs();
            view.dispose();

            return { initial, safe, unsafe };
        });

        expect(results).toEqual({
            initial: ["", ""],
            safe: ["https://fast.design/", "https://fast.design/"],
            unsafe: ["", ""],
        });
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
