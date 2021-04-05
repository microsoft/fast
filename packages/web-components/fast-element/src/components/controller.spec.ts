import { expect } from "chai";
import { DOM } from "../dom";
import type { Behavior } from "../observation/behavior";
import { Observable } from "../observation/observable";
import { css } from "../styles/css";
import { html } from "../templating/template";
import { toHTML, uniqueElementName } from "../__test__/helpers";
import { Controller } from "./controller";
import { FASTElementDefinition, PartialFASTElementDefinition } from "./fast-definitions";
import { FASTElement } from "./fast-element";

describe("The Controller", () => {
    const templateA = html`a`;
    const templateB = html`b`;
    const cssA = "class-a { color: red; }";
    const stylesA = css`${cssA}`;
    const cssB = "class-b { color: blue; }";
    const stylesB = css`${cssB}`;

    function createController(
        config: Omit<PartialFASTElementDefinition, "name"> = {},
        BaseClass = FASTElement
    ) {
        const name = uniqueElementName();
        const definition = new FASTElementDefinition(
            class ControllerTest extends BaseClass {
                static definition = { ...config, name };
            }
        ).define();

        const element = document.createElement(name);
        const controller = Controller.forCustomElement(element);

        return {
            name,
            element,
            controller,
            definition,
            shadowRoot: element.shadowRoot! as ShadowRoot & {
                adoptedStyleSheets: CSSStyleSheet[];
            },
        };
    }

    context("during construction", () => {
        it("if no shadow options defined, uses open shadow dom", () => {
            const { shadowRoot } = createController();
            expect(shadowRoot).to.be.instanceOf(ShadowRoot);
        });

        it("if shadow options open, uses open shadow dom", () => {
            const { shadowRoot } = createController({ shadowOptions: { mode: "open" } });
            expect(shadowRoot).to.be.instanceOf(ShadowRoot);
        });

        it("if shadow options nullled, does not create shadow root", () => {
            const { shadowRoot } = createController({ shadowOptions: null });
            expect(shadowRoot).to.equal(null);
        });

        it("if shadow options closed, does not expose shadow root", () => {
            const { shadowRoot } = createController({
                shadowOptions: { mode: "closed" },
            });
            expect(shadowRoot).to.equal(null);
        });

        it("does not attach view to shadow root", () => {
            const { shadowRoot } = createController();
            expect(shadowRoot.childNodes.length).to.equal(0);
        });
    });

    context("during connect", () => {
        it("renders nothing to shadow dom in shadow dom mode when there's no template", () => {
            const { shadowRoot, controller } = createController();

            expect(toHTML(shadowRoot)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(shadowRoot)).to.equal("");
        });

        it("renders nothing to light dom in light dom mode when there's no template", () => {
            const { element, controller } = createController({ shadowOptions: null });

            expect(toHTML(element)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(element)).to.equal("");
        });

        it("renders a template to shadow dom in shadow dom mode", () => {
            const { shadowRoot, controller } = createController({ template: templateA });

            expect(toHTML(shadowRoot)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(shadowRoot)).to.equal("a");
        });

        it("renders a template to light dom in light dom mode", () => {
            const { controller, element } = createController({
                shadowOptions: null,
                template: templateA,
            });

            expect(toHTML(element)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(element)).to.equal("a");
        });

        it("renders a template override to shadow dom when set", () => {
            const { shadowRoot, controller } = createController({ template: templateA });

            expect(toHTML(shadowRoot)).to.equal("");
            controller.template = templateB;
            expect(toHTML(shadowRoot)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(shadowRoot)).to.equal("b");
        });

        it("renders a template override to light dom when set", () => {
            const { controller, element } = createController({
                shadowOptions: null,
                template: templateA,
            });

            expect(toHTML(element)).to.equal("");
            controller.template = templateB;
            expect(toHTML(element)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(element)).to.equal("b");
        });

        it("renders a resolved template to shadow dom in shadow dom mode", () => {
            const { shadowRoot, controller } = createController(
                {},
                class extends FASTElement {
                    resolveTemplate() {
                        return templateA;
                    }
                }
            );

            expect(toHTML(shadowRoot)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(shadowRoot)).to.equal("a");
        });

        it("renders a resolved template to light dom in light dom mode", () => {
            const { element, controller } = createController(
                { shadowOptions: null },
                class extends FASTElement {
                    resolveTemplate() {
                        return templateA;
                    }
                }
            );

            expect(toHTML(element)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(element)).to.equal("a");
        });

        it("renders a template override over a resolved template to shadow dom when set", () => {
            const { shadowRoot, controller } = createController(
                {},
                class extends FASTElement {
                    resolveTemplate() {
                        return templateA;
                    }
                }
            );

            expect(toHTML(shadowRoot)).to.equal("");
            controller.template = templateB;
            expect(toHTML(shadowRoot)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(shadowRoot)).to.equal("b");
        });

        it("renders a template override over a resolved template to light dom when set", () => {
            const { element, controller } = createController(
                { shadowOptions: null },
                class extends FASTElement {
                    resolveTemplate() {
                        return templateA;
                    }
                }
            );

            expect(toHTML(element)).to.equal("");
            controller.template = templateB;
            expect(toHTML(element)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(element)).to.equal("b");
        });

        if (DOM.supportsAdoptedStyleSheets) {
            it("sets no styles when none are provided", () => {
                const { shadowRoot, controller } = createController();

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.onConnectedCallback();
                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
            });

            it("sets styles when provided", () => {
                const { shadowRoot, controller } = createController({ styles: stylesA });

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.onConnectedCallback();
                expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].cssText).to.equal(
                    cssA
                );
            });

            it("renders style override when set", () => {
                const { shadowRoot, controller } = createController({ styles: stylesA });

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.styles = stylesB;
                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.onConnectedCallback();
                expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].cssText).to.equal(
                    cssB
                );
            });

            it("renders resolved styles", () => {
                const { shadowRoot, controller } = createController(
                    {},
                    class extends FASTElement {
                        resolveStyles() {
                            return stylesA;
                        }
                    }
                );

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.onConnectedCallback();
                expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].cssText).to.equal(
                    cssA
                );
            });

            it("renders a style override over a resolved style", () => {
                const { shadowRoot, controller } = createController(
                    {},
                    class extends FASTElement {
                        resolveStyles() {
                            return stylesA;
                        }
                    }
                );

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.styles = stylesB;
                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.onConnectedCallback();
                expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].cssText).to.equal(
                    cssB
                );
            });
        }
    });

    context("after connect", () => {
        it("can dynamically change the template in shadow dom mode", () => {
            const { shadowRoot, controller } = createController({ template: templateA });

            expect(toHTML(shadowRoot)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(shadowRoot)).to.equal("a");

            controller.template = templateB;
            expect(toHTML(shadowRoot)).to.equal("b");
        });

        it("can dynamically change the template in light dom mode", () => {
            const { controller, element } = createController({
                shadowOptions: null,
                template: templateA,
            });

            expect(toHTML(element)).to.equal("");
            controller.onConnectedCallback();
            expect(toHTML(element)).to.equal("a");

            controller.template = templateB;
            expect(toHTML(element)).to.equal("b");
        });

        if (DOM.supportsAdoptedStyleSheets) {
            it("can dynamically change the styles", () => {
                const { shadowRoot, controller } = createController({ styles: stylesA });

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.onConnectedCallback();
                expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].cssText).to.equal(
                    cssA
                );

                controller.styles = stylesB;
                expect(shadowRoot.adoptedStyleSheets.length).to.equal(1);
                expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].cssText).to.equal(
                    cssB
                );
            });
        }
    });

    it("should have an observable isConnected property", () => {
        const { element, controller } = createController();
        let attached = controller.isConnected;
        const handler = { handleChange: () => (attached = !attached) };
        Observable.getNotifier(controller).subscribe(handler, "isConnected");

        expect(attached).to.equal(false);
        document.body.appendChild(element);
        expect(attached).to.equal(true);
        document.body.removeChild(element);
        expect(attached).to.equal(false);
    });

        it("should attach and detach the HTMLStyleElement supplied to .addStyles() and .removeStyles() to the shadowRoot", () => {
            const { controller, element } = createController({
                shadowOptions: {
                    mode: "open",
                },
                template: templateA,
            });

            const style = document.createElement("style") as HTMLStyleElement;
            expect(element.shadowRoot?.contains(style)).to.equal(false);

            controller.addStyles(style);

            expect(element.shadowRoot?.contains(style)).to.equal(true);

            controller.removeStyles(style);

            expect(element.shadowRoot?.contains(style)).to.equal(false);
        });
        it("should attach and detach the HTMLStyleElement supplied to .addStyles() and .removeStyles() to the shadowRoot", () => {
            const { controller, element } = createController({
                shadowOptions: {
                    mode: "open",
                },
                template: templateA,
            });

            const style = document.createElement("style") as HTMLStyleElement;
            expect(element.shadowRoot?.contains(style)).to.equal(false);

            controller.addStyles(style);

            expect(element.shadowRoot?.contains(style)).to.equal(true);

            controller.removeStyles(style);

            expect(element.shadowRoot?.contains(style)).to.equal(false);
        });

        context("with behaviors", () => {
            it("should bind all behaviors added prior to connection, during connection", () => {
                class TestBehavior implements Behavior {
                    public bound = false;
                    bind() {
                        this.bound = true;
                    }
                    unbind() {
                        this.bound = false;
                    }
                }

                const behaviors = [new TestBehavior(), new TestBehavior(), new TestBehavior()];
                const { controller, element } = createController();
                controller.addBehaviors(behaviors);

                behaviors.forEach(x => expect(x.bound).to.equal(false))

                document.body.appendChild(element);

                behaviors.forEach(x => expect(x.bound).to.equal(true));
            });

            it("should bind a behavior B that is added to the Controller by behavior A, where A is added prior to connection and B is added during A's bind()", () => {
                let childBehaviorBound = false;
                class ParentBehavior implements Behavior {
                    bind(el: FASTElement) {
                        el.$fastController.addBehaviors([new ChildBehavior()])
                    }

                    unbind() {}
                }

                class ChildBehavior implements Behavior {
                    bind(el: FASTElement) {
                        childBehaviorBound = true;
                    }

                    unbind() {}
                }



                const { element, controller } = createController();
                controller.addBehaviors([new ParentBehavior()]);
                document.body.appendChild(element);

                expect(childBehaviorBound).to.equal(true);
            });
            it("should unbind a behavior only when the behavior is removed the number of times it has been added", () => {
                class TestBehavior implements Behavior {
                    public bound = false;
                    bind() {
                        this.bound = true;
                    }

                    unbind() {
                        this.bound = false;
                    }
                }

                const behavior = new TestBehavior();
                const { element, controller } = createController();

                document.body.appendChild(element);

                controller.addBehaviors([behavior]);
                controller.addBehaviors([behavior]);
                controller.addBehaviors([behavior]);

                expect(behavior.bound).to.equal(true);
                controller.removeBehaviors([behavior]);
                expect(behavior.bound).to.equal(true);
                controller.removeBehaviors([behavior]);
                expect(behavior.bound).to.equal(true);
                controller.removeBehaviors([behavior]);
                expect(behavior.bound).to.equal(false);
            });
            it("should unbind a behavior whenever the behavior is removed with the force argument", () => {
                class TestBehavior implements Behavior {
                    public bound = false;
                    bind() {
                        this.bound = true;
                    }

                    unbind() {
                        this.bound = false;
                    }
                }

                const behavior = new TestBehavior();
                const { element, controller } = createController();

                document.body.appendChild(element);

                controller.addBehaviors([behavior]);
                controller.addBehaviors([behavior]);

                expect(behavior.bound).to.equal(true);
                controller.removeBehaviors([behavior], true);
                expect(behavior.bound).to.equal(false);
            });
        })
});
