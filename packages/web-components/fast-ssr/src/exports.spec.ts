import "./install-dom-shim.js";
import { html, RefDirective, ref } from "@microsoft/fast-element";
import fastSSR from "./exports.js";
import { ViewBehaviorFactoryRenderer } from "./template-renderer/directives.js";
import { test, expect } from "@playwright/test";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";
import { FASTElement, HTMLDirective, StatelessAttachedAttributeDirective, ViewBehaviorFactory, ViewController } from "@microsoft/fast-element";
import { consolidate } from "./test-utilities/consolidate.js";


test.describe("fastSSR default export", () => {
    test("should return a TemplateRenderer configured to create a RenderInfo object using the returned ElementRenderer", () => {
        const  { templateRenderer, ElementRenderer } = fastSSR();
        expect(templateRenderer.createRenderInfo().elementRenderers.includes(ElementRenderer)).toBe(true)
    })

    test("should render FAST elements without the `defer-hydration` attribute by default", () => {
        const { templateRenderer } = fastSSR();
        const name = uniqueElementName();
        FASTElement.define(name);

        expect(consolidate(templateRenderer.render(`<${name}></${name}>`))).toBe(`<${name}><template shadowroot="open"></template></${name}>`)
    });
    test("should render FAST elements with the `defer-hydration` attribute when deferHydration is configured to be true", () => {
        const { templateRenderer } = fastSSR({deferHydration: true});
        const name = uniqueElementName();
        FASTElement.define(name);

        expect(consolidate(templateRenderer.render(`<${name}></${name}>`))).toBe(`<${name} defer-hydration><template shadowroot="open"></template></${name}>`)
    });
    test("should not render FAST elements with the `defer-hydration` attribute when deferHydration is configured to be false", () => {
        const { templateRenderer } = fastSSR({deferHydration: false});
        const name = uniqueElementName();
        FASTElement.define(name);

        expect(consolidate(templateRenderer.render(`<${name}></${name}>`))).toBe(`<${name}><template shadowroot="open"></template></${name}>`)
    });

    test("should render a custom directive using a registered ViewBehaviorFactoryRenderer", () => {
        class Directive extends StatelessAttachedAttributeDirective<string> {
            bind(controller: ViewController) {}
            constructor(public readonly value: string) {
                super(value);
            }
        }

        HTMLDirective.define(Directive)

        const renderer: ViewBehaviorFactoryRenderer<Directive> = {
            matcher: Directive,
            *render(behaviorFactory, renderInfo, source, renderer, context) {
                yield `value='${behaviorFactory.value}'`;
            },
        }

        const { templateRenderer } = fastSSR({viewBehaviorFactoryRenderers: [renderer]})
        expect(consolidate(templateRenderer.render(html`<p ${new Directive("hello-world")}></p>`))).toBe(
            `<p value='hello-world'></p>`
        )
    });
    test("should support overriding pre-registered ViewBehaviorFactoryRenderer", () => {
        class Directive extends StatelessAttachedAttributeDirective<string> {
            bind(controller: ViewController) {}
            constructor(public readonly value: string) {
                super(value);
            }
        }

        const renderer: ViewBehaviorFactoryRenderer<RefDirective> = {
            matcher: RefDirective,
            *render(behaviorFactory, renderInfo, source, renderer, context) {
                yield `ref='some-ref'`;
            },
        }

        const { templateRenderer } = fastSSR({viewBehaviorFactoryRenderers: [renderer]})
        expect(consolidate(templateRenderer.render(html`<p ${ref("key")}></p>`))).toBe(
            `<p ref='some-ref'></p>`
        )
    });
});
