import { direction as directionDesignToken } from "../design-tokens";
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
export class DirectionalStyleSheetBehavior {
    constructor(ltr, rtl) {
        this.cache = new WeakMap();
        this.ltr = ltr;
        this.rtl = rtl;
    }
    /**
     * @internal
     */
    bind(source) {
        this.attach(source);
    }
    /**
     * @internal
     */
    unbind(source) {
        const cache = this.cache.get(source);
        if (cache) {
            directionDesignToken.unsubscribe(cache);
        }
    }
    attach(source) {
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
class DirectionalStyleSheetBehaviorSubscription {
    constructor(ltr, rtl, source) {
        this.ltr = ltr;
        this.rtl = rtl;
        this.source = source;
        this.attached = null;
    }
    handleChange({ target, token }) {
        this.attach(token.getValueFor(target));
    }
    attach(direction) {
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
