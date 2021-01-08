import { FASTElement, FASTElementDefinition } from "@microsoft/fast-element";
import { expect } from "chai";
import { Container } from "../di";
import { uniqueElementName } from "../fixture";
import { DefineElement, DesignSystem, ElementPrefix } from "./design-system";

describe("DesignSystem", () => {
    it("Should initialize with a default prefix of 'fast'", () => {
        const host = document.createElement("div");
        const container = new DesignSystem().applyTo(host);

        expect(container.get(ElementPrefix)).to.equal("fast");
    });

    it("Should initialize with a provided prefix", () => {
        const host = document.createElement("div");
        const container = new DesignSystem().withPrefix("custom").applyTo(host);

        expect(container.get(ElementPrefix)).to.equal("custom");
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
                    capturedDefine = container.get(DefineElement);
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
                    capturePrefix = container.get(ElementPrefix);
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
                const defineElement = container.get(DefineElement);
                defineElement(customElement, elementName);
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
                        const defineElement = container.get(DefineElement);
                        defineElement(class extends HTMLElement {}, elementName);
                    },
                },
                {
                    register(container: Container) {
                        const defineElement = container.get(DefineElement);
                        defineElement(class extends HTMLElement {}, elementName);
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
                    const defineElement = container.get(DefineElement);
                    defineElement(customElement, elementName);
                },
            },
            {
                register(container: Container) {
                    const defineElement = container.get(DefineElement);
                    defineElement(class extends HTMLElement {}, elementName);
                },
            }
        );

        expect(() => system.applyTo(host)).not.to.throw();
        expect(customElements.get(elementName)).to.equal(customElement);
    });

    // it("should allow registry and retrieval of a default template by element name", () => {
    //     const conf = new ConfigurationImpl();
    //     const template = html``;

    //     conf.setDefaultTemplateFor("my-element", template);

    //     expect(conf.getDefaultTemplateFor("my-element")).to.equal(template);
    // });

    // it("should allow registry and retrieval of a default style by element name", () => {
    //     const conf = new ConfigurationImpl();
    //     const styles = css``;

    //     conf.setDefaultStylesFor("my-element", styles);

    //     expect(conf.getDefaultStylesFor("my-element")).to.equal(styles);
    // });

    // it("should allow registration of custom elements with registerElement()", () => {
    //     class MyEl extends FASTElement {}

    //     new ConfigurationImpl().registerElement(MyEl, { name: "my-element" });

    //     expect(customElements.get("my-element")).to.equal(MyEl);
    // });

    // describe(".forComponent", () => {
    //     it("should register an element, default template, and default styles for a Configuration", () => {
    //         const conf = new ConfigurationImpl();
    //         const styles = css``;
    //         const template = html``;
    //         const baseName = "element";
    //         class MyElement extends FASTElement {}

    //         const myElement = ConfigurationImpl.forComponent({
    //             styles,
    //             template,
    //             baseName,
    //             type: MyElement,
    //         });

    //         conf.register(myElement());

    //         expect(conf.getDefaultStylesFor("element")).to.equal(styles);
    //         expect(conf.getDefaultTemplateFor("element")).to.equal(template);
    //         expect(customElements.get(`${conf.prefix}-${baseName}`)).to.equal(MyElement);
    //     });

    //     it("should provider opportunity to override template, styles, prefix, and baseName of a registry for a configuration", () => {
    //         const conf = new ConfigurationImpl();
    //         class MyElement extends FASTElement {}

    //         const myElement = ConfigurationImpl.forComponent({
    //             styles: css``,
    //             template: html``,
    //             baseName: "foo",
    //             type: MyElement,
    //         });

    //         const overrides = {
    //             prefix: "my",
    //             baseName: "custom-element",
    //             styles: css``,
    //             template: html``,
    //         };

    //         conf.register(myElement(overrides));

    //         expect(conf.getDefaultStylesFor("foo")).to.equal(null);
    //         expect(conf.getDefaultTemplateFor("foo")).to.equal(null);
    //         expect(customElements.get(`foo`)).to.equal(undefined);

    //         expect(conf.getDefaultStylesFor(overrides.baseName)).to.equal(
    //             overrides.styles
    //         );
    //         expect(conf.getDefaultTemplateFor(overrides.baseName)).to.equal(
    //             overrides.template
    //         );
    //         expect(
    //             customElements.get(`${overrides.prefix}-${overrides.baseName}`)
    //         ).to.equal(MyElement);
    //     });
    // });
});
