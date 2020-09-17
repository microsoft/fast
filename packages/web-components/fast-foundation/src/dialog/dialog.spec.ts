import { expect } from "chai";
import { Dialog, DialogTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";

@customElement({
    name: "fast-dialog",
    template,
})
class FASTDialog extends Dialog {}

// TODO: Add tests for focus management
describe("Dialog", () => {
    it("should include a role of `dialog` on the control", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        await connect();

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("role")
        ).to.equal("dialog");

        await disconnect();
    });

    it("should add an attribute of `hidden` when passed", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        element.hidden = true;

        await connect();
        await DOM.nextUpdate();

        expect(element.hasAttribute("hidden")).to.equal(true);

        element.hidden = false;

        await DOM.nextUpdate();

        expect(element.hasAttribute("hidden")).to.equal(false);

        await disconnect();
    });

    it("should NOT add an attribute of `hidden` when passed", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        await connect();

        expect(element.hasAttribute("hidden")).to.equal(false);

        await disconnect();
    });

    it("should add an attribute of `aria-modal` with a value equal to the modal attribute", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        element.modal = true;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector("[role='dialog']")
                ?.getAttribute("aria-modal")
        ).to.equal("true");

        element.modal = false;

        await DOM.nextUpdate();

        expect(
            element.shadowRoot
                ?.querySelector("[role='dialog']")
                ?.getAttribute("aria-modal")
        ).to.equal("false");

        await disconnect();
    });

    it("should add a default `aria-modal` value of TRUE when the modal attribute is not provided", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector("[role='dialog']")
                ?.getAttribute("aria-modal")
        ).to.equal("true");

        await disconnect();
    });

    it("should add an overlay element with a role of `presentation` when modal is true", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        await connect();

        expect(
            element.shadowRoot?.querySelector(".overlay")?.getAttribute("role")
        ).to.equal("presentation");

        await disconnect();
    });

    it("should add a tabindex of -1 to the modal overlay when modal is true", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        await connect();

        expect(
            element.shadowRoot?.querySelector(".overlay")?.getAttribute("tabindex")
        ).to.equal("-1");

        await disconnect();
    });

    it("should add an attribute of `trap-focus` when trapFocus is true", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        element.trapFocus = true;

        await connect();
        await DOM.nextUpdate();

        expect(element.hasAttribute("trap-focus")).to.equal(true);

        await disconnect();
    });

    it("should add a default attribute of `trap-focus` when trapFocus not defined", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        await connect();
        await DOM.nextUpdate();

        expect(element.trapFocus).to.equal(true);
        expect(element.hasAttribute("trap-focus")).to.equal(true);

        await disconnect();
    });

    it("should NOT add an attribute of `hidden` when passed", async () => {
        const { element, connect, disconnect } = await fixture<Dialog>("fast-dialog");

        await connect();

        expect(element.hasAttribute("hidden")).to.equal(false);

        await disconnect();
    });

    it("should set the `aria-describedBy` attribute on the dialog control when provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTDialog>("fast-dialog");
        const ariaDescribedby = "testId";

        element.ariaDescribedby = ariaDescribedby;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector("[role='dialog']")
                ?.getAttribute("aria-describedBy")
        ).to.equal(ariaDescribedby);

        await disconnect();
    });

    it("should set the `aria-labelledby` attribute on the dialog control when provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTDialog>("fast-dialog");
        const ariaLabelledby = "testId";

        element.ariaLabelledby = ariaLabelledby;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector("[role='dialog']")
                ?.getAttribute("aria-labelledby")
        ).to.equal(ariaLabelledby);

        await disconnect();
    });

    it("should set the `aria-label` attribute on the dialog control when provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTDialog>("fast-dialog");
        const ariaLabel = "test label";

        element.ariaLabel = ariaLabel;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector("[role='dialog']")
                ?.getAttribute("aria-label")
        ).to.equal(ariaLabel);

        await disconnect();
    });

    describe("events", () => {
        // TODO: test trap focus
        it("should fire an event on click", async () => {
            const { element, connect, disconnect } = await fixture<FASTDialog>(
                "fast-dialog"
            );
            let wasDismissed: boolean = false;
            const event = new MouseEvent("click");

            await connect();

            element.addEventListener("dismiss", e => {
                e.preventDefault();

                wasDismissed = true;
            });

            await DOM.nextUpdate();

            element.shadowRoot?.querySelector(".overlay")?.dispatchEvent(event);

            await DOM.nextUpdate();

            expect(wasDismissed).to.equal(true);

            await disconnect();
        });

        it("should fire an event when spacebar is invoked", async () => {
            const { element, connect, disconnect } = await fixture<FASTDialog>(
                "fast-dialog"
            );
            let wasDismissed: boolean = false;
            const event = new KeyboardEvent("keydown", {
                key: "escape",
                keyCode: KeyCodes.escape,
            } as KeyboardEventInit);

            await connect();

            element.addEventListener("keydown", e => {
                e.preventDefault();

                wasDismissed = true;
            });

            await DOM.nextUpdate();

            element.dispatchEvent(event);

            expect(wasDismissed).to.equal(true);

            await disconnect();
        });
    });
});
