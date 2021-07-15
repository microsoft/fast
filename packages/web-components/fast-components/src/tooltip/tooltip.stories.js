import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import TooltipTemplate from "./fixtures/base.html";
import "../button";
import "./index";
function onShowClick() {
    for (let i = 1; i <= 4; i++) {
        const tooltipInstance = document.getElementById(`tooltip-show-${i}`);
        tooltipInstance.visible = !tooltipInstance.visible;
    }
}
function onAnchorMouseEnter(e) {
    if (!e.target) {
        return;
    }
    const tooltipInstance = document.getElementById("tooltip-anchor-switch");
    tooltipInstance.anchorElement = e.target;
}
addons.getChannel().addListener(STORY_RENDERED, name => {
    if (name.toLowerCase().startsWith("tooltip")) {
        document.querySelectorAll("fast-button[id^=anchor-anchor-switch]").forEach(el => {
            el.addEventListener("mouseenter", onAnchorMouseEnter);
        });
        const showButton = document.getElementById("anchor-show");
        showButton.addEventListener("click", onShowClick);
    }
});
export default {
    title: "Tooltip",
};
export const Tooltip = () => TooltipTemplate;
