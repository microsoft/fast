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
import { DOM } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";

const FASTPickerList = PickerList.compose({
    baseName: "picker-list",
    template: pickerListTemplate
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
    template: pickerTemplate
})

const enterEvent = new KeyboardEvent("keydown", {
    key: "Enter",
    keyCode: KeyCodes.enter,
    bubbles: true,
} as KeyboardEventInit);


async function setupPicker() {
    const { element, connect, disconnect } = await fixture(
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

        expect((element as Picker).listElement).to.be.instanceof(PickerList);

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

    
    it("picker list should include a text input with role of 'combobox'", async () => {
        const { element, connect, disconnect } = await setupPickerList();

        await connect();

        const inputElement: HTMLInputElement | null | undefined = element.shadowRoot?.querySelector('.input-element');

        expect(inputElement?.getAttribute("role")).to.equal("combobox");

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
