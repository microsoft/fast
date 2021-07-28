import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import PickerTemplate from "./fixtures/picker.html";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    // if (name.toLowerCase().startsWith("picker")) {
    // }
});

export default {
    title: "Picker",
};

export const Picker = () => PickerTemplate;
