import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { FASTDesignSystemProvider } from "../design-system-provider";
import Examples from "./fixtures/base.html";
import { FASTSlider } from ".";

// Prevent tree-shaking
FASTSlider;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("slider")) {
        const slider: HTMLElement | null = document.getElementById("switcher");
        (slider as FASTSlider).valueTextFormatter = valueTextFormatter;
    }
});

function valueTextFormatter(value: string): string {
    return "pixel";
}

export default {
    title: "Slider",
};

export const Slider = () => Examples;
