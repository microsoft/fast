import { css, customElement, elements, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../fixture";
import { FASTFoundation } from "./index";

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
class BareElement extends FASTFoundation {}

@customElement({
    name: "styled-element",
})
class StyledElement extends FASTFoundation {
    styles = styles;
}

@customElement({
    name: "templated-element",
})
class TemplatedElement extends FASTFoundation {
    template = template;
}

async function setup(tag: string) {
    const { element, connect, disconnect } = await fixture<BareElement>(tag);

    return { element, connect, disconnect };
}

describe("FASTFoundation", () => {
    describe("should template with", () => {
        it("the instance template property if it is assigned", async () => {
            const { element, connect, disconnect } = await setup("bare-element");
            await connect();

            expect(element.$fastController.template).to.equal(null);
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

        xit("the template resolved from $fastProvider when a local template property is not set", async () => {});
    });

    describe("should style with", () => {
        it("the instance styles property if it is assigned", async () => {
            const { element, connect, disconnect } = await setup("bare-element");
            await connect();

            expect(element.$fastController.styles).to.equal(null);
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

        xit("the styles resolved from $fastProvider when a local template property is not set", async () => {});
    });

    it("should resolve a null $fastProvider if no parent FASTProvider exists", async () => {
        const { element, connect, disconnect } = await setup("bare-element");
        await connect();

        expect(element.$fastProvider).to.equal(null);
        await disconnect();
    });

    xit("should resolve a provider element to $fastProvider after DOM connection if element has a parent FASTProvider", async () => {});
});
