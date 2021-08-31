import { css, ElementStyles } from "@microsoft/fast-element";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    RadioOptions,
} from "@microsoft/fast-foundation";
import { heightNumber } from "../styles";
import {
    bodyFont,
    designUnit,
    disabledOpacity,
    fillColor,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillInputActive,
    neutralFillInputFocus,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    strokeControlStrongActive,
    strokeControlStrongHover,
    strokeControlStrongRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const radioStyles: (
    context: ElementDefinitionContext,
    definition: RadioOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: RadioOptions) =>
    css`
    ${display("inline-flex")} :host {
      --input-size: calc((${heightNumber} / 2) + ${designUnit});
      align-items: center;
      outline: none;
      margin: calc(${designUnit} * 1px) 0;
      ${
          /*
           * Chromium likes to select label text or the default slot when
           * the radio button is clicked. Maybe there is a better solution here?
           */ ""
      } user-select: none;
      position: relative;
      flex-direction: row;
      transition: all 0.2s ease-in-out;
    }

    .control {
      position: relative;
      width: calc(var(--input-size) * 1px);
      height: calc(var(--input-size) * 1px);
      box-sizing: border-box;
      border-radius: 50%;
      border: calc(${strokeWidth} * 1px) solid ${strokeControlStrongRest};
      background: transparent;
      outline: none;
      cursor: pointer;
    }

    .label__hidden {
      display: none;
      visibility: hidden;
    }

    .label {
      font-family: ${bodyFont};
      color: ${neutralForegroundRest};
      ${
          /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast/issues/2766 */ ""
      } padding-inline-start: calc(${designUnit} * 2px + 2px);
      margin-inline-end: calc(${designUnit} * 2px + 2px);
      cursor: pointer;
      font-size: ${typeRampBaseFontSize};
      line-height: ${typeRampBaseLineHeight};
    }

    .control,
    slot[name="checked-indicator"] {
      flex-shrink: 0;
    }

    slot[name="checked-indicator"] {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      fill: ${neutralForegroundRest};
      opacity: 0;
      pointer-events: none;
    }

    :host(.checked) .control {
      background: transparent;
      border-color: ${strokeControlStrongRest};
    }

    :host(:enabled:hover) .control,
    :host(.checked:enabled:hover) .control {
      background: transparent;
      border-color: ${strokeControlStrongHover};
    }

    :host(:enabled:active) .control,
    :host(.checked:enabled:active) .control {
      background: transparent;
      border-color: ${strokeControlStrongActive};
    }

    :host(:enabled:active) slot[name="checked-indicator"] {
      opacity: 1;
    }

    :host(:${focusVisible}) .control,
    :host(.checked:enabled:${focusVisible}) .control {
      background: transparent;
      border-color: ${focusStrokeOuter};
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter};
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
      cursor: ${disabledCursor};
    }

    :host(.checked) slot[name="checked-indicator"] {
      opacity: 1;
    }

    :host(.disabled) {
      opacity: ${disabledOpacity};
    }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
            .control {
              border-color: ${SystemColors.FieldText};
              background: ${SystemColors.Field};
            }
            :host(:enabled:hover) .control,
            .control:active {
              border-color: ${SystemColors.Highlight};
              background: ${SystemColors.Field};
            }
            :host(.checked) .control {
              background: ${SystemColors.Highlight};
              border-color: ${SystemColors.Highlight};
            }
            :host(.checked:enabled:hover) .control,
            .control:active {
              border-color: ${SystemColors.Highlight};
              background: ${SystemColors.HighlightText};
            }
            :host(:${focusVisible}) .control,
            :host(.checked:enabled:${focusVisible}) .control {
              forced-color-adjust: none;
              background: ${SystemColors.Field};
              border-color: ${SystemColors.FieldText};
              box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.FieldText};
            }
            :host(.checked) slot[name='checked-indicator'] {
              fill: ${SystemColors.HighlightText};
            }
            :host(.checked:enabled:hover) slot[name='checked-indicator'],
            :host(.checked:enabled:${focusVisible}) slot[name='checked-indicator'] {
              fill: ${SystemColors.Highlight};
            }
            :host(.disabled) {
              opacity: 1;
            }
            :host(.disabled) .label {
              color: ${SystemColors.GrayText};
            }
            :host(.disabled) .control,
            :host(.checked.disabled:hover) .control,
            .control:active {
              background: ${SystemColors.Field};
              border-color: ${SystemColors.GrayText};
            }
            :host(.disabled) slot[name='checked-indicator'],
            :host(.checked.disabled) .control:hover slot[name='checked-indicator'] {
              fill: ${SystemColors.GrayText};
            }
          `
        )
    );
