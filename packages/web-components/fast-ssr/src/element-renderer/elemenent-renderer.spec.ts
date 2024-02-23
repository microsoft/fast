import "../install-dom-shim.js";
import { FASTElement, customElement, css, html, attr, observable, when } from "@microsoft/fast-element";
import { expect, test } from '@playwright/test';
import { SyncFASTElementRenderer } from "./fast-element-renderer.js";
import fastSSR from "../exports.js";
import { consolidate, consolidateAsync } from "../test-utilities/consolidate.js";
import { uniqueElementName } from "@microsoft/fast-element/testing.js";
import { PendingTaskEvent } from "@microsoft/fast-element/pending-task.js";

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
            expect(result).toBe("<styled-element><template shadowroot=\"open\"><style>:host { display: block; }</style><style>:host { color: red; }</style></template></styled-element>");
        });
        test.skip(`should render stylesheets as 'fast-style' elements when configured`, () => {
            const { templateRenderer } = fastSSR(/* Replace w/ configuration when fast-style work is complete{useFASTStyle: true}*/);
            const result = consolidate(templateRenderer.render(html`<styled-element></styled-element>`));
            expect(result).toBe(`<styled-element><template shadowroot=\"open\"><fast-style style-id="fast-style-0" css=":host { display: block; }\"></fast-style><fast-style style-id=\"fast-style-1\" css=\":host { color: red; }"></fast-style></template></styled-element>`);
        });
    });

    test("should render attributes on the root of a template element to the host element", () => {
        const { templateRenderer } = fastSSR();
        const result = consolidate(templateRenderer.render(html`
            <host-binding-element></host-binding-element>
        `));
        expect(result).toBe(`
            <host-binding-element attr="attr" bool-attr><template shadowroot=\"open\"></template></host-binding-element>
        `);
    });

    test.describe("rendering an element with attributes", () => {
        test("should not render the attribute when binding evaluates null", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element attr="${x => null}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element ><template shadowroot=\"open\"></template></bare-element>
            `);
        });
        test("should not render the attribute when the binding evaluates undefined", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element attr="${x => undefined}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element ><template shadowroot=\"open\"></template></bare-element>
            `);
        });

        test("should render a boolean attribute with the values of true or false", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element ?attr="${x => true}"></bare-element>
                <bare-element ?attr="${x => false}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element  attr><template shadowroot=\"open\"></template></bare-element>
                <bare-element ><template shadowroot=\"open\"></template></bare-element>
            `);
        });

        test("should render a non-boolean attribute with the values of true or false", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element aria-expanded="${x => true}"></bare-element>
                <bare-element aria-expanded="${x => false}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element  aria-expanded="true"><template shadowroot=\"open\"></template></bare-element>
                <bare-element  aria-expanded="false"><template shadowroot=\"open\"></template></bare-element>
            `);
        });

        test("should render an attribute with a string value", () => {
            const { templateRenderer } = fastSSR();
            const result = consolidate(templateRenderer.render(html`
                <bare-element attr="${x => 'my-str-value'}"></bare-element>
            `));
            expect(result).toBe(`
                <bare-element  attr="my-str-value"><template shadowroot=\"open\"></template></bare-element>
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
            expect(result).toBe(`<test-event-dispatch  event-detail=\"listen-self-success\" listen-self><template shadowroot="open"></template></test-event-dispatch>`)
        });
        test("An ancestor with a handler should get it's handler invoked if the event bubbles", () => {
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-listener data="bubble-success"><test-event-dispatch></test-event-dispatch></test-event-listener>`));
            expect(result).toBe("<test-event-listener  data=\"bubble-success\"><template shadowroot=\"open\"></template><test-event-dispatch event-detail=\"bubble-success\"><template shadowroot=\"open\"></template></test-event-dispatch></test-event-listener>")
        });
        test("Should bubble events to the document", () => {
            document.addEventListener("test-event", (e) => {
                (e as any).detail.data = "document-success";
            });
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-dispatch></test-event-dispatch>`));

            expect(result).toBe(`<test-event-dispatch event-detail=\"document-success\"><template shadowroot=\"open\"></template></test-event-dispatch>`);
        });
        test("Should bubble events to the window", () => {
            window.addEventListener("test-event", (e) => {
                (e as any).detail.data = "window-success";
            });
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-dispatch></test-event-dispatch>`));
            expect(result).toBe(`<test-event-dispatch event-detail=\"window-success\"><template shadowroot=\"open\"></template></test-event-dispatch>`);
        });
        test("Should not bubble an event that invokes event.stopImmediatePropagation()", () => {
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-listener data="stop-immediate-propagation-failure"><test-event-dispatch stop-immediate-prop></test-event-dispatch></test-event-listener>`));
            expect(result).toBe(`<test-event-listener  data=\"stop-immediate-propagation-failure\"><template shadowroot=\"open\"></template><test-event-dispatch  event-detail=\"stop-immediate-prop-success\" stop-immediate-prop><template shadowroot=\"open\"></template></test-event-dispatch></test-event-listener>`)
        });
        test("Should not bubble an event that invokes event.stopPropagation()", () => {
            const { templateRenderer } = fastSSR();

            const result = consolidate(templateRenderer.render(html`<test-event-listener data="stop-propagation-failure"><test-event-dispatch stop-prop></test-event-dispatch></test-event-listener>`));
            expect(result).toBe(`<test-event-listener  data=\"stop-propagation-failure\"><template shadowroot=\"open\"></template><test-event-dispatch  event-detail=\"stop-prop-success\" stop-prop><template shadowroot=\"open\"></template></test-event-dispatch></test-event-listener>`)
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

            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name} async-resolved><template shadowroot="open"></template></${name}>`)
        });


        test("should render elements that have rejected PendingTaskEvents", async () => {
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
                            reject();
                        }, 20);
                    })));
                }
            }

            const template = html`<${html.partial(name)}></${html.partial(name)}>`;
            const { templateRenderer } = fastSSR({renderMode: "async"});

            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name} async-reject><template shadowroot="open"></template></${name}>`)
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

            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name} async-resolved-one async-resolved-two><template shadowroot="open"></template></${name}>`)
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

            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name}><template shadowroot="open"><h1>Async content success</h1></template></${name}>`)
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

            expect(await consolidateAsync(templateRenderer.render(template))).toBe(`<${name} async-resolved><template shadowroot="open"><slot></slot></template><${name} async-resolved><template shadowroot="open"><slot></slot></template></${name}></${name}>`)
        });
    })
});
