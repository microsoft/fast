import { css } from "@microsoft/fast-element";
import { FoundationAccordion } from "../accordion.js";
import { createAccordionTemplate } from "../accordion.template.js";

const styles = css`
    :host {
        box-sizing: border-box;
        flex-direction: column;
        font: var(--type-ramp-minus1-font-size) / var(--type-ramp-minus1-line-height)
            var(--body-font);
        color: var(--neutral-foreground-rest);
        border-top: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
    }
`;

FoundationAccordion.define(FoundationAccordion, {
    name: "fast-accordion",
    template: createAccordionTemplate(),
    styles,
});
