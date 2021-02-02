import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import "../accordion-item";
import "../design-system-provider";
import type { FASTDesignSystemProvider } from "../design-system-provider";
import { accentFillRestBehavior } from "../styles/recipes";
import Examples from "./fixtures/base.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("accordion")) {
        const provider = document.querySelector(
            "fast-design-system-provider"
        ) as FASTDesignSystemProvider;

        // Example depends on accentFillRest but component itself
        // does not.
        provider.registerCSSCustomProperty(accentFillRestBehavior);
    }
});

export default {
    title: "Accordion",
};

export const Accordion = (): string => Examples;
