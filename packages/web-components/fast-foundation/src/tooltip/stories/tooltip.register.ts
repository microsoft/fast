import { css } from "@microsoft/fast-element";
import { FASTTooltip } from "../tooltip.js";
import { tooltipTemplate } from "../tooltip.template.js";

const styles = css`
    :host {
        position: absolute;
        display: block;
        visibility: hidden;
        box-sizing: border-box;
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--focus-stroke-outer);
        box-shadow: 0 0 0 1px var(--focus-stroke-outer) inset;
        background: var(--neutral-fill-rest);
        color: var(--neutral-foreground-rest);
        padding: 4px;
        height: fit-content;
        width: fit-content;
        font: var(--type-ramp-base-font-size) / var(--type-ramp-base-line-height)
            var(--body-font);
        white-space: nowrap;
        z-index: 10000;
    }

    :host([strategy="fixed"]) {
        position: fixed;
    }

    :host(:not([hidden])) {
        visibility: visible;
    }
`;

FASTTooltip.define({
    name: "fast-tooltip",
    styles,
    template: tooltipTemplate(),
});
