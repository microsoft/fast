import {
    Behavior,
    ElementStyles,
    FASTElement,
    Observable,
    Subscriber,
} from "@microsoft/fast-element";
import type { Direction } from "@microsoft/fast-web-utilities";
import { DesignSystemProvider } from "../../design-system-provider";

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
        [DesignSystemProvider, DirectionalStyleSheetBehaviorSubscription]
    > = new WeakMap();

    constructor(ltr: ElementStyles | null, rtl: ElementStyles | null) {
        this.ltr = ltr;
        this.rtl = rtl;
    }

    /**
     * @internal
     */
    public bind(source: FASTElement & HTMLElement) {
        const provider = DesignSystemProvider.findProvider(source);

        if (provider !== null) {
            if (provider.$fastController && provider.$fastController.isConnected) {
                this.attach(source, provider);
            } else {
                if (!Array.isArray(provider.disconnectedRegistry)) {
                    provider.disconnectedRegistry = [];
                }

                provider.disconnectedRegistry.push(this.attach.bind(this, source));
            }
        }
    }

    /**
     * @internal
     */
    public unbind(source: FASTElement & HTMLElement) {
        const cache = this.cache.get(source);

        if (cache) {
            Observable.getNotifier(cache[0].designSystem).unsubscribe(cache[1]);
        }
    }

    private attach(source: FASTElement & HTMLElement, provider: DesignSystemProvider) {
        const subscriber = new DirectionalStyleSheetBehaviorSubscription(
            this.ltr,
            this.rtl,
            source
        );
        Observable.getNotifier(provider.designSystem).subscribe(subscriber, "direction");
        subscriber.attach(provider.designSystem["direction"]);

        this.cache.set(source, [provider, subscriber]);
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

    public handleChange(source: any) {
        this.attach(source.direction);
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
