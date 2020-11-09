import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { FASTDesignSystemProvider } from "../design-system-provider";
import PopoverTemplate from "./fixtures/base.html";
import { FASTPopover } from ".";

// Prevent tree-shaking
FASTPopover;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("popover")) {
        connectAnchors();
    }
});

function onTargetMouseEnter(e: MouseEvent): void {
    if (e.target === null) {
        return;
    }
    const popoverInstance: HTMLElement | null = document.getElementById(
        "popover-anchor-switch"
    );
    (popoverInstance as FASTPopover).targetElement = e.target as HTMLElement;
}

function connectAnchors(): void {
    document.querySelectorAll("fast-button").forEach(el => {
        if (el !== null && el.id.startsWith("anchor-anchor-switch")) {
            (el as HTMLElement).onmouseenter = onTargetMouseEnter;
        }
    });
}

export default {
    title: "Popover",
};

export const base = () => PopoverTemplate;
