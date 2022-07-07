import { expect } from "chai";
import { FASTMenuItem, menuItemTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { Updates } from "@microsoft/fast-element";
import { MenuItemRole } from "./menu-item.js";
import { keyEnter, keySpace } from "@microsoft/fast-web-utilities";
import { FASTAnchoredRegion, anchoredRegionTemplate } from "../anchored-region/index.js";

const anchoredRegionName = uniqueElementName();
FASTAnchoredRegion.compose({
    name: anchoredRegionName,
    template: anchoredRegionTemplate()
});

const menuItemName = uniqueElementName();
FASTMenuItem.define({
    name: menuItemName,
    template: menuItemTemplate({
        anchoredRegion: anchoredRegionName
    })
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTMenuItem>(menuItemName);

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

        await Updates.next();

        expect(element.getAttribute("aria-checked")).to.equal(null);

        element.click();

        await Updates.next();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        element.click();

        await Updates.next();

        expect(element.getAttribute("aria-checked")).to.equal("false");

        await disconnect();
    });

    it("should aria-checked attribute of radio item to true when clicked", async () => {
        const { element, connect, disconnect } = await setup();
        element.role = MenuItemRole.menuitemradio;

        await connect();

        await Updates.next();

        expect(element.getAttribute("aria-checked")).to.equal(null);

        element.click();

        await Updates.next();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        element.click();

        await Updates.next();

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

            await Updates.next();

            element.click();

            expect(wasClicked).to.equal(true);

            await disconnect();
        });

        it("should fire an event when spacebar is invoked", async () => {
            const { element, connect, disconnect } = await setup();
            let wasInvoked: boolean = false;
            const event = new KeyboardEvent("keydown", {
                key: keySpace,
            } as KeyboardEventInit);

            await connect();

            element.addEventListener("keydown", e => {
                e.preventDefault();

                wasInvoked = true;
            });

            await Updates.next();

            element.dispatchEvent(event);

            expect(wasInvoked).to.equal(true);

            await disconnect();
        });

        it("should fire an event when enter is invoked", async () => {
            const { element, connect, disconnect } = await setup();
            let wasInvoked: boolean = false;
            const event = new KeyboardEvent("keydown", {
                key: keyEnter,
            } as KeyboardEventInit);

            await connect();

            element.addEventListener("keydown", e => {
                e.preventDefault();

                wasInvoked = true;
            });

            await Updates.next();

            element.dispatchEvent(event);

            expect(wasInvoked).to.equal(true);

            await disconnect();
        });
    });
});
