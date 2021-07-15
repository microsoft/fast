var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { css, customElement, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { DI } from "../di";
import { fixture, uniqueElementName } from "../test-utilities/fixture";
import {
    ComponentPresentation,
    DefaultComponentPresentation,
    DesignSystem,
} from "../design-system";
import { FoundationElement } from "./foundation-element";
const styles = css`
    :host {
        background: red;
    }
`;
const template = html`
    <slot></slot>
`;
let BareElement = class BareElement extends FoundationElement {};
BareElement = __decorate(
    [
        customElement({
            name: "bare-element",
        }),
    ],
    BareElement
);
let StyledElement = class StyledElement extends FoundationElement {
    constructor() {
        super(...arguments);
        this.styles = styles;
    }
};
StyledElement = __decorate(
    [
        customElement({
            name: "styled-element",
        }),
    ],
    StyledElement
);
let TemplatedElement = class TemplatedElement extends FoundationElement {
    constructor() {
        super(...arguments);
        this.template = template;
    }
};
TemplatedElement = __decorate(
    [
        customElement({
            name: "templated-element",
        }),
    ],
    TemplatedElement
);
function setup(tag) {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, parent, connect, disconnect } = yield fixture(tag);
        const container = DI.getOrCreateDOMContainer(parent);
        const builtinTemplate = html`
            default-template
        `;
        const builtinStyles = css``;
        ComponentPresentation.define(
            tag,
            new DefaultComponentPresentation(builtinTemplate, builtinStyles),
            container
        );
        return { element, connect, disconnect, builtinTemplate, builtinStyles };
    });
}
describe("FoundationElement", () => {
    describe("should template with", () => {
        it("the presentation template by default", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, builtinTemplate } = yield setup(
                    "bare-element"
                );
                yield connect();
                expect(element.$fastController.template).to.equal(builtinTemplate);
                yield disconnect();
            }));
        it("the instance template property if it is assigned", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, builtinTemplate } = yield setup(
                    "bare-element"
                );
                yield connect();
                element.template = template;
                expect(element.$fastController.template).to.equal(template);
                yield disconnect();
            }));
        it("the template property if it is assigned by the constructor", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup("templated-element");
                yield connect();
                expect(element.$fastController.template).to.equal(template);
                yield disconnect();
            }));
    });
    describe("should style with", () => {
        it("the presentation styles by default", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, builtinStyles } = yield setup(
                    "bare-element"
                );
                yield connect();
                expect(element.$fastController.styles).to.equal(builtinStyles);
                yield disconnect();
            }));
        it("the instance styles property if it is assigned", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect, builtinStyles } = yield setup(
                    "bare-element"
                );
                yield connect();
                expect(element.$fastController.styles).to.equal(builtinStyles);
                element.styles = styles;
                expect(element.$fastController.styles).to.equal(styles);
                yield disconnect();
            }));
        it("the styles property if it is assigned by the constructor", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                const { element, connect, disconnect } = yield setup("styled-element");
                yield connect();
                expect(element.$fastController.styles).to.equal(styles);
                yield disconnect();
            }));
    });
    describe(".compose", () => {
        it("should register an element, default template, and default styles", () => {
            const styles = css``;
            const template = html``;
            const baseName = uniqueElementName();
            class MyElement extends FoundationElement {}
            const myElement = MyElement.compose({
                styles,
                template,
                baseName,
            });
            const host = document.createElement("div");
            DesignSystem.getOrCreate(host).register(myElement());
            const fullName = `fast-${baseName}`;
            const presentation = ComponentPresentation.forTag(fullName, host);
            expect(presentation.styles).to.equal(styles);
            expect(presentation.template).to.equal(template);
            expect(customElements.get(fullName)).to.equal(MyElement);
        });
        it("should register an element, default template, and default styles with functions", () => {
            const styles = css``;
            const template = html``;
            const baseName = uniqueElementName();
            const fullName = `fast-${baseName}`;
            class MyElement extends FoundationElement {}
            function checkCallback(context, definition, part) {
                expect(context.name).to.equal(fullName);
                expect(context.type).to.equal(MyElement);
                expect(context.willDefine).to.be.true;
                expect(context.tagFor(MyElement)).to.equal(fullName);
                expect(definition.baseName).to.equal(baseName);
                return part;
            }
            const myElement = MyElement.compose({
                styles: (c, d) => checkCallback(c, d, styles),
                template: (c, d) => checkCallback(c, d, template),
                baseName,
            });
            const host = document.createElement("div");
            DesignSystem.getOrCreate(host).register(myElement());
            const presentation = ComponentPresentation.forTag(fullName, host);
            expect(presentation.styles).to.equal(styles);
            expect(presentation.template).to.equal(template);
            expect(customElements.get(fullName)).to.equal(MyElement);
        });
        it("should provide opportunity to override template, styles, prefix, and baseName of a registry", () => {
            class MyElement extends FoundationElement {}
            const originalName = uniqueElementName();
            const myElement = MyElement.compose({
                styles: css``,
                template: html``,
                baseName: originalName,
            });
            const overrideName = uniqueElementName();
            const overrides = {
                prefix: "my",
                baseName: overrideName,
                styles: css``,
                template: html``,
            };
            const host = document.createElement("div");
            DesignSystem.getOrCreate(host).register(myElement(overrides));
            const originalFullName = `fast-${originalName}`;
            const overrideFullName = `my-${overrideName}`;
            expect(customElements.get(originalFullName)).to.be.undefined;
            const presentation = ComponentPresentation.forTag(overrideFullName, host);
            expect(presentation.styles).to.equal(overrides.styles);
            expect(presentation.template).to.equal(overrides.template);
            expect(customElements.get(overrideFullName)).to.equal(MyElement);
        });
    });
    describe("shadow mode", () => {
        it("should be open by default", () => {
            class MyElement extends FoundationElement {}
            const baseName = uniqueElementName();
            const fullName = `fast-${baseName}`;
            const myElement = MyElement.compose({
                styles: css``,
                template: html`
                    test
                `,
                baseName,
            });
            const host = document.createElement("div");
            DesignSystem.getOrCreate(host).register(myElement());
            const element = document.createElement(fullName);
            expect(element.shadowRoot).to.be.instanceof(ShadowRoot);
        });
        it("can be overridden to closed by the design system", () => {
            class MyElement extends FoundationElement {}
            const baseName = uniqueElementName();
            const fullName = `fast-${baseName}`;
            const myElement = MyElement.compose({
                styles: css``,
                template: html`
                    test
                `,
                baseName,
                shadowOptions: {
                    mode: "open",
                },
            });
            const host = document.createElement("div");
            DesignSystem.getOrCreate(host)
                .withShadowRootMode("closed")
                .register(myElement());
            const element = document.createElement(fullName);
            expect(element.shadowRoot).to.be.null;
        });
        it("can be be override to open by the design system", () => {
            class MyElement extends FoundationElement {}
            const baseName = uniqueElementName();
            const fullName = `fast-${baseName}`;
            const myElement = MyElement.compose({
                styles: css``,
                template: html`
                    test
                `,
                baseName,
                shadowOptions: {
                    mode: "closed",
                },
            });
            const host = document.createElement("div");
            DesignSystem.getOrCreate(host)
                .withShadowRootMode("open")
                .register(myElement());
            const element = document.createElement(fullName);
            expect(element.shadowRoot).to.be.instanceof(ShadowRoot);
        });
        it("is not overridden when the component targets light DOM", () => {
            class MyElement extends FoundationElement {}
            const baseName = uniqueElementName();
            const fullName = `fast-${baseName}`;
            const myElement = MyElement.compose({
                styles: css``,
                template: html`
                    test
                `,
                baseName,
                shadowOptions: null,
            });
            const host = document.createElement("div");
            DesignSystem.getOrCreate(host)
                .withShadowRootMode("open")
                .register(myElement());
            const element = document.createElement(fullName);
            expect(element.shadowRoot).to.be.null;
        });
    });
    describe("subclasses", () => {
        it("should be able to use the @customElement decorator", () =>
            __awaiter(void 0, void 0, void 0, function* () {
                class BaseClass extends FoundationElement {}
                const name = `fast-${uniqueElementName()}`;
                let Subclass = class Subclass extends BaseClass {};
                Subclass = __decorate(
                    [
                        customElement({
                            name,
                            template: html`
                                test
                            `,
                        }),
                    ],
                    Subclass
                );
                const { element, parent, connect, disconnect } = yield fixture(name);
                yield connect();
                expect(element.shadowRoot.innerHTML).to.equal("test");
                yield disconnect();
            }));
    });
});
