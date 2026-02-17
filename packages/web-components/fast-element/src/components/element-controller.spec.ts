import chai, { expect } from "chai";
import { ElementStyles } from "../index.debug.js";
import type { HostBehavior, HostController } from "../styles/host.js";
import { observable, Observable } from "../observation/observable.js";
import { css } from "../styles/css.js";
import { html } from "../templating/template.js";
import { uniqueElementName } from "../testing/fixture.js";
import { toHTML } from "../__test__/helpers.js";
import { ElementController } from "./element-controller.js";
import { FASTElementDefinition, PartialFASTElementDefinition } from "./fast-definitions.js";
import { FASTElement } from "./fast-element.js";
import spies from "chai-spies";

chai.use(spies);

describe("The ElementController", () => {
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
        const definition = FASTElementDefinition.compose(
            class ControllerTest extends BaseClass {
                static definition = { ...config, name };
            }
        ).define();

        const element = document.createElement(name);
        const controller = ElementController.forCustomElement(element);

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
            controller.connect();
            expect(toHTML(shadowRoot)).to.equal("");
        });

        it("renders nothing to light dom in light dom mode when there's no template", () => {
            const { element, controller } = createController({ shadowOptions: null });

            expect(toHTML(element)).to.equal("");
            controller.connect();
            expect(toHTML(element)).to.equal("");
        });

        it("renders a template to shadow dom in shadow dom mode", () => {
            const { shadowRoot, controller } = createController({ template: templateA });

            expect(toHTML(shadowRoot)).to.equal("");
            controller.connect();
            expect(toHTML(shadowRoot)).to.equal("a");
        });

        it("renders a template to light dom in light dom mode", () => {
            const { controller, element } = createController({
                shadowOptions: null,
                template: templateA,
            });

            expect(toHTML(element)).to.equal("");
            controller.connect();
            expect(toHTML(element)).to.equal("a");
        });

        it("renders a template override to shadow dom when set", () => {
            const { shadowRoot, controller } = createController({ template: templateA });

            expect(toHTML(shadowRoot)).to.equal("");
            controller.template = templateB;
            expect(toHTML(shadowRoot)).to.equal("");
            controller.connect();
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
            controller.connect();
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
            controller.connect();
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
            controller.connect();
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
            controller.connect();
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
            controller.connect();
            expect(toHTML(element)).to.equal("b");
        });

        if (ElementStyles.supportsAdoptedStyleSheets) {
            it("sets no styles when none are provided", () => {
                const { shadowRoot, controller } = createController();

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.connect();
                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
            });

            it("sets styles when provided", () => {
                const { shadowRoot, controller } = createController({ styles: stylesA });

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.connect();
                expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].cssText).to.equal(
                    cssA
                );
            });

            it("renders style override when set", () => {
                const { shadowRoot, controller } = createController({ styles: stylesA });

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.mainStyles = stylesB;
                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.connect();
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
                controller.connect();
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
                controller.mainStyles = stylesB;
                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.connect();
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
            controller.connect();
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
            controller.connect();
            expect(toHTML(element)).to.equal("a");

            controller.template = templateB;
            expect(toHTML(element)).to.equal("b");
        });

        if (ElementStyles.supportsAdoptedStyleSheets) {
            it("can dynamically change the styles", () => {
                const { shadowRoot, controller } = createController({ styles: stylesA });

                expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
                controller.connect();
                expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].cssText).to.equal(
                    cssA
                );

                controller.mainStyles = stylesB;
                expect(shadowRoot.adoptedStyleSheets.length).to.equal(1);
                expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].cssText).to.equal(
                    cssB
                );
            });
        }
    });

    it("should use itself as the notifier", () => {
        const { controller } = createController();
        const notifier = Observable.getNotifier(controller);
        expect(notifier).to.equal(controller);
    });

    it("should have an observable isConnected property", () => {
        const { element, controller } = createController();
        let attached = controller.isConnected;
        const handler = { handleChange: () => {attached = controller.isConnected} };
        Observable.getNotifier(controller).subscribe(handler, "isConnected");

        expect(attached).to.equal(false);
        document.body.appendChild(element);
        expect(attached).to.equal(true);
        document.body.removeChild(element);
        expect(attached).to.equal(false);
    });

    it("should raise cancelable custom events by default", () => {
        const { controller, element } = createController();
        let cancelable = false;

        controller.connect();
        element.addEventListener('my-event', (e: Event) => {
            cancelable = e.cancelable;
        });

        controller.emit('my-event');

        expect(cancelable).to.be.true;
    });

    it("should raise bubble custom events by default", () => {
        const { controller, element } = createController();
        let bubbles = false;

        controller.connect();
        element.addEventListener('my-event', (e: Event) => {
            bubbles = e.bubbles;
        });

        controller.emit('my-event');

        expect(bubbles).to.be.true;
    });

    it("should raise composed custom events by default", () => {
        const { controller, element } = createController();
        let composed = false;

        controller.connect();
        element.addEventListener('my-event', (e: Event) => {
            composed = e.composed;
        });

        controller.emit('my-event');

        expect(composed).to.be.true;
    });

    it("should attach and detach the HTMLStyleElement supplied to styles.add() and styles.remove() to the shadowRoot", () => {
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
            class TestBehavior implements HostBehavior {
                public bound = false;

                connectedCallback() {
                    this.bound = true;
                }
                disconnectedCallback() {
                    this.bound = false;
                }
            }

            const behaviors = [new TestBehavior(), new TestBehavior(), new TestBehavior()];
            const { controller, element } = createController();
            behaviors.forEach(x => controller.addBehavior(x));

            behaviors.forEach(x => expect(x.bound).to.equal(false))

            document.body.appendChild(element);

            behaviors.forEach(x => expect(x.bound).to.equal(true));
        });

        it("should bind a behavior B that is added to the Controller by behavior A, where A is added prior to connection and B is added during A's bind()", () => {
            let childBehaviorBound = false;
            class ParentBehavior implements HostBehavior {
                addedCallback(controller: HostController<any>): void {
                    controller.addBehavior(new ChildBehavior())
                }
            }

            class ChildBehavior implements HostBehavior {
                connectedCallback(controller: HostController<any>) {
                    childBehaviorBound = true;
                }
            }

            const { element, controller } = createController();
            controller.addBehavior(new ParentBehavior());
            document.body.appendChild(element);

            expect(childBehaviorBound).to.equal(true);
        });

        it("should disconnect a behavior B that is added to the Controller by behavior A, where A removes B during disconnection", () => {
            class ParentBehavior implements HostBehavior {
                public child = new ChildBehavior();
                connectedCallback(controller: HostController<any>): void {
                    controller.addBehavior(this.child);
                }

                disconnectedCallback(controller) {
                    controller.removeBehavior(this.child);
                }
            }

            const disconnected = chai.spy();
            class ChildBehavior implements HostBehavior {
                disconnectedCallback = disconnected
            }

            const { controller } = createController();
            const behavior = new ParentBehavior();
            controller.addBehavior(behavior);
            controller.connect();
            controller.disconnect();

            expect(behavior.child.disconnectedCallback).to.have.been.called();
        });

        it("should unbind a behavior only when the behavior is removed the number of times it has been added", () => {
            class TestBehavior implements HostBehavior {
                public bound = false;

                connectedCallback() {
                    this.bound = true;
                }

                disconnectedCallback() {
                    this.bound = false;
                }
            }

            const behavior = new TestBehavior();
            const { element, controller } = createController();

            document.body.appendChild(element);

            controller.addBehavior(behavior);
            controller.addBehavior(behavior);
            controller.addBehavior(behavior);

            expect(behavior.bound).to.equal(true);
            controller.removeBehavior(behavior);
            expect(behavior.bound).to.equal(true);
            controller.removeBehavior(behavior);
            expect(behavior.bound).to.equal(true);
            controller.removeBehavior(behavior);
            expect(behavior.bound).to.equal(false);
        });
        it("should unbind a behavior whenever the behavior is removed with the force argument", () => {
            class TestBehavior implements HostBehavior {
                public bound = false;

                connectedCallback() {
                    this.bound = true;
                }

                disconnectedCallback() {
                    this.bound = false;
                }
            }

            const behavior = new TestBehavior();
            const { element, controller } = createController();

            document.body.appendChild(element);

            controller.addBehavior(behavior);
            controller.addBehavior(behavior);

            expect(behavior.bound).to.equal(true);
            controller.removeBehavior(behavior, true);
            expect(behavior.bound).to.equal(false);
        });

        it("should connect behaviors added by stylesheets by .addStyles() during connection and disconnect them during disconnection", () => {
            const { controller } = createController();
            const behavior: HostBehavior = {
                connectedCallback: chai.spy(),
                disconnectedCallback: chai.spy()
            };
            controller.addStyles(css``.withBehaviors(behavior));

            controller.connect();
            expect(behavior.connectedCallback).to.have.been.called;

            controller.disconnect();
            expect(behavior.disconnectedCallback).to.have.been.called;
        });

        it("should connect behaviors added by the component's main stylesheet during connection and disconnect them during disconnection", () => {
            const behavior: HostBehavior = {
                connectedCallback: chai.spy(),
                disconnectedCallback: chai.spy()
            };
            const { controller } = createController({styles: css``.withBehaviors(behavior)});
            controller.connect();

            expect(behavior.connectedCallback).to.have.been.called();

            controller.disconnect();
            expect(behavior.disconnectedCallback).to.have.been.called();
        });
        it("should add behaviors added by a stylesheet when added and remove them the stylesheet is removed", () => {
            const behavior: HostBehavior = {
                addedCallback: chai.spy(),
                removedCallback: chai.spy()
            };
            const styles = css``.withBehaviors(behavior)
            const { controller } = createController();
            controller.addStyles(styles)

            expect(behavior.addedCallback).to.have.been.called();

            controller.removeStyles(styles);
            expect(behavior.removedCallback).to.have.been.called();
        });
    });

    context("with pre-existing shadow dom on the host", () => {
        it("re-renders the view during connect", async () => {
            const name = uniqueElementName();
            const element = document.createElement(name);
            const root = element.attachShadow({ mode: 'open' });
            root.innerHTML = 'Test 1';

            document.body.append(element);

            FASTElementDefinition.compose(
                class TestElement extends FASTElement {
                    static definition = {
                        name,
                        template: html`Test 2`
                    };
                }
            ).define();

            expect(root.innerHTML).to.equal("Test 2");

            document.body.removeChild(element);
        });
    });

    it("should ensure proper invocation order of state, rendering, and behaviors during connection and disconnection", () => {
        const order: string[] = [];
        const name = uniqueElementName();
        const template = new Proxy(html``, { get(target, p, receiver) {
            if (p === "render") { order.push("template rendered") }

            return Reflect.get(target, p, receiver);
        }});

        class Test extends FASTElement {
            @observable
            observed = true;
            observedChanged() {
                if (this.observed) {
                    order.push("observables bound")
                }
            }
        }

        Test.compose({
            name,
            template
        }).define();

        const element = document.createElement(name);
        const controller = ElementController.forCustomElement(element);
        Observable.getNotifier(controller).subscribe({
            handleChange() {
                order.push(`isConnected set ${controller.isConnected}`);
            }
        }, "isConnected")
        controller.addBehavior({
            connectedCallback() {
                order.push("parent behavior connected");
                controller.addBehavior({
                    connectedCallback() {
                        order.push("child behavior connected")
                    },
                    disconnectedCallback() {
                        order.push('child behavior disconnected')
                    }
                })
            },
            disconnectedCallback() { order.push("parent behavior disconnected")}
        });

        controller.connect();

        expect(order[0]).to.equal("observables bound");
        expect(order[1]).to.equal("parent behavior connected");
        expect(order[2]).to.equal("child behavior connected");
        expect(order[3]).to.equal("template rendered");
        expect(order[4]).to.equal("isConnected set true");

        controller.disconnect();

        expect(order[5]).to.equal('isConnected set false');
        expect(order[6]).to.equal('parent behavior disconnected');
        expect(order[7]).to.equal('child behavior disconnected');
    });

    it("should not throw if DOM stringified", () => {
        const controller = createController();

        expect(() => {
            JSON.stringify(controller.element);
        }).to.not.throw();
    });
});
