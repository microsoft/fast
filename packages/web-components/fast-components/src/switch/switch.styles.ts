import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    SwitchOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeControlStrongActive,
    strokeControlStrongHover,
    strokeControlStrongRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { DirectionalStyleSheetBehavior, heightNumber } from "../styles";

export const switchStyles: (
    context: ElementDefinitionContext,
    definition: SwitchOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: SwitchOptions) =>
    css`
    :host([hidden]) {
      display: none;
    }

    ${display("inline-flex")} :host {
      align-items: center;
      outline: none;
      font-family: ${bodyFont};
      margin: calc(${designUnit} * 1px) 0;
      ${
          /*
           * Chromium likes to select label text or the default slot when
           * the checkbox is clicked. Maybe there is a better solution here?
           */ ""
      } user-select: none;
    }

    :host(.disabled) {
      opacity: ${disabledOpacity};
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.disabled) .switch,
    :host(.readonly) .switch,
    :host(.disabled) .status-message,
    :host(.readonly) .status-message {
      cursor: ${disabledCursor};
    }

    .switch {
      position: relative;
      outline: none;
      box-sizing: border-box;
      width: calc(((${heightNumber} / 2) + ${designUnit}) * 2px);
      height: calc(((${heightNumber} / 2) + ${designUnit}) * 1px);
      background: ${neutralFillInputRest};
      border-radius: calc(${heightNumber} * 1px);
      border: calc(${strokeWidth} * 1px) solid ${strokeControlStrongRest};
    }

    :host(:enabled:hover) .switch {
      background: ${neutralFillInputHover};
      border-color: ${strokeControlStrongHover};
    }

    :host(:enabled:active) .switch {
      background: ${neutralFillInputActive};
      border-color: ${strokeControlStrongActive};
    }

    :host(:${focusVisible}) .switch,
    :host([aria-checked="true"]:${focusVisible}:enabled) .switch {
      box-shadow: 0 0 0 3px ${focusStrokeOuter};
      border-color: ${focusStrokeOuter};
    }

    slot[name="switch"] {
      position: absolute;
      display: flex;
      border: 1px solid transparent; /* Spacing included in the transform reference box */
      fill: ${neutralForegroundRest};
      transition: all 0.2s ease-in-out;
    }

    .status-message {
      color: ${neutralForegroundRest};
      cursor: pointer;
      font-size: ${typeRampBaseFontSize};
      line-height: ${typeRampBaseLineHeight};
    }

    .label__hidden {
      display: none;
      visibility: hidden;
    }

    .label {
      color: ${neutralForegroundRest};
      font-size: ${typeRampBaseFontSize};
      line-height: ${typeRampBaseLineHeight};
      margin-inline-end: calc(${designUnit} * 2px + 2px);
      cursor: pointer;
    }

    .status-message {
      margin-inline-start: calc(${designUnit} * 2px + 2px);
    }

    :host([aria-checked="true"]) .switch,
    :host([aria-checked="true"]:enabled:hover) .switch {
      background: ${neutralFillInputRest};
      border-color: ${neutralForegroundHover};
    }

    :host([aria-checked="true"]) .switch slot[name='switch'],
    :host([aria-checked="true"]:enabled:hover) .switch slot[name='switch'] {
        fill: ${neutralForegroundHover};
    }

    .unchecked-message {
      display: block;
    }

    .checked-message {
      display: none;
    }

    :host([aria-checked="true"]) .unchecked-message {
      display: none;
    }

    :host([aria-checked="true"]) .checked-message {
      display: block;
    }
  `.withBehaviors(
        new DirectionalStyleSheetBehavior(
            css`
                slot[name="switch"] {
                    left: 0;
                }

                :host([aria-checked="true"]) slot[name="switch"] {
                    left: 100%;
                    transform: translateX(-100%);
                }
            `,
            css`
                slot[name="switch"] {
                    right: 0;
                }

                :host([aria-checked="true"]) slot[name="switch"] {
                    right: 100%;
                    transform: translateX(100%);
                }
            `
        ),
        forcedColorsStylesheetBehavior(
            css`
              :host {
                forced-color-adjust: auto;
              }
              .switch {
                background: ${SystemColors.Field};
              }
              slot[name="switch"] {
                background: none;
                border: none;
                fill: ${SystemColors.FieldText};
              }
              :host(:enabled:hover) .switch {
                border-color: ${SystemColors.Highlight};
              }
              :host(:enabled:${focusVisible}) .switch,
              :host([aria-checked="true"]:enabled:${focusVisible}) .switch {
                forced-color-adjust: none;
                border-color: ${SystemColors.FieldText};
                box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.FieldText};
              }
              :host(.checked) .switch {
                background: ${SystemColors.Highlight};
              }
              :host([aria-checked="true"]) .switch slot[name="switch"] {
                fill: ${SystemColors.HighlightText};
              }
              :host([aria-checked='true']:enabled:hover) .switch slot[name='switch'],
              :host([aria-checked='true']:enabled) .switch:hover slot[name='switch'] {
                fill: ${SystemColors.Highlight};
              }
              :host(.disabled) {
                opacity: 1;
              }
              :host(.disabled) .switch {
                background: ${SystemColors.Field};
                border-color: ${SystemColors.GrayText};
              }
              :host(.disabled) slot[name='switch'] {
                fill: ${SystemColors.GrayText};
              }
            `
        )
    );
