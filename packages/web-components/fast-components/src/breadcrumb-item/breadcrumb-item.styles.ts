import { css, ElementStyles } from "@microsoft/fast-element";
import {
    BreadcrumbItemOptions,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    bodyFont,
    focusStrokeWidth,
    neutralFillStealthActive,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

export const breadcrumbItemStyles: (
    context: ElementDefinitionContext,
    definition: BreadcrumbItemOptions
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: BreadcrumbItemOptions
) =>
    css`
    ${display("inline-flex")} :host {
      background: transparent;
      box-sizing: border-box;
      font-family: ${bodyFont};
      font-size: ${typeRampBaseFontSize};
      fill: currentcolor;
      line-height: ${typeRampBaseLineHeight};
      min-width: calc(${heightNumber} * 1px);
      border-radius: calc(${controlCornerRadius} * 1px);
      outline: none;
      color: ${neutralForegroundRest}
    }

    .listitem {
        display: flex;
        align-items: center;
        width: max-content;
    }

    .separator {
        margin: 0 6px;
        display: flex;
    }

    .control {
      position: relative;
      align-items: center;
      box-sizing: border-box;
      background: transparent;
      border: calc(${strokeWidth} * 1px) solid transparent;
      color: ${neutralForegroundRest};
      cursor: pointer;
      display: flex;
      fill: inherit;
      outline: none;
      text-decoration: none;
      white-space: nowrap;
      border-radius: inherit;
      padding: 4px 8px;
    }

    .control:hover {
      color: ${neutralForegroundHover};
    }

    .control:active {
      background: ${neutralFillStealthActive};
      color: ${neutralForegroundActive};
    }

    .control:${focusVisible} {
      border-color: ${focusStrokeOuter};
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset;
      color: ${neutralForegroundFocus};
    }

    .control .content {
      position: relative;
    }

    .control .content::before {
      content: "";
      display: block;
      height: calc(${strokeWidth} * 1px);
      left: 0;
      position: absolute;
      right: 0;
      top: calc(1em + 4px);
      width: 100%;
    }

    .control:hover .content::before {
      background: ${neutralForegroundHover};
    }

    .control:active .content::before {
      background: transparent;
    }

    .control:${focusVisible} .content::before {
      background: ${neutralForegroundHover};
    }

    .control:not([href]) .content::before {
        background: none;
    }

    .start,
    .end {
        display: flex;
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-end: 6px;
    }

    .end {
        margin-inline-start: 6px;
    }
`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                .control:hover .content::before,
                .control:${focusVisible} .content::before {
                    background: ${SystemColors.LinkText};
                }
                .start,
                .end {
                    fill: ${SystemColors.ButtonText};
                }
            `
        )
    );
