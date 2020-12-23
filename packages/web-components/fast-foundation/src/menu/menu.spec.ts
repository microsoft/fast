import { expect } from "chai";
import { Menu, MenuTemplate as template } from "./index";
import { MenuItem, MenuItemTemplate as itemTemplate } from "../menu-item";
import { fixture } from "../fixture";
import { DOM, customElement, html } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";

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

const arrowUpEvent = new KeyboardEvent("keydown", {
    key: "ArrowUp",
    keyCode: KeyCodes.arrowUp,
    bubbles: true,
} as KeyboardEventInit);

const arrowDownEvent = new KeyboardEvent("keydown", {
    key: "ArrowDown",
    keyCode: KeyCodes.arrowDown,
    bubbles: true,
} as KeyboardEventInit);

describe("Menu", () => {
    it("should include a role of menu", async () => {
        const { element, connect, disconnect } = await fixture<Menu>("fast-menu");

        await connect();

        expect(element.getAttribute("role")).to.equal("menu");

        await disconnect();
    });

    it("should set tabindex of the first focusable menu item to 0", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <div>I put a div in my menu</div>
                <fast-menu-item id="id1">Foo</fast-menu-item>
                <fast-menu-item id="id2">Bar</fast-menu-item>
                <fast-menu-item>Baz</fast-menu-item>
            </fast-menu>
        `);

        await connect();

        expect(document.getElementById("id1")?.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should focus disabled items", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <div>I put a div in my menu</div>
                <fast-menu-item disabled id="id1">Foo</fast-menu-item>
                <fast-menu-item id="id2">Bar</fast-menu-item>
                <fast-menu-item>Baz</fast-menu-item>
            </fast-menu>
        `);

        await connect();

        expect(document.getElementById("id1")?.getAttribute("tabindex")).to.equal("0");

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

    it("should navigate the menu on arrow up/down keys", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item id="id1">Foo</fast-menu-item>
                <fast-menu-item role="menuitem" id="id2">Bar</fast-menu-item>
                <div>I put a div in my menu</div>
                <fast-menu-item role="menuitemradio" id="id3">Baz</fast-menu-item>
                <div>I put a div in my menu</div>
                <fast-menu-item role="menuitemcheckbox" id="id4">Baz</fast-menu-item>
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        const item1 = element.querySelector('[id="id1"]');
        (item1 as HTMLElement).focus();
        expect(document.activeElement?.id).to.equal("id1");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.id).to.equal("id2");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.id).to.equal("id3");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.id).to.equal("id4");

        document.activeElement?.dispatchEvent(arrowDownEvent);
        expect(document.activeElement?.id).to.equal("id4");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.id).to.equal("id3");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.id).to.equal("id2");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.id).to.equal("id1");

        document.activeElement?.dispatchEvent(arrowUpEvent);
        expect(document.activeElement?.id).to.equal("id1");

        await disconnect();
    });
});
