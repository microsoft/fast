import { STORY_RENDERED } from "@storybook/core-events";
import { toggleBold, toggleItalic } from "roosterjs-editor-api";
import addons from "@storybook/addons";
import { html, ViewTemplate } from "@microsoft/fast-element";
import {
    TextEditor as foundationTextEditor,
    TextEditorToolbar,
} from "@microsoft/fast-foundation";
import TextEditorTemplate from "./fixtures/base.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("text-editor")) {
        const toolbarResources: object = {
            boldButtonTitle: "Bold",
            boldButtonTooltip: "Click to bold text",

            italicButtonTitle: "Italic",
            italicButtonTooltip: "Click to italicize text",

            bulletButtonTitle: "Bullet",
            bulletButtonTooltip: "Click to bullet text",

            codeButtonTitle: "Clear button",
            codeButtonTooltip: "Click to make it code",

            clearFormatButtonTitle: "Clear format",
            clearFormatButtonTooltip: "Click to clear format",

            alignLeftButtonTitle: "Left",
            alignLeftButtonTooltip: "Click to align left",

            alignCenterButtonTitle: "Center",
            alignCenterButtonTooltip: "Click to align center",

            alignRightButtonTitle: "Right",
            alignRightButtonTooltip: "Click to align right",

            undoButtonTitle: "Undo",
            undoButtonTooltip: "Click to undo",

            redoButtonTitle: "Redo",
            redoButtonTooltip: "Click to redo",

            increaseSizeButtonTitle: "+Size",
            increaseSizeButtonTooltip: "Click to increase font size",

            decreaseSizeButtonTitle: "-Size",
            decreaseSizeButtonTooltip: "Click to decrease font size",

            increaseIndentButtonTitle: "+Indent",
            increaseIndentButtonTooltip: "Click to increase indent",

            decreaseIndentButtonTitle: "-Indent",
            decreaseIndentButtonTooltip: "Click to decrease indent",

            underlineButtonTitle: "Underline",
            underlineButtonTooltip: "Click to toggle underline",

            superscriptButtonTitle: "Superscript",
            superscriptButtonTooltip: "Click to toggle superscript",

            subscriptButtonTitle: "Subscript",
            subscriptButtonTooltip: "Click to toggle subscript",

            rtlButtonTitle: "RTL",
            rtlButtonTooltip: "Click to set direction right to left",

            ltrButtonTitle: "LTR",
            ltrButtonTooltip: "Click to set direction left to right",

            strikethroughButtonTitle: "StrikeThrough",
            strikethroughButtonTooltip: "Click to toggle StrikeThrough",

            blockquoteButtonTitle: "BlockQuote",
            blockquoteButtonTooltip: "Click to toggle BlockQuote",

            numberingButtonTitle: "Numbered list",
            numberingButtonTooltip: "Click to toggle Numbered List",
        };

        const customToolbarTemplate: ViewTemplate = html<TextEditorToolbar>`
            <fast-toolbar class="toolbar" part="toolbar">
                <fast-button @click="${x => toggleBold(x.editor)}">
                    Template Bold
                </fast-button>
                <fast-button @click="${x => toggleItalic(x.editor)}">
                    ${x => x.resources["italicButtonTitle"]}
                </fast-button>
            </fast-toolbar>
        `;

        const editor1: foundationTextEditor = document.getElementById(
            "editor1"
        ) as foundationTextEditor;
        editor1.toolbarResources = toolbarResources;

        const editor2: foundationTextEditor = document.getElementById(
            "editor2"
        ) as foundationTextEditor;
        editor2.toolbarResources = toolbarResources;
        editor2.toolbarTemplate = customToolbarTemplate;

        const editor3: foundationTextEditor = document.getElementById(
            "editor3"
        ) as foundationTextEditor;
        editor3.toolbarResources = toolbarResources;

        const editor4: foundationTextEditor = document.getElementById(
            "editor4"
        ) as foundationTextEditor;
        editor4.toolbarResources = toolbarResources;
    }
});

export default {
    title: "Text Editor",
};

export const TextEditor = () => TextEditorTemplate;
