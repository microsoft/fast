import { Direction, RtlScrollConverter } from "@microsoft/fast-web-utilities";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import AnchoreRegionTemplate from "./fixtures/base.html";
import type { FASTAnchoredRegion } from "./index";
import "./index";

let scalingViewportPreviousXValue: number = 250;
let scalingViewportPreviousYValue: number = 250;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("anchored-region")) {
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

        const anchorRegion = document.getElementById("toggle-anchor-region")!;
        const anchor1 = document.getElementById("toggle-anchor-anchor1")!;
        const anchor2 = document.getElementById("toggle-anchor-anchor2")!;
        const positionsRegion = document.getElementById("toggle-positions-region")!;
        const togglePositionsHorizontal = document.getElementById(
            "toggle-positions-horizontal"
        )!;
        const togglePositionsVertical = document.getElementById(
            "toggle-positions-vertical"
        )!;
        const togglePositionsSmall = document.getElementById(
            "btn-toggle-positions-small"
        )!;
        const togglePositionsLarge = document.getElementById(
            "btn-toggle-positions-large"
        )!;
        const smallContent = document.getElementById("toggle-positions-small")!;
        const largeContent = document.getElementById("toggle-positions-large")!;

        anchor1.onclick = () => {
            anchorRegion.setAttribute("anchor", "toggle-anchor-anchor1");
        };

        anchor2.onclick = () => {
            anchorRegion.setAttribute("anchor", "toggle-anchor-anchor2");
        };

        togglePositionsHorizontal.onclick = () => {
            const currentPosition = positionsRegion.getAttribute(
                "horizontal-default-position"
            );
            positionsRegion.setAttribute(
                "horizontal-default-position",
                currentPosition === "left" ? "right" : "left"
            );
        };

        togglePositionsVertical.onclick = () => {
            const currentPosition = positionsRegion.getAttribute(
                "vertical-default-position"
            );
            positionsRegion.setAttribute(
                "vertical-default-position",
                currentPosition === "top" ? "bottom" : "top"
            );
        };

        togglePositionsSmall.onclick = () => {
            smallContent.hidden = false;
            largeContent.hidden = true;
        };

        togglePositionsLarge.onclick = () => {
            smallContent.hidden = true;
            largeContent.hidden = false;
        };

        const scalingViewportUpdate = document.getElementById("viewport-scaling-update")!;
        scalingViewportUpdate.addEventListener("scroll", handleScrollViaUpdate);

        const scalingViewportOffset = document.getElementById("viewport-scaling-offset")!;
        scalingViewportOffset.addEventListener("scroll", handleScrollViaOffset);
    }
});

function handleScrollViaUpdate(ev: Event): void {
    const scalingRegionUpdate = document.getElementById(
        "region-scaling-update"
    ) as FASTAnchoredRegion;
    scalingRegionUpdate.update();
}

function handleScrollViaOffset(ev: Event): void {
    const scroller = ev.target as HTMLElement;

    const scalingRegionOffset = document.getElementById(
        "region-scaling-offset"
    ) as FASTAnchoredRegion;
    scalingRegionOffset.updateAnchorOffset(
        scalingViewportPreviousXValue - scroller.scrollLeft,
        scalingViewportPreviousYValue - scroller.scrollTop
    );

    scalingViewportPreviousXValue = scroller.scrollLeft;
    scalingViewportPreviousYValue = scroller.scrollTop;
}

const providerStyles = `
fast-design-system-provider {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
`;

export default {
    title: "Anchored Region",
    decorators: [
        Story => `
        <style>${providerStyles}</style>
        ${Story()}
        `,
    ],
};

export const AnchoredRegion = () => AnchoreRegionTemplate;
