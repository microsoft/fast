import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    heightNumber,
} from "@microsoft/fast-components";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    neutralFillHoverBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior,
} from "../styles";

export const TextFieldStyles = css`
    ${display("inline-block")} :host {
        font-family: var(--body-font);
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        height: calc(${heightNumber} * 1px);
    }

    .control {
        -webkit-appearance: none;
        background: transparent;
        border: 0;
        padding: 0;
        height: calc(100% - 4px);
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(var(--design-unit) * 2px + 1px);
        ${
            /* Font size is temporary - 
            replace when adaptive typography is figured out */ ""
        } font-size: 14px;
        line-height: 20px;
    }

    .control:hover,
    .control:${focusVisible},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .label {
        display: block;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        ${
            /* Font size is temporary - 
            replace when adaptive typography is figured out */ ""
        } font-size: 14px;
        margin-bottom: 4px;
    }

    .before-content,
    .after-content {
        ${
            /* Glyph size and margin-left is temporary - 
            replace when adaptive typography is figured out */ ""
        } width: 16px;
        height: 16px;
        margin: auto;
        fill: var(--neutral-foreground-rest);
    }

    .before-content {
        margin-inline-start: 11px;
    }

    .after-content {
        margin-inline-end: 11px;
    }

    :host(:hover:not(.disabled)) .root {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    :host(:focus-within) .root {
        border-color: var(--neutral-focus);
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
    }

    :host(.filled) .root {
        background: var(--neutral-fill-rest);
        border-color: transparent;
    }

    :host(.filled:hover:not(.disabled)) .root {
        background: var(--neutral-fill-hover);
        border-color: transparent;
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
        cursor: ${disabledCursor};
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    neutralFillHoverBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            .root,
            :host(.filled) .root {
                forced-color-adjust: none;
                background: ${SystemColors.Field};
                border-color: ${SystemColors.FieldText};
            }
            :host(:hover:not(.disabled)) .root,
            :host(.filled:hover:not(.disabled)) .root,
            :host(.filled:hover) .root {
                background: ${SystemColors.Field};
                border-color: ${SystemColors.Highlight};
            }
            .before-content,
            .after-content {
                fill: ${SystemColors.ButtonText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(.disabled) .root,
            :host(.filled:hover.disabled) .root {
                border-color: ${SystemColors.GrayText};
                background: ${SystemColors.Field};
            }
            :host(:focus-within) .root {
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 1px ${SystemColors.Highlight} inset;
            }
        `
    )
);
