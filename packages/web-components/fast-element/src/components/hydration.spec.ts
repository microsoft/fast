import chai, { expect } from "chai";
import { css, HostBehavior, Updates } from "../index.js";
import { html } from "../templating/template.js";
import { uniqueElementName } from "../testing/exports.js";
import { ElementController } from "./element-controller.js";
import { FASTElementDefinition, PartialFASTElementDefinition } from "./fast-definitions.js";
import { FASTElement } from "./fast-element.js";
import { HydratableElementController } from "./hydration.js";
import spies from "chai-spies";

chai.use(spies)

describe("The HydratableElementController", () => {
    beforeEach(() => {
        HydratableElementController.install();
    })
    afterEach(() => {
        ElementController.setStrategy(ElementController);
    })
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

        const element = document.createElement(name) as FASTElement;
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

    it("A FASTElement's controller should be an instance of HydratableElementController after invoking 'addHydrationSupport'", () => {
        const { element } = createController()

        expect(element.$fastController).to.be.instanceOf(HydratableElementController);
    });

    describe("without the `defer-hydration` attribute on connection", () => {
        it("should render the element's template", async () => {
            const { element } = createController({template: html`<p>Hello world</p>`})

            document.body.appendChild(element);
            await Updates.next();
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
    })

    describe("with the `defer-hydration` is set before connection", () => {
        it("should not render the element's template", async () => {
            const { element } = createController({template: html`<p>Hello world</p>`})

            element.setAttribute('defer-hydration', '');
            document.body.appendChild(element);
            await Updates.next();
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
    })

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
    })
});
