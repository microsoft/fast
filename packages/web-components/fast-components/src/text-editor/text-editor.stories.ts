import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { TextEditor as foundationTextEditor } from "@microsoft/fast-foundation";
import TextEditorTemplate from "./fixtures/base.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    const toolbarResources: object = {
        boldButtonTitle: "Bold",
        italicButtonTitle: "Italic",
    };

    if (name.toLowerCase().startsWith("text-editor")) {
        const editor1: foundationTextEditor = document.getElementById(
            "editor1"
        ) as foundationTextEditor;
        editor1.toolbarResources = toolbarResources;

        const editor2: foundationTextEditor = document.getElementById(
            "editor2"
        ) as foundationTextEditor;
        editor2.toolbarResources = toolbarResources;

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
