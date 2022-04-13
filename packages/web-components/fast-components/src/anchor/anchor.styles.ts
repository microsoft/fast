import { css, ElementStyles } from "@microsoft/fast-element";
import { AnchorOptions, FoundationElementTemplate } from "@microsoft/fast-foundation";
import {
    AccentButtonStyles,
    BaseButtonStyles,
    HypertextStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/index.js";
import { appearanceBehavior } from "../utilities/behaviors.js";

/**
 * Styles for Anchor
 * @public
 */
export const anchorStyles: FoundationElementTemplate<ElementStyles, AnchorOptions> = (
    context,
    definition
) =>
    css`
        ${BaseButtonStyles}
    `.withBehaviors(
        appearanceBehavior("accent", AccentButtonStyles),
        appearanceBehavior("hypertext", HypertextStyles),
        appearanceBehavior("lightweight", LightweightButtonStyles),
        appearanceBehavior("outline", OutlineButtonStyles),
        appearanceBehavior("stealth", StealthButtonStyles)
    );
