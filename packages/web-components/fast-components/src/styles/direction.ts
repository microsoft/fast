import {
    Behavior,
    ElementStyles,
    FASTElement,
    observable,
    Subscriber,
} from "@microsoft/fast-element";
import {
    cssCustomPropertyBehaviorFactory,
    DesignToken,
    DesignTokenChangeRecord,
} from "@microsoft/fast-foundation";
import { Direction } from "@microsoft/fast-web-utilities";
import { FASTDesignSystemProvider } from "../design-system-provider";
import { direction, FASTDesignSystem } from "../fast-design-system";
import { direction as directionDesignToken } from "../design-tokens";

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

/**
 * Behavior to conditionally apply LTR and RTL stylesheets. To determine which to apply,
 * the behavior will use the nearest DesignSystemProvider's 'direction' design system value.
 *
 * @public
 * @example
 * ```ts
 * import { css } from "@microsoft/fast-element";
 * import { DirectionalStyleSheetBehavior } from "@microsoft/fast-foundation";
 *
 * css`
 *  // ...
 * `.withBehaviors(new DirectionalStyleSheetBehavior(
 *   css`:host { content: "ltr"}`),
 *   css`:host { content: "rtl"}`),
 * )
 * ```
 */
export class DirectionalStyleSheetBehavior implements Behavior {
    private ltr: ElementStyles | null;
    private rtl: ElementStyles | null;
    private cache: WeakMap<
        HTMLElement,
        DirectionalStyleSheetBehaviorSubscription
    > = new WeakMap();

    constructor(ltr: ElementStyles | null, rtl: ElementStyles | null) {
        this.ltr = ltr;
        this.rtl = rtl;
    }

    /**
     * @internal
     */
    public bind(source: FASTElement & HTMLElement) {
        this.attach(source);
    }

    /**
     * @internal
     */
    public unbind(source: FASTElement & HTMLElement) {
        const cache = this.cache.get(source);

        if (cache) {
            directionDesignToken.unsubscribe(cache);
        }
    }

    private attach(source: FASTElement & HTMLElement) {
        const subscriber =
            this.cache.get(source) ||
            new DirectionalStyleSheetBehaviorSubscription(this.ltr, this.rtl, source);

        const value = directionDesignToken.getValueFor(source);
        directionDesignToken.subscribe(subscriber);
        subscriber.attach(value);

        this.cache.set(source, subscriber);
    }
}

/**
 * Subscription for {@link DirectionalStyleSheetBehavior}
 */
class DirectionalStyleSheetBehaviorSubscription implements Subscriber {
    private attached: ElementStyles | null = null;

    constructor(
        private ltr: ElementStyles | null,
        private rtl: ElementStyles | null,
        private source: HTMLElement & FASTElement
    ) {}

    public handleChange({
        target,
        token,
    }: DesignTokenChangeRecord<typeof directionDesignToken>) {
        this.attach(token.getValueFor(target));
    }

    public attach(direction: Direction) {
        if (this.attached !== this[direction]) {
            if (this.attached !== null) {
                this.source.$fastController.removeStyles(this.attached);
            }
            this.attached = this[direction];
            if (this.attached !== null) {
                this.source.$fastController.addStyles(this.attached);
            }
        }
    }
}
