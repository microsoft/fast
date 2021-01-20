import { FASTElement, FASTElementDefinition } from "@microsoft/fast-element";
import { expect } from "chai";
import { Container } from "../di";
import { uniqueElementName } from "../fixture";
import { DesignSystem, DesignSystemContext } from "./design-system";

describe("DesignSystem", () => {
    it("Should initialize with a default prefix of 'fast'", () => {
        const host = document.createElement("div");
        const container = new DesignSystem().applyTo(host);

        expect(container.get(DesignSystemContext).elementPrefix).to.equal("fast");
    });

    it("Should initialize with a provided prefix", () => {
        const host = document.createElement("div");
        const container = new DesignSystem().withPrefix("custom").applyTo(host);

        expect(container.get(DesignSystemContext).elementPrefix).to.equal("custom");
    });

    it("Should apply registries to the container", () => {
        let capturedContainer: Container | null = null;
        const host = document.createElement("div");
        const container = new DesignSystem()
            .register({
                register(container: Container) {
                    capturedContainer = container;
                },
            })
            .applyTo(host);

        expect(capturedContainer).to.equal(container);
    });

    it("Should provide a way for registries to define elements", () => {
        let capturedDefine: typeof FASTElement.define | null = null;
        const host = document.createElement("div");
        new DesignSystem()
            .register({
                register(container: Container) {
                    capturedDefine = container.get(DesignSystemContext).defineElement;
                },
            })
            .applyTo(host);

        expect(capturedDefine).to.not.be.null;
    });

    it("Should provide a way for registries to get the default prefix", () => {
        let capturePrefix: string | null = null;
        const host = document.createElement("div");
        new DesignSystem()
            .withPrefix("custom")
            .register({
                register(container: Container) {
                    capturePrefix = container.get(DesignSystemContext).elementPrefix;
                },
            })
            .applyTo(host);

        expect(capturePrefix).to.equal("custom");
    });

    it("Should register elements when applied", () => {
        const elementName = uniqueElementName();
        const customElement = class extends HTMLElement {};
        const host = document.createElement("div");
        const system = new DesignSystem().register({
            register(container: Container) {
                const context = container.get(DesignSystemContext);
                context.defineElement(customElement, elementName);
            },
        });

        expect(customElements.get(elementName)).to.be.undefined;

        system.applyTo(host);

        expect(customElements.get(elementName)).to.equal(customElement);
    });

    it("Should detect duplicate elements and allow disambiguation", () => {
        const elementName = uniqueElementName();
        const elementName2 = uniqueElementName();
        const host = document.createElement("div");
        let capturedDefinition: FASTElementDefinition | null = null;
        const system = new DesignSystem()
            .withElementDisambiguation((existing, attempting) => {
                capturedDefinition = existing;
                return new FASTElementDefinition(attempting.type, elementName2);
            })
            .register(
                {
                    register(container: Container) {
                        const context = container.get(DesignSystemContext);
                        context.defineElement(class extends HTMLElement {}, elementName);
                    },
                },
                {
                    register(container: Container) {
                        const context = container.get(DesignSystemContext);
                        context.defineElement(class extends HTMLElement {}, elementName);
                    },
                }
            )
            .applyTo(host);

        expect(capturedDefinition).to.not.be.null;
        expect(customElements.get(elementName)).to.not.be.undefined;
        expect(customElements.get(elementName2)).to.not.be.undefined;
    });

    it("Should skip defining duplicate elements by default", () => {
        const elementName = uniqueElementName();
        const customElement = class extends HTMLElement {};
        const host = document.createElement("div");
        const system = new DesignSystem().register(
            {
                register(container: Container) {
                    const context = container.get(DesignSystemContext);
                    context.defineElement(customElement, elementName);
                },
            },
            {
                register(container: Container) {
                    const context = container.get(DesignSystemContext);
                    context.defineElement(class extends HTMLElement {}, elementName);
                },
            }
        );

        expect(() => system.applyTo(host)).not.to.throw();
        expect(customElements.get(elementName)).to.equal(customElement);
    });
});
