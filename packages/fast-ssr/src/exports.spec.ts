import "./install-dom-shim.js";

import { strictEqual } from "node:assert/strict";
import { describe, test } from "node:test";
import { FASTElement, html, HTMLDirective, ref, RefDirective, StatelessAttachedAttributeDirective, ViewController } from "@microsoft/fast-element";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";
import fastSSR from "./exports.js";
import { ViewBehaviorFactoryRenderer } from "./template-renderer/directives.js";
import { consolidate } from "./test-utilities/consolidate.js";

describe("fastSSR default export", () => {
    test("should return a TemplateRenderer configured to create a RenderInfo object using the returned ElementRenderer", () => {
        const { templateRenderer, ElementRenderer } = fastSSR();
        strictEqual(templateRenderer.createRenderInfo().elementRenderers.includes(ElementRenderer), true)
    })

    test("should render FAST elements without the `defer-hydration` attribute by default", () => {
        const { templateRenderer } = fastSSR();
        const name = uniqueElementName();
        FASTElement.define(name);

        strictEqual(consolidate(templateRenderer.render(`<${name}></${name}>`)), 
            `<${name}><template shadowrootmode="open" shadowroot="open"></template></${name}>`
        );
    });
    test("should render FAST elements with the `defer-hydration` attribute when deferHydration is configured to be true", () => {
        const { templateRenderer } = fastSSR({ deferHydration: true });
        const name = uniqueElementName();
        FASTElement.define(name);

        strictEqual(consolidate(templateRenderer.render(`<${name}></${name}>`)), 
            `<${name} defer-hydration><template shadowrootmode="open" shadowroot="open"></template></${name}>`
        )
    });
    test("should not render FAST elements with the `defer-hydration` attribute when deferHydration is configured to be false", () => {
        const { templateRenderer } = fastSSR({ deferHydration: false });
        const name = uniqueElementName();
        FASTElement.define(name);

        strictEqual(consolidate(templateRenderer.render(`<${name}></${name}>`)), 
            `<${name}><template shadowrootmode="open" shadowroot="open"></template></${name}>`
        )
    });

    test("should render a custom directive using a registered ViewBehaviorFactoryRenderer", () => {
        class Directive extends StatelessAttachedAttributeDirective<string> {
            bind(controller: ViewController) {}
            constructor(public readonly value: string) {
                super(value);
            }
        }

        HTMLDirective.define(Directive);

        const renderer: ViewBehaviorFactoryRenderer<Directive> = {
            matcher: Directive,
            *render(behaviorFactory, renderInfo, source, renderer, context) {
                yield `value='${behaviorFactory.value}'`;
            },
        }

        const { templateRenderer } = fastSSR({viewBehaviorFactoryRenderers: [renderer]})
        strictEqual(consolidate(templateRenderer.render(html`<p ${new Directive("hello-world")}></p>`)), 
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
        strictEqual(consolidate(templateRenderer.render(html`<p ${ref("key")}></p>`)), 
            `<p ref='some-ref'></p>`
        )
    });
});
