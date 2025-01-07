import { expect } from "chai";
import {
    Picker,
    PickerList,
    PickerListItem,
    pickerListItemTemplate,
    pickerListTemplate,
    PickerMenu,
    PickerMenuOption,
    pickerMenuOptionTemplate,
    pickerMenuTemplate,
    pickerTemplate,
} from "./index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@ni/fast-element";
import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyBackspace,
    keyDelete,
    keyEnd,
    keyEnter,
    keyEscape,
    keyHome,
} from "@ni/fast-web-utilities";

const FASTPickerList = PickerList.compose({
    baseName: "picker-list",
    template: pickerListTemplate,
    shadowOptions: null,
})

const FASTPickerListItem = PickerListItem.compose({
    baseName: "picker-list-item",
    template: pickerListItemTemplate
})

const FASTPickerMenu = PickerMenu.compose({
    baseName: "picker-menu",
    template: pickerMenuTemplate
})

const FASTPickerMenuOption = PickerMenuOption.compose({
    baseName: "picker-menu-option",
    template: pickerMenuOptionTemplate
})

const FASTPicker = Picker.compose({
    baseName: "picker",
    template: pickerTemplate,
    shadowOptions: {
        delegatesFocus: true,
    },
})

const enterEvent = new KeyboardEvent("keydown", {
    key: keyEnter,
    bubbles: true,
} as KeyboardEventInit);

const arrowLeftEvent = new KeyboardEvent("keydown", {
    key: keyArrowLeft,
    bubbles: true,
} as KeyboardEventInit);

const arrowRightEvent = new KeyboardEvent("keydown", {
    key: keyArrowRight,
    bubbles: true,
} as KeyboardEventInit);

const backEvent = new KeyboardEvent("keydown", {
    key: keyBackspace,
    bubbles: true,
} as KeyboardEventInit);

const deleteEvent = new KeyboardEvent("keydown", {
    key: keyDelete,
    bubbles: true,
} as KeyboardEventInit);


async function setupPicker() {
    const { element, connect, disconnect }: {
        element: HTMLElement & Picker,
        connect: () => void,
        disconnect: () => void
    } = await fixture(
        [
            FASTPicker(),
            FASTPickerList(),
            FASTPickerListItem(),
            FASTPickerMenu(),
            FASTPickerMenuOption()
        ]
    );

    return { element, connect, disconnect };
}

async function setupPickerList() {
    const { element, connect, disconnect } = await fixture(FASTPickerList());

    return { element, connect, disconnect };
}

async function setupPickerListItem() {
    const { element, connect, disconnect } = await fixture(FASTPickerListItem());

    return { element, connect, disconnect };
}

async function setupPickerMenu() {
    const { element, connect, disconnect } = await fixture(FASTPickerMenu());

    return { element, connect, disconnect };
}

async function setupPickerMenuOption() {
    const { element, connect, disconnect } = await fixture(FASTPickerMenuOption());

    return { element, connect, disconnect };
}



