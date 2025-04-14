import chai, { expect } from "chai";
import { css, HostBehavior, Updates } from "../index.js";
import { html } from "../templating/template.js";
import { uniqueElementName } from "../testing/exports.js";
import { ElementController, HydratableElementController } from "./element-controller.js";
import { FASTElementDefinition, PartialFASTElementDefinition } from "./fast-definitions.js";
import { FASTElement } from "./fast-element.js";
import spies from "chai-spies";
import { HydrationMarkup } from "./hydration.js";

chai.use(spies)

describe("The HydratableElementController", () => {
    beforeEach(() => {
        HydratableElementController.install();
    })
    afterEach(() => {
        ElementController.setStrategy(ElementController);
    })
    function createController<T extends ElementController>(
        config: Omit<PartialFASTElementDefinition, "name"> = {},
        BaseClass = FASTElement,
    ) {
        const name = uniqueElementName();
        const definition = FASTElementDefinition.compose(
            class ControllerTest extends BaseClass {
                static definition = { ...config, name };
            }
        ).define();

        const element = document.createElement(name) as FASTElement;
        element.setAttribute("needs-hydration", "");
        const controller = ElementController.forCustomElement(element) as T;

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

    it("A FASTElement's controller should be an instance of HydratableElementController after invoking 'addHydrationSupport'", () => {
        const { element } = createController()

        expect(element.$fastController).to.be.instanceOf(HydratableElementController);
    });

    it("should remove the needs-hydration attribute after connection", () => {
        const { controller, element } = createController();

        expect(element.hasAttribute("needs-hydration")).to.equal(true);
        controller.connect();
        expect(element.hasAttribute("needs-hydration")).to.equal(false);
    });

    describe("without the `defer-hydration` attribute on connection", () => {
        it("should render the element's template", async () => {
            const { element } = createController({template: html`<p>Hello world</p>`})

            document.body.appendChild(element);
            expect(element.shadowRoot?.innerHTML).to.be.equal("<p>Hello world</p>");
            document.body.removeChild(element)
        });
        it("should apply the element's main stylesheet", async () => {
            const { element } = createController({styles: css`:host{ color :red}`})

            document.body.appendChild(element);
            expect(element.$fastController.mainStyles?.isAttachedTo(element)).to.be.true;
            document.body.removeChild(element)
        });
        it("should invoke a HostBehavior's connectedCallback", async () => {
            const behavior: HostBehavior = {
                connectedCallback: chai.spy(() => {})
            }

            const { element, controller } = createController()
            controller.addBehavior(behavior);

            document.body.appendChild(element);
            expect(behavior.connectedCallback).to.have.been.called()
            document.body.removeChild(element)
        });
    });

    describe("with the `defer-hydration` is set before connection", () => {
        it("should not render the element's template", async () => {
            const { element } = createController({template: html`<p>Hello world</p>`})

            element.setAttribute('defer-hydration', '');
            document.body.appendChild(element);
            expect(element.shadowRoot?.innerHTML).be.equal("");
            document.body.removeChild(element)
        });
        it("should not attach the element's main stylesheet", async () => {
            const { element } = createController({styles: css`:host{ color :red}`})

            element.setAttribute('defer-hydration', '');
            document.body.appendChild(element);
            expect(element.$fastController.mainStyles?.isAttachedTo(element)).to.be.false;
            document.body.removeChild(element)
        });
        it("should not invoke a HostBehavior's connectedCallback", async () => {
            const behavior: HostBehavior = {
                connectedCallback: chai.spy(() => {})
            }

            const { element, controller } = createController()
            element.setAttribute('defer-hydration', '')
            controller.addBehavior(behavior);

            document.body.appendChild(element);
            expect(behavior.connectedCallback).not.to.have.been.called()
            document.body.removeChild(element)
        });

        it("should  defer connection when 'needsHydration' is assigned false and 'defer-hydration' attribute exists", async () => {
            class Controller extends HydratableElementController {
                needsHydration = false;
            }

            ElementController.setStrategy(Controller)
            const { element, controller } = createController<Controller>({template: html`<p>Hello world</p>`})
            element.setAttribute('defer-hydration', '')
            controller.connect();
            expect(controller.isConnected).to.equal(false);
            await Updates.next();
            element.removeAttribute('defer-hydration');
            expect(controller.isConnected).to.equal(true);
            ElementController.setStrategy(HydratableElementController)
        })
    });

    describe("when the `defer-hydration` attribute removed after connection", () => {
        it("should render the element's template", async () => {
            const { element } = createController({template: html`<p>Hello world</p>`})

            element.setAttribute('defer-hydration', '');
            document.body.appendChild(element);
            await Updates.next();
            expect(element.shadowRoot?.innerHTML).be.equal("");
            element.removeAttribute('defer-hydration')
            await Updates.next();
            expect(element.shadowRoot?.innerHTML).to.be.equal("<p>Hello world</p>");
            document.body.removeChild(element)
        });
        it("should attach the element's main stylesheet", async () => {
            const { element } = createController({styles: css`:host{ color :red}`})

            element.setAttribute('defer-hydration', '');
            document.body.appendChild(element);
            expect(element.$fastController.mainStyles?.isAttachedTo(element)).to.be.false;
            element.removeAttribute('defer-hydration');
            await Updates.next();
            expect(element.$fastController.mainStyles?.isAttachedTo(element)).to.be.true;
            document.body.removeChild(element);
        });
        it("should invoke a HostBehavior's connectedCallback", async () => {
            const behavior: HostBehavior = {
                connectedCallback: chai.spy(() => {})
            }

            const { element, controller } = createController()
            element.setAttribute('defer-hydration', '')
            controller.addBehavior(behavior);

            document.body.appendChild(element);
            expect(behavior.connectedCallback).not.to.have.been.called();
            element.removeAttribute('defer-hydration');
            await Updates.next();
            expect(behavior.connectedCallback).to.have.been.called();
            document.body.removeChild(element)
        });
    });
});

describe("HydrationMarkup", () => {
    describe("content bindings", () => {
        it("isContentBindingStartMarker should return true when provided the output of isBindingStartMarker", () => {
            expect(HydrationMarkup.isContentBindingStartMarker(HydrationMarkup.contentBindingStartMarker(12, "foobar"))).to.equal(true);
        });
        it("isContentBindingStartMarker should return false when provided the output of isBindingEndMarker", () => {
            expect(HydrationMarkup.isContentBindingStartMarker(HydrationMarkup.contentBindingEndMarker(12, "foobar"))).to.equal(false);
        });
        it("isContentBindingEndMarker should return true when provided the output of isBindingEndMarker", () => {
            expect(HydrationMarkup.isContentBindingEndMarker(HydrationMarkup.contentBindingEndMarker(12, "foobar"))).to.equal(true);
        });
        it("isContentBindingStartMarker should return false when provided the output of isBindingEndMarker", () => {
            expect(HydrationMarkup.isContentBindingStartMarker(HydrationMarkup.contentBindingEndMarker(12, "foobar"))).to.equal(false);
        });

        it("parseContentBindingStartMarker should return null when not provided a start marker", () => {
            expect(HydrationMarkup.parseContentBindingStartMarker(HydrationMarkup.contentBindingEndMarker(12, "foobar"))).to.equal(null)
        })
        it("parseContentBindingStartMarker should the index and id arguments to contentBindingStartMarker", () => {
            expect(HydrationMarkup.parseContentBindingStartMarker(HydrationMarkup.contentBindingStartMarker(12, "foobar"))).to.eql([12, "foobar"])
        });
        it("parseContentBindingEndMarker should return null when not provided an end marker", () => {
            expect(HydrationMarkup.parseContentBindingEndMarker(HydrationMarkup.contentBindingStartMarker(12, "foobar"))).to.equal(null)
        })
        it("parseContentBindingEndMarker should the index and id arguments to contentBindingEndMarker", () => {
            expect(HydrationMarkup.parseContentBindingEndMarker(HydrationMarkup.contentBindingEndMarker(12, "foobar"))).to.eql([12, "foobar"])
        });
    });

    describe("attribute binding parser", () => {
        it("should return null when the element does not have an attribute marker", () => {
            expect(HydrationMarkup.parseAttributeBinding(document.createElement("div"))).to.equal(null)
        });
        it("should return the binding ids as numbers when assigned a marker attribute", () => {
            const el = document.createElement("div");
            el.setAttribute(HydrationMarkup.attributeMarkerName, "0 1 2");
            expect(HydrationMarkup.parseAttributeBinding(el)).to.eql([0, 1, 2]);
        });
    });

    describe("repeat parser", () => {
        it("isRepeatViewStartMarker should return true when provided the output of repeatStartMarker", () => {
            expect(HydrationMarkup.isRepeatViewStartMarker(HydrationMarkup.repeatStartMarker(12))).to.equal(true);
        });
        it("isRepeatViewStartMarker should return false when provided the output of repeatEndMarker", () => {
            expect(HydrationMarkup.isRepeatViewStartMarker(HydrationMarkup.repeatEndMarker(12))).to.equal(false);
        });
        it("isRepeatViewEndMarker should return true when provided the output of repeatEndMarker", () => {
            expect(HydrationMarkup.isRepeatViewEndMarker(HydrationMarkup.repeatEndMarker(12))).to.equal(true);
        });
        it("isRepeatViewEndMarker should return false when provided the output of repeatStartMarker", () => {
            expect(HydrationMarkup.isRepeatViewEndMarker(HydrationMarkup.repeatStartMarker(12))).to.equal(false);
        });

        it("parseRepeatStartMarker should return null when not provided a start marker", () => {
            expect(HydrationMarkup.parseRepeatStartMarker(HydrationMarkup.repeatEndMarker(12))).to.equal(null)
        })
        it("parseRepeatStartMarker should the index and id arguments to repeatStartMarker", () => {
            expect(HydrationMarkup.parseRepeatStartMarker(HydrationMarkup.repeatStartMarker(12))).to.eql(12)
        });
        it("parseRepeatEndMarker should return null when not provided an end marker", () => {
            expect(HydrationMarkup.parseRepeatEndMarker(HydrationMarkup.repeatStartMarker(12))).to.equal(null)
        })
        it("parseRepeatEndMarker should the index and id arguments to repeatEndMarker", () => {
            expect(HydrationMarkup.parseRepeatEndMarker(HydrationMarkup.repeatEndMarker(12))).to.eql(12)
        });
    })
})
