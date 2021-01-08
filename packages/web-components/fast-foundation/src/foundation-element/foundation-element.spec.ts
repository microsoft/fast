import { css, customElement, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { DI, Registration } from "../di";
import { fixture } from "../fixture";
import { ComponentPresentation, DefaultComponentPresentation } from "../design-system";
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

describe("FASTFoundation", () => {
    describe("should template with", () => {
        it("the instance template property if it is assigned", async () => {
            const { element, connect, disconnect, builtinTemplate } = await setup(
                "bare-element"
            );
            await connect();

            expect(element.$fastController.template).to.equal(builtinTemplate);
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
});
