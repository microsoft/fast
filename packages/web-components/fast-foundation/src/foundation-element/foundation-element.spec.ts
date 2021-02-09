import { css, customElement, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { DI, Registration } from "../di";
import { fixture, uniqueElementName } from "../fixture";
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

    container.register(
        Registration.instance(
            ComponentPresentation.keyFrom(tag),
            new DefaultComponentPresentation(builtinTemplate, builtinStyles)
        )
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

    describe(".configuration", () => {
        it("should register an element, default template, and default styles", () => {
            const styles = css``;
            const template = html``;
            const baseName = uniqueElementName();
            class MyElement extends FoundationElement {}

            const myElement = FoundationElement.configuration({
                styles,
                template,
                baseName,
                type: MyElement,
            });

            const host = document.createElement("div");
            const container = new DesignSystem().register(myElement()).applyTo(host);

            const fullName = `fast-${baseName}`;
            const presentation = container.get<DefaultComponentPresentation>(
                ComponentPresentation.keyFrom(fullName)
            );

            expect(presentation.styles).to.equal(styles);
            expect(presentation.template).to.equal(template);
            expect(customElements.get(fullName)).to.equal(MyElement);
        });

        it("should provider opportunity to override template, styles, prefix, and baseName of a registry", () => {
            class MyElement extends FoundationElement {}
            const originalName = uniqueElementName();
            const myElement = FoundationElement.configuration({
                styles: css``,
                template: html``,
                baseName: originalName,
                type: MyElement,
            });

            const overrideName = uniqueElementName();
            const overrides = {
                prefix: "my",
                baseName: overrideName,
                styles: css``,
                template: html``,
            };

            const host = document.createElement("div");
            const container = new DesignSystem()
                .register(myElement(overrides))
                .applyTo(host);

            const originalFullName = `fast-${originalName}`;
            const overrideFullName = `my-${overrideName}`;

            expect(
                container.has(ComponentPresentation.keyFrom(originalFullName), false)
            ).to.equal(false);
            expect(customElements.get(originalFullName)).to.be.undefined;

            const presentation = container.get<DefaultComponentPresentation>(
                ComponentPresentation.keyFrom(overrideFullName)
            );

            expect(presentation.styles).to.equal(overrides.styles);
            expect(presentation.template).to.equal(overrides.template);
            expect(customElements.get(overrideFullName)).to.equal(MyElement);
        });
    });
});
