import { css, customElement, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { DI } from "../di";
import { fixture, uniqueElementName } from "../test-utilities/fixture";
import {
    ComponentPresentation,
    DefaultComponentPresentation,
    DesignSystem,
    ElementDefinitionContext,
} from "../design-system";
import { FoundationElement, FoundationElementDefinition, OverrideFoundationElementDefinition } from "./foundation-element";

const styles = css`
    :host {
        background: red;
    }
`;
const template = html`
    <slot></slot>
`;

@customElement({
    name: "bare-element",
})
class BareElement extends FoundationElement {}

@customElement({
    name: "styled-element",
})
class StyledElement extends FoundationElement {
    styles = styles;
}

@customElement({
    name: "templated-element",
})
class TemplatedElement extends FoundationElement {
    template = template;
}

async function setup(tag: string) {
    const { element, parent, connect, disconnect } = await fixture<BareElement>(tag);
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
}

describe("FoundationElement", () => {
    describe("should template with", () => {
        it("the presentation template by default", async () => {
            const { element, connect, disconnect, builtinTemplate } = await setup(
                "bare-element"
            );
            await connect();
            expect(element.$fastController.template).to.equal(builtinTemplate);
            await disconnect();
        });

        it("the instance template property if it is assigned", async () => {
            const { element, connect, disconnect, builtinTemplate } = await setup(
                "bare-element"
            );
            await connect();

            element.template = template;
            expect(element.$fastController.template).to.equal(template);
            await disconnect();
        });

        it("the template property if it is assigned by the constructor", async () => {
            const { element, connect, disconnect } = await setup("templated-element");
            await connect();

            expect(element.$fastController.template).to.equal(template);
            await disconnect();
        });
    });

    describe("should style with", () => {
        it("the presentation styles by default", async () => {
            const { element, connect, disconnect, builtinStyles } = await setup(
                "bare-element"
            );
            await connect();
            expect(element.$fastController.styles).to.equal(builtinStyles);
            await disconnect();
        });

        it("the instance styles property if it is assigned", async () => {
            const { element, connect, disconnect, builtinStyles } = await setup(
                "bare-element"
            );
            await connect();

            expect(element.$fastController.styles).to.equal(builtinStyles);
            element.styles = styles;
            expect(element.$fastController.styles).to.equal(styles);
            await disconnect();
        });

        it("the styles property if it is assigned by the constructor", async () => {
            const { element, connect, disconnect } = await setup("styled-element");
            await connect();

            expect(element.$fastController.styles).to.equal(styles);
            await disconnect();
        });
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
                baseName
            });

            const host = document.createElement("div");
            DesignSystem.getOrCreate(host).register(myElement());

            const fullName = `fast-${baseName}`;
            const presentation = ComponentPresentation
                .forTag(fullName, host) as DefaultComponentPresentation;

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

            function checkCallback<T>(
                context: ElementDefinitionContext, 
                definition: OverrideFoundationElementDefinition<FoundationElementDefinition>,
                part: T
            ) {
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
                baseName
            });

            const host = document.createElement("div");
            DesignSystem.getOrCreate(host).register(myElement());

            const presentation = ComponentPresentation
                .forTag(fullName, host) as DefaultComponentPresentation;

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
                baseName: originalName
            });

            const overrideName = uniqueElementName();
            const overrides = {
                prefix: "my",
                baseName: overrideName,
                styles: css``,
                template: html``,
            };

            const host = document.createElement("div");
            DesignSystem.getOrCreate(host)
                .register(myElement(overrides));

            const originalFullName = `fast-${originalName}`;
            const overrideFullName = `my-${overrideName}`;

            expect(customElements.get(originalFullName)).to.be.undefined;

            const presentation = ComponentPresentation
                .forTag(overrideFullName, host) as DefaultComponentPresentation;

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
                template: html`test`,
                baseName
            });

            const host = document.createElement("div");
            DesignSystem.getOrCreate(host)
                .register(myElement());

            const element = document.createElement(fullName);
            expect(element.shadowRoot).to.be.instanceof(ShadowRoot);
        });

        it("can be overridden to closed by the design system", () => {
            class MyElement extends FoundationElement {}
            const baseName = uniqueElementName();
            const fullName = `fast-${baseName}`;
            const myElement = MyElement.compose({
                styles: css``,
                template: html`test`,
                baseName,
                shadowOptions: {
                    mode: 'open'
                }
            });

            const host = document.createElement("div");
            DesignSystem.getOrCreate(host)
                .withShadowRootMode('closed')
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
                template: html`test`,
                baseName,
                shadowOptions: {
                    mode: 'closed'
                }
            });

            const host = document.createElement("div");
            DesignSystem.getOrCreate(host)
                .withShadowRootMode('open')
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
                template: html`test`,
                baseName,
                shadowOptions: null
            });

            const host = document.createElement("div");
            DesignSystem.getOrCreate(host)
                .withShadowRootMode('open')
                .register(myElement());

            const element = document.createElement(fullName);
            expect(element.shadowRoot).to.be.null;
        });
    });

    describe("subclasses", () => {
        it("should be able to use the @customElement decorator", async () => {
            class BaseClass extends FoundationElement {}

            const name = `fast-${uniqueElementName()}`;
            @customElement({
                name,
                template: html`test`
            })
            class Subclass extends BaseClass {}

            const { element, parent, connect, disconnect } = await fixture<Subclass>(name);

            await connect();

            expect(element.shadowRoot!.innerHTML).to.equal('test');

            await disconnect();
        });
    });
});
