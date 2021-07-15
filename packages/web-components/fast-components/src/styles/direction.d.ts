import { Behavior, ElementStyles, FASTElement } from "@microsoft/fast-element";
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
export declare class DirectionalStyleSheetBehavior implements Behavior {
    private ltr;
    private rtl;
    private cache;
    constructor(ltr: ElementStyles | null, rtl: ElementStyles | null);
    /**
     * @internal
     */
    bind(source: FASTElement & HTMLElement): void;
    /**
     * @internal
     */
    unbind(source: FASTElement & HTMLElement): void;
    private attach;
}
