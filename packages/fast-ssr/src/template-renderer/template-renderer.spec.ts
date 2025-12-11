import "../install-dom-shim.js";
import "../configure-fast-element.js";
import { children, css, customElement, ExecutionContext, FASTElement, HostBehavior, html, ref, render, repeat, slotted, when } from "@microsoft/fast-element";
import { PendingTaskEvent } from "@microsoft/fast-element/pending-task.js";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";
import { expect, test } from "@playwright/test";
import { HydrationMarkup } from "@microsoft/fast-element/element-hydration.js";
import { DefaultElementRenderer, FallbackRenderer } from "../element-renderer/element-renderer.js";
import { escapeHtml } from "../escape-html.js";
import fastSSR from "../exports.js";
import { RenderInfo } from "../render-info.js";
import { consolidate, consolidateAsync } from "../test-utilities/consolidate.js";
import { SSRView } from "../view.js";
import { validateRendererOutput } from "../test-utilities/validators.js";
import { hydrationMarker } from "./hydration-marker-emitter.js";
import { DefaultTemplateRenderer } from "./template-renderer.js";

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
                disconnectedCallback(): void {}
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
        test("should escape dynamic string attributes", () => {
            const { templateRenderer } = fastSSR();
            const attrValue = JSON.stringify({"dangerousScript": "<script>alert(1);</script>"})

            const result = templateRenderer.render(html`<span name="${_ => attrValue}"></span>`)

            expect(consolidate(result)).toBe(`<span name="${escapeHtml(attrValue)}"></span>`);
        })
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

            expect(consolidate(result)).toBe(`<with-slot><template shadowrootmode="open" shadowroot="open"><slot></slot></template></with-slot>`);
        });
        test("should emit template element with shadowroot and shadowrootmode attributes for defined custom element", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<hello-world></hello-world>`)

            expect(consolidate(result)).toBe(`<hello-world><template shadowrootmode="open" shadowroot="open"></template></hello-world>`);
        });
        test("should render a custom element with a static attribute", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<hello-world id="test"></hello-world>`)

            expect(consolidate(result)).toBe(`<hello-world  id="test"><template shadowrootmode="open" shadowroot="open"></template></hello-world>`);
        });

        test("should emit a custom element with attributes and properties reflected from an element's root <template> element", () => {
            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<with-host-attributes id="foo"></with-host-attributes>`)

            expect(consolidate(result)).toBe(`<with-host-attributes  id="foo" static="static" dynamic="dynamic" bool-true><template shadowrootmode="open" shadowroot="open">value<slot></slot></template></with-host-attributes>`);
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

        test("should not render element boundary markers when element is not defined", () => {
            const name = uniqueElementName();

            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`);

            expect(consolidate(result)).toBe(`<${name}></${name}>`);
        });

        test("should render it's template inside element boundary markers to the light DOM", () => {
            const name = uniqueElementName();
            const template = "<p>Hello world</p>";
            @customElement({
                name,
                shadowOptions: null,
                template: html`${template}`
            })
            class MyElement extends FASTElement {}

            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`);
            const validationResult = validateRendererOutput(result, [
                `<${name}`,
                ">",
                 (x) => !!HydrationMarkup.parseElementBoundaryStartMarker(x),
                 template,
                 (x) => !!HydrationMarkup.parseElementBoundaryEndMarker(x),
                 `</${name}>`
            ]);

            expect(validationResult).toEqual(true);
        });

        test("should render styles as the first child elements in the element's light DOM", () => {
            const name = uniqueElementName();
            const template = "<p>With styles</p>";
            @customElement({
                name,
                shadowOptions: null,
                template: html`${template}`,
                styles: css`:host {color: red;}`
            })
            class MyElement extends FASTElement {}

            const { templateRenderer } = fastSSR();
            const result = templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`);

            const validationResult = validateRendererOutput(result, [
                `<${name}`,
                ">",
                 (x) => !!HydrationMarkup.parseElementBoundaryStartMarker(x),
                 "<style>:host {color: red;}</style>",
                 template,
                 (x) => !!HydrationMarkup.parseElementBoundaryEndMarker(x),
                 `</${name}>`
            ]);

            expect(validationResult).toEqual(true);
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
            console.log(result);

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
            expect(consolidate(templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`))).toBe(`<${name}><template shadowrootmode="open" shadowroot="open"><p>Hello world</p></template></${name}>`);
            ElementRenderer.disable(key);
            expect(consolidate(templateRenderer.render(html`<${html.partial(name)}></${html.partial(name)}>`))).toBe(`<${name}></${name}>`);
        }
    });

    test.describe("with deferHydration enabled", () => {
        test("should emit elements that have been disabled with defer-hydration attribute", () => {
            const name = uniqueElementName();
            @customElement({
                name,
                shadowOptions: null,
                template: html`<p>Hello world</p>`
            })
            class MyElement extends FASTElement {}

            const { templateRenderer, ElementRenderer } = fastSSR({ deferHydration: true });
            ElementRenderer.disable(name);
            const result = templateRenderer.render(html`<${html.partial(name)}><p>Hello world</p></${html.partial(name)}>`)

            expect(consolidate(result)).toBe(`<${name} defer-hydration><p>Hello world</p></${name}>`);
        });

        test("should emit undefined custom elements with the defer-hydration attribute", () => {
            const name = uniqueElementName();
            const { templateRenderer } = fastSSR({ deferHydration: true });
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(`<${name} defer-hydration></${name}>`);
        });

        test("should emit elements that have been disabled with defer-hydration attribute based on deferHydration function return value", () => {
            const noDeferName = uniqueElementName();
            const deferName = uniqueElementName();
            class MyElement extends FASTElement {}
            MyElement.compose({name: deferName, template: html``}).define()
            MyElement.compose({name: noDeferName, template: html``}).define()
            const { templateRenderer, ElementRenderer } = fastSSR({ deferHydration: (name) => name === deferName });
            ElementRenderer.disable(deferName);
            ElementRenderer.disable(noDeferName);
            const result = consolidate(templateRenderer.render(`<${noDeferName}></${noDeferName}><${deferName}></${deferName}>`));
            expect(result).toBe(`<${noDeferName}></${noDeferName}><${deferName} defer-hydration></${deferName}>`);
        });

        test("should emit undefined custom elements with defer-hydration attribute based on deferHydration function return value", () => {
            const noDeferName = uniqueElementName();
            const deferName = uniqueElementName();
            const { templateRenderer } = fastSSR({ deferHydration: (name) => name === deferName });
            const result = consolidate(templateRenderer.render(`<${noDeferName}></${noDeferName}><${deferName}></${deferName}>`));
            expect(result).toBe(`<${noDeferName}></${noDeferName}><${deferName} defer-hydration></${deferName}>`);
        });
    })

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

        expect(consolidate(result)).toBe(`<hello-world  my-attr="foobar"><template shadowrootmode="open" shadowroot="open"></template></hello-world>`);
    });
    test("should emit an element with a boolean attribute when the attr binding returns true", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`<input type="checkbox" ?checked="${(x) => true}" />`));

        expect(result).toBe(`<input type="checkbox" checked />`);
    });
    test.describe("should not emit an attribute", () => {
        test("for a boolean attribute binding that returns false", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`<input type="checkbox" ?checked="${(x) => false}" />`));

            expect(result).toBe(`<input type="checkbox"  />`);
        });

        test("for an attribute binding that returns undefined", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`<div attr="${(x) => undefined}"></div>`));

            expect(result).toBe(`<div ></div>`);
        });
        test("for an attribute binding that returns null", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`<div attr="${(x) => null}"></div>`));

            expect(result).toBe(`<div ></div>`);
        });
    })

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
            expect(result).toBe(`<hello-world  class="foo bar"><template shadowrootmode="open" shadowroot="open"></template></hello-world>`);
        });
    });
    test.describe("binding an event", () => {
        test("should not evaluate the event binding for a defined custom element", () => {
            const { templateRenderer } = fastSSR();
            expect(() => {
                consolidate(templateRenderer.render(html`<hello-world @click="${() => { throw new Error()}}"></hello-world>`))
            }).not.toThrow()
        });
        test("should not evaluate the event binding for a native element", () => {
            const { templateRenderer } = fastSSR();
            expect(() => {
                consolidate(templateRenderer.render(html`<p @click="${() => { throw new Error()}}"></p>`))
            }).not.toThrow()
        });
    });

    test("should render content bindings into style elements", () => {
        /**
         * This tests a case where client-side compilation patches up
         * the aspect of the binding that was mis-assigned during
         * pre-compilation.
         */
        const { templateRenderer } = fastSSR();
        const name = uniqueElementName();
        class MyElement extends FASTElement {
            public id = 'foo'
        }
        MyElement.define({
            name,
            template: html`<style>div[id="${(x) => x.id}"]{display: none;}</style>`,
        });

        expect(consolidate(templateRenderer.render(`<${name}></${name}>`))).toBe(`<${name}><template shadowrootmode="open" shadowroot="open"><style>div[id="foo"]{display: none;}</style></template></${name}>`)
    })

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

    for (const directive of [children, ref, slotted ]) {
        test.describe(`with '${directive.name}' directive`, () => {
            test("should interpolate empty string", () => {
                const { templateRenderer } = fastSSR();
                const source = {}
                const result = templateRenderer.render(html`<ul ${directive('items')}><li>Hello</li><li>World</li></ul>`, templateRenderer.createRenderInfo(), source);

                expect(consolidate(result)).toBe("<ul ><li>Hello</li><li>World</li></ul>")
            });
        });
    }

    test.describe("with hydration binding emission enabled", () => {
        test("should emit a comment with the binding index when the binding is interpolated into element content", () => {
            const name = uniqueElementName();
            const template = html`<p>${() => "hello world"}</p>`;
            FASTElement.define({name, template});
            const { templateRenderer } = fastSSR({emitHydratableMarkup: true});
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));
            const codes = (template.create() as unknown as SSRView).codes;
            expect(result).toBe(`<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><p>${hydrationMarker.contentBindingStart(0, codes.id)}hello world${hydrationMarker.contentBindingEnd(0, codes.id)}</p></template></${name}>`)
        });
        test("should emit a marker attribute to an element with a attribute binding ", () => {
            const name = uniqueElementName();
            FASTElement.define({name, template: html`<p attr="${() => "value"}"></p>`});
            const { templateRenderer } = fastSSR({emitHydratableMarkup: true});
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(`<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><p attr="value" ${hydrationMarker.attribute([0])}></p></template></${name}>`)
        });
        test("should emit a marker attribute to an element with a boolean attribute binding ", () => {
            const name = uniqueElementName();
            FASTElement.define({name, template: html`<p ?attr="${() => true}"></p>`});
            const { templateRenderer } = fastSSR({emitHydratableMarkup: true});
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(`<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><p attr ${hydrationMarker.attribute([0])}></p></template></${name}>`)
        });
        test("should emit a marker attribute to an element with a property binding", () => {
            const name = uniqueElementName();
            FASTElement.define({name, template: html`<p :property="${() => "value"}"></p>`});
            const { templateRenderer } = fastSSR({emitHydratableMarkup: true});
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(`<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><p  ${hydrationMarker.attribute([0])}></p></template></${name}>`)
        });
        test("should emit a marker attribute to an element with an event binding", () => {
            const name = uniqueElementName();
            FASTElement.define({name, template: html`<p @click="${new Function()}"></p>`});
            const { templateRenderer } = fastSSR({emitHydratableMarkup: true});
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(`<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><p  ${hydrationMarker.attribute([0])}></p></template></${name}>`)
        });
        test("should emit a all binding ids to the marker attribute to an element with multiple attribute bindings", () => {
            const name = uniqueElementName();
            FASTElement.define({name, template: html`<p :property="${() => "value"}" ?attr=${() => false}></p>`});
            const { templateRenderer } = fastSSR({emitHydratableMarkup: true});
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(`<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><p   ${hydrationMarker.attribute([0, 1])}></p></template></${name}>`)
        });
        test("should restart marker indexes inside the template after host bindings", () => {
            const name = uniqueElementName();
            FASTElement.define({
                name,
                template: html`<template @click="${() => void 0}"><span attr="${() => "value"}"></span></template>`,
            });
            const { templateRenderer } = fastSSR({ emitHydratableMarkup: true });
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(
                `<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><span attr="value" ${hydrationMarker.attribute([0])}></span></template></${name}>`
            );
        });
        test("should restart marker indexes after multiple host bindings of different types", () => {
            // Test various permutations of host binding types to ensure order doesn't matter
            const hostBindings = {
                event: `@click="\${() => void 0}"`,
                boolean: `?disabled="\${() => true}"`,
                property: `:title="\${() => 'tooltip'}"`,
                attribute: `attr="\${() => 'value'}"`,
            };

            const permutations = [
                ["event", "boolean", "property", "attribute"],
                ["attribute", "property", "boolean", "event"],
                ["boolean", "event", "attribute", "property"],
                ["property", "attribute", "event", "boolean"],
            ] as const;

            for (const order of permutations) {
                const name = uniqueElementName();
                const hostBindingString = order.map(key => hostBindings[key]).join(" ");
                const templateString = `<template ${hostBindingString}><span attr="\${() => 'value'}"></span></template>`;

                FASTElement.define({
                    name,
                    template: new Function("html", `return html\`${templateString}\``)(html),
                });
                const { templateRenderer } = fastSSR({ emitHydratableMarkup: true });
                const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

                // Verify content binding is at index 0 regardless of host binding order
                // Attribute order on host may vary, so check for key parts
                expect(result).toContain(`<${name}`);
                expect(result).toContain(`disabled`);
                expect(result).toContain(`attr="value"`);
                expect(result).toContain(`needs-hydration`);
                expect(result).toContain(`<span attr="value" ${hydrationMarker.attribute([0])}></span>`);
                expect(result).toContain(`</${name}>`);
            }
        });
        test("should restart marker indexes after host bindings with static attributes", () => {
            const name = uniqueElementName();
            FASTElement.define({
                name,
                template: html`<template id="static-id" @click="${() => void 0}"><span attr="${() => "value"}"></span></template>`,
            });
            const { templateRenderer } = fastSSR({ emitHydratableMarkup: true });
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(
                `<${name} id="static-id" needs-hydration><template shadowrootmode="open" shadowroot="open"><span attr="value" ${hydrationMarker.attribute([0])}></span></template></${name}>`
            );
        });
        test("should restart marker indexes after multiple host events", () => {
            const name = uniqueElementName();
            FASTElement.define({
                name,
                template: html`<template @click="${() => void 0}" @keydown="${() => void 0}"><span attr="${() => "value"}"></span></template>`,
            });
            const { templateRenderer } = fastSSR({ emitHydratableMarkup: true });
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(
                `<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><span attr="value" ${hydrationMarker.attribute([0])}></span></template></${name}>`
            );
        });
        test("should restart marker indexes with host bindings and multiple content bindings", () => {
            const name = uniqueElementName();
            FASTElement.define({
                name,
                template: html`<template @click="${() => void 0}"><span first="${() => "a"}" second="${() => "b"}"></span></template>`,
            });
            const { templateRenderer } = fastSSR({ emitHydratableMarkup: true });
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(result).toBe(
                `<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><span first="a" second="b" ${hydrationMarker.attribute([0, 1])}></span></template></${name}>`
            );
        });
        test("should restart marker indexes with host bindings and content text bindings", () => {
            const name = uniqueElementName();
            const template = html`<template @click="${() => void 0}"><span>${() => "text"}</span></template>`;
            FASTElement.define({
                name,
                template,
            });
            const { templateRenderer } = fastSSR({ emitHydratableMarkup: true });
            const result = consolidate(templateRenderer.render(`<${name}></${name}>`));
            const codes = (template.create() as unknown as SSRView).codes;

            expect(result).toBe(
                `<${name} needs-hydration><template shadowrootmode="open" shadowroot="open"><span>${hydrationMarker.contentBindingStart(0, codes.id)}text${hydrationMarker.contentBindingEnd(0, codes.id)}</span></template></${name}>`
            );
        });
        test("should only emit markers for custom element templates", () => {
            const { templateRenderer } = fastSSR({emitHydratableMarkup: true});
            const result = consolidate(templateRenderer.render(html`<p>${x => "hello world"}</p>`));
            expect(result).toBe("<p>hello world</p>");
        })
    });

    test.describe("Disconnecting elements", () => {
        test("should disconnect an element if there are no other elements in the customElementInstanceStack", () => {
            let disconnected = false;
            const name = uniqueElementName();
            (class extends FASTElement {
                disconnectedCallback(): void {
                    disconnected = true;
                }
            }).define(name);

            const  { templateRenderer } = fastSSR();
            consolidate(templateRenderer.render(`<${name}></${name}>`));

            expect(disconnected).toBe(true);
        });

        test("should not disconnect an element if there are other elements in the customElementInstanceStack", () => {
            let disconnected = false;
            const name = uniqueElementName();
            (class extends FASTElement {
                disconnectedCallback(): void {
                    disconnected = true;
                }
            }).define(name);

            const  { templateRenderer } = fastSSR();
            const renderInfo = templateRenderer.createRenderInfo();
            renderInfo.customElementInstanceStack.push(new FallbackRenderer("tag-name"));
            consolidate(templateRenderer.render(`<${name}></${name}>`, renderInfo));

            expect(disconnected).toBe(false);
        });
        test("should remove behaviors during disconnection", () => {
            let removed = false;
            const behavior: HostBehavior = {
                removedCallback() {
                    removed = true;
                }
            }

            const name = uniqueElementName();
            (class extends FASTElement {
                connectedCallback(): void {
                    super.connectedCallback();
                    this.$fastController.addBehavior(behavior);
                }
            }).define(name);

            const  { templateRenderer } = fastSSR();
            const renderInfo = templateRenderer.createRenderInfo();
            consolidate(templateRenderer.render(`<${name}></${name}>`, renderInfo));

            expect(removed).toBe(true);
        });
    });

    test.describe("with tryRecoverFromErrors", () => {
        test("should not emit shadow-dom for a component that throws during connectedCallback", () => {
            const name = uniqueElementName();
            (class extends FASTElement {
                connectedCallback(): void {
                    super.connectedCallback();
                    throw new Error();
                }
            } ).define({name});
            const { templateRenderer } = fastSSR({tryRecoverFromError: true});

            let result: string = "";
            const template = `<${name}></${name}>`;
            expect(() => {
                result = consolidate(templateRenderer.render(template));
            }).not.toThrow();
            expect(result).toBe(template)
        });

        test("should emit the defer-hydration attribute to the element when configured for a component that throws during connectedCallback", () => {
            const name = uniqueElementName();
            (class extends FASTElement {
                connectedCallback(): void {
                    super.connectedCallback();
                    throw new Error();
                }
            } ).define({name});
            const { templateRenderer } = fastSSR({tryRecoverFromError: true, deferHydration: true});

            let result: string = "";
            const template = `<${name}></${name}>`;
            expect(() => {
                result = consolidate(templateRenderer.render(template));
            }).not.toThrow();
            expect(result).toBe(`<${name} defer-hydration></${name}>`);
        });
        test("should not emit the needs-hydration attribute to the element when configured for a component that throws during connectedCallback", () => {
            const name = uniqueElementName();
            (class extends FASTElement {
                connectedCallback(): void {
                    super.connectedCallback();
                    throw new Error();
                }
            } ).define({name});
            const { templateRenderer } = fastSSR({tryRecoverFromError: true, emitHydratableMarkup: true});

            let result: string = "";
            const template = `<${name}></${name}>`;
            expect(() => {
                result = consolidate(templateRenderer.render(template));
            }).not.toThrow();
            expect(result).toBe(template);
        });
        test("should not emit shadow-dom for a component that throws during async process in connectedCallback", async () => {
            const name = uniqueElementName();
            (class extends FASTElement {
                connectedCallback(): void {
                    async function throwErr(): Promise<void> {
                        throw new Error()
                    }
                    this.dispatchEvent(new PendingTaskEvent(throwErr()))
                }
            } ).define({name});
            const { templateRenderer } = fastSSR({tryRecoverFromError: true, renderMode: "async"});

            let result: string = "";
            const template = `<${name}></${name}>`;
            result = await consolidateAsync(templateRenderer.render(template));
            expect(result).toBe(template);
        });
        test("should not emit host binding attributes after handling error", () => {
            const name = uniqueElementName();
            (class extends FASTElement {
                connectedCallback(): void {
                    super.connectedCallback();
                    throw new Error();
                }
            } ).define({name, template: html`<template my-static-attr="value" my-attr-binding="${() => "binding"}"><p>Hello world</p></template>`});
            const { templateRenderer } = fastSSR({tryRecoverFromError: true});

            const result = consolidate(templateRenderer.render(`<${name} contextual-attribute="value"></${name}>`))
            expect(result).toBe(`<${name}  contextual-attribute="value"></${name}>`);
        });
        test("should invoke a provided handler with the thrown error when a recoverable error is caught in the connectedCallback", () => {
            const name = uniqueElementName();
            (class extends FASTElement {
                connectedCallback(): void {
                    super.connectedCallback();
                    throw new Error();
                }
            } ).define(name);
            let err: any;
            const handler = (reason: unknown) => {
                err = reason;
            }
            const { templateRenderer } = fastSSR({tryRecoverFromError: handler});

            consolidate(templateRenderer.render(`<${name} contextual-attribute="value"></${name}>`))
            expect(err instanceof Error).toBe(true);
        });
        test("should invoke a provided handler with the thrown error when a recoverable error is caught from a PendingTaskEvent", async () => {
            const name = uniqueElementName();
            (class extends FASTElement {
                connectedCallback(): void {
                    async function throwErr(): Promise<void> {
                        throw new Error()
                    }
                    this.dispatchEvent(new PendingTaskEvent(throwErr()))
                }
            } ).define({name});
            let err: any;
            const handler = (reason: unknown) => {
                err = reason;
            }
            const { templateRenderer } = fastSSR({tryRecoverFromError: handler, renderMode: "async"});

            const template = `<${name}></${name}>`;
            await consolidateAsync(templateRenderer.render(template));
            expect(err instanceof Error).toBe(true);
        });
    });
});
