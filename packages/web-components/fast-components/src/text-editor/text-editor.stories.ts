import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import TextEditorTemplate from "./fixtures/base.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    // if (name.toLowerCase().startsWith("text-editor")) {
    // }
});

export default {
    title: "Text Editor",
};

export const TextEditor = () => TextEditorTemplate;
