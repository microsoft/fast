import { expect } from "chai";
import { Menu, MenuTemplate as template } from "./index";
import { MenuItem, MenuItemTemplate as itemTemplate } from "../menu-item";
import { fixture } from "../fixture";
import { DOM, customElement, html } from "@microsoft/fast-element";

describe("Menu", () => {
    // TODO: Add tests for keyboard handling
    const name = "Menu";

    @customElement({
        name: "fast-menu",
        template,
    })
    class FASTMenu extends Menu {}

    @customElement({
        name: "fast-menu-item",
        template: itemTemplate,
    })
    class FASTMenuItem extends MenuItem {}

    it("should include a role of menu", async () => {
        const { element, connect, disconnect } = await fixture<Menu>("fast-menu");

        await connect();

        expect(element.getAttribute("role")).to.equal("menu");

        await disconnect();
    });

    it("should set tabindex of the first focusable menu item to 0", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item disabled id="id1">Foo</fast-menu-item>
                <fast-menu-item id="id2">Bar</fast-menu-item>
                <fast-menu-item>Baz</fast-menu-item>
            </fast-menu>
        `);

        await connect();

        expect(
            element.querySelectorAll("fast-menu-item")[1].getAttribute("tabindex")
        ).to.equal("0");

        await disconnect();
    });

    it("should accept elements with role of `menuitem` as focusable child", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <div role="menuitem" id="id1">Foo</div>
                <div role="menuitem">Bar</div>
                <div role="menuitem">Baz</div>
            </fast-menu>
        `);

        await connect();

        expect(
            element.querySelector("[role='menuitem']")?.getAttribute("tabindex")
        ).to.equal("0");

        await disconnect();
    });

    it("should accept elements with role of `menuitemcheckbox` as focusable child", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <div role="menuitemcheckbox" id="id1">Foo</div>
                <div role="menuitemcheckbox">Bar</div>
                <div role="menuitemcheckbox">Baz</div>
            </fast-menu>
        `);

        await connect();

        expect(
            element.querySelector("[role='menuitemcheckbox']")?.getAttribute("tabindex")
        ).to.equal("0");

        await disconnect();
    });

    it("should accept elements with role of `menuitemradio` as focusable child", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <div role="menuitemradio" id="id1">Foo</div>
                <div role="menuitemradio">Bar</div>
                <div role="menuitemradio">Baz</div>
            </fast-menu>
        `);

        await connect();

        expect(
            element.querySelector("[role='menuitemradio']")?.getAttribute("tabindex")
        ).to.equal("0");

        await disconnect();
    });
});
