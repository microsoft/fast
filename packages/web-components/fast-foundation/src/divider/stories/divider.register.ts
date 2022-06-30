import { css } from "@microsoft/fast-element";
import { FASTDivider } from "../divider.js";
import { dividerTemplate } from "../divider.template.js";

const styles = css`
    :host {
        border-left: none;
        border-top: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
        box-sizing: content-box;
        display: block;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
    }
    :host([orientation="vertical"]) {
        border-top: none;
        border-left: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
        height: 100%;
        margin: 0 calc(var(--design-unit) * 1px);
    }
`;

FASTDivider.define({
    name: "fast-divider",
    styles,
    template: dividerTemplate(),
});
