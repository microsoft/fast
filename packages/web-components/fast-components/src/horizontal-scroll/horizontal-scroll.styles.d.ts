import { ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    HorizontalScrollOptions,
} from "@microsoft/fast-foundation";
/**
 * Styles used for the flipper container and gradient fade
 * @public
 */
export declare const ActionsStyles: ElementStyles;
/**
 * Styles handling the scroll container and content
 * @public
 */
export declare const horizontalScrollStyles: (
    context: ElementDefinitionContext,
    definition: HorizontalScrollOptions
) => ElementStyles;
