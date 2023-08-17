import "../install-dom-shim.js";
import { children, css, customElement, ExecutionContext, FASTElement, html, ref, repeat, slotted, when } from "@microsoft/fast-element";
import { expect, test } from "@playwright/test";
import fastSSR from "../exports.js";
import { consolidate } from "../test-utilities/consolidate.js";
import { DefaultTemplateRenderer } from "./template-renderer.js";
import { render } from "@microsoft/fast-element/render.js";
import { DefaultElementRenderer } from "../element-renderer/element-renderer.js";
import { RenderInfo } from "../render-info.js";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";

@customElement("hello-world")
class HelloWorld extends FASTElement {}

@customElement({name: "with-slot", template: html`<slot></slot>`})
class WithSlot extends FASTElement {}

@customElement({name: "with-host-attributes", template: html`<template static="static" dynamic="${x => "dynamic"}" ?bool-true=${x => true} ?bool-false=${x => false} :property=${x => "value"}>${x => x.property}<slot></slot></template>`})
class WithHostAttributes extends FASTElement {}


test.describe("TemplateRenderer", () => {
    test.describe("should have a createRenderInfo method", () => {
        test("that returns unique object instances for every invocation", () => {
            const renderer = new DefaultTemplateRenderer();
            expect(renderer.createRenderInfo()).not.toBe(renderer.createRenderInfo())
        });
        test("that can be populated with ElementRenderers with the 'withDefaultElementRenderer()' method", () => {
            const renderer = new DefaultTemplateRenderer();
            class MyRenderer extends DefaultElementRenderer {
                element?: HTMLElement | undefined;
                attributeChangedCallback(name: string, prev: string | null, next: string | null): void {}
                connectedCallback(): void {}
                public *renderAttributes(): IterableIterator<string> {}
                public *renderShadow(renderInfo: RenderInfo): IterableIterator<string> {}
            }

            renderer.withDefaultElementRenderers(MyRenderer);
            expect(renderer.createRenderInfo().elementRenderers.includes(MyRenderer)).toBe(true);
        });
    })

    test.describe("rendering <template> elements", () => {
        test("should render a template element without attributes", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<template></template>`)

            expect(consolidate(result)).toBe("<template></template>");
        });
        test("should render a template element with static attributes", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<template name="foo" id="bar"></template>`)

            expect(consolidate(result)).toBe(`<template name="foo" id="bar"></template>`);
        });
        test("should render a template element with dynamic attributes", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<template name=${x => "bar"} id=${x => "bat"}></template>`)

            expect(consolidate(result)).toBe(`<template name="bar" id="bat"></template>`);
        });
        test("should render a template element with a boolean attribute binding", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<template ?true=${x => true} ?false=${x => false}></template>`)

            expect(consolidate(result)).toBe(`<template true ></template>`);
        });
        test("should render a template element with a classList property binding", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<template :classList=${x => "a b"}></template>`)

            expect(consolidate(result)).toBe(`<template class="a b"></template>`);
        });

        test("should render a template element with both static and dynamic attributes", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<template id="bar" name=${x => "foo"}></template>`)

            expect(consolidate(result)).toBe(`<template id="bar" name="foo"></template>`);
        });
        test("should render with static attributes preceding dynamic attributes", () => {
            // Attribute order changes are due to attribute categorization during template parsing.
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<template name=${x => "foo"} id="bar"></template>`)

            expect(consolidate(result)).toBe(`<template id="bar" name="foo"></template>`);
        });
        test("should render a template with content", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<template name="bar"><p>Hello world</p></template>`)

            expect(consolidate(result)).toBe(`<template name="bar"><p>Hello world</p></template>`);
        });
        test("should render a template as a child element", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<p><template name="bar"></template></p>`)

            expect(consolidate(result)).toBe(`<p><template name="bar"></template></p>`);
        });
    });

    test.describe("rendering declarative shadow DOM", () => {
        test("should emit static shadow DOM template for a defined custom element", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<with-slot></with-slot>`)

            expect(consolidate(result)).toBe("<with-slot><template shadowroot=\"open\"><slot></slot></template></with-slot>");
        });
        test("should emit template element with shadowroot attribute for defined custom element", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<hello-world></hello-world>`)

            expect(consolidate(result)).toBe("<hello-world><template shadowroot=\"open\"></template></hello-world>");
        });
        test("should render a custom element with a static attribute", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<hello-world id="test"></hello-world>`)

            expect(consolidate(result)).toBe(`<hello-world  id="test"><template shadowroot=\"open\"></template></hello-world>`);
        });

        test("should emit a custom element with attributes and properties reflected from an element's root <template> element", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<with-host-attributes id="foo"></with-host-attributes>`)

            expect(consolidate(result)).toBe(`<with-host-attributes  id="foo" static="static" dynamic="dynamic" bool-true><template shadowroot=\"open\">value<slot></slot></template></with-host-attributes>`);
        });
    });
    test.describe("rendering a FAST element configured with a null shadowOptions config", () => {
        test("should not render declarative shadow DOM", () => {
            const name = uniqueElementName();
            @customElement({
                name,
                shadowOptions: null
            })
            class MyElement extends FASTElement {}

            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`);

            expect(consolidate(result)).toBe(`<${name}></${name}>`);
        });
        test("should render it's template to the light DOM", () => {
            const name = uniqueElementName();
            @customElement({
                name,
                shadowOptions: null,
                template: html`<p>Hello world</p>`
            })
            class MyElement extends FASTElement {}

            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`);

            expect(consolidate(result)).toBe(`<${name}><p>Hello world</p></${name}>`);
        });

        test("should render styles as the first child elements in the element's light DOM", () => {
            const name = uniqueElementName();
            @customElement({
                name,
                shadowOptions: null,
                template: html`<p>With styles</p>`,
                styles: css`:host {color: red;}`
            })
            class MyElement extends FASTElement {}

            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`);

            expect(consolidate(result)).toBe(`<${name}><style>:host {color: red;}</style><p>With styles</p></${name}>`);
        });
        test("should render child elements into the element's light DOM", () => {
            const name = uniqueElementName();
            @customElement({
                name,
                shadowOptions: null
            })
            class MyElement extends FASTElement {}

            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<${html.partial(name)}><p>Hello world</p></${html.partial(name)}>`);

            expect(consolidate(result)).toBe(`<${name}><p>Hello world</p></${name}>`);
        });
    });

    test("should emit a single element template", () => {
        const { templateRenderer } = fastSSR();
        const result = templateRenderer.render(html`<p>Hello world</p>`)

        expect(consolidate(result)).toBe("<p>Hello world</p>")
    });

    test("should emit un-registered custom elements without any shadow DOM", () => {
        const { templateRenderer } = fastSSR();
        const result = templateRenderer.render(html`<unregistered-element>Hello world</unregistered-element>`)

        expect(consolidate(result)).toBe("<unregistered-element>Hello world</unregistered-element>");
    });

    test("should not render the template for elements that have been disabled via the ElementRenderer", () => {
        const name = uniqueElementName();
        class MyElement extends FASTElement {}
        const definition = MyElement.compose({name, template: html`<p>Hello world</p>`})
        definition.define()

        for (const key of [name, definition, MyElement]) {
            const  { ElementRenderer, templateRenderer } = fastSSR();
            expect(consolidate(templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`))).toBe(`<${name}><template shadowroot="open"><p>Hello world</p></template></${name}>`);
            ElementRenderer.disable(key);
            expect(consolidate(templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`))).toBe(`<${name}><template shadowroot="open"></template></${name}>`);
        }
    });

    /**
     * Bindings
     */
    test("should provide the source object to any bindings", () => {
        const source = {};
        let calledWith: any;
        const { templateRenderer } = fastSSR();
        consolidate(templateRenderer.render(html`${(x) => {calledWith = x}}`, templateRenderer.createRenderInfo(), source));

        expect(source).toBe(calledWith);
    });

    test("should provide the defaultExecutionContext object to a binding", () => {
        let calledWith: any;
        const { templateRenderer } = fastSSR();
        consolidate(templateRenderer.render(html`${(x, c) => {calledWith = c}}`));

        expect(calledWith).toBe(ExecutionContext.default);
    });


    test("should not emit string content from a binding that returns a null value", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`${(x) => null}`));

        expect(result).toBe("");
    });

    test("should not emit string content from a binding that returns an undefined value", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`${(x) => undefined}`));

        expect(result).toBe("");
    });

    test("should emit a native element with an attribute when the attr binding returns a string", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`<p id="${(x) => "test"}"></p>`));

        expect(result).toBe(`<p id="test"></p>`);
    });

    test("should emit a custom element with an attribute binding when the attr binding returns a string", () => {
        const { templateRenderer } = fastSSR();
        const result = templateRenderer.render(html`<hello-world my-attr=${x => "foobar"}></hello-world>`)

        expect(consolidate(result)).toBe(`<hello-world  my-attr="foobar"><template shadowroot=\"open\"></template></hello-world>`);
    });
    test("should emit an element with a boolean attribute when the attr binding returns true", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`<input type="checkbox" ?checked="${(x) => true}" />`));

        expect(result).toBe(`<input type="checkbox" checked />`);
    });
    test("should not emit an attribute for a boolean attribute that returns false", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`<input type="checkbox" ?checked="${(x) => false}" />`));

        expect(result).toBe(`<input type="checkbox"  />`);
    });

    test("should evaluate bindings for html element", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`<html attr=${x => "value"}></html>`));

        expect(result).toBe(`<html attr="value"></html>`);
    });
    test("should evaluate bindings for head element", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`<head attr=${x => "value"}></head>`));

        expect(result).toBe(`<head attr="value"></head>`);
    });

    test("should evaluate bindings for body element", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`<body attr=${x => "value"}></body>`));

        expect(result).toBe(`<body attr="value"></body>`);
    });

    test("should emit embedded templates", () =>{
        const { templateRenderer } = fastSSR();

        const result = consolidate(templateRenderer.render(html`<p>Hello ${html`<span>world</span>`}</p>`))
        expect(result).toBe(`<p>Hello <span>world</span></p>`);
    });

    test.describe("binding the the classList", () => {
        test("should emit class attribute to native elements", () => {
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<p :classList=${ x => "foo bar"}>Hello world</p>`))
            expect(result).toBe(`<p class="foo bar">Hello world</p>`);
        });
        test("should emit class attribute to custom elements", () => {
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<hello-world :classList=${x => "foo bar"}></hello-world>`))
            expect(result).toBe(`<hello-world  class="foo bar"><template shadowroot="open"></template></hello-world>`);
        });
    });

    /**
     * Directive tests
     */
    test.describe("with a 'when' directive", () => {
        test("should render a 'when' directive's content when the binding evaluates true", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`${when(x => true, html`<p>Hello world</p>`)}`)

            expect(consolidate(result)).toBe("<p>Hello world</p>")
        });
        test("should emit nothing when a 'when' directive's binding evaluates false ", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`${when(x => false, html`<p>Hello world</p>`)}`)

            expect(consolidate(result)).toBe("");
        });
    });

    test.describe("with a 'repeat' directive", () => {
        test("should provide parent and parentContext to execution context of bindings in child template", () => {

            const { templateRenderer } = fastSSR();
            const source = {
                data: ["foo", "bar", "bat"]
            };
            const ctx = ExecutionContext.default;
            consolidate(templateRenderer.render(html<typeof source>`${repeat(x => x.data, html<string>`${(x, c) => {
                expect(c.parent).toBe(source);
                expect(c.parentContext).toBe(ctx)
            }}`)}`, templateRenderer.createRenderInfo(), source, ctx))
        });
        test("should provide positioning information when invoked with the positioning config", () => {

            const { templateRenderer } = fastSSR();
            const source = {
                data: ["foo", "bar", "bat"]
            };
            let i = 0;
            consolidate(templateRenderer.render(html<typeof source>`${repeat(x => x.data, html<string>`${(x, c) => {
                expect(c.index).toBe(i);
                i++;
                expect(c.length).toBe(c.parent.data.length)
            }}`, { positioning: true})}`, templateRenderer.createRenderInfo(), source))
        });
        test("should render the provided template with the instance as the source data", () => {
            const { templateRenderer } = fastSSR();
            const source = {
                data: ["foo", "bar", "bat"]
            };
            const result = templateRenderer.render(html<typeof source>`${repeat(x => x.data, html<string>`${x => x}`)}`, templateRenderer.createRenderInfo(), source)
            expect(consolidate( result )).toBe("foobarbat");
        });
    });

    test.describe("with a 'render' directive", () => {
        test("should provide parent and parentContext to execution context of bindings in child template", () => {

            const { templateRenderer } = fastSSR();
            const source = { data: "test" };
            const ctx = ExecutionContext.default;
            consolidate(templateRenderer.render(html<typeof source>`${render(x => x.data, html`${(x, c) => {
                expect(c.parent).toBe(source);
                expect(c.parentContext).toBe(ctx)
            }}`)}`, templateRenderer.createRenderInfo(), source, ctx))
        });

        test("should render the provided template with the binding's value as the source data", () => {
            const { templateRenderer } = fastSSR();
            const source = { data: "test"};
            const result = templateRenderer.render(html<typeof source>`${render(x => x.data, html<string>`${x => x}`)}`, templateRenderer.createRenderInfo(), source)
            expect(consolidate( result )).toBe("test");
        });
    });

    for (let directive of [children, ref, slotted ]) {
        test.describe(`with '${directive.name}' directive`, () => {
            test("should interpolate empty string", () => {
                const { templateRenderer } = fastSSR();
                const source = {}
                const result = templateRenderer.render(html`<ul ${directive('items')}><li>Hello</li><li>World</li></ul>`, templateRenderer.createRenderInfo(), source);

                expect(consolidate(result)).toBe("<ul ><li>Hello</li><li>World</li></ul>")
            });
        });
    }
});
