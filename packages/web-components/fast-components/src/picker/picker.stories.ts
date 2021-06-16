import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { FASTDesignSystemProvider } from "../design-system-provider";
import PickerTemplate from "./fixtures/picker.html";
import { FASTPicker } from "./";

// Prevent tree-shaking
FASTPicker;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    // if (name.toLowerCase().startsWith("picker")) {
    // }
});

export default {
    title: "Picker",
};

export const Picker = () => PickerTemplate;
