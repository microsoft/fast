import "../install-dom-shim.js";

import { attr, css, customElement, FASTElement, html, observable, when } from "@microsoft/fast-element";
import { PendingTaskEvent } from "@microsoft/fast-element/pending-task.js";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";
import { expect, test } from '@playwright/test';
import fastSSR from "../exports.js";
import { consolidate, consolidateAsync } from "../test-utilities/consolidate.js";
import { SyncFASTElementRenderer } from "./fast-element-renderer.js";

@customElement({
    name: "bare-element",
})
export class BareElement extends FASTElement {}
@customElement({
    name: "styled-element",
    styles: css`:host { display: block; }${css`:host { color: red; }`}
    `
})
export class StyledElement extends FASTElement {}
@customElement({
    name: "host-binding-element",
    template: html`
        <template attr="attr" ?bool-attr="${() => true}"></template>
    `
})
export class HostBindingElement extends FASTElement {}

test.describe("FallbackRenderer", () => {
    // Define custom element that is not a FAST elmeent.
    const name = uniqueElementName();
    customElements.define(name, class extends HTMLElement{});
    test.describe("rendering an element with attributes", () => {
        test("should not render the attribute when binding evaluates null", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <${html.partial(name)} attr="${x => null}"></${html.partial(name)}>
            `));
            expect(result).toBe(`
                <${name} ></${name}>
            `);
        });

        test("should not render the attribute when the binding evaluates undefined", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <${html.partial(name)} attr="${x => undefined}"></${html.partial(name)}>
            `));
            expect(result).toBe(`
                <${name} ></${name}>
            `);
        });

        test("should render a boolean attribute with the values of true or false", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <${html.partial(name)} ?attr="${x => true}"></${html.partial(name)}>
                <${html.partial(name)} ?attr="${x => false}"></${html.partial(name)}>
            `));
            expect(result).toBe(`
                <${name}  attr></${name}>
                <${name} ></${name}>
            `);
        });

        test("should render a non-boolean attribute with the values of true or false", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <${html.partial(name)} aria-expanded="${x => true}"></${html.partial(name)}>
                <${html.partial(name)} aria-expanded="${x => false}"></${html.partial(name)}>
            `));
            expect(result).toBe(`
                <${name}  aria-expanded="true"></${name}>
                <${name}  aria-expanded="false"></${name}>
            `);
        });

        test("should render an attribute with the value of a number", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <${html.partial(name)} number="${x => 12}"></${html.partial(name)}>
                <${html.partial(name)} number="${x => NaN}"></${html.partial(name)}>
            `));
            expect(result).toBe(`
                <${name}  number="12"></${name}>
                <${name}  number="NaN"></${name}>
            `);
        });

        test("should render an attribute with a string value", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <${html.partial(name)} attr="${x => 'my-str-value'}"></${html.partial(name)}>
            `));
            expect(result).toBe(`
                <${name}  attr="my-str-value"></${name}>
            `);
        });

        test("should throw error when rendering an attribute with an object value", () => {
            const { templateRenderer } = fastSSR();

            expect(() => {
                consolidate(templateRenderer.render(html`<${html.partial(name)} attr="${x => ({ key: 'my-value' })}"></${html.partial(name)}>`));
            }).toThrowError()
        });
    });
});

