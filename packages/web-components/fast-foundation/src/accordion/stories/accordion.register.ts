import { css } from "@microsoft/fast-element";
import { FASTAccordion } from "../accordion.js";
import { accordionTemplate } from "../accordion.template.js";

const styles = css`
    :host {
        display: flex;
        flex-direction: column;
        border-top: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
    }
`;

FASTAccordion.define({
    name: "fast-accordion",
    template: accordionTemplate(),
    styles,
});
