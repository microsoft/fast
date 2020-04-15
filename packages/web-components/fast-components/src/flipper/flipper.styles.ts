import { css } from "@microsoft/fast-element";
import { disabledCursor, display, focusVisible } from "../styles";
import { heightNumber } from "../styles/size";
import { SystemColors } from "../styles/system-colors";
import {
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineActiveBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior,
} from "../styles/recipes";

export const FlipperStyles = css`
    ${display("inline-flex")} :host {
        width: calc(${heightNumber} * 1px);
        height: calc(${heightNumber} * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        position: relative;
        fill: var(--neutral-foreground-rest);
        color: var(--neutral-foreground-rest);
        background: transparent;
        border: none;
        padding: 0;
    }

    :host::before {
        content: "";
        opacity: 0.8;
        background: var(--neutral-fill-steal-rest);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        transition: all 0.1s ease-in-out;
    }

    .next,
    .previous {
        position: relative;
        ${
            /* Glyph size and margin-left is temporary - 
            replace when adaptive typography is figured out */ ""
        } width: 16px;
        height: 16px;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
        cursor: ${disabledCursor};
    }

    :host(:hover)::before {
        background: var(--neutral-fill-stealth-hover);
        border-color: var(--neutral-outline-hover);
    }

    :host(:${focusVisible}) {
        outline: none;
    }

    :host(:${focusVisible})::before {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }

    :host(:active)::before {
        background: var(--neutral-fill-stealth-active);
        border-color: var(--neutral-outline-active);
    }

    :host::-moz-focus-inner {
        border: 0;
    }

    @media (forced-colors: active) {
        :host {
            background: ${SystemColors.Canvas}
            border-color: ${SystemColors.ButtonText};
        }

        :host .next,
        :host .previous {
            color: ${SystemColors.ButtonText}
            fill: ${SystemColors.ButtonText}
        }

        :host::before {
            background: ${SystemColors.Canvas}
        }

        :host(:hover)::before {
            background: ${SystemColors.Highlight}
        }

        :host(:hover) .next,
        :host(:hover) .previous {
            color: ${SystemColors.HighlightText}
            fill: ${SystemColors.HighlightText}
        }
    }
`.withBehaviors(
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineActiveBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior
);
