import type { Constructable } from "@microsoft/fast-element";
import { expect } from "chai";
import type { Container } from "../di";
import { uniqueElementName } from "../fixture";
import { DesignSystem, DesignSystemRegistrationContext } from "./design-system";

describe("DesignSystem", () => {
    it("Should initialize with a default prefix of 'fast'", () => {
        const host = document.createElement("div");
        const container = new DesignSystem().applyTo(host);

        expect(container.get(DesignSystemRegistrationContext).elementPrefix).to.equal(
            "fast"
        );
    });

    it("Should initialize with a provided prefix", () => {
        const host = document.createElement("div");
        const container = new DesignSystem().withPrefix("custom").applyTo(host);

        expect(container.get(DesignSystemRegistrationContext).elementPrefix).to.equal(
            "custom"
        );
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
        let capturedDefine: any;
        const host = document.createElement("div");
        new DesignSystem()
            .register({
                register(container: Container) {
                    capturedDefine = container.get(DesignSystemRegistrationContext)
                        .tryDefineElement;
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
                    capturePrefix = container.get(DesignSystemRegistrationContext)
                        .elementPrefix;
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
                const context = container.get(DesignSystemRegistrationContext);
                context.tryDefineElement(elementName, customElement, x =>
                    x.defineElement()
                );
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
        let capturedType: Constructable | null = null;
        const system = new DesignSystem()
            .withElementDisambiguation((name, type, existingType) => {
                capturedType = existingType;
                return elementName2;
            })
            .register(
                {
                    register(container: Container) {
                        const context = container.get(DesignSystemRegistrationContext);
                        context.tryDefineElement(
                            elementName,
                            class extends HTMLElement {},
                            x => x.defineElement()
                        );
                    },
                },
                {
                    register(container: Container) {
                        const context = container.get(DesignSystemRegistrationContext);
                        context.tryDefineElement(
                            elementName,
                            class extends HTMLElement {},
                            x => x.defineElement()
                        );
                    },
                }
            )
            .applyTo(host);

        expect(capturedType).to.not.be.null;
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
                    const context = container.get(DesignSystemRegistrationContext);
                    context.tryDefineElement(elementName, customElement, x =>
                        x.defineElement()
                    );
                },
            },
            {
                register(container: Container) {
                    const context = container.get(DesignSystemRegistrationContext);
                    context.tryDefineElement(
                        elementName,
                        class extends HTMLElement {},
                        x => x.defineElement()
                    );
                },
            }
        );

        expect(() => system.applyTo(host)).not.to.throw();
        expect(customElements.get(elementName)).to.equal(customElement);
    });
});
