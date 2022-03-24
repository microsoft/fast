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
            alignLeftButtonTitle: "Left",
            alignLeftButtonTooltip: "Click to align left",
            alignCenterButtonTitle: "Center",
            alignCenterButtonTooltip: "Click to align center",
            alignRightButtonTitle: "Right",
            alignRightButtonTooltip: "Click to align right",
            undoButtonTitle: "Undo",
            undoButtonTooltip: "Click to redo",
            redoButtonTitle: "Undo",
            reddoButtonTooltip: "Click to undo",
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
