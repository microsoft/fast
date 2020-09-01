import { cssCustomPropertyBehaviorFactory } from "@microsoft/fast-foundation";
import { Direction } from "@microsoft/fast-web-utilities";
import { direction, FASTDesignSystem } from "../fast-design-system";
import { FASTDesignSystemProvider } from "../design-system-provider";
/**
 * Behavior to resolve and make available the inline-start CSS custom property.
 *
 * @remarks
 * Replaces the inline-start value for the {@link https://developer.mozilla.org/en-US/docs/Web/CSS/float | float} property
 * when the native value is not supported.
 *
 * @public
 * @example
 * ```ts
 * import { css } from "@microsoft/fast-element";
 * import { inlineStartBehavior } from "@microsoft/fast-components";
 *
 * css`
 *   :host {
 *     float: ${inlineStartBehavior.var};
 *   }
 * `.withBehaviors(inlineStartBehavior)
 * ```
 */
export const inlineStartBehavior = cssCustomPropertyBehaviorFactory(
    "inline-start",
    (designSystem: FASTDesignSystem) =>
        direction(designSystem) === Direction.ltr ? "left" : "right",
    FASTDesignSystemProvider.findProvider
);

/**
 * Behavior to resolve and make available the inline-end CSS custom property.
 *
 * @remarks
 * Replaces the inline-end value for the {@link https://developer.mozilla.org/en-US/docs/Web/CSS/float | float} property
 * when the native value is not supported.
 *
 * @public
 * @example
 * ```ts
 * import { css } from "@microsoft/fast-element";
 * import { inlineEndBehavior } from "@microsoft/fast-components";
 *
 * css`
 *   :host {
 *     float: ${inlineEndBehavior.var};
 *   }
 * `.withBehaviors(inlineEndBehavior)
 * ```
 */
export const inlineEndBehavior = cssCustomPropertyBehaviorFactory(
    "inline-end",
    (designSystem: FASTDesignSystem) =>
        direction(designSystem) === Direction.ltr ? "right" : "left",
    FASTDesignSystemProvider.findProvider
);
