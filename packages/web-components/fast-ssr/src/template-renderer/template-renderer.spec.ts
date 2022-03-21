import "@lit-labs/ssr/lib/install-global-dom-shim.js";
import { customElement, FASTElement, html, when, defaultExecutionContext, repeat, children, slotted, ref } from "@microsoft/fast-element";
import { expect, test } from "@playwright/test";
import fastSSR from "../exports.js";
import { TemplateRenderer } from "./template-renderer.js";
import { parseTemplateToOpCodes } from "../template-parser/template-parser.js";
import exp from "constants";

function consolidate(strings: IterableIterator<string>): string {
    let str = "";
    let current = strings.next();

    while(!current.done) {
        str = str.concat(current.value)
        current = strings.next();
    }

    return str;
}

@customElement("hello-world")
class HelloWorld extends FASTElement {}

@customElement({name: "with-slot", template: html`<slot></slot>`})
class WithSlot extends FASTElement {}

@customElement({name: "with-host-attributes", template: html`<template static="static" dynamic="${x => "dynamic"}" ?bool-true=${x => true} ?bool-false=${x => false} :property=${x => "value"}>${x => x.property}<slot></slot></template>`})
class WithHostAttributes extends FASTElement {}

test.describe("TemplateRenderer", () => {
    test.describe("should have an initial configuration", () => {
        test("that emits to shadow DOM", () => {
            const instance = new TemplateRenderer();
            expect(instance.componentDOMEmissionMode).toBe("shadow")
        });
    });

    test.describe("should allow configuration", () => {
        test("that emits to light DOM", () => {
            const instance = new TemplateRenderer({componentDOMEmissionMode: "light"});
            expect(instance.componentDOMEmissionMode).toBe("light")
        });
    });

    test.describe("rendering <template> elements", () => {
        test("should render a template element without attributes", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<template></template>`, defaultRenderInfo)

            expect(consolidate(result)).toBe("<template></template>");
        });
        test("should render a template element with static attributes", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<template name="foo" id="bar"></template>`, defaultRenderInfo)

            expect(consolidate(result)).toBe(`<template name="foo" id="bar"></template>`);
        });
        test("should render a template element with dynamic attributes", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<template name=${x => "bar"} id=${x => "bat"}></template>`, defaultRenderInfo)

            expect(consolidate(result)).toBe(`<template name="bar" id="bat"></template>`);
        });
        test("should render a template element with both static and dynamic attributes", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<template id="bar" name=${x => "foo"}></template>`, defaultRenderInfo)

            expect(consolidate(result)).toBe(`<template id="bar" name="foo"></template>`);
        });
        test("should render with static attributes preceding dynamic attributes", () => {
            // Attribute order changes are due to attribute categorization during template parsing.
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<template name=${x => "foo"} id="bar"></template>`, defaultRenderInfo)

            expect(consolidate(result)).toBe(`<template id="bar" name="foo"></template>`);
        });
        test("should render a template with content", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<template name="bar"><p>Hello world</p></template>`, defaultRenderInfo)

            expect(consolidate(result)).toBe(`<template name="bar"><p>Hello world</p></template>`);
        });
        test("should render a template as a child element", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<p><template name="bar"></template></p>`, defaultRenderInfo)

            expect(consolidate(result)).toBe(`<p><template name="bar"></template></p>`);
        });
    });

    test.describe("rendering declarative shadow DOM", () => {
        test("should emit static shadow DOM template for a defined custom element", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<with-slot></with-slot>`, defaultRenderInfo)

            expect(consolidate(result)).toBe("<with-slot><template shadowroot=\"open\"><slot></slot></template></with-slot>");
        });
        test("should emit template element with shadowroot attribute for defined custom element", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<hello-world></hello-world>`, defaultRenderInfo)

            expect(consolidate(result)).toBe("<hello-world><template shadowroot=\"open\"></template></hello-world>");
        });
        test("should a custom element with a static attribute", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<hello-world id="test"></hello-world>`, defaultRenderInfo)

            expect(consolidate(result)).toBe(`<hello-world  id="test"><template shadowroot=\"open\"></template></hello-world>`);
        });

        test("should emit a custom element with attributes and properties reflected from an element's root <template> element", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`<with-host-attributes id="foo"></with-host-attributes>`, defaultRenderInfo)

            expect(consolidate(result)).toBe(`<with-host-attributes  id="foo" static="static" dynamic="dynamic" bool-true><template shadowroot=\"open\">value<slot></slot></template></with-host-attributes>`);
        });
    })

    test("should emit a single element template", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = templateRenderer.render(html`<p>Hello world</p>`, defaultRenderInfo)

        expect(consolidate(result)).toBe("<p>Hello world</p>")
    });

    test("should emit un-registered custom elements without any shadow DOM", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = templateRenderer.render(html`<unregistered-element>Hello world</unregistered-element>`, defaultRenderInfo)

        expect(consolidate(result)).toBe("<unregistered-element>Hello world</unregistered-element>");
    });

    /**
     * Bindings
     */
    test("should provide the source object to any bindings", () => {
        const source = {};
        let calledWith: any;
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        consolidate(templateRenderer.render(html`${(x) => {calledWith = x}}`, defaultRenderInfo, source));

        expect(source).toBe(calledWith);
    });

    test("should provide the defaultExecutionContext object to a binding", () => {
        let calledWith: any;
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        consolidate(templateRenderer.render(html`${(x, c) => {calledWith = c}}`, defaultRenderInfo));

        expect(calledWith).toBe(defaultExecutionContext);
    });


    test("should not emit string content from a binding that returns a null value", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = consolidate(templateRenderer.render(html`${(x) => null}`, defaultRenderInfo));

        expect(result).toBe("");
    });

    test("should not emit string content from a binding that returns an undefined value", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = consolidate(templateRenderer.render(html`${(x) => undefined}`, defaultRenderInfo));

        expect(result).toBe("");
    });

    test("should emit a native element with an attribute when the attr binding returns a string", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = consolidate(templateRenderer.render(html`<p id="${(x) => "test"}"></p>`, defaultRenderInfo));

        expect(result).toBe(`<p id="test"></p>`);
    });

    test("should emit a custom element with an attribute binding when the attr binding returns a string", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = templateRenderer.render(html`<hello-world my-attr=${x => "foobar"}></hello-world>`, defaultRenderInfo)

        expect(consolidate(result)).toBe(`<hello-world my-attr="foobar"><template shadowroot=\"open\"></template></hello-world>`);
    });
    test("should emit an element with a boolean attribute when the attr binding returns true", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = consolidate(templateRenderer.render(html`<input type="checkbox" ?checked="${(x) => true}" />`, defaultRenderInfo));

        expect(result).toBe(`<input type="checkbox" checked />`);
    });
    test("should not emit an attribute for a boolean attribute that returns false", () => {
        const { templateRenderer, defaultRenderInfo} = fastSSR();
        const result = consolidate(templateRenderer.render(html`<input type="checkbox" ?checked="${(x) => false}" />`, defaultRenderInfo));

        expect(result).toBe(`<input type="checkbox"  />`);
    });

    test("should emit embedded templates", () =>{
        const { templateRenderer, defaultRenderInfo} = fastSSR();

        const result = consolidate(templateRenderer.render(html`<p>Hello ${html`<span>world</span>`}</p>`, defaultRenderInfo))
        expect(result).toBe(`<p>Hello <span>world</span></p>`);
    })

    /**
     * Directive tests
     */
    test.describe("with a 'when' directive", () => {
        test("should render a 'when' directive's content when the binding evaluates true", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`${when(x => true, html`<p>Hello world</p>`)}`, defaultRenderInfo)

            expect(consolidate(result)).toBe("<p>Hello world</p>")
        });
        test("should emit nothing when a 'when' directive's binding evaluates false ", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const result = templateRenderer.render(html`${when(x => false, html`<p>Hello world</p>`)}`, defaultRenderInfo)

            expect(consolidate(result)).toBe("");
        });
    });

    test.describe("with a 'repeat' directive", () => {
        test("should provide parent and parentContext to execution context of bindings in child template", () => {

            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const source = {
                data: ["foo", "bar", "bat"]
            };
            const ctx = Object.create(defaultExecutionContext);
            consolidate(templateRenderer.render(html<typeof source>`${repeat(x => x.data, html<string>`${(x, c) => {
                expect(c.parent).toBe(source);
                expect(c.parentContext).toBe(ctx)
            }}`, { positioning: true})}`, defaultRenderInfo, source, ctx))
        });
        test("should provide positioning information when invoked with the positioning config", () => {

            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const source = {
                data: ["foo", "bar", "bat"]
            };
            let i = 0;
            consolidate(templateRenderer.render(html<typeof source>`${repeat(x => x.data, html<string>`${(x, c) => {
                expect(c.index).toBe(i);
                i++;
                expect(c.length).toBe(c.parent.data.length)
            }}`, { positioning: true})}`, defaultRenderInfo, source))
        });
        test("should render the provided template with the instance as the source data", () => {
            const { templateRenderer, defaultRenderInfo} = fastSSR();
            const source = {
                data: ["foo", "bar", "bat"]
            };
            const result = templateRenderer.render(html<typeof source>`${repeat(x => x.data, html<string>`${x => x}`)}`, defaultRenderInfo, source)
            expect(consolidate( result )).toBe("foobarbat");
        });
    });
    for (let directive of [children, ref, slotted ]) {
        test.describe(`with '${directive.name}' directive`, () => {
            test("should interpolate empty string", () => {
                const { templateRenderer, defaultRenderInfo} = fastSSR();
                const source = {}
                const result = templateRenderer.render(html`<ul ${directive('items')}><li>Hello</li><li>World</li></ul>`, defaultRenderInfo, source);

                expect(consolidate(result)).toBe("<ul ><li>Hello</li><li>World</li></ul>")
            });
        })
    }
});
