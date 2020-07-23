import { expect } from "chai";
import { FASTElementDefinition, PartialFASTElementDefinition } from "./fast-definitions";
import { Controller } from "./controller";
import { FASTElement } from "./fast-element";
import { uniqueElementName } from "./__test__/helpers";

describe("The Controller", () => {
    function createController(config: Omit<PartialFASTElementDefinition, "name"> = {}) {
        const name = uniqueElementName();
        const definition = new FASTElementDefinition(
            class ControllerTest extends FASTElement {
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
        };
    }

    context("during construction", () => {
        it("if no shadow options defined, uses open shadow dom", () => {
            const { element } = createController();
            expect(element.shadowRoot).to.be.instanceOf(ShadowRoot);
        });

        it("if shadow options open, uses open shadow dom", () => {
            const { element } = createController({ shadowOptions: { mode: "open" } });
            expect(element.shadowRoot).to.be.instanceOf(ShadowRoot);
        });

        it("if shadow options nullled, does not create shadow root", () => {
            const { element } = createController({ shadowOptions: null });
            expect(element.shadowRoot).to.equal(null);
        });

        it("if shadow options closed, does not expose shadow root", () => {
            const { element } = createController({ shadowOptions: { mode: "closed" } });
            expect(element.shadowRoot).to.equal(null);
        });

        it("does not attach view to shadow root", () => {
            const { element } = createController();
            expect(element.shadowRoot?.childNodes.length).to.equal(0);
        });
    });
});
