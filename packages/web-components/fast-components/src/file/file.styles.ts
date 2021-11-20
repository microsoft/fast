import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import {
    baseHeightMultiplier,
    bodyFont,
    density,
    designUnit,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const fileStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        :host {
            --default-preview-width: calc(
                (
                        (var(--base-height-multiplier) + var(--density)) *
                            var(--design-unit) + ((var(--design-unit) * 16))
                    ) * 1px
            );
        }

        .file-list ul {
            list-style: none;
            padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
            font-family: ${bodyFont};
            color: ${neutralForegroundRest};
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
        }

        .file-list ul li {
            margin: calc(${designUnit} * 1px) 0;
        }

        .preview {
            width: var(--default-preview-width);
        }
    `;
