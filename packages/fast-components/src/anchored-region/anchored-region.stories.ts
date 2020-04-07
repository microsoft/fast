import { FASTAnchoredRegion } from ".";
import { FASTDesignSystemProvider } from "../design-system-provider";
import AnchoreRegionTemplate from "./fixtures/base.html";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";

// Prevent tree-shaking
FASTAnchoredRegion;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("anchored-region")) {
        scrollViewports();
        setButtonActions();
    }
});

function scrollViewports(): void {
    document.querySelectorAll("div[id^='viewport']").forEach(el => {
        if (el instanceof HTMLDivElement) {
            el.scrollTop = 250;
            el.scrollLeft = 250;
        }
    });
}

function setButtonActions(): void {
    document.querySelectorAll("button").forEach(el => {
        if (el instanceof HTMLButtonElement) {
            switch (el.id) {
                case "toggle-anchor-anchor1":
                    el.onclick = event => {
                        const region: HTMLElement | null = document.getElementById(
                            "toggle-anchor-region"
                        );
                        if (region === null) {
                            return;
                        }
                        region.setAttribute("anchor", "toggle-anchor-anchor1");
                    };
                    break;

                case "toggle-anchor-anchor2":
                    el.onclick = event => {
                        const region: HTMLElement | null = document.getElementById(
                            "toggle-anchor-region"
                        );
                        if (region === null) {
                            return;
                        }
                        region.setAttribute("anchor", "toggle-anchor-anchor2");
                    };
                    break;
            }
        }
    });
}

export default {
    title: "Anchored region",
};

export const base = () => AnchoreRegionTemplate;
