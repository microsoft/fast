import { expect } from "chai";
import { TextEditor, textEditorTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";

const FASTTextEditor = TextEditor.compose({
    baseName: "text-editor",
    template,
})

async function setup() {
    const { connect, disconnect, document, element } = await fixture(FASTTextEditor());

    return { connect, disconnect, document, element };
}

describe("Text editor", () => {
});
