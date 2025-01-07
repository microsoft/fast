import { Constructable, DOM } from "@ni/fast-element";
import { expect } from "chai";
import { FoundationElement } from "..";
import { Container, DI, Registration } from "../di";
import { uniqueElementName } from "../test-utilities/fixture";
import { DesignSystem, ElementDisambiguation } from "./design-system";
import type { DesignSystemRegistrationContext } from "./registration-context";
import { DesignToken } from "../design-token/design-token";

describe("DesignSystem", () => {
    it("Should return the same instance for the same element", () => {
        const host = document.createElement("div");
        const ds1 = DesignSystem.getOrCreate(host);
        const ds2 = DesignSystem.getOrCreate(host);

        expect(ds1).to.equal(ds2);
    });

    it("Should find the responsible design system for an element in the hierarchy", () => {
        const host = document.createElement("div");
        const child = document.createElement("div");
        host.appendChild(child);

        const ds1 = DesignSystem.getOrCreate(host);
        const ds2 = DesignSystem.responsibleFor(child);

        expect(ds1).to.equal(ds2);
    });

    it("Should initialize with a default prefix of 'fast'", () => {
        const host = document.createElement("div");
        let prefix = '';

        DesignSystem.getOrCreate(host)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    prefix = context.elementPrefix;
                }
            });

        expect(prefix).to.equal("fast");
    });

    it("Should initialize with a provided prefix", () => {
        const host = document.createElement("div");
        let prefix = '';

        DesignSystem.getOrCreate(host)
            .withPrefix("custom")
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    prefix = context.elementPrefix;
                }
            });

        expect(prefix).to.equal("custom");
    });

    it("Should apply registries to the container associated with the host", () => {
        let capturedContainer: Container | null = null;
        const host = document.createElement("div");

        DesignSystem.getOrCreate(host)
            .register({
                register(container: Container) {
                    capturedContainer = container;
                },
            });

        const container = DI.getOrCreateDOMContainer(host);
        expect(container).equals(capturedContainer);
    });

    it("Should provide a way for registries to define elements", () => {
        let capturedDefine: any;
        const host = document.createElement("div");
        DesignSystem.getOrCreate(host)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    capturedDefine = context.tryDefineElement;
                },
            });

        expect(capturedDefine).to.not.be.null;
    });

    it("Should provide a way for registries to get the default prefix", () => {
        let capturePrefix: string | null = null;
        const host = document.createElement("div");
        DesignSystem.getOrCreate(host)
            .withPrefix("custom")
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    capturePrefix = context.elementPrefix;
                },
            });

        expect(capturePrefix).to.equal("custom");
    });

    it("Should register elements", () => {
        const elementName = uniqueElementName();
        const customElement = class extends HTMLElement {};
        const host = document.createElement("div");

        expect(customElements.get(elementName)).to.be.undefined;

        DesignSystem.getOrCreate(host)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    context.tryDefineElement({
                        name: elementName,
                        type: customElement,
                        callback: x => x.defineElement()
                    });
                },
            });

        expect(customElements.get(elementName)).to.equal(customElement);
    });

    it("Should register elements with the deprecated `tryDefineElement` signature", () => {
        const elementName = uniqueElementName();
        const customElement = class extends HTMLElement {};
        const host = document.createElement("div");

        expect(customElements.get(elementName)).to.be.undefined;

        DesignSystem.getOrCreate(host)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    context.tryDefineElement(elementName, customElement, x => x.defineElement());
                },
            });

        expect(customElements.get(elementName)).to.equal(customElement);
    });

    it("Should register an element with a custom base class", () => {
        const elementName = uniqueElementName();
        const baseClass = class extends HTMLElement {};
        const customElement = class extends baseClass {};
        const host = document.createElement("div");

        expect(customElements.get(elementName)).to.be.undefined;

        DesignSystem.getOrCreate(host)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    context.tryDefineElement({
                        name: elementName,
                        type: customElement,
                        callback: x => x.defineElement(),
                        baseClass
                    });
                },
            });

        expect(customElements.get(elementName)).to.equal(customElement);
        expect(DesignSystem.tagFor(baseClass)).to.equal(elementName);
        expect(DesignSystem.tagFor(customElement)).to.equal(elementName);
    });

    it("Should detect duplicate elements and allow disambiguation", () => {
        const elementName = uniqueElementName();
        const elementName2 = uniqueElementName();
        const host = document.createElement("div");
        let capturedType: Constructable | null = null;
        DesignSystem.getOrCreate(host)
            .withElementDisambiguation((name, type, existingType) => {
                capturedType = existingType;
                return elementName2;
            })
            .register(
                {
                    register(container: Container, context: DesignSystemRegistrationContext) {
                        context.tryDefineElement({
                            name: elementName,
                            type: class extends HTMLElement {},
                            callback: x => x.defineElement()
                        });
                    },
                },
                {
                    register(container: Container, context: DesignSystemRegistrationContext) {
                        context.tryDefineElement({
                            name: elementName,
                            type: class extends HTMLElement {},
                            callback: x => x.defineElement()
                        });
                    },
                }
            );

        expect(capturedType).to.not.be.null;
        expect(customElements.get(elementName)).to.not.be.undefined;
        expect(customElements.get(elementName2)).to.not.be.undefined;
    });

    it("Should only call callbacks for duplicate elements by default", () => {
        const elementName = uniqueElementName();
        const customElement = class extends HTMLElement {};
        const host = document.createElement("div");
        const system = DesignSystem.getOrCreate(host);
        let callbackCalled = false;

        expect(() => {
            system.register(
                {
                    register(container: Container, context: DesignSystemRegistrationContext) {
                        context.tryDefineElement({
                            name: elementName,
                            type: customElement,
                            callback: x => x.defineElement()
                        });
                    },
                },
                {
                    register(container: Container, context: DesignSystemRegistrationContext) {
                        context.tryDefineElement({
                            name: elementName,
                            type: class extends HTMLElement {},
                            callback: x => {
                                x.defineElement();
                                callbackCalled = true;
                            },
                        });
                    },
                }
            );
        }).not.to.throw();

        expect(customElements.get(elementName)).to.equal(customElement);
        expect(callbackCalled).to.be.true;
    });

    it("Can completely ignore duplicates", () => {
        const elementName = uniqueElementName();
        const customElement = class extends HTMLElement {};
        const host = document.createElement("div");
        const system = DesignSystem.getOrCreate(host)
            .withElementDisambiguation(() => ElementDisambiguation.ignoreDuplicate);
        let callbackCalled = false;

        expect(() => {
            system.register(
                {
                    register(container: Container, context: DesignSystemRegistrationContext) {
                        context.tryDefineElement({
                            name: elementName,
                            type: customElement,
                            callback: x =>
                            x.defineElement(),
                        });
                    },
                },
                {
                    register(container: Container, context: DesignSystemRegistrationContext) {
                        context.tryDefineElement({
                            name: elementName,
                            type: class extends HTMLElement {},
                            callback: x => {
                                x.defineElement();
                                callbackCalled = true;
                            },
                        });
                    },
                }
            );
        }).not.to.throw();

        expect(customElements.get(elementName)).to.equal(customElement);
        expect(callbackCalled).to.be.false;
    });

    it("Should auto-subclass if attempting to define FoundationElement", () => {
        const elementName = uniqueElementName();
        const host = document.createElement("div");

        DesignSystem.getOrCreate(host)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    context
                        .tryDefineElement(elementName, FoundationElement, x => {
                            x.defineElement();
                        });
                },
            });

        const type = customElements.get(elementName)!;
        const proto = Reflect.getPrototypeOf(type);

        expect(type).to.not.equal(FoundationElement);
        expect(proto).to.equal(FoundationElement);
    });

    it("Should have an undefined shadow mode by default", () => {
        const elementName = uniqueElementName();
        const customElement = class extends HTMLElement {};
        const host = document.createElement("div");
        let mode: ShadowRootMode | undefined | null = null;

        DesignSystem.getOrCreate(host)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    context.tryDefineElement({
                        name: elementName,
                        type: customElement,
                        callback: x => {
                            mode = x.shadowRootMode;
                            x.defineElement();
                        }
                    });
                },
            });

        expect(mode).to.equal(undefined);
    });

    it("Should pass through open shadow mode overrides", () => {
        const elementName = uniqueElementName();
        const customElement = class extends HTMLElement {};
        const host = document.createElement("div");
        let mode: ShadowRootMode | undefined | null = null;

        DesignSystem.getOrCreate(host)
            .withShadowRootMode('open')
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    context.tryDefineElement({
                        name: elementName,
                        type: customElement,
                        callback: x => {
                            mode = x.shadowRootMode;
                            x.defineElement();
                        }
                    });
                },
            });

        expect(mode).to.equal('open');
    });

    it("Should pass through closed shadow mode overrides", () => {
        const elementName = uniqueElementName();
        const customElement = class extends HTMLElement {};
        const host = document.createElement("div");
        let mode: ShadowRootMode | undefined | null = null;

        DesignSystem.getOrCreate(host)
            .withShadowRootMode('closed')
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {
                    context.tryDefineElement({
                        name: elementName,
                        type: customElement,
                        callback: x => {
                            mode = x.shadowRootMode;
                            x.defineElement();
                        }
                    });
                },
            });

        expect(mode).to.equal('closed');
    });

    it("should enable DI service overrides through the design system", () => {
        interface Test {}

        class DefaultTest implements Test {}
        class AltTest implements Test {}

        const Test = DI.createInterface<Test>(x => x.singleton(DefaultTest));

        const host = document.createElement("div");
        DesignSystem.getOrCreate(host)
            .register(
                Registration.singleton(Test, AltTest)
            );

        const found = DI.getOrCreateDOMContainer(host).get(Test);

        expect(found).to.be.instanceOf(AltTest);
    });

    it("should set the DesignToken root to the default root when register is invoked", async () => {
        const token = DesignToken.create<number>("design-system-registration").withDefault(12);
        const host = document.createElement("div");
        expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");

        DesignSystem.getOrCreate(host)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {}
            });


        await DOM.nextUpdate();
        expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("12");

        DesignToken.unregisterRoot();
        await DOM.nextUpdate();
    });

    it("should provide a way to specify the DesignToken root", async () => {
        const token = DesignToken.create<number>("custom-design-system-registration").withDefault(12);
        const host = document.createElement("div");
        expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");

        DesignSystem.getOrCreate(host)
            .withDesignTokenRoot(host)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {}
            });


        await DOM.nextUpdate();
        const value = host.style.getPropertyValue(token.cssCustomProperty)
        expect(value).to.equal("12");
        expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");
        DesignToken.unregisterRoot(host);
        await DOM.nextUpdate();
        expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");
    });
    it("should provide a way to disable DesignToken root registration", async () => {
        const token = DesignToken.create<number>("disabled-design-system-registration").withDefault(12);
        expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");

        DesignSystem.getOrCreate()
            .withDesignTokenRoot(null)
            .register({
                register(container: Container, context: DesignSystemRegistrationContext) {}
            });


        await DOM.nextUpdate();
        expect(window.getComputedStyle(document.body).getPropertyValue(token.cssCustomProperty)).to.equal("");
    });
});
