import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import { Direction, RtlScrollConverter } from "@microsoft/fast-web-utilities";
import { FASTDesignSystemProvider } from "../design-system-provider";
import AnchoreRegionTemplate from "./fixtures/base.html";
import { FASTAnchoredRegion } from "./";

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
            el.scrollTop = 280;
            RtlScrollConverter.setScrollLeft(
                el,
                el.dir === Direction.rtl ? -250 : 250,
                el.dir === Direction.rtl ? Direction.rtl : Direction.ltr
            );
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

                case "toggle-positions-horizontal":
                    el.onclick = event => {
                        const region: HTMLElement | null = document.getElementById(
                            "toggle-positions-region"
                        );
                        if (region === null) {
                            return;
                        }
                        const currentPosition: string | null = region.getAttribute(
                            "horizontal-default-position"
                        );
                        if (currentPosition === "left") {
                            region.setAttribute("horizontal-default-position", "right");
                        } else {
                            region.setAttribute("horizontal-default-position", "left");
                        }
                    };
                    break;

                case "toggle-positions-vertical":
                    el.onclick = event => {
                        const region: HTMLElement | null = document.getElementById(
                            "toggle-positions-region"
                        );
                        if (region === null) {
                            return;
                        }
                        const currentPosition: string | null = region.getAttribute(
                            "vertical-default-position"
                        );
                        if (currentPosition === "top") {
                            region.setAttribute("vertical-default-position", "bottom");
                        } else {
                            region.setAttribute("vertical-default-position", "top");
                        }
                    };
                    break;

                case "toggle-positions-small":
                    el.onclick = event => {
                        const smallContent: HTMLElement | null = document.getElementById(
                            "toggle-positions-small"
                        );
                        const largeContent: HTMLElement | null = document.getElementById(
                            "toggle-positions-large"
                        );
                        if (smallContent === null || largeContent === null) {
                            return;
                        }

                        smallContent.hidden = false;
                        largeContent.hidden = true;
                    };
                    break;

                case "toggle-positions-large":
                    el.onclick = event => {
                        const smallContent: HTMLElement | null = document.getElementById(
                            "toggle-positions-small"
                        );
                        const largeContent: HTMLElement | null = document.getElementById(
                            "toggle-positions-large"
                        );
                        if (smallContent === null || largeContent === null) {
                            return;
                        }

                        smallContent.hidden = true;
                        largeContent.hidden = false;
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
