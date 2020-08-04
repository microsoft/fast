import { expect } from "chai";
import { FASTElementDefinition, PartialFASTElementDefinition } from "./fast-definitions";
import { Controller } from "./controller";
import { FASTElement } from "./fast-element";
import { uniqueElementName, toHTML } from "./__test__/helpers";
import { html } from "./template";
import { DOM } from "./dom";
import { css } from "./styles";

describe("The Controller", () => {
    const templateA = html`
        a
    `;
    const templateB = html`
        b
    `;
    const cssA = "class-a { color: red; }";
    const stylesA = css`
        ${cssA}
    `;
    const cssB = "class-b { color: blue; }";
    const stylesB = css`
        ${cssB}
    `;

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
});
