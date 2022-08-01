import { css } from "@microsoft/fast-element";
import { FASTBadge } from "../badge.js";
import { badgeTemplate } from "../badge.template.js";

const styles = css`
    :host {
        box-sizing: border-box;
        display: inline-block;
        font: var(--type-ramp-minus-1-font-size) / var(--type-ramp-minus-1-line-height)
            var(--body-font);
    }

    .control {
        background: var(--accent-fill-rest);
        border: calc(var(--stroke-width) * 1px) solid transparent;
        border-radius: calc(var(--control-corner-radius) * 1px);
        color: var(--foreground-on-accent-rest);
        padding: 1px 3px;
    }
`;

FASTBadge.define({
    name: "fast-badge",
    template: badgeTemplate(),
    styles,
});
