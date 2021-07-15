import { Direction, RtlScrollConverter } from "@microsoft/fast-web-utilities";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import AnchoredRegionTemplate from "./fixtures/base.html";
import "./index";
let scalingViewportPreviousXValue = 250;
let scalingViewportPreviousYValue = 250;
addons.getChannel().addListener(STORY_RENDERED, name => {
    var _a;
    if (name.toLowerCase().startsWith("anchored-region")) {
        document.querySelectorAll("div[id^=viewport]").forEach(el => {
            el.scrollTop = 280;
            RtlScrollConverter.setScrollLeft(
                el,
                el.dir === Direction.rtl ? -250 : 250,
                el.dir === Direction.rtl ? Direction.rtl : Direction.ltr
            );
        });
        document.querySelectorAll("[id^=toggle-anchor-anchor").forEach(anchor => {
            anchor.addEventListener("click", e => {
                document
                    .getElementById("toggle-anchor-region")
                    .setAttribute("anchor", e.target.id);
            });
        });
        const positionsRegion = document.getElementById("toggle-positions-region");
        document
            .querySelectorAll("#toggle-positions-horizontal, #toggle-positions-vertical")
            .forEach(el => {
                el.addEventListener("click", e => {
                    const isHorizontal = e.target.id.includes("horizontal");
                    const direction = isHorizontal ? "horizontal" : "vertical";
                    const attr = `${direction}-default-position`;
                    const currentPosition = positionsRegion.getAttribute(attr);
                    positionsRegion.setAttribute(
                        attr,
                        isHorizontal
                            ? currentPosition === "left"
                                ? "right"
                                : "left"
                            : currentPosition === "top"
                            ? "bottom"
                            : "top"
                    );
                });
            });
        const smallContent = document.getElementById("toggle-positions-small");
        const largeContent = document.getElementById("toggle-positions-large");
        document.querySelectorAll("[id^=btn-toggle-positions]").forEach(el => {
            el.addEventListener("click", e => {
                const isSmall = e.target.id.includes("small");
                smallContent.hidden = !isSmall;
                largeContent.hidden = isSmall;
            });
        });
        const regionScalingUpdate = document.getElementById("region-scaling-update");
        document
            .getElementById("viewport-scaling-update")
            .addEventListener("scroll", () => regionScalingUpdate.update());
        const regionScalingOffset = document.getElementById("region-scaling-offset");
        (_a = document.getElementById("viewport-scaling-offset")) === null ||
        _a === void 0
            ? void 0
            : _a.addEventListener("scroll", e => {
                  const target = e.target;
                  regionScalingOffset.updateAnchorOffset(
                      scalingViewportPreviousXValue - target.scrollLeft,
                      scalingViewportPreviousYValue - target.scrollTop
                  );
                  scalingViewportPreviousXValue = target.scrollLeft;
                  scalingViewportPreviousYValue = target.scrollTop;
              });
    }
});
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
export const AnchoredRegion = () => AnchoredRegionTemplate;
