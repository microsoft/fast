import { customElement, html, ViewTemplate } from "@microsoft/fast-element";
import { expect, assert } from "chai";
import { fixture } from "../fixture";
import { ListPicker, createListPickerTemplate } from "./index";

function createItemTemplate(): ViewTemplate {
    return html`
        <button role="listitem">${x => x}</button>
    `;
}

function createOptionTemplate(): ViewTemplate {
    return html`
        <button role="option">${x => x}</button>
    `;
}

@customElement({
    name: "fast-list-picker",
    template: createListPickerTemplate("fast", "fast-list-picker-menu", createItemTemplate(), createOptionTemplate()),
})
class FASTListPicker extends ListPicker {}

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<FASTListPicker>(
        "fast-list-picker"
    );

    return { element, connect, disconnect, parent };
}

// describe("ListPicker", () => {
// });
