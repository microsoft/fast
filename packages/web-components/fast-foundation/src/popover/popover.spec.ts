import { assert, expect } from "chai";
import { customElement, DOM, html } from "@microsoft/fast-element";
import { fixture } from "../fixture";
import { createPopoverTemplate, Popover } from "./index";
import { PopoverPosition } from "./popover";
import { KeyCodes } from "@microsoft/fast-web-utilities";

@customElement({
    name: "fast-popover",
    template: createPopoverTemplate("fast"),
})
class FASTPopover extends Popover {}

async function defaultSetup() {
    const { element, connect, disconnect, document } = await fixture(html<HTMLDivElement>`
        <div>
            <button id="target">target</button>
            <fast-popover target="target" id="popover">
                Test text
            </fast-popover>
        </div>
    `);
    return { element, connect, disconnect, document };
}

async function trapFocusSetup() {
    const { element, connect, disconnect, document } = await fixture(html<HTMLDivElement>`
        <div>
            <button id="trapFocusTarget">target</button>
            <fast-popover target="trapFocusTarget" id="trapFocusPopover" visible>
                <button id="buttonOne">Button One</button>
                <button id="buttonTwo">Button Two</button>
                Test Text
            </fast-popover>
        </div>
    `);
    return { element, connect, disconnect, document };
}

async function autofocusSetup() {
    const { element, connect, disconnect, document } = await fixture(html<HTMLDivElement>`
        <div>
            <button id="autofocusTarget">target</button>
            <fast-popover target="autofocusTarget" id="popover" visible>
                <button id="nonAutofocus">No Autofocus</button>
                <button id="shouldAutofocus" autofocus>Autofocus</button>
                Test Text
            </fast-popover>
        </div>
    `);
    return { element, connect, disconnect, document };
}

