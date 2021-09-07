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
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundActive,
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
        fill: currentColor;
        line-height: ${typeRampBaseLineHeight};
        min-width: calc(${heightNumber} * 1px);
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
      background: ${neutralFillStealthRest};
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
      background: ${neutralFillStealthHover};
      color: ${neutralForegroundHover};
    }

    .control:active {
      background: ${neutralFillStealthActive};
      color: ${neutralForegroundActive};
    }

    .control:${focusVisible} .content::before {
        background: ${neutralForegroundRest};
        height: calc(${focusStrokeWidth} * 1px);
    }

    .control:not([href]) {
        color: ${neutralForegroundRest};
        cursor: default;
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
