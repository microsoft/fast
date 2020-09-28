import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { FASTDesignSystemProvider } from "../design-system-provider";
import TooltipTemplate from "./fixtures/base.html";
import { FASTTooltip } from "./";

// Prevent tree-shaking
FASTTooltip;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("tooltip")) {
        connectAnchors();
    }
});

function onAnchorMouseEnter(e: MouseEvent): void {
    if (e.target === null) {
        return;
    }
    const tooltipInstance: HTMLElement | null = document.getElementById(
        "tooltip-anchor-switch"
    );
    (tooltipInstance as FASTTooltip).anchorElement = e.target as HTMLElement;
}

function connectAnchors(): void {
    document.querySelectorAll("fast-button").forEach(el => {
        if (el !== null && el.id.startsWith("anchor-anchor-switch")) {
            (el as HTMLElement).onmouseenter = onAnchorMouseEnter;
        }
    });
}

export default {
    title: "Tooltip",
};

export const base = () => TooltipTemplate;
