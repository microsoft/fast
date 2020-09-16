import { expect } from "chai";
import { MenuItem, MenuItemTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";
import { MenuItemRole } from "./menu-item";
import { KeyCodes } from "@microsoft/fast-web-utilities";

describe("Menu item", () => {
    // TODO: Add tests for keyboard handling
    const name = "Menu item";

    @customElement({
        name: "fast-menu-item",
        template,
    })
    class FASTMenuItem extends MenuItem {}

    it("should include a role of menuitem when `menuitem` role is provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenuItem>(
            "fast-menu-item"
        );
        const role = MenuItemRole.menuitem;

        element.role = role;

        await connect();

        expect(element.getAttribute("role")).to.equal(role);

        await disconnect();
    });

    it("should include a role of `menuitemcheckbox` when `menuitemcheckbox` role is provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenuItem>(
            "fast-menu-item"
        );
        const role = MenuItemRole.menuitemcheckbox;

        element.role = role;

        await connect();

        expect(element.getAttribute("role")).to.equal(role);

        await disconnect();
    });

    it("should include a role of `menuitemradio` when `menuitemradio` role is provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenuItem>(
            "fast-menu-item"
        );
        const role = MenuItemRole.menuitemradio;

        element.role = role;

        await connect();

        expect(element.getAttribute("role")).to.equal(role);

        await disconnect();
    });

    it("should include a role of `menuitem` by default when no role is provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenuItem>(
            "fast-menu-item"
        );

        await connect();

        expect(element.getAttribute("role")).to.equal(MenuItemRole.menuitem);

        await disconnect();
    });

    it("should set the `aria-disabled` attribute with the `disabled` value when provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenuItem>(
            "fast-menu-item"
        );

        element.disabled = true;

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("true");

        await disconnect();
    });

    it("should set an `aria-expanded` attribute with the `expanded` value when provided", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenuItem>(
            "fast-menu-item"
        );

        element.expanded = true;

        await connect();

        expect(element.getAttribute("aria-expanded")).to.equal("true");

        await disconnect();
    });

    it("should set an `aria-checked` attribute with the `checked` value when provided to a menuitemcheckbox", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenuItem>(
            "fast-menu-item"
        );

        element.role = MenuItemRole.menuitemcheckbox;
        element.checked = true;

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        await disconnect();
    });

    it("should NOT set an `aria-checked` attribute when checked is provided to a menuitem", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenuItem>(
            "fast-menu-item"
        );

        element.role = MenuItemRole.menuitem;
        element.checked = true;

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal(null);

        await disconnect();
    });

    describe("events", () => {
        it("should fire an event on click", async () => {
            const { element, connect, disconnect } = await fixture<FASTMenuItem>(
                "fast-menu-item"
            );
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
            const { element, connect, disconnect } = await fixture<FASTMenuItem>(
                "fast-menu-item"
            );
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
            const { element, connect, disconnect } = await fixture<FASTMenuItem>(
                "fast-menu-item"
            );
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
