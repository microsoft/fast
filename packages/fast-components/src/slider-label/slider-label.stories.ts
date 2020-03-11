import { FASTSliderLabel } from ".";
// import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";

// Prevent tree-shaking
FASTSliderLabel;
// FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("slider")) {
        // setIndeterminate();
    }
});

document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        //setIndeterminate();
    }
});

export default {
    title: "SliderLabel",
};

export const Base = () => Examples;
