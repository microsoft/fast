import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";
import { FASTSlider } from ".";

// Prevent tree-shaking
FASTSlider;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().endsWith("slider")) {
        ["switcher", "switcher2", "slider1"].forEach(x => {
            const slider = document.getElementById(x);
            slider && ((slider as FASTSlider).valueTextFormatter = valueTextFormatter);
        });
    }
});

function valueTextFormatter(value: string): string {
    return `${value} degrees celsius`;
}

export default {
    title: "Slider",
};

export const Slider = () => Examples;
