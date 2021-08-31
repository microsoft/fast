import { css, ElementStyles } from "@microsoft/fast-element";
import {
    CheckboxOptions,
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles";
import {
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillInputActive,
    neutralFillInputFocus,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeControlStrongHover,
    strokeControlStrongRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const checkboxStyles: (
    context: ElementDefinitionContext,
    definition: CheckboxOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: CheckboxOptions) =>
    css`
    ${display("inline-flex")} :host {
      align-items: center;
      outline: none;
      margin: calc(${designUnit} * 1px) 0;
      ${
          /*
           * Chromium likes to select label text or the default slot when
           * the checkbox is clicked. Maybe there is a better solution here?
           */ ""
      } user-select: none;
    }

    .control {
      position: relative;
      width: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
      height: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
      box-sizing: border-box;
      border-radius: calc(${controlCornerRadius} * 1px);
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

    slot[name="checked-indicator"],
    slot[name="indeterminate-indicator"] {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      fill: ${neutralForegroundRest};
      opacity: 0;
      pointer-events: none;
    }

    slot[name="indeterminate-indicator"] {
      position: absolute;
      top: 0;
    }

    :host(:hover) .control,
    :host([aria-checked="true"]:enabled:hover) .control {
      background: transparent;
      border-color: ${strokeControlStrongHover};
    }

    :host[aria-checked="true"]:enabled:active) .control {
      background: transparent;
      border-color: ${neutralForegroundActive};
    }

    :host(:${focusVisible}) .control {
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter};
      background: transparent;
      border-color: ${focusStrokeOuter};
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
      cursor: ${disabledCursor};
    }

    :host([aria-checked="true"]:not(.indeterminate)) slot[name='checked-indicator'],
    :host(.indeterminate) slot[name='indeterminate-indicator'] {
      opacity: 1;
    }

    :host(:enabled:hover[aria-checked="true"]:not(.indeterminate)) slot[name="checked-indicator"],
    :host(:enabled:hover[aria-checked="true"].indeterminate) slot[name="indeterminate-indicator"] {
      fill: ${neutralForegroundHover};
    }

    :host([aria-checked="true"]:enabled:active) slot[name="checked-indicator"],
    :host([aria-checked="true"]:enabled:active) slot[name="indeterminate-indicator"] {
      fill: ${neutralForegroundActive};
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
        slot[name='checked-indicator'],
        slot[name='indeterminate-indicator'] {
          fill: ${SystemColors.FieldText};
        }
        :host(:enabled:hover) .control,
        :host(:enabled:active) .control {
          border-color: ${SystemColors.Highlight};
          background: ${SystemColors.Field};
        }
        :host(:enabled:${focusVisible}) .control,
        :host(.checked:enabled:${focusVisible}) .control {
          forced-color-adjust: none;
          background: ${SystemColors.Field};
          border-color: ${SystemColors.FieldText};
          box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.FieldText};
        }
        :host(.checked) .control {
          background: ${SystemColors.Highlight};
          border-color: ${SystemColors.Highlight};
        }
        :host(.checked:enabled:hover) .control,
        :host(.checked:enabled:active) .control {
          background: ${SystemColors.Field};
          border-color: ${SystemColors.Highlight}
        }
        :host(.checked) slot[name='checked-indicator'],
        :host(.checked) slot[name='indeterminate-indicator'] {
          fill: ${SystemColors.HighlightText};
        }
        :host(.checked:enabled:hover) slot[name='checked-indicator'],
        :host(.checked:enabled:${focusVisible}) slot[name='checked-indicator'],
        :host(.checked:enabled:hover) slot[name='indeterminate-indicator'],
        :host(.checked:enabled:${focusVisible}) slot[name='indeterminate-indicator'] {
          fill: ${SystemColors.Highlight};
        }
        :host(.disabled) {
          opacity: 1;
        }
        :host(.disabled) .label {
          color: ${SystemColors.GrayText};
        }
        :host(.disabled) .control {
          border-color: ${SystemColors.GrayText};
          background: ${SystemColors.Field};
        }
        :host(.disabled) slot[name='indeterminate-indicator'],
        :host(.checked.disabled) .control:hover slot[name='indeterminate-indicator'] {
          color: ${SystemColors.GrayText};
          fill: currentcolor;
        }
        :host(.disabled) slot[name='checked-indicator'],
        :host(.checked.disabled) .control:hover slot[name='checked-indicator'] {
          color: ${SystemColors.GrayText};
          fill: currentcolor;
        }
      `
        )
    );
