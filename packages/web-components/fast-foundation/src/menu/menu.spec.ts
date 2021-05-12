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

    it("should focus on first menu item when focus is called", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu id="menu">
                <fast-menu-item id="id1">Foo</fast-menu-item>
                <fast-menu-item id="id2">Bar</fast-menu-item>
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        element.focus();
        expect(document.activeElement?.id).to.equal("id1");

        await disconnect();
    });

    it("should not throw when focus is called with no items", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu id="menu">
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        element.focus();
        expect(document.activeElement?.id).to.equal("");

        await disconnect();
    });

    it("should not throw when focus is called before initialization is complete", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu id="menu">
                <fast-menu-item id="id1">Foo</fast-menu-item>
                <fast-menu-item id="id2">Bar</fast-menu-item>
            </fast-menu>
        `);

        //don't wait for connect...

        element.focus();
        expect(document.activeElement?.id).to.equal("");

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

    it("should not set any tabindex on non menu items elements", async () => {
        const { connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <div id="not-an-item">I put a div in my menu</div>
                <fast-menu-item id="id1">Foo</fast-menu-item>
                <fast-menu-item id="id2">Bar</fast-menu-item>
                <fast-menu-item>Baz</fast-menu-item>
            </fast-menu>
        `);

        await connect();

        expect(document.getElementById("not-an-item")?.hasAttribute("tabindex")).to.equal(false);

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

    it("should not set indent class on non-menu items", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item>Foo</fast-menu-item>
                <fast-menu-item>Bar</fast-menu-item>
                <hr id="id1"></hr>
                <fast-menu-item>Baz</fast-menu-item>
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        expect(document.getElementById("id1")?.className).to.not.contain("indent");

        await disconnect();
    });

    it("should set class on menu items to 0 columns", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item id="id1">Foo</fast-menu-item>
                <fast-menu-item>Bar</fast-menu-item>
                <fast-menu-item>Baz</fast-menu-item>
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        expect(document.getElementById("id1")?.className).to.contain("indent-0");

        await disconnect();
    });

    it("should set class on menu items to 1 column", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item id="id1">Foo</fast-menu-item>
                <fast-menu-item>Bar</fast-menu-item>
                <fast-menu-item role="menuitemradio">Baz</fast-menu-item>
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        expect(document.getElementById("id1")?.className).to.contain("indent-1");

        await disconnect();
    });

    it("should set class on menu items to 2 columns", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item id="id1">Foo</fast-menu-item>
                <fast-menu-item>Bar</fast-menu-item>
                <fast-menu-item role="menuitemradio"><div slot="start">Foo</div>Baz</fast-menu-item>
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        expect(document.getElementById("id1")?.className).to.contain("indent-2");

        await disconnect();
    });

    it("should navigate the menu on arrow up/down keys", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item id="id1">One</fast-menu-item>
                <fast-menu-item role="menuitem" id="id2">Two</fast-menu-item>
                <div>I put a div in my menu</div>
                <fast-menu-item role="menuitemradio" id="id3">Three</fast-menu-item>
                <div>I put a div in my menu</div>
                <fast-menu-item role="menuitemcheckbox" id="id4">Four</fast-menu-item>
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

    it("should treat all checkbox menu items as individually selectable items", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item role="menuitemcheckbox" id="id1">One</fast-menu-item>
                <fast-menu-item role="menuitemcheckbox" id="id2">Two</fast-menu-item>
                <fast-menu-item role="menuitemcheckbox" id="id3">Three</fast-menu-item>
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        const item1 = element.querySelector('[id="id1"]');
        const item2 = element.querySelector('[id="id2"]');
        const item3 = element.querySelector('[id="id3"]');

        expect(item1?.getAttribute("aria-checked")).to.equal(null);
        expect(item2?.getAttribute("aria-checked")).to.equal(null);
        expect(item3?.getAttribute("aria-checked")).to.equal(null);

        (item1 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal(null);
        expect(item3?.getAttribute("aria-checked")).to.equal(null);

        (item2 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal(null);

        (item3 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal("true");

        (item3 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal("false");

        await disconnect();
    });

    it("should treat all radio menu items as a 'radio group' and limit selection to one item within the group by default", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item role="menuitemradio" id="id1">One</fast-menu-item>
                <fast-menu-item role="menuitemradio" id="id2">Two</fast-menu-item>
                <fast-menu-item role="menuitemradio" id="id3">Three</fast-menu-item>
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        const item1 = element.querySelector('[id="id1"]');
        const item2 = element.querySelector('[id="id2"]');
        const item3 = element.querySelector('[id="id3"]');

        expect(item1?.getAttribute("aria-checked")).to.equal(null);
        expect(item2?.getAttribute("aria-checked")).to.equal(null);
        expect(item3?.getAttribute("aria-checked")).to.equal(null);

        (item1 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("false");
        expect(item3?.getAttribute("aria-checked")).to.equal("false");

        (item2 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("false");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal("false");

        (item3 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("false");
        expect(item2?.getAttribute("aria-checked")).to.equal("false");
        expect(item3?.getAttribute("aria-checked")).to.equal("true");

        await disconnect();
    });

    it("should use elements with role='separator' to divide radio menu items into different radio groups ", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTMenu>`
            <fast-menu>
                <fast-menu-item role="menuitemradio" id="id1">One</fast-menu-item>
                <fast-menu-item role="menuitemradio" id="id2">Two</fast-menu-item>
                <div role="separator"></div>
                <fast-menu-item role="menuitemradio" id="id3">Three</fast-menu-item>
                <fast-menu-item role="menuitemradio" id="id4">Four</fast-menu-item>
            </fast-menu>
        `);

        await connect();
        await DOM.nextUpdate();

        const item1 = element.querySelector('[id="id1"]');
        const item2 = element.querySelector('[id="id2"]');
        const item3 = element.querySelector('[id="id3"]');
        const item4 = element.querySelector('[id="id4"]');

        expect(item1?.getAttribute("aria-checked")).to.equal(null);
        expect(item2?.getAttribute("aria-checked")).to.equal(null);
        expect(item3?.getAttribute("aria-checked")).to.equal(null);
        expect(item4?.getAttribute("aria-checked")).to.equal(null);

        (item1 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("false");
        expect(item3?.getAttribute("aria-checked")).to.equal(null);
        expect(item4?.getAttribute("aria-checked")).to.equal(null);

        (item2 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("false");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal(null);
        expect(item4?.getAttribute("aria-checked")).to.equal(null);

        (item3 as HTMLElement).click();
        await DOM.nextUpdate();
        expect(item1?.getAttribute("aria-checked")).to.equal("false");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal("true");
        expect(item4?.getAttribute("aria-checked")).to.equal("false");

        await disconnect();
    });
});
