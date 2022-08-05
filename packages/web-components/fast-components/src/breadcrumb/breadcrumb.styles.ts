import { css, ElementStyles } from "@microsoft/fast-element";
import { display, FoundationElementTemplate } from "@microsoft/fast-foundation";
import {
    bodyFont,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens.js";

/**
 * Styles for Breadcrumb
 * @public
 */
export const breadcrumbStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }
`;
