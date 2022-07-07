import { expect } from "chai";
import {
    FASTPicker,
    FASTPickerList,
    FASTPickerListItem,
    pickerListItemTemplate,
    pickerListTemplate,
    FASTPickerMenu,
    FASTPickerMenuOption,
    pickerMenuOptionTemplate,
    pickerMenuTemplate,
    pickerTemplate,
} from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { Updates } from "@microsoft/fast-element";
import {
    keyArrowLeft,
    keyArrowRight,
    keyBackspace,
    keyDelete,
    keyEnter,
} from "@microsoft/fast-web-utilities";
import { FASTAnchoredRegion, anchoredRegionTemplate } from "../anchored-region/index.js";
import { FASTProgressRing, progressRingTemplate } from "../progress-ring/index.js";

const anchoredRegionName = uniqueElementName();
FASTAnchoredRegion.define({
    name: anchoredRegionName,
    template: anchoredRegionTemplate()
});

const pickerListName = uniqueElementName();
FASTPickerList.define({
    name: pickerListName,
    template: pickerListTemplate(),
    shadowOptions: null,
});

const pickerListItemName = uniqueElementName();
FASTPickerListItem.define({
    name: pickerListItemName,
    template: pickerListItemTemplate()
});

const pickerMenuName = uniqueElementName();
FASTPickerMenu.define({
    name: pickerMenuName,
    template: pickerMenuTemplate()
});

const pickerMenuOptionName = uniqueElementName();
FASTPickerMenuOption.define({
    name: pickerMenuOptionName,
    template: pickerMenuOptionTemplate()
});

const progressRingName = uniqueElementName();
FASTProgressRing.define({
    name: progressRingName,
    template: progressRingTemplate()
});

const pickerName = uniqueElementName();
FASTPicker.define({
    name: pickerName,
    template: pickerTemplate({
        anchoredRegion: anchoredRegionName,
        pickerList: pickerListName,
        pickerListItem: pickerListItemName,
        pickerMenu: pickerMenuName,
        pickerMenuOption: pickerMenuOptionName,
        progressRing: progressRingName
    }),
    shadowOptions: {
        delegatesFocus: true,
    },
});

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
        element: HTMLElement & FASTPicker,
        connect: () => void,
        disconnect: () => void
    } = await fixture<FASTPicker>(pickerName);

    return { element, connect, disconnect };
}

async function setupPickerList() {
    const { element, connect, disconnect } = await fixture<FASTPickerList>(pickerListName);

    return { element, connect, disconnect };
}

async function setupPickerListItem() {
    const { element, connect, disconnect } = await fixture<FASTPickerListItem>(pickerListItemName);

    return { element, connect, disconnect };
}

async function setupPickerMenu() {
    const { element, connect, disconnect } = await fixture<FASTPickerMenu>(pickerMenuName);

    return { element, connect, disconnect };
}

async function setupPickerMenuOption() {
    const { element, connect, disconnect } = await fixture<FASTPickerMenuOption>(pickerMenuOptionName);

    return { element, connect, disconnect };
}



describe("Picker", () => {

    /**
     *  Picker tests
     */
     it("picker should create a list element when instanciated", async () => {
        const { element, connect, disconnect } = await setupPicker();
        await connect();

        expect(element.listElement).to.be.instanceof(FASTPickerList);

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

        expect(element.menuElement).to.be.instanceof(FASTPickerMenu);

        await disconnect();
    });
    it("picker should generate list items for selected elements", async () => {
        const { element, connect, disconnect } = await setupPicker();

        element.selection = "apples,oranges,bananas"

        await connect();

        await Updates.next();

        expect(element.querySelectorAll(pickerListItemName).length).to.equal(3);

        await disconnect();
    });

    it("picker should move focus to the input element when focused", async () => {
        const { element, connect, disconnect } = await setupPicker();
        await connect();

        await Updates.next();

        element.focus();

        expect(document.activeElement === element.inputElement).to.equal(true);

        await disconnect();
    });

    it("picker should move focus accross list items with left/right arrow keys", async () => {
        const { element, connect, disconnect } = await setupPicker();

        element.selection = "apples,oranges,bananas"

        await connect();

        await Updates.next();
        element.focus();

        expect(document.activeElement === element.inputElement).to.equal(true);

        const listItems: Element[] = Array.from(element.querySelectorAll(pickerListItemName));

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

        await Updates.next();
        element.focus();

        let listItems: Element[] = Array.from(element.querySelectorAll(pickerListItemName));
        expect(listItems.length).to.equal(3);
        expect(element.selection).to.equal("apples,oranges,bananas");

        element.dispatchEvent(backEvent);
        await Updates.next();
        listItems = Array.from(element.querySelectorAll(pickerListItemName));
        expect(listItems.length).to.equal(2);
        expect(element.selection).to.equal("apples,oranges");

        element.dispatchEvent(deleteEvent);
        await Updates.next();
        listItems = Array.from(element.querySelectorAll(pickerListItemName));
        expect(listItems.length).to.equal(1);
        expect(element.selection).to.equal("apples");

        await disconnect();
    });

    it("picker should apply settings to place scaling menu below input by default", async () => {
        const { element, connect, disconnect } = await setupPicker();
        await connect();

        await Updates.next();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("bottom");
        expect(element.menuConfig.verticalScaling).to.equal("fill");

        await disconnect();
    });

    it("picker should apply menu placement selections", async () => {
        const { element, connect, disconnect } = await setupPicker();
        element.menuPlacement = "top-fill";
        await connect();

        await Updates.next();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("top");
        expect(element.menuConfig.verticalPositioningMode).to.equal("locktodefault");
        expect(element.menuConfig.verticalScaling).to.equal("fill");

        element.menuPlacement = "top";
        await Updates.next();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("top");
        expect(element.menuConfig.verticalPositioningMode).to.equal("locktodefault");
        expect(element.menuConfig.verticalScaling).to.equal("content");

        element.menuPlacement = "bottom";
        await Updates.next();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("bottom");
        expect(element.menuConfig.verticalPositioningMode).to.equal("locktodefault");
        expect(element.menuConfig.verticalScaling).to.equal("content");

        element.menuPlacement = "bottom-fill";
        await Updates.next();

        expect(element.menuConfig.verticalDefaultPosition).to.equal("bottom");
        expect(element.menuConfig.verticalPositioningMode).to.equal("locktodefault");
        expect(element.menuConfig.verticalScaling).to.equal("fill");

        element.menuPlacement = "tallest-fill";
        await Updates.next();

        expect(element.menuConfig.verticalDefaultPosition).to.equal(undefined);
        expect(element.menuConfig.verticalPositioningMode).to.equal("dynamic");
        expect(element.menuConfig.verticalScaling).to.equal("fill");

        element.menuPlacement = "tallest";
        await Updates.next();

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
