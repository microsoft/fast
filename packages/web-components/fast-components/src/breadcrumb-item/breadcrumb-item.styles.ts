import { css, ElementStyles } from "@microsoft/fast-element";
import {
    BreadcrumbItemOptions,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    controlCornerRadius,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens.js";
import { heightNumber } from "../styles/index.js";

/**
 * Styles for Breadcrumb item
 * @public
 */
export const breadcrumbItemStyles: FoundationElementTemplate<
    ElementStyles,
    BreadcrumbItemOptions
> = (context, definition) =>
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
            border-radius: inherit;
        }
        .separator {
            margin: 0 20px;
            display: flex;
        }
        .control {
            position: relative;
            align-items: center;
            box-sizing: border-box;
            background: transparent;
            border: calc(${focusStrokeWidth} * 1px) solid transparent;
            color: ${neutralForegroundRest};
            cursor: pointer;
            display: flex;
            fill: inherit;
            outline: none;
            text-decoration-line: none;
            text-decoration-thickness: calc(${strokeWidth} * 1px);
            white-space: nowrap;
            border-radius: inherit;
            padding: 4px 8px;
        }
        .control:hover {
            color: ${neutralForegroundHover};
        }
        .control:active {
            color: ${neutralForegroundActive};
        }
        .control:${focusVisible} {
            border-color: ${focusStrokeOuter};
            color: ${neutralForegroundFocus};
        }
        .control:hover .content,
        .control:active .content
        .control:${focusVisible} .content {
            text-decoration-line: underline;
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
                    fill: ${SystemColors.ButtonText};
                    border-color: ${SystemColors.ButtonFace};
                }
                :host(:hover) .control,
                :host(:active) .control {
                    color: ${SystemColors.LinkText};
                    fill: ${SystemColors.ButtonText};
                    border-color: ${SystemColors.ButtonFace};
                }
                :host(:${focusVisible}) .control {
                    color: ${SystemColors.LinkText};
                    fill: ${SystemColors.ButtonText};
                    border-color: ${SystemColors.LinkText};
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
