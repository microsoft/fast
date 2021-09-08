import { css, ElementStyles } from "@microsoft/fast-element";
import { AnchorOptions, ElementDefinitionContext } from "@microsoft/fast-foundation";
import {
    AccentButtonStyles,
    baseButtonStyles,
    HypertextStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/";
import { appearanceBehavior } from "../utilities/behaviors";

const interactivitySelector: string = "[href]";

export const anchorStyles: (
    context: ElementDefinitionContext,
    definition: AnchorOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: AnchorOptions) =>
    css`
        :host .control:not([href]) {
            cursor: default;
        }
        ${baseButtonStyles(context, definition, interactivitySelector)}
    `.withBehaviors(
        appearanceBehavior(
            "accent",
            AccentButtonStyles(context, definition, interactivitySelector)
        ),
        appearanceBehavior(
            "hypertext",
            HypertextStyles(context, definition, interactivitySelector)
        ),
        appearanceBehavior(
            "lightweight",
            LightweightButtonStyles(context, definition, interactivitySelector)
        ),
        appearanceBehavior(
            "outline",
            OutlineButtonStyles(context, definition, interactivitySelector)
        ),
        appearanceBehavior(
            "stealth",
            StealthButtonStyles(context, definition, interactivitySelector)
        )
    );
