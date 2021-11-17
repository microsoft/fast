import { css, ElementStyles } from "@microsoft/fast-element";
import {
    AnchorOptions,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { focusStrokeWidth, strokeWidth } from "../design-tokens";
import {
    AccentButtonStyles,
    BaseButtonStyles,
    HypertextStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/";
import { appearanceBehavior } from "../utilities/behaviors";

const interactivitySelector: string = "[href]";
const nonInteractivitySelector: string = ":not([href])";

/**
 * Styles for Anchor
 * @public
 */
export const anchorStyles: (
    context: ElementDefinitionContext,
    definition: AnchorOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: AnchorOptions) =>
    css`
        :host .control:not([href]) {
            cursor: default;
        }
        ${BaseButtonStyles(
            context,
            definition,
            interactivitySelector,
            nonInteractivitySelector
        )}
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
              :host([href]) .control {
                  border-color: ${SystemColors.LinkText};
                  background: ${SystemColors.ButtonFace};
                  color: ${SystemColors.LinkText};
                  fill: currentcolor;
              }
              :host([href]) .control:hover {
                  forced-color-adjust: none;
                  border-color: ${SystemColors.LinkText} ;
                  box-shadow: 0 0 0 1px ${SystemColors.LinkText} ;
                  background: ${SystemColors.ButtonFace};
                  color: ${SystemColors.LinkText};
              }
              :host([href]) .control:${focusVisible} {
                  forced-color-adjust: none;
                  border-color: ${SystemColors.LinkText} ;
                  box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.LinkText} ;
              }
          `
        ),
        appearanceBehavior(
            "accent",
            css`
                ${AccentButtonStyles(
                    context,
                    definition,
                    interactivitySelector,
                    nonInteractivitySelector
                )}
            `.withBehaviors(
                forcedColorsStylesheetBehavior(
                    css`
                        :host([href]) .control {
                            background: ${SystemColors.LinkText};
                            color: ${SystemColors.HighlightText};
                        }
                        :host([href]) .control:hover {
                            background: ${SystemColors.ButtonFace};
                            border-color: ${SystemColors.LinkText};
                            box-shadow: none;
                            color: ${SystemColors.LinkText};
                            fill: currentcolor;
                        }
                        :host([href]) .control:${focusVisible} {
                            box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${SystemColors.LinkText} inset,
                              0 0 0 calc(((${focusStrokeWidth} * 2) - ${strokeWidth}) * 1px) ${SystemColors.HighlightText} inset ;
                        }
                    `
                )
            )
        ),
        appearanceBehavior(
            "hypertext",
            css`
                ${HypertextStyles(
                    context,
                    definition,
                    interactivitySelector,
                    nonInteractivitySelector
                )}
            `.withBehaviors(
                forcedColorsStylesheetBehavior(
                    css`
                        :host([href]) .control:hover,
                        :host([href]) .control:${focusVisible} {
                            box-shadow: none ;
                            text-decoration: underline 3px;
                        }
                    `
                )
            )
        ),
        appearanceBehavior(
            "lightweight",
            css`
                ${LightweightButtonStyles(
                    context,
                    definition,
                    interactivitySelector,
                    nonInteractivitySelector
                )}
            `.withBehaviors(
                forcedColorsStylesheetBehavior(
                    css`
                        :host([href]) .control {
                            border-color: ${SystemColors.ButtonFace};
                        }
                        :host([href]) .control:hover,
                        :host([href]) .control:${focusVisible} {
                            border-color: ${SystemColors.ButtonFace} ;
                            box-shadow: none ;
                            background: ${SystemColors.ButtonFace};
                            color: ${SystemColors.LinkText};
                        }
                        :host([href]) .control:hover .content::before,
                        :host([href]) .control:${focusVisible} .content::before {
                            background: ${SystemColors.LinkText};
                        }
                    `
                )
            )
        ),
        appearanceBehavior(
            "outline",
            css`
                ${OutlineButtonStyles(
                    context,
                    definition,
                    interactivitySelector,
                    nonInteractivitySelector
                )}
            `.withBehaviors(
                forcedColorsStylesheetBehavior(
                    css`
                        :host([href]) {
                            border-color: ${SystemColors.LinkText};
                        }
                        :host([href]) .control${interactivitySelector}:${focusVisible} {
                            forced-color-adjust: none;
                            border-color: ${SystemColors.LinkText} ;
                            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.LinkText} ;
                            color: ${SystemColors.LinkText};
                        }
                        :host([href]) .control:hover {
                            forced-color-adjust: none;
                            border-color: ${SystemColors.LinkText} ;
                            box-shadow: 0 0 0 1px ${SystemColors.LinkText} ;
                            background: ${SystemColors.ButtonFace};
                            color: ${SystemColors.LinkText};
                        }
                    `
                )
            )
        ),
        appearanceBehavior(
            "stealth",
            css`
                ${StealthButtonStyles(
                    context,
                    definition,
                    interactivitySelector,
                    nonInteractivitySelector
                )}
            `.withBehaviors(
                forcedColorsStylesheetBehavior(
                    css`
                        :host([href]) .control {
                            border-color: ${SystemColors.ButtonFace};
                            color: ${SystemColors.LinkText};
                        }
                        :host([href])  .control${interactivitySelector}:hover,
                        :host([href])  .control${interactivitySelector}:active,
                        :host([href])  .control${interactivitySelector}:${focusVisible} {
                            background: ${SystemColors.LinkText};
                            border-color: ${SystemColors.LinkText} ;
                            color: ${SystemColors.HighlightText};
                            fill: currentcolor;
                        }
                    `
                )
            )
        )
    );
