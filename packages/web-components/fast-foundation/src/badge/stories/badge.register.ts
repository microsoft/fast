import { css } from "@microsoft/fast-element";
import { FASTBadge } from "../badge.js";
import { badgeTemplate } from "../badge.template.js";

const styles = css`
    :host {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        font: var(--type-ramp-minus-1-font-size) / var(--type-ramp-minus-1-line-height)
            var(--body-font);
        background: var(--accent-fill-rest);
        border: calc(var(--stroke-width) * 1px) solid transparent;
        border-radius: calc(var(--control-corner-radius) * 1px);
        color: var(--foreground-on-accent-rest);
        fill: currentcolor;
        padding: 1px 3px;
    }

    ::slotted([slot="start"]) {
        display: flex;
        margin-inline-end: 4px;
    }

    ::slotted([slot="end"]) {
        display: flex;
        margin-inline-start: 4px;
    }
`;

FASTBadge.define({
    name: "fast-badge",
    template: badgeTemplate(),
    styles,
});
