import { expect } from "chai";
import { FASTMenu, menuTemplate } from "./index.js";
import { FASTMenuItem, menuItemTemplate, MenuItemRole } from "../menu-item/index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { Updates } from "@microsoft/fast-element";
import { keyArrowDown, keyArrowUp } from "@microsoft/fast-web-utilities";
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

const menuName = uniqueElementName();
FASTMenu.define({
    name: menuName,
    template: menuTemplate(),
});

const arrowUpEvent = new KeyboardEvent("keydown", {
    key: keyArrowUp,
    bubbles: true,
} as KeyboardEventInit);

const arrowDownEvent = new KeyboardEvent("keydown", {
    key: keyArrowDown,
    bubbles: true,
} as KeyboardEventInit);

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTMenu>(menuName);

    const menuItem1 = document.createElement(menuItemName);
    (menuItem1 as FASTMenuItem).textContent = "Foo";
    (menuItem1 as FASTMenuItem).id = "id1";

    const menuItem2 = document.createElement(menuItemName);
    (menuItem2 as FASTMenuItem).textContent = "Bar";
    (menuItem2 as FASTMenuItem).id = "id2";

    const menuItem3 = document.createElement(menuItemName);
    (menuItem3 as FASTMenuItem).textContent = "Baz";
    (menuItem3 as FASTMenuItem).id = "id3";

    const menuItem4 = document.createElement(menuItemName);
    (menuItem4 as FASTMenuItem).textContent = "Bat";
    (menuItem4 as FASTMenuItem).id = "id4";

    element.appendChild(menuItem1);
    element.appendChild(menuItem2);
    element.appendChild(menuItem3);
    element.appendChild(menuItem4);

    return { element, connect, disconnect, menuItem1, menuItem2, menuItem3, menuItem4 };
}

