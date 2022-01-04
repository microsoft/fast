import { css, ElementStyles } from "@microsoft/fast-element";
import {
    AnchorOptions,
    ElementDefinitionContext,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import {
    AccentButtonStyles,
    BaseButtonStyles,
    HypertextStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/index";
import { appearanceBehavior } from "../utilities/behaviors";

/**
 * Styles for Anchor
 * @public
 */
export const anchorStyles: FoundationElementTemplate<ElementStyles, AnchorOptions> = (
    context: ElementDefinitionContext,
    definition: AnchorOptions
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
