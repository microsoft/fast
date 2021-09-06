import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    ElementDefinitionContext,
    focusVisible,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    controlCornerRadius,
    disabledOpacity,
    focusStrokeWidth,
    neutralFillFocus,
    neutralFillHover,
    neutralFillInputFocus,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillRest,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralStrokeFocus,
    neutralStrokeHover,
    neutralStrokeInputFillActive,
    neutralStrokeInputFillFocus,
    neutralStrokeInputFillHover,
    neutralStrokeInputFillRest,
    neutralStrokeRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../../design-tokens";
import { heightNumber } from "../size";

/**
 * @internal
 */
export const inputStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => css`
  :host {
    font-family: ${bodyFont};
    font-size: ${typeRampBaseFontSize};
    line-height: ${typeRampBaseLineHeight};
    color: ${neutralForegroundRest};
    fill: currentcolor;
    outline: none;
    user-select: none;
    position: relative;
  }

  ${rootSelector} {
    box-sizing: border-box;
    position: relative;
    color: inherit;
    fill: inherit;
    background: ${neutralFillInputRest};
    border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
    border-radius: calc(${controlCornerRadius} * 1px);
    height: calc(${heightNumber} * 1px);
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .control {
    width: 100%;
  }

  .control:hover,
  .control:${focusVisible},
  .control:disabled,
  .control:active {
    outline: none;
  }

  .label {
    display: block;
    color: ${neutralForegroundRest};
    cursor: pointer;
    font-size: ${typeRampBaseFontSize};
    line-height: ${typeRampBaseLineHeight};
    margin-bottom: 4px;
  }

  .label__hidden {
    display: none;
    visibility: hidden;
  }

  :host([disabled]) ${rootSelector}, :host([readonly]) ${rootSelector}, :host([disabled]) .label,
  :host([readonly]) .label,
  :host([disabled]) .control,
  :host([readonly]) .control {
    cursor: ${disabledCursor};
  }

  :host([disabled]) {
    opacity: ${disabledOpacity};
  }
`;

/**
 * @internal
 */
export const inputStateStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => css`
  :host(:hover:not([disabled]):not(:focus-within)) ${rootSelector},
  :host(:active:not([disabled])) ${rootSelector},
  :host(:focus-within:not([disabled])) ${rootSelector} {
    background: ${neutralFillInputHover};
    border-color: ${neutralStrokeHover};
    box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${neutralStrokeHover} inset;
    color: ${neutralForegroundHover};
  }

  :host(:${focusVisible}:not([disabled])) ${rootSelector} {
    background: ${neutralFillInputFocus};
    border-color: ${neutralStrokeFocus};
    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${neutralStrokeFocus} inset;
    color: ${neutralForegroundFocus};
  }
`;

/**
 * @internal
 */
export const inputFilledStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => css`
    :host ${rootSelector} {
        background: ${neutralFillRest};
        border-color: ${neutralStrokeInputFillRest};
        color: ${neutralForegroundRest};
    }

    :host(:hover:not([disabled]):not(:focus-within)) ${rootSelector} {
      background: ${neutralFillHover};
      border-color: ${neutralStrokeInputFillHover};
      box-shadow: none;
      color: ${neutralForegroundHover};
    }

    :host(:active:not([disabled])) ${rootSelector},
    :host(:focus-within:not([disabled])) ${rootSelector} {
      background: ${neutralFillRest};
      border-color: ${neutralStrokeInputFillActive};
      box-shadow: 0 0 0 calc(${strokeWidth} * 1px) ${neutralStrokeInputFillActive} inset;
      color: ${neutralForegroundActive};
    }

    :host(:${focusVisible}:not([disabled])) ${rootSelector} {
      background: ${neutralFillFocus};
      border-color: ${neutralStrokeInputFillFocus};
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${neutralStrokeInputFillFocus} inset;
      color: ${neutralForegroundFocus};
    }
`;

/**
 * @internal
 */
export const inputForcedColorStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => css`
    ${rootSelector} {
        forced-color-adjust: none;
        background: ${SystemColors.Field};
        border-color: ${SystemColors.FieldText};
    }
    :host(:hover:not([disabled])) ${rootSelector}, :host(:hover:not([disabled])) .control,
    :host(:hover:not([disabled]):not(:focus-within)) .control {
        background: ${SystemColors.Field};
        border-color: ${SystemColors.Highlight};
    }
    :host(:hover:not([disabled])) .controls,
    :host(:focus-within:not([disabled])) .controls {
        background: transparent;
        color: ${SystemColors.FieldText};
        fill: currentcolor;
    }
    :host(:hover:not([disabled]):not(:focus-within)) .root {
        background: ${SystemColors.ButtonFace};
    }
    :host(:focus-within:enabled) ${rootSelector} {
        border-color: ${SystemColors.Highlight};
        box-shadow: 0 0 0 1px ${SystemColors.Highlight} inset;
    }
    .control,
    ::-webkit-input-placeholder,
    ::slotted(svg) {
        color: ${SystemColors.FieldText};
        fill: currentcolor;
    }
    :host([disabled]) {
        opacity: 1;
    }
    :host([disabled]) ${rootSelector} {
        border-color: ${SystemColors.GrayText};
        background: ${SystemColors.Field};
    }
    :host([disabled]) ::placeholder,
    :host([disabled]) ::-webkit-input-placeholder,
    :host([disabled]) .label,
    ::placeholder {
        color: ${SystemColors.GrayText};
    }
`;

/**
 * @internal
 */
export const inputFilledForcedColorStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    rootSelector: string
) => css`
    :host
        ${rootSelector},
        :host(:hover:not([disabled]))
        ${rootSelector},
        :host(:active:not([disabled]))
        ${rootSelector},
        :host(:focus-within:not([disabled]))
        ${rootSelector} {
        background: ${SystemColors.Field};
        border-color: ${SystemColors.FieldText};
    }
    :host(:not([disabled]):active)::after,
    :host(:not([disabled]):focus-within:not(:active))::after {
        border-bottom-color: ${SystemColors.Highlight};
    }
    :host([disabled]) ${rootSelector} {
        border-color: ${SystemColors.GrayText};
        background: ${SystemColors.Field};
    }
`;
