import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
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

export const anchorStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
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
