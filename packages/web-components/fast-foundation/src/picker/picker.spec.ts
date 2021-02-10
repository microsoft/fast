import { customElement, html, ViewTemplate } from "@microsoft/fast-element";
import { expect, assert } from "chai";
import { fixture } from "../fixture";
import { Picker, createPickerTemplate } from "./index";

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
    name: "fast-picker",
    template: createPickerTemplate("fast", "fast-picker-menu", createItemTemplate(), createOptionTemplate()),
})
class FASTPicker extends Picker {}

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<FASTPicker>(
        "fast-picker"
    );

    return { element, connect, disconnect, parent };
}

// describe("Picker", () => {
// });
