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
        const showButton: HTMLElement | null = document.getElementById("anchor-show");
        if (showButton !== null) {
            showButton.addEventListener("click", onShowClick);
        }
    }
});

function onShowClick(e: MouseEvent): void {
    toggleTooltipVisibility("tooltip-show-1");
    toggleTooltipVisibility("tooltip-show-2");
    toggleTooltipVisibility("tooltip-show-3");
    toggleTooltipVisibility("tooltip-show-4");
}

function toggleTooltipVisibility(tooltipId: string): void {
    const tooltipInstance = document.getElementById(tooltipId) as FASTTooltip | null;
    if (tooltipInstance === null) {
        return;
    }
    tooltipInstance.visible = !tooltipInstance.visible;
}

function onAnchorMouseEnter(e: MouseEvent): void {
    if (e.target === null) {
        return;
    }
    const tooltipInstance = document.getElementById(
        "tooltip-anchor-switch"
    ) as FASTTooltip | null;

    if (tooltipInstance === null) {
        return;
    }

    tooltipInstance.anchorElement = e.target as HTMLElement;
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