test.describe("FASTElementRenderer", () => {
    test.describe("should have a 'matchesClass' method", () => {
        test("that returns true when invoked with a class that extends FASTElement ",  () => {
            class MyElement extends FASTElement {}
            expect(SyncFASTElementRenderer.matchesClass(MyElement, "", new Map())).toBe(true);
        });
        test("that returns false when invoked with a class that does not extend FASTElement ", () => {
            class MyElement extends HTMLElement {}
            expect(SyncFASTElementRenderer.matchesClass(MyElement, "", new Map())).toBe(false);
        });

        test("should return false when the provided class has been disabled", () => {
            class MyElement extends FASTElement {}
            const { ElementRenderer } = fastSSR();

            ElementRenderer.disable(MyElement);

            expect(ElementRenderer.matchesClass(MyElement, "", new Map())).toBe(false)
        });
        test("should return false when the provided tag-name has been disabled", () => {
            const name = uniqueElementName();
            class MyElement extends FASTElement {}
            const { ElementRenderer } = fastSSR();

            ElementRenderer.disable(name);

            expect(ElementRenderer.matchesClass(MyElement, name, new Map())).toBe(false)
        });
        test("should return false when the provided element definition has been disabled", () => {
            const name = uniqueElementName();
            class MyElement extends FASTElement {}
            const definition = MyElement.compose(name);
            const { ElementRenderer } = fastSSR();

            ElementRenderer.disable(definition);

            expect(ElementRenderer.matchesClass(MyElement, name, new Map())).toBe(false)
        });
    });

    test.describe("rendering stylesheets", () => {
        test(`should render stylesheets as 'style' elements by default`, () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`<styled-element></styled-element>`));
            expect(result).toBe(`<styled-element><template shadowrootmode="open" shadowroot="open"><style>:host { display: block; }</style><style>:host { color: red; }</style></template></styled-element>`);
        });
        test.skip(`should render stylesheets as 'fast-style' elements when configured`, () => {
            const { templateRenderer } = fastSSR(/* Replace w/ configuration when fast-style work is complete{useFASTStyle: true}*/);
            const result = consolidate(templateRenderer.render(html`<styled-element></styled-element>`));
            expect(result).toBe(`<styled-element><template shadowrootmode="open" shadowroot="open"><fast-style style-id="fast-style-0" css=":host { display: block; }"></fast-style><fast-style style-id="fast-style-1" css=":host { color: red; }"></fast-style></template></styled-element>`);
        });
    });

    test.describe("with host bindings", () => {
        test("should render attributes on the root of a template element to the host element", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <host-binding-element></host-binding-element>
            `));
            expect(result).toBe(`
                <host-binding-element attr="attr" bool-attr><template shadowrootmode="open" shadowroot="open"></template></host-binding-element>
            `);
        });

        test("should not evaluate event bindings on the host", () => {
            const { templateRenderer } = fastSSR();
            const name = uniqueElementName();
            FASTElement.define({name , template: html`<template @click=${() => {throw new Error("Event bindings should not be invoked")}}></template>`});

            expect(() => {
                consolidate(templateRenderer.render(`<${name}></${name}>`));
            }).not.toThrow()
        });
    })

    test.describe("rendering an element with attributes", () => {
        test("should not render the attribute when binding evaluates null", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element attr="${x => null}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element ><template shadowrootmode="open" shadowroot="open"></template></bare-element>
            `);
        });
        test("should not render the attribute when the binding evaluates undefined", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element attr="${x => undefined}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element ><template shadowrootmode="open" shadowroot="open"></template></bare-element>
            `);
        });

        test("should render a boolean attribute with the values of true or false", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element ?attr="${x => true}"></bare-element>
                <bare-element ?attr="${x => false}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element  attr><template shadowrootmode="open" shadowroot="open"></template></bare-element>
                <bare-element ><template shadowrootmode="open" shadowroot="open"></template></bare-element>
            `);
        });

        test("should render a non-boolean attribute with the values of true or false", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element aria-expanded="${x => true}"></bare-element>
                <bare-element aria-expanded="${x => false}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element  aria-expanded="true"><template shadowrootmode="open" shadowroot="open"></template></bare-element>
                <bare-element  aria-expanded="false"><template shadowrootmode="open" shadowroot="open"></template></bare-element>
            `);
        });

        test("should render an attribute with the value of a number", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element number="${x => 12}"></bare-element>
                <bare-element number="${x => NaN}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element  number="12"><template shadowrootmode="open" shadowroot="open"></template></bare-element>
                <bare-element  number="NaN"><template shadowrootmode="open" shadowroot="open"></template></bare-element>
            `);
        });

        test("should render an attribute with a string value", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element attr="${x => 'my-str-value'}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element  attr="my-str-value"><template shadowrootmode="open" shadowroot="open"></template></bare-element>
            `);
        });

        test("should throw error when rendering an attribute with an object value", () => {
            const { templateRenderer } = fastSSR();
            try {
                consolidate(templateRenderer.render(html`<bare-element attr="${x => ({ key: 'my-value' })}"></bare-element>`));
            } catch (error) {
                expect(error).toEqual(new Error("Cannot assign attribute 'attr' for element bare-element."));
            }
        });
    });

    test.describe("emitting events", () => {

    @customElement("test-event-dispatch")
    class TestEventDispatch extends FASTElement {
        @attr({attribute: "event-detail"})
        eventDetail: string = "";

        @attr({ attribute: "listen-self", mode: "boolean"})
        listenSelf: boolean = false;

        @attr({ attribute: "stop-immediate-prop", mode: "boolean"})
        stopImmediateProp: boolean = false;

        @attr({ attribute: "stop-prop", mode: "boolean"})
        stopProp: boolean = false;

        connectedCallback(): void {
            super.connectedCallback();
            const e = new CustomEvent<{ data: string }>("test-event", {bubbles: true, detail: { data: ""}})

            if (this.listenSelf) {
                this.addEventListener("test-event", (e: any) => {
                    e.detail.data = "listen-self-success";
                    e.stopPropagation();
                });
            }

            if (this.stopProp) {
                this.addEventListener("test-event", (e: any) => {
                    e.detail.data = "stop-prop-success";
                    e.stopPropagation();
                });
            }
            if (this.stopImmediateProp) {
                this.addEventListener("test-event", (e: any) => {
                    e.detail.data = "stop-immediate-prop-success";
                    e.stopImmediatePropagation();
                });
                this.addEventListener("test-event", (e: any) => {
                    e.detail.data = "stop-immediate-prop-failure";
                });
            }

            this.dispatchEvent(e);

            this.eventDetail = e.detail.data || "";
        }
    }

    @customElement("test-event-listener")
    class TestEventListener extends FASTElement {
        @attr
        data: string = "default"

        connectedCallback() {
            super.connectedCallback();
            this.addEventListener("test-event", (e: Event) => {
                ( e as CustomEvent<{ data: string }> ).detail.data = this.data;
            })
        }
    }
        test("An element dispatching an event should get it's own handler fired", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`<test-event-dispatch listen-self></test-event-dispatch>` ));
            expect(result).toBe(`<test-event-dispatch  event-detail="listen-self-success" listen-self><template shadowrootmode="open" shadowroot="open"></template></test-event-dispatch>`)
        });
        test("An ancestor with a handler should get it's handler invoked if the event bubbles", () => {
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-listener data="bubble-success"><test-event-dispatch></test-event-dispatch></test-event-listener>`));
            expect(result).toBe(`<test-event-listener  data="bubble-success"><template shadowrootmode="open" shadowroot="open"></template><test-event-dispatch event-detail="bubble-success"><template shadowrootmode="open" shadowroot="open"></template></test-event-dispatch></test-event-listener>`)
        });
        test("Should bubble events to the document", () => {
            document.addEventListener("test-event", (e) => {
                (e as any).detail.data = "document-success";
            });
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-dispatch></test-event-dispatch>`));

            expect(result).toBe(`<test-event-dispatch event-detail="document-success"><template shadowrootmode="open" shadowroot="open"></template></test-event-dispatch>`);
        });
        test("Should bubble events to the window", () => {
            window.addEventListener("test-event", (e) => {
                (e as any).detail.data = "window-success";
            });
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-dispatch></test-event-dispatch>`));
            expect(result).toBe(`<test-event-dispatch event-detail="window-success"><template shadowrootmode="open" shadowroot="open"></template></test-event-dispatch>`);
        });
        test("Should not bubble an event that invokes event.stopImmediatePropagation()", () => {
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-listener data="stop-immediate-propagation-failure"><test-event-dispatch stop-immediate-prop></test-event-dispatch></test-event-listener>`));
            expect(result).toBe(`<test-event-listener  data="stop-immediate-propagation-failure"><template shadowrootmode="open" shadowroot="open"></template><test-event-dispatch  event-detail="stop-immediate-prop-success" stop-immediate-prop><template shadowrootmode="open" shadowroot="open"></template></test-event-dispatch></test-event-listener>`)
        });
        test("Should not bubble an event that invokes event.stopPropagation()", () => {
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-listener data="stop-propagation-failure"><test-event-dispatch stop-prop></test-event-dispatch></test-event-listener>`));
            expect(result).toBe(`<test-event-listener  data="stop-propagation-failure"><template shadowrootmode="open" shadowroot="open"></template><test-event-dispatch  event-detail="stop-prop-success" stop-prop><template shadowrootmode="open" shadowroot="open"></template></test-event-dispatch></test-event-listener>`)
        });
    });

    test.describe("rendering asynchronously", () => {
        test("should support attribute mutation for the element as a result of PendingTask events", async () => {
            const name = uniqueElementName();
            @customElement({
                name,
            })
            class MyElement extends FASTElement {
                connectedCallback(): void {
                    super.connectedCallback();
                    this.dispatchEvent(new PendingTaskEvent(new Promise((resolve) => {
                        window.setTimeout(() => {
                            this.setAttribute("async-resolved", "");
                            resolve();
                        }, 20);
                    })));
                }
            }

            const template = html`<${html.partial(name)}></${html.partial(name)}>`;
            const { templateRenderer } = fastSSR({renderMode: "async"});

            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name} async-resolved><template shadowrootmode="open" shadowroot="open"></template></${name}>`)
        });


        test("should throw when the element catches rejected PendingTaskEvents", async () => {
            const name = uniqueElementName();
            @customElement({
                name,
            })
            class MyElement extends FASTElement {
                connectedCallback(): void {
                    super.connectedCallback();
                    this.dispatchEvent(new PendingTaskEvent(new Promise((resolve, reject) => {
                        window.setTimeout(() => {
                            this.setAttribute("async-reject", "");
                            reject(new Error());
                        }, 20);
                    })));
                }
            }

            const template = html`<${html.partial(name)}></${html.partial(name)}>`;
            const { templateRenderer } = fastSSR({renderMode: "async"});
            try {
                await consolidateAsync(templateRenderer.render(template))
                expect("didn't error").toBe("errored");
            } catch(e) {
                expect("errored").toBe("errored");
            }
        });
        test("should await multiple PendingTaskEvents", async () => {
            const name = uniqueElementName();
            @customElement({
                name,
            })
            class MyElement extends FASTElement {
                connectedCallback(): void {
                    super.connectedCallback();
                    this.dispatchEvent(new PendingTaskEvent(new Promise((resolve) => {
                        window.setTimeout(() => {
                            this.setAttribute("async-resolved-one", "");
                            resolve();
                        }, 20);
                    })));
                    this.dispatchEvent(new PendingTaskEvent(new Promise((resolve) => {
                        window.setTimeout(() => {
                            this.setAttribute("async-resolved-two", "");
                            resolve();
                        }, 30);
                    })));
                }
            }

            const template = html`<${html.partial(name)}></${html.partial(name)}>`;
            const { templateRenderer } = fastSSR({renderMode: "async"});

            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name} async-resolved-one async-resolved-two><template shadowrootmode="open" shadowroot="open"></template></${name}>`)
        });
        test("should render template content only displayed after PendingTaskEvent is resolved", async () => {
            const name = uniqueElementName();
            @customElement({
                name,
                template: html`${when(x => x.renderContent, html`<h1>Async content success</h1>`)}`
            })
            class MyElement extends FASTElement {
                @observable
                renderContent: boolean = false;
                connectedCallback(): void {
                    super.connectedCallback();
                    this.dispatchEvent(new PendingTaskEvent(new Promise((resolve) => {
                        window.setTimeout(() => {
                            this.renderContent = true;
                            resolve();
                        }, 20);
                    })));
                }
            }

            const template = html`<${html.partial(name)}></${html.partial(name)}>`;
            const { templateRenderer } = fastSSR({renderMode: "async"});

            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name}><template shadowrootmode="open" shadowroot="open"><h1>Async content success</h1></template></${name}>`)
        });
        test("should support nested async rendering scenarios", async () => {
            const name = uniqueElementName();
            @customElement({
                name,
                template: html`<slot></slot>`
            })
            class MyElement extends FASTElement {
                @observable
                renderContent: boolean = false;
                connectedCallback(): void {
                    super.connectedCallback();
                    this.dispatchEvent(new PendingTaskEvent(new Promise((resolve) => {
                        window.setTimeout(() => {
                            this.setAttribute("async-resolved", "")
                            resolve();
                        }, 20);
                    })));
                }
            }

            const template = html`<${html.partial(name)}><${html.partial(name)}></${html.partial(name)}></${html.partial(name)}>`;
            const { templateRenderer } = fastSSR({renderMode: "async"});

            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name} async-resolved><template shadowrootmode="open" shadowroot="open"><slot></slot></template><${name} async-resolved><template shadowrootmode="open" shadowroot="open"><slot></slot></template></${name}></${name}>`)
        });

        test("should support asyncronously calling FASTElement.connectedCallback", async () => {
            const name = uniqueElementName();
            @customElement({
                name,
                template: html<MyElement>`<p>attr value: ${x => x.value}</p>`
            })
            class MyElement extends FASTElement {
                @attr
                value: string = "";

                connectedCallback(): void {
                    this.asyncConnectedCallback();
                }

                async asyncConnectedCallback() {
                    this.dispatchEvent(new PendingTaskEvent(new Promise((resolve) => {
                        window.setTimeout(() => {
                            super.connectedCallback();
                            resolve();
                        }, 20);
                    })));
                }
            }


            const { templateRenderer } = fastSSR({renderMode: "async"});
            const template = `<${name} value="hello-world"></${name}>`;
            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name}  value="hello-world"><template shadowrootmode="open" shadowroot="open"><p>attr value: hello-world</p></template></${name}>`)
        })
    });

    test("should match FAST elements that extend base-classes created from `FASTElement.from()`", () => {
        const BaseClass = FASTElement.from(HTMLElement);
        class MyElement extends BaseClass {}

        const name = uniqueElementName();
        FASTElement.define(MyElement, name);

        const { ElementRenderer } = fastSSR();

        expect(ElementRenderer.matchesClass(MyElement, name, new Map())).toBe(true)
    })

    test.describe("with hydration markup enabled", () => {
        test("should emit the 'needs-hydration' attribute from `renderAttributes()`", () => {
            const { ElementRenderer, templateRenderer } = fastSSR({ emitHydratableMarkup: true});
            const name = uniqueElementName();

            FASTElement.define(name);
            const renderer = new ElementRenderer(name, templateRenderer.createRenderInfo());

            expect(consolidate(renderer.renderAttributes()).split(" ")).toContain("needs-hydration");
        });
    })
});
