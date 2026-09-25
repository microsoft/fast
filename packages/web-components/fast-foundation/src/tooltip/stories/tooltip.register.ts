import { css } from "@microsoft/fast-element";
import { FASTTooltip } from "../tooltip.js";
import { tooltipTemplate } from "../tooltip.template.js";

const styles = css`
    :host {
        box-sizing: border-box;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.14);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--focus-stroke-outer);
        background: var(--fill-color);
        color: var(--neutral-foreground-rest);
        padding: 4px 12px;
        height: fit-content;
        width: fit-content;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        font-weight: initial;
        font-variation-settings: var(--type-ramp-base-font-variations);
        white-space: nowrap;
        box-shadow: var(--elevation-shadow-tooltip);
        position: fixed;
        visibility: hidden;
    }

    :host([hidden]) {
        display: none;
    }

    :host([visible]) {
        transition: visibility 0s 0s linear, opacity 50ms 0.5s linear;
        opacity: 1;
        visibility: visible;
    }

    :host(:not([visible])) {
        transition: visibility 0s 0.5s, opacity 50ms linear;
        opacity: 0;
        visibility: hidden;
    }

    :host([show="true"][visible]) {
        transition: none;
    }
`;

FASTTooltip.define({
    name: "fast-tooltip",
    styles,
    template: tooltipTemplate(),
});
