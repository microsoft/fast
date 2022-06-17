import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Accordion } from "../accordion.js";
import { accordionTemplate as template } from "../accordion.template.js";

const styles = () => css`
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

DesignSystem.getOrCreate(document.body)
    .withPrefix("fast")
    .register(
        Accordion.compose({
            baseName: "accordion",
            template,
            styles,
        })()
    );
