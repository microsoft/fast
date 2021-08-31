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
    bodyFont,
    controlCornerRadius,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillRest,
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
      border: calc(${strokeWidth} * 1px) solid transparent;
      border-radius: calc(${controlCornerRadius} * 1px);
      outline: none;
      color: ${neutralForegroundRest}
    }

    .listitem {
      display: flex;
      align-items: center;
      border-radius: inherit;
    }

    .separator {
        margin: 0 20px;
      }

    .control {
      position: relative;
      align-items: center;
      box-sizing: border-box;
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

    .control:hover,
    .control:active {
      background: ${neutralFillRest};
      color: ${neutralForegroundHover};
    }

    .control:active {
      background: transparent;
      color: ${neutralForegroundHover};
    }

    .control:${focusVisible} {
      border-color: ${focusStrokeOuter};
      color: ${neutralForegroundHover};
    }

    .control:${focusVisible}::after {
      content: "";
      position: absolute;
      inset: calc(${strokeWidth} * -1px);
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset;
      border-radius: inherit;
    }

    :host(:not([href])),
    :host([aria-current]) .control {
      color: ${neutralForegroundRest};
      fill: currentcolor;
      cursor: default;
    }

    .start {
      display: flex;
      margin-inline-end: 6px;
    }

    .end {
      display: flex;
      margin-inline-start: 6px;
    }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
              :host,
              .control {
                border-color: ${SystemColors.ButtonFace};
              }
              .control .content::after {
                content: "";
                display: block;
                height: calc(${strokeWidth} * 1px);
              }
              .control:hover .content::after ,
              .control:active .content::after,
              .control:${focusVisible} .content::after {
                  background: ${SystemColors.LinkText};
              }
              :host(:not([href])) {
                  color: ${SystemColors.ButtonText};
                  fill: currentcolor;
              }
              .separator {
                  fill: ${SystemColors.ButtonText};
                }
            `
        )
    );
