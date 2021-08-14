import { expect } from "chai";
import { MenuItem, menuItemTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { MenuItemRole } from "./menu-item";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { AnchoredRegion, anchoredRegionTemplate } from "../anchored-region";

const FASTMenuItem = MenuItem.compose({
    baseName: "menu-item",
    template
})

const FASTAnchoredRegion = AnchoredRegion.compose({
    baseName: "anchored-region",
    template: anchoredRegionTemplate
})

async function setup() {
    const { element, connect, disconnect } = await fixture([FASTMenuItem(), FASTAnchoredRegion()]);

    return { element, connect, disconnect };
}

// TODO: Add tests for keyboard handling
describe("Menu item", () => {
    it("should include a role of menuitem when `menuitem` role is provided", async () => {
        const { element, connect, disconnect } = await setup();
        const role = MenuItemRole.menuitem;

        element.role = role;

        await connect();

        expect(element.getAttribute("role")).to.equal(role);

        await disconnect();
    });

    it("should include a role of `menuitemcheckbox` when `menuitemcheckbox` role is provided", async () => {
        const { element, connect, disconnect } = await setup();
        const role = MenuItemRole.menuitemcheckbox;

        element.role = role;

        await connect();

        expect(element.getAttribute("role")).to.equal(role);

        await disconnect();
    });

    it("should include a role of `menuitemradio` when `menuitemradio` role is provided", async () => {
        const { element, connect, disconnect } = await setup();
        const role = MenuItemRole.menuitemradio;

        element.role = role;

        await connect();

        expect(element.getAttribute("role")).to.equal(role);

        await disconnect();
    });

    it("should include a role of `menuitem` by default when no role is provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal(MenuItemRole.menuitem);

        await disconnect();
    });

    it("should set the `aria-disabled` attribute with the `disabled` value when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("true");

        await disconnect();
    });

    it("should set an `aria-expanded` attribute with the `expanded` value when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.expanded = true;

        await connect();

        expect(element.getAttribute("aria-expanded")).to.equal("true");

        await disconnect();
    });

    it("should set an `aria-checked` attribute with the `checked` value when provided to a menuitemcheckbox", async () => {
        const { element, connect, disconnect } = await setup();

        element.role = MenuItemRole.menuitemcheckbox;
        element.checked = true;

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        await disconnect();
    });

    it("should NOT set an `aria-checked` attribute when checked is provided to a menuitem", async () => {
        const { element, connect, disconnect } = await setup();

        element.role = MenuItemRole.menuitem;
        element.checked = true;

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal(null);

        await disconnect();
    });

    it("should toggle the aria-checked attribute of checkbox item when clicked", async () => {
        const { element, connect, disconnect } = await setup();
        element.role = MenuItemRole.menuitemcheckbox;

        await connect();

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal(null);

        element.click();

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        element.click();

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal("false");

        await disconnect();
    });

    it("should aria-checked attribute of radio item to true when clicked", async () => {
        const { element, connect, disconnect } = await setup();
        element.role = MenuItemRole.menuitemradio;

        await connect();

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal(null);

        element.click();

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        element.click();

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        await disconnect();
    });

    describe("events", () => {
        it("should fire an event on click", async () => {
            const { element, connect, disconnect } = await setup();
            let wasClicked: boolean = false;

            await connect();

            element.addEventListener("change", e => {
                e.preventDefault();

                wasClicked = true;
            });

            await DOM.nextUpdate();

            element.click();

            expect(wasClicked).to.equal(true);

            await disconnect();
        });

        it("should fire an event when spacebar is invoked", async () => {
            const { element, connect, disconnect } = await setup();
            let wasInvoked: boolean = false;
            const event = new KeyboardEvent("keydown", {
                key: "space",
                keyCode: KeyCodes.space,
            } as KeyboardEventInit);

            await connect();

            element.addEventListener("keydown", e => {
                e.preventDefault();

                wasInvoked = true;
            });

            await DOM.nextUpdate();

            element.dispatchEvent(event);

            expect(wasInvoked).to.equal(true);

            await disconnect();
        });

        it("should fire an event when enter is invoked", async () => {
            const { element, connect, disconnect } = await setup();
            let wasInvoked: boolean = false;
            const event = new KeyboardEvent("keydown", {
                key: "enter",
                keyCode: KeyCodes.enter,
            } as KeyboardEventInit);

            await connect();

            element.addEventListener("keydown", e => {
                e.preventDefault();

                wasInvoked = true;
            });

            await DOM.nextUpdate();

            element.dispatchEvent(event);

            expect(wasInvoked).to.equal(true);

            await disconnect();
        });
    });
});