describe("Picker", () => {

    /**
     *  Picker tests
     */
     it("picker should create a list element when instanciated", async () => {
        const { element, connect, disconnect } = await setupPicker();
        await connect();

        expect(element.listElement).to.be.instanceof(PickerList);

        await disconnect();
    });

    it("picker should include a text input with role of 'combobox'", async () => {
        const { element, connect, disconnect } = await setupPicker();

        await connect();

        expect(element.inputElement?.getAttribute("role")).to.equal("combobox");

        await disconnect();
    });

    it("picker 'combobox' should reflect label/labbelledby/placeholder attributes on picker", async () => {
        const { element, connect, disconnect } = await setupPicker();

        element.label = "test label";
        element.labelledBy = "test labelledby";
        element.placeholder = "test placeholder";

        await connect();

        expect(element.inputElement?.getAttribute("aria-label")).to.equal("test label");
        expect(element.inputElement?.getAttribute("aria-labelledby")).to.equal("test labelledby");
        expect(element.inputElement?.getAttribute("placeholder")).to.equal("test placeholder");

        await disconnect();
    });

    it("picker should create a menu element when instanciated", async () => {
        const { element, connect, disconnect } = await setupPicker();
        await connect();

        expect(element.menuElement).to.be.instanceof(PickerMenu);

        await disconnect();
    });
    it("picker should generate list items for selected elements", async () => {
        const { element, connect, disconnect } = await setupPicker();

        element.selection = "apples,oranges,bananas"

        await connect();

        await DOM.nextUpdate();

        expect(element.querySelectorAll("fast-picker-list-item").length).to.equal(3);

        await disconnect();
    });

    it("picker should move focus to the input element when focused", async () => {
        const { element, connect, disconnect } = await setupPicker();
        await connect();

        await DOM.nextUpdate();

        element.focus();

        expect(document.activeElement === element.inputElement).to.equal(true);

        await disconnect();
    });

    it("picker should move focus accross list items with left/right arrow keys", async () => {
        const { element, connect, disconnect } = await setupPicker();

        element.selection = "apples,oranges,bananas"

        await connect();

        await DOM.nextUpdate();
        element.focus();

        expect(document.activeElement === element.inputElement).to.equal(true);

        const listItems: Element[] = Array.from(element.querySelectorAll("fast-picker-list-item"));

        element.dispatchEvent(arrowLeftEvent);
        expect(document.activeElement === listItems[2]).to.equal(true);

        element.dispatchEvent(arrowLeftEvent);
        expect(document.activeElement === listItems[1]).to.equal(true);

        element.dispatchEvent(arrowLeftEvent);
        expect(document.activeElement === listItems[0]).to.equal(true);

        element.dispatchEvent(arrowLeftEvent);
        expect(document.activeElement === listItems[0]).to.equal(true);

        element.dispatchEvent(arrowRightEvent);
        expect(document.activeElement === listItems[1]).to.equal(true);

        element.dispatchEvent(arrowRightEvent);
        expect(document.activeElement === listItems[2]).to.equal(true);

        element.dispatchEvent(arrowRightEvent);
        expect(document.activeElement === element.inputElement).to.equal(true);

        element.dispatchEvent(arrowRightEvent);
        expect(document.activeElement === element.inputElement).to.equal(true);

        await disconnect();
    });

    it("picker should delete entries with delete/backspace keystrokes", async () => {
        const { element, connect, disconnect } = await setupPicker();

        element.selection = "apples,oranges,bananas"

        await connect();

        await DOM.nextUpdate();
        element.focus();

        let listItems: Element[] = Array.from(element.querySelectorAll("fast-picker-list-item"));
        expect(listItems.length).to.equal(3);
        expect(element.selection).to.equal("apples,oranges,bananas");

        element.dispatchEvent(backEvent);
        await DOM.nextUpdate();
        listItems = Array.from(element.querySelectorAll("fast-picker-list-item"));
        expect(listItems.length).to.equal(2);
        expect(element.selection).to.equal("apples,oranges");

        element.dispatchEvent(deleteEvent);
        await DOM.nextUpdate();
        listItems = Array.from(element.querySelectorAll("fast-picker-list-item"));
        expect(listItems.length).to.equal(1);
        expect(element.selection).to.equal("apples");

        await disconnect();
    });

    it("picker should apply settings to place scaling menu below input by default", async () => {
        const { element, connect, disconnect } = await setupPicker();
        await connect();

        await DOM.nextUpdate();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("bottom");
        expect(element.menuConfig.verticalScaling).to.equal("fill");

        await disconnect();
    });

    it("picker should apply menu placement selections", async () => {
        const { element, connect, disconnect } = await setupPicker();
        element.menuPlacement = "top-fill";
        await connect();

        await DOM.nextUpdate();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("top");
        expect(element.menuConfig.verticalPositioningMode).to.equal("locktodefault");
        expect(element.menuConfig.verticalScaling).to.equal("fill");

        element.menuPlacement = "top";
        await DOM.nextUpdate();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("top");
        expect(element.menuConfig.verticalPositioningMode).to.equal("locktodefault");
        expect(element.menuConfig.verticalScaling).to.equal("content");

        element.menuPlacement = "bottom";
        await DOM.nextUpdate();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("bottom");
        expect(element.menuConfig.verticalPositioningMode).to.equal("locktodefault");
        expect(element.menuConfig.verticalScaling).to.equal("content");

        element.menuPlacement = "bottom-fill";
        await DOM.nextUpdate();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("bottom");
        expect(element.menuConfig.verticalPositioningMode).to.equal("locktodefault");
        expect(element.menuConfig.verticalScaling).to.equal("fill");

        element.menuPlacement = "tallest-fill";
        await DOM.nextUpdate();

        expect(element.menuConfig.verticalDefaultPosition).to.equal(undefined);
        expect(element.menuConfig.verticalPositioningMode).to.equal("dynamic");
        expect(element.menuConfig.verticalScaling).to.equal("fill");

        element.menuPlacement = "tallest";
        await DOM.nextUpdate();

        expect(element.menuConfig.verticalDefaultPosition).to.equal(undefined);
        expect(element.menuConfig.verticalPositioningMode).to.equal("dynamic");
        expect(element.menuConfig.verticalScaling).to.equal("content");

        await disconnect();
    });

    /**
     *  Picker-list tests
     */
    it("picker list should include a role of `list`", async () => {
        const { element, connect, disconnect } = await setupPickerList();

        await connect();

        expect(element.getAttribute("role")).to.equal("list");

        await disconnect();
    });

    /**
     *  Picker-list-item tests
     */
     it("picker list-item should include a role of `listitem`", async () => {
        const { element, connect, disconnect } = await setupPickerListItem();

        await connect();

        expect(element.getAttribute("role")).to.equal("listitem");

        await disconnect();
    });

    it("picker list-item emits 'pickeriteminvoked' event when clicked", async () => {
        const { element, connect, disconnect } = await setupPickerListItem();

        let wasInvoked: boolean = false;

        element.addEventListener("pickeriteminvoked", e => {
            wasInvoked = true;
        });

        await connect();

        element.click();

        expect(wasInvoked).to.equal(true);

        await disconnect();
    });

    it("picker menu-option emits 'pickeriteminvoked' event on 'Enter'", async () => {
        const { element, connect, disconnect } = await setupPickerListItem();

        let wasInvoked: boolean = false;

        element.addEventListener("pickeriteminvoked", e => {
            wasInvoked = true;
        });

        await connect();

        element.dispatchEvent(enterEvent);

        expect(wasInvoked).to.equal(true);

        await disconnect();
    });

    /**
     *  Picker-menu tests
     */
    it("picker menu should include a role of `list`", async () => {
        const { element, connect, disconnect } = await setupPickerMenu();

        await connect();

        expect(element.getAttribute("role")).to.equal("list");

        await disconnect();
    });

    /**
     *  Picker-menu-option tests
     */
    it("picker menu-option should include a role of `listitem`", async () => {
        const { element, connect, disconnect } = await setupPickerMenuOption();

        await connect();

        expect(element.getAttribute("role")).to.equal("listitem");

        await disconnect();
    });

    it("picker menu-option emits 'pickeroptioninvoked' event when clicked", async () => {
        const { element, connect, disconnect } = await setupPickerMenuOption();

        let wasInvoked: boolean = false;

        element.addEventListener("pickeroptioninvoked", e => {
            wasInvoked = true;
        });

        await connect();

        element.click();

        expect(wasInvoked).to.equal(true);

        await disconnect();
    });
});