describe("Popover", () => {
    it("should have trap-focus by default", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.visible = true;

        await connect();
        await DOM.nextUpdate();

        assert.strictEqual(popover.hasAttribute("trap-focus"), true);

        await disconnect();
    });
    it("should include a role of `dialog` in the shadowRoot once visible", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.visible = true;

        await connect();
        await DOM.nextUpdate();

        const region: any = popover.shadowRoot?.querySelector("fast-anchored-region");
        const popoverPart: any = region.querySelector("[part='popover']");
        assert.strictEqual(popoverPart.getAttribute("role"), "dialog");

        await disconnect();
    });

    it("should not render the popover by default", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        await connect();
        await DOM.nextUpdate();

        expect(popover.popoverVisible).to.equal(false);
        expect(popover.shadowRoot?.querySelector("fast-anchored-region")).to.equal(null);

        await disconnect();
    });

    it("should render the popover when visible is true", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.visible = true;

        await connect();
        await DOM.nextUpdate();

        expect(popover.popoverVisible).to.equal(true);
        expect(popover.shadowRoot?.querySelector("fast-anchored-region")).not.to.equal(
            null
        );

        await disconnect();
    });

    it("should not render the popover when visible is false", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.visible = false;

        await connect();
        await DOM.nextUpdate();

        expect(popover.popoverVisible).to.equal(false);
        expect(popover.shadowRoot?.querySelector("fast-anchored-region")).to.equal(null);

        await disconnect();
    });

    it("should set positioning mode to dynamic by default", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        await connect();

        expect(popover.verticalPositioningMode).to.equal("dynamic");
        expect(popover.horizontalPositioningMode).to.equal("dynamic");

        await disconnect();
    });

    it("should not set a default position by default", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        await connect();

        expect(popover.verticalDefaultPosition).to.equal(undefined);
        expect(popover.horizontalDefaultPosition).to.equal(undefined);

        await disconnect();
    });

    it("should set horizontal scaling to match anchor and vertical scaling to match content by default", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        await connect();

        expect(popover.verticalScaling).to.equal("content");
        expect(popover.horizontalScaling).to.equal("anchor");

        await disconnect();
    });

    // top position settings

    it("should set vertical positioning mode to locked and horizontal to dynamic when position is set to top", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.top;

        await connect();

        expect(popover.verticalPositioningMode).to.equal("locktodefault");
        expect(popover.horizontalPositioningMode).to.equal("dynamic");

        await disconnect();
    });

    it("should set default vertical position to top when position is set to top", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.top;

        await connect();

        expect(popover.verticalDefaultPosition).to.equal("top");
        expect(popover.horizontalDefaultPosition).to.equal(undefined);

        await disconnect();
    });

    it("should set horizontal scaling to match anchor and vertical scaling to match content when position is set to top", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.top;

        await connect();

        expect(popover.verticalScaling).to.equal("content");
        expect(popover.horizontalScaling).to.equal("anchor");

        await disconnect();
    });

    // bottom position settings

    it("should set vertical positioning mode to locked and horizontal to dynamic when position is set to bottom", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.bottom;

        await connect();

        expect(popover.verticalPositioningMode).to.equal("locktodefault");
        expect(popover.horizontalPositioningMode).to.equal("dynamic");

        await disconnect();
    });

    it("should set default vertical position to top when position is set to top", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.bottom;

        await connect();

        expect(popover.verticalDefaultPosition).to.equal("bottom");
        expect(popover.horizontalDefaultPosition).to.equal(undefined);

        await disconnect();
    });

    it("should set horizontal scaling to match anchor and vertical scaling to match content when position is set to bottom", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.bottom;

        await connect();

        expect(popover.verticalScaling).to.equal("content");
        expect(popover.horizontalScaling).to.equal("anchor");

        await disconnect();
    });

    // left position settings

    it("should set horizontal positioning mode to locked and vertical to dynamic when position is set to left", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.left;

        await connect();

        expect(popover.verticalPositioningMode).to.equal("dynamic");
        expect(popover.horizontalPositioningMode).to.equal("locktodefault");

        await disconnect();
    });

    it("should set default horizontal position to left when position is set to left", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.left;

        await connect();

        expect(popover.verticalDefaultPosition).to.equal(undefined);
        expect(popover.horizontalDefaultPosition).to.equal("left");

        await disconnect();
    });

    it("should set vertical scaling to match anchor and horizontal scaling to match content when position is set to bottom", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.left;

        await connect();

        expect(popover.verticalScaling).to.equal("anchor");
        expect(popover.horizontalScaling).to.equal("content");

        await disconnect();
    });

    // right position settings

    it("should set horizontal positioning mode to locked and vertical to dynamic when position is set to right", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.right;

        await connect();

        expect(popover.verticalPositioningMode).to.equal("dynamic");
        expect(popover.horizontalPositioningMode).to.equal("locktodefault");

        await disconnect();
    });

    it("should set default horizontal position to right when position is set to right", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.right;

        await connect();

        expect(popover.verticalDefaultPosition).to.equal(undefined);
        expect(popover.horizontalDefaultPosition).to.equal("right");

        await disconnect();
    });

    it("should set vertical scaling to match anchor and horizontal scaling to match content when position is set to rig", async () => {
        const { element, connect, disconnect } = await defaultSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.position = PopoverPosition.right;

        await connect();

        expect(popover.verticalScaling).to.equal("anchor");
        expect(popover.horizontalScaling).to.equal("content");

        await disconnect();
    });

    // focus testing

    it("should set focus to first button in popover", async () => {
        const { element, connect, disconnect, document } = await trapFocusSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        await connect();
        await DOM.nextUpdate();
        await DOM.nextUpdate();

        expect(document.activeElement?.id).to.equal("buttonOne");

        await disconnect();
    });

    it("should set focus to autofocus button in popover", async () => {
        const { element, connect, disconnect, document } = await autofocusSetup();
        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        await connect();
        await DOM.nextUpdate();
        await DOM.nextUpdate();

        expect(document.activeElement?.id).to.equal("shouldAutofocus");

        await disconnect();
    });

    // event testing

    it("should fire a 'dismiss' event when escape is invoked on the document", async () => {
        const { element, connect, disconnect, document } = await defaultSetup();

        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;

        popover.visible = true;

        const event = new KeyboardEvent("keydown", {
            key: "Escape",
            keyCode: KeyCodes.escape,
        } as KeyboardEventInit);

        await connect();
        await DOM.nextUpdate();

        const wasDismissed = await new Promise(resolve => {
            element.addEventListener("dismiss", e => resolve(true));

            document.dispatchEvent(event);

            // Resolve false on the next update in case the event hasn't happened
            DOM.queueUpdate(() => resolve(false));
        });

        expect(wasDismissed).to.equal(true);
        expect(popover.popoverVisible).to.equal(false);

        await disconnect();
    });

    it("should focus the target element when the dismiss event is triggered by default", async () => {
        const { element, connect, disconnect, document } = await defaultSetup();

        const popover: FASTPopover = element.querySelector("fast-popover") as FASTPopover;
        const target: HTMLButtonElement = element.querySelector(
            "#target"
        ) as HTMLButtonElement;

        popover.visible = true;

        const event = new KeyboardEvent("keydown", {
            key: "Escape",
            keyCode: KeyCodes.escape,
        } as KeyboardEventInit);

        await connect();

        target.focus();

        expect(document.activeElement).to.equal(target);

        const wasDismissed = await new Promise(resolve => {
            element.addEventListener("dismiss", e => resolve(true));
            document.dispatchEvent(event);
            DOM.queueUpdate(() => resolve(false));
        });

        expect(wasDismissed).to.equal(true);
        expect(popover.visible).to.equal(false);
        expect(document.activeElement).to.equal(target);

        await disconnect();
    });

    // TODO: ADD focus-target-on-dismiss disabled test
    // TODO: ADD focus cycle test
});
