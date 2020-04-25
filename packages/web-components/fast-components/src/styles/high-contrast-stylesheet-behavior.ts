import { Behavior, ElementStyles, FASTElement } from "@microsoft/fast-element";
/**
 * Conditionally apply a high-contrast stylesheet to
 * a FASTElement.
 */
export class HighContrastStylesheetBehavior implements Behavior {
    public static query: MediaQueryList = window.matchMedia("(forced-colors)");
    public static cache: WeakMap<
        typeof FASTElement,
        (this: MediaQueryList) => void
    > = new WeakMap();
    constructor(private sheet: ElementStyles) {}

    public static constructListener(source: typeof FASTElement, sheet: ElementStyles) {
        let attached = false;

        function listener(this: MediaQueryList) {
            const { matches } = this;
            if (matches && !attached) {
                (source as any).$fastController.addStyles(sheet);
                attached = matches;
            } else if (!matches && attached) {
                (source as any).$fastController.removeStyles(sheet);
                attached = matches;
            }
        }

        return listener;
    }

    bind(source: typeof FASTElement) {
        const { constructListener, query, cache } = HighContrastStylesheetBehavior;
        const listener = constructListener(source, this.sheet);
        // Invoke immediately to add high-contrast
        // stylesheets if the query currently matches
        listener.bind(query)();
        query.addListener(listener);
        cache.set(source, listener);
    }
    unbind(source: typeof FASTElement) {
        const { cache, query } = HighContrastStylesheetBehavior;
        query.removeListener(cache.get(source)!);
        cache.delete(source);
    }
}
