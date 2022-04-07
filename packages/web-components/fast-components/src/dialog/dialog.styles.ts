import { css, ElementStyles } from "@microsoft/fast-element";
import { FoundationElementTemplate } from "@microsoft/fast-foundation";
import { controlCornerRadius, fillColor, strokeWidth } from "../design-tokens.js";
import { elevation } from "../styles/elevation.js";

/**
 * Styles for Dialog
 * @public
 */
export const dialogStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 14;
        --dialog-height: 480px;
        --dialog-width: 640px;
        display: block;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        touch-action: none;
    }

    .positioning-region {
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: auto;
    }

    .control {
        ${elevation}
        margin-top: auto;
        margin-bottom: auto;
        width: var(--dialog-width);
        height: var(--dialog-height);
        background-color: ${fillColor};
        z-index: 1;
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid transparent;
    }
`;
