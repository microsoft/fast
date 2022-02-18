import { css, ElementStyles } from "@microsoft/fast-element";
import { display, FoundationElementTemplate } from "@microsoft/fast-foundation";
import { designUnit, neutralForegroundRest } from "../design-tokens";

/**
 * Styles for Radio Group
 * @public
 */
export const radioGroupStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
    ${display("flex")} :host {
        align-items: flex-start;
        margin: calc(${designUnit} * 1px) 0;
        flex-direction: column;
        color: ${neutralForegroundRest};
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