describe("Menu", () => {
    it("should include a role of menu", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenu>(menuName);

        await connect();

        expect(element.getAttribute("role")).to.equal("menu");

        await disconnect();
    });

    it("should focus on first menu item when focus is called", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        await Updates.next();

        element.focus();
        expect(document.activeElement?.id).to.equal("id1");

        await disconnect();
    });

    it("should not throw when focus is called with no items", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenu>(menuName);

        await connect();
        await Updates.next();

        element.focus();
        expect(document.activeElement?.id).to.equal("");

        await disconnect();
    });

    it("should not throw when focus is called before initialization is complete", async () => {
        const { element, connect, disconnect } = await setup();

        //don't wait for connect...

        element.focus();
        expect(document.activeElement?.id).to.equal("");

        await disconnect();
    });


    it("should set tabindex of the first focusable menu item to 0", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        await Updates.next();

        expect(document.getElementById("id1")?.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should not set any tabindex on non menu item elements", async () => {
        const { element, connect, disconnect, menuItem1 } = await setup();

        const notMenuItem = document.createElement("div");
        notMenuItem.id = "not-an-item";

        element.insertBefore(notMenuItem, menuItem1);

        await connect();

        await Updates.next();

        expect(document.getElementById("not-an-item")?.hasAttribute("tabindex")).to.equal(false);

        await disconnect();
    });

    it("should focus disabled items", async () => {
        const { element, connect, disconnect, menuItem1 } = await setup();

        (menuItem1 as FASTMenuItem).disabled = true;

        await connect();
        await Updates.next();

        expect(document.getElementById("id1")?.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should accept elements with role of `menuitem` as focusable child", async () => {
        const { element, connect, disconnect } = await setup();

        const menuItem1 = document.createElement("div");
        const menuItem2 = document.createElement("div");
        const menuItem3 = document.createElement("div");

        menuItem1.textContent = "Foo";
        (menuItem1 as any).role = "menuitem";

        menuItem2.textContent = "Bar";
        (menuItem2 as any).role = "menuitem";

        menuItem3.textContent = "Baz";
        (menuItem3 as any).role = "menuitem";

        element.appendChild(menuItem1);
        element.appendChild(menuItem2);
        element.appendChild(menuItem3);

        await connect();

        await Updates.next();

        expect(
            element.querySelector("[role='menuitem']")?.getAttribute("tabindex")
        ).to.equal("0");

        await disconnect();
    });

    it("should accept elements with role of `menuitemcheckbox` as focusable child", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenu>(menuName);

        const menuItem1 = document.createElement("div");
        const menuItem2 = document.createElement("div");
        const menuItem3 = document.createElement("div");

        menuItem1.textContent = "Foo";
        menuItem2.textContent = "Bar";
        menuItem3.textContent = "Baz";

        element.appendChild(menuItem1);
        element.appendChild(menuItem2);
        element.appendChild(menuItem3);

        menuItem1.setAttribute("role", "menuitemcheckbox");
        menuItem2.setAttribute("role", "menuitemcheckbox");
        menuItem3.setAttribute("role", "menuitemcheckbox");

        await connect();
        await Updates.next();

        expect(
            element.querySelector("[role='menuitemcheckbox']")?.getAttribute("tabindex")
        ).to.equal("0");

        await disconnect();
    });

    it("should accept elements with role of `menuitemradio` as focusable child", async () => {
        const { element, connect, disconnect } = await fixture<FASTMenu>(menuName);

        const menuItem1 = document.createElement("div");
        const menuItem2 = document.createElement("div");
        const menuItem3 = document.createElement("div");

        menuItem1.textContent = "Foo";
        menuItem2.textContent = "Bar";
        menuItem3.textContent = "Baz";

        element.appendChild(menuItem1);
        element.appendChild(menuItem2);
        element.appendChild(menuItem3);

        menuItem1.setAttribute("role", "menuitemradio");
        menuItem2.setAttribute("role", "menuitemradio");
        menuItem3.setAttribute("role", "menuitemradio");

        await connect();
        await Updates.next();

        expect(
            element.querySelector("[role='menuitemradio']")?.getAttribute("tabindex")
        ).to.equal("0");

        await disconnect();
    });

    it("should not set indent class on non-menu items", async () => {
        const { element, connect, disconnect, menuItem1, menuItem2, menuItem3 } = await setup();

        const hr = document.createElement("hr");

        element.insertBefore(hr, menuItem2);

        hr.setAttribute("id", "hrid");

        await connect();
        await Updates.next();

        expect(document.getElementById("hrid")?.className).to.not.contain("indent");

        await disconnect();
    });

    it("should set class on menu items to 0 columns", async () => {
        const { element, connect, disconnect, menuItem1, menuItem2, menuItem3 } = await setup();

        await connect();
        await Updates.next();

        const item1 = element.querySelector('[id="id1"]');

        expect(item1?.className).to.contain("indent-0");

        await disconnect();
    });

    it("should set class on menu items to 0 columns when non fast-menu-item is present", async () => {
        const { element, connect, disconnect, menuItem1, menuItem2, menuItem3 } = await setup();

        const anchor = document.createElement("a");
        anchor.setAttribute("role", "menuitem");

        element.insertBefore(anchor, menuItem2);

        await connect();
        await Updates.next();

        const item1 = element.querySelector('[id="id1"]');

        expect(item1?.className).to.contain("indent-0");

        await disconnect();
    });

    it("should set class on menu items to 1 column", async () => {
        const { element, connect, disconnect, menuItem1, menuItem2, menuItem3 } = await setup();

        (menuItem3 as FASTMenuItem).role = MenuItemRole.menuitemradio;

        await connect();
        await Updates.next();

        const item1 = element.querySelector('[id="id1"]');

        expect(item1?.className).to.contain("indent-1");

        await disconnect();
    });

    it("should set class on menu items to 2 columns", async () => {
        const { element, connect, disconnect, menuItem1, menuItem2, menuItem3 } = await setup();

        const startSlot = document.createElement("div");

        (menuItem3 as FASTMenuItem).role = MenuItemRole.menuitemradio;

        startSlot.setAttribute("slot", "start");

        menuItem3.appendChild(startSlot);

        await connect();
        await Updates.next();

        const item1 = element.querySelector('[id="id1"]');

        expect(item1?.className).to.contain("indent-2");

        await disconnect();
    });

    it("should not navigate to hidden items", async () => {
        const { element, connect, disconnect, menuItem3, menuItem4 } = await setup();

        const hiddenItem1 = document.createElement(menuItemName);
        const hiddenItem2 = document.createElement(menuItemName);

        (hiddenItem1 as FASTMenuItem).setAttribute("hidden", "");
        (hiddenItem2 as FASTMenuItem).setAttribute("hidden", "");

        element.insertBefore(hiddenItem1, menuItem3);
        element.insertBefore(hiddenItem2, menuItem4);

        await connect();
        await Updates.next();

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

    it("should navigate the menu on arrow up/down keys", async () => {
        const { element, connect, disconnect, menuItem1, menuItem2, menuItem3, menuItem4 } = await setup();

        const notMenuItem1 = document.createElement("div");
        const notMenuItem2 = document.createElement("div");

        (menuItem3 as FASTMenuItem).role = MenuItemRole.menuitemradio;
        (menuItem4 as FASTMenuItem).role = MenuItemRole.menuitemcheckbox;

        element.insertBefore(notMenuItem1, menuItem3);
        element.insertBefore(notMenuItem2, menuItem4);

        await connect();
        await Updates.next();

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
        const { element, connect, disconnect, menuItem1, menuItem2, menuItem3 } = await setup();

        (menuItem1 as FASTMenuItem).role = MenuItemRole.menuitemcheckbox;
        (menuItem2 as FASTMenuItem).role = MenuItemRole.menuitemcheckbox;
        (menuItem3 as FASTMenuItem).role = MenuItemRole.menuitemcheckbox;

        await connect();
        await Updates.next();

        const item1 = element.querySelector('[id="id1"]');
        const item2 = element.querySelector('[id="id2"]');
        const item3 = element.querySelector('[id="id3"]');

        expect(item1?.getAttribute("aria-checked")).to.equal(null);
        expect(item2?.getAttribute("aria-checked")).to.equal(null);
        expect(item3?.getAttribute("aria-checked")).to.equal(null);

        (item1 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal(null);
        expect(item3?.getAttribute("aria-checked")).to.equal(null);

        (item2 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal(null);

        (item3 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal("true");

        (item3 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal("false");

        await disconnect();
    });

    it("should treat all radio menu items as a 'radio group' and limit selection to one item within the group by default", async () => {
        const { element, connect, disconnect, menuItem1, menuItem2, menuItem3, menuItem4 } = await setup();

        element.removeChild(menuItem4);

        (menuItem1 as FASTMenuItem).role = MenuItemRole.menuitemradio;
        (menuItem2 as FASTMenuItem).role = MenuItemRole.menuitemradio;
        (menuItem3 as FASTMenuItem).role = MenuItemRole.menuitemradio;

        await connect();
        await Updates.next();

        const item1 = element.querySelector('[id="id1"]');
        const item2 = element.querySelector('[id="id2"]');
        const item3 = element.querySelector('[id="id3"]');

        expect(item1?.getAttribute("aria-checked")).to.equal(null);
        expect(item2?.getAttribute("aria-checked")).to.equal(null);
        expect(item3?.getAttribute("aria-checked")).to.equal(null);

        (item1 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("false");
        expect(item3?.getAttribute("aria-checked")).to.equal("false");

        (item2 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("false");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal("false");

        (item3 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("false");
        expect(item2?.getAttribute("aria-checked")).to.equal("false");
        expect(item3?.getAttribute("aria-checked")).to.equal("true");

        await disconnect();
    });

    it("should use elements with role='separator' to divide radio menu items into different radio groups ", async () => {
        const { element, connect, disconnect, menuItem1, menuItem2, menuItem3, menuItem4 } = await setup();

        (menuItem1 as FASTMenuItem).role = MenuItemRole.menuitemradio;
        (menuItem2 as FASTMenuItem).role = MenuItemRole.menuitemradio;
        (menuItem3 as FASTMenuItem).role = MenuItemRole.menuitemradio;
        (menuItem4 as FASTMenuItem).role = MenuItemRole.menuitemradio;

        const separator = document.createElement("div");

        element.insertBefore(separator, menuItem3);

        separator.setAttribute("role", "separator");

        await connect();
        await Updates.next();

        const item1 = element.querySelector('[id="id1"]');
        const item2 = element.querySelector('[id="id2"]');
        const item3 = element.querySelector('[id="id3"]');
        const item4 = element.querySelector('[id="id4"]');

        expect(item1?.getAttribute("aria-checked")).to.equal(null);
        expect(item2?.getAttribute("aria-checked")).to.equal(null);
        expect(item3?.getAttribute("aria-checked")).to.equal(null);
        expect(item4?.getAttribute("aria-checked")).to.equal(null);

        (item1 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("true");
        expect(item2?.getAttribute("aria-checked")).to.equal("false");
        expect(item3?.getAttribute("aria-checked")).to.equal(null);
        expect(item4?.getAttribute("aria-checked")).to.equal(null);

        (item2 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("false");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal(null);
        expect(item4?.getAttribute("aria-checked")).to.equal(null);

        (item3 as HTMLElement).click();
        await Updates.next();
        expect(item1?.getAttribute("aria-checked")).to.equal("false");
        expect(item2?.getAttribute("aria-checked")).to.equal("true");
        expect(item3?.getAttribute("aria-checked")).to.equal("true");
        expect(item4?.getAttribute("aria-checked")).to.equal("false");

        await disconnect();
    });
});
