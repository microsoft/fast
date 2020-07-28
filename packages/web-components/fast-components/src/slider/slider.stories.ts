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
        const slider1: HTMLElement | null = document.getElementById("switcher");
        (slider1 as FASTSlider).valueTextFormatter = valueTextFormatter;

        const slider2: HTMLElement | null = document.getElementById("switcher2");
        (slider2 as FASTSlider).valueTextFormatter = valueTextFormatter;

        const slider3: HTMLElement | null = document.getElementById("slider1");
        (slider3 as FASTSlider).valueTextFormatter = valueTextFormatter;
    }
});

function valueTextFormatter(value: string): string {
    return `${value} degrees celsius`;
}

export default {
    title: "Slider",
};

export const Slider = () => Examples;
