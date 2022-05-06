import { css, ElementStyles } from "@microsoft/fast-element";
import { FoundationElementTemplate } from "@microsoft/fast-foundation";
import {
    bodyFont,
    designUnit,
    fillColor,
    typeRampBaseFontSize,
} from "../design-tokens.js";
import { heightNumber } from "../styles/index.js";

/**
 * Styles for Picker
 * @public
 */
export const pickerStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
        .region {
            z-index: 1000;
            overflow: hidden;
            display: flex;
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
        }

        .loaded {
            opacity: 1;
            pointer-events: none;
        }

        .loading-display,
        .no-options-display {
            background: ${fillColor};
            width: 100%;
            min-height: calc(${heightNumber} * 1px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-items: center;
            padding: calc(${designUnit} * 1px);
        }

        .loading-progress {
            width: 42px;
            height: 42px;
        }

        .bottom {
            flex-direction: column;
        }

        .top {
            flex-direction: column-reverse;
        }
    `;
