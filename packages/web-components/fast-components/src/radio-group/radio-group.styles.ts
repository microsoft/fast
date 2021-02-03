import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

/**
 * Styles for the {@link @microsoft/fast-components#FASTRadioGroup|FASTRadioGroup} component.
 *
 * @public
 */
export const RadioGroupStyles: ElementStyles = css`
    ${display("flex")} :host {
        align-items: flex-start;
        margin: calc(var(--design-unit) * 1px) 0;
        flex-direction: column;
    }
    .positioning-region {
        display: flex;
        flex-wrap: wrap;
    }
    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
    }
    :host([orientation="horizontal"]) .positioning-region {
        flex-direction: row;
    }
`;
