import { expect, test } from "@playwright/test";
import type { ExecutionContext } from "../observation/observable.js";

test.describe("The host directive", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("binds attributes, properties, and events through the view lifecycle", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { host, html, listener, oneTime, oneWay, reactive, Updates } =
                await import("/main.js");
            const source = reactive({
                label: "first",
                hidden: false,
                tabIndex: 0,
                clicks: 0,
            });
            const template = html`
                ${host({
                    role: "button",
                    title: oneWay((model: typeof source) => model.label),
                    "data-initial": oneTime((model: typeof source) => model.label),
                    "data-literal": '"><span>literal</span>',
                    "data-null": null,
                    "data-undefined": undefined,
                    ":tabIndex": (model: typeof source) => model.tabIndex,
                    "?hidden": (model: typeof source) => model.hidden,
                    "@click": listener(
                        (model: typeof source, context: ExecutionContext) => {
                            model.clicks++;
                            return context.event.defaultPrevented;
                        },
                    ),
                })}
                <span>${(model: typeof source) => model.label}</span>
            `;
            const target = document.createElement("div");
            const view = template.create(target);
            view.bind(source);
            view.appendTo(target);
            const initial = {
                role: target.getAttribute("role"),
                title: target.getAttribute("title"),
                literal: target.getAttribute("data-literal"),
                nullAttribute: target.hasAttribute("data-null"),
                undefinedAttribute: target.hasAttribute("data-undefined"),
                tabIndex: target.tabIndex,
                hidden: target.hasAttribute("hidden"),
                spanCount: target.querySelectorAll("span").length,
                hostCount: target.querySelectorAll("f-host").length,
            };
            const defaultAllowed = target.dispatchEvent(
                new MouseEvent("click", { cancelable: true }),
            );

            source.label = "second";
            source.hidden = true;
            source.tabIndex = 3;
            await Updates.next();
            const updated = {
                title: target.getAttribute("title"),
                initial: target.getAttribute("data-initial"),
                tabIndex: target.tabIndex,
                hidden: target.hasAttribute("hidden"),
                content: target.querySelector("span")!.textContent,
            };

            view.unbind();
            source.label = "unbound";
            target.click();
            await Updates.next();
            const unboundTitle = target.getAttribute("title");
            const unboundClicks = source.clicks;

            view.bind(source);
            await Updates.next();
            target.click();
            const reboundTitle = target.getAttribute("title");
            view.dispose();
            target.click();

            return {
                initial,
                defaultAllowed,
                updated,
                unboundTitle,
                unboundClicks,
                reboundTitle,
                clicks: source.clicks,
            };
        });

        expect(result.initial).toEqual({
            role: "button",
            title: "first",
            literal: '"><span>literal</span>',
            nullAttribute: false,
            undefinedAttribute: false,
            tabIndex: 0,
            hidden: false,
            spanCount: 1,
            hostCount: 0,
        });
        expect(result.defaultAllowed).toBe(false);
        expect(result.updated).toEqual({
            title: "second",
            initial: "first",
            tabIndex: 3,
            hidden: true,
            content: "second",
        });
        expect(result.unboundTitle).toBe("second");
        expect(result.unboundClicks).toBe(1);
        expect(result.reboundTitle).toBe("unbound");
        expect(result.clicks).toBe(2);
    });

    test("supports host-only templates and existing template host attributes", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { host, html } = await import("/main.js");
            const target = document.createElement("div");
            const template = html`<template role="button">${host({
                title: "host only",
            })}${host({})}</template>`;
            const view = template.create(target);
            view.bind({});
            view.appendTo(target);
            const attributes = [
                target.getAttribute("role"),
                target.getAttribute("title"),
            ];
            const elementCount = target.childElementCount;
            view.dispose();

            return { attributes, elementCount, remainingNodes: target.childNodes.length };
        });

        expect(result.attributes).toEqual(["button", "host only"]);
        expect(result.elementCount).toBe(0);
        expect(result.remainingNodes).toBe(0);
    });

    for (const scenario of ["template", "directive", "static", "case-variant"]) {
        test(`keeps overridden ${scenario} host bindings inactive`, async ({ page }) => {
            const result = await page.evaluate(async scenario => {
                // @ts-expect-error: Client module.
                const { host, html, reactive, Updates } = await import("/main.js");
                const source = reactive({ outer: "outer", inner: "inner" });
                let outerEvaluations = 0;
                const outerBinding = (model: typeof source) => {
                    outerEvaluations++;
                    return model.outer;
                };
                const innerHost = host({
                    [scenario === "case-variant" ? "TITLE" : "title"]:
                        scenario === "static"
                            ? "static"
                            : (model: typeof source) => model.inner,
                });
                const template =
                    scenario === "directive"
                        ? html`${host({
                              title: outerBinding,
                              "data-outer": (model: typeof source) => model.outer,
                          })}${innerHost}`
                        : html`<template title=${outerBinding}
                              data-outer=${(model: typeof source) => model.outer}
                          >${innerHost}</template>`;
                const target = document.createElement("div");
                const view = template.create(target);
                view.bind(source);
                view.appendTo(target);
                const titles = [target.title];

                source.outer = "updated outer";
                await Updates.next();
                titles.push(target.title);
                source.inner = "updated inner";
                await Updates.next();
                titles.push(target.title);
                view.unbind();
                view.bind(source);
                titles.push(target.title);
                const outerAttribute = target.getAttribute("data-outer");
                view.dispose();

                return { titles, outerEvaluations, outerAttribute };
            }, scenario);

            expect(result).toEqual({
                titles:
                    scenario === "static"
                        ? ["static", "static", "static", "static"]
                        : ["inner", "inner", "updated inner", "updated inner"],
                outerEvaluations: 0,
                outerAttribute: "updated outer",
            });
        });
    }

    test("deduplicates host properties, boolean attributes, and event handlers", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { host, html, reactive, Updates } = await import("/main.js");
            const source = reactive({
                outer: "outer",
                inner: "inner",
                outerHidden: true,
                innerHidden: true,
            });
            const events: string[] = [];
            const template = html`
                ${host({
                    value: "attribute",
                    ":value": (model: typeof source) => model.outer,
                    "?hidden": (model: typeof source) => model.outerHidden,
                    "@click": () => events.push("outer"),
                    "@change": () => events.push("change"),
                })}
                ${host({
                    ":value": (model: typeof source) => model.inner,
                    "?hidden": (model: typeof source) => model.innerHidden,
                    "@click": () => events.push("inner"),
                })}
            `;
            const target = document.createElement("input");
            const view = template.create(target);
            view.bind(source);
            target.click();
            target.dispatchEvent(new Event("change"));
            source.outer = "updated outer";
            source.outerHidden = false;
            await Updates.next();
            const afterOuter = { value: target.value, hidden: target.hidden };

            source.inner = "updated inner";
            source.innerHidden = false;
            await Updates.next();
            const afterInner = { value: target.value, hidden: target.hidden };
            const attribute = target.getAttribute("value");
            view.dispose();

            return { afterOuter, afterInner, attribute, events };
        });

        expect(result).toEqual({
            afterOuter: { value: "inner", hidden: true },
            afterInner: { value: "updated inner", hidden: false },
            attribute: "attribute",
            events: ["inner", "change"],
        });
    });

    test("registers a native directive without declarative markup", async ({ page }) => {
        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { HostDirective, host, html } = await import("/main.js");
            const directive = host({ title: "native host" });
            const template = html`${directive}<span>content</span>`;
            return {
                native: directive instanceof HostDirective,
                html: template.html,
                factories: Object.keys(template.factories).length,
            };
        });

        expect(result).toEqual({
            native: true,
            html: "<span>content</span>",
            factories: 1,
        });
    });

    const staticHost = '<f-host role="button"></f-host>';
    const inlineStyle = "<style>.x { color:red; }</style>";
    for (const { position, markup, styleCount } of [
        {
            position: "before",
            markup: `${staticHost}${inlineStyle}`,
            styleCount: 1,
        },
        {
            position: "after",
            markup: `${inlineStyle}${staticHost}`,
            styleCount: 1,
        },
        {
            position: "between",
            markup: `${inlineStyle}${staticHost}${inlineStyle}`,
            styleCount: 2,
        },
    ]) {
        test(`applies static declarative host bindings ${position} inline CSS`, async ({
            page,
        }) => {
            const result = await page.evaluate(async markup => {
                // @ts-expect-error: Client module.
                const { Schema, TemplateParser } = await import("/main.js");
                const parser = new TemplateParser();
                const { strings, values } = parser.parse(
                    markup,
                    new Schema("static-declarative-host"),
                );
                const target = document.createElement("div");
                const shadow = target.attachShadow({ mode: "open" });
                const view = parser.createTemplate(strings, values).create(target);
                view.bind({});
                view.appendTo(shadow);
                const result = {
                    role: target.getAttribute("role"),
                    hostCount: shadow.querySelectorAll("f-host").length,
                    styles: Array.from(
                        shadow.querySelectorAll("style"),
                        style => style.textContent,
                    ),
                };
                view.dispose();
                return result;
            }, markup);

            expect(result).toEqual({
                role: "button",
                hostCount: 0,
                styles: Array(styleCount).fill(".x { color:red; }"),
            });
        });
    }

    test("resolves declarative f-host markup to the native directive", async ({
        page,
    }) => {
        const result = await page.evaluate(async () => {
            // @ts-expect-error: Client module.
            const { HostDirective, reactive, Schema, TemplateParser, Updates } =
                await import("/main.js");
            const parser = new TemplateParser();
            const schema = new Schema("declarative-host");
            const { strings, values } = parser.parse(
                `<span>{{label}}</span>
                <f-host role="button" class="prefix {{label}}" :title="{label}"
                    ?hidden="{{hidden}}" @click="{handleClick($e)}"
                    data-literal="&quot; > literal"></f-host>
                <span title="{{label}}"></span>`,
                schema,
            );
            const source = reactive({
                label: "first",
                hidden: false,
                clicks: 0,
                handleClick(event: Event) {
                    if (event.type === "click") {
                        this.clicks++;
                    }
                },
            });
            const template = parser.createTemplate(strings, values);
            const target = document.createElement("div");
            const view = template.create(target);
            view.bind(source);
            view.appendTo(target);
            target.click();
            source.label = "second";
            source.hidden = true;
            await Updates.next();

            return {
                native: values.some((value: unknown) => value instanceof HostDirective),
                role: target.getAttribute("role"),
                className: target.className,
                title: target.title,
                literal: target.getAttribute("data-literal"),
                hidden: target.hidden,
                clicks: source.clicks,
                hostCount: target.querySelectorAll("f-host").length,
                content: target.querySelector("span")!.textContent,
                siblingTitle: target.querySelectorAll("span")[1].title,
            };
        });

        expect(result).toEqual({
            native: true,
            role: "button",
            className: "prefix second",
            title: "second",
            literal: '" > literal',
            hidden: true,
            clicks: 1,
            hostCount: 0,
            content: "second",
            siblingTitle: "second",
        });
    });
});
