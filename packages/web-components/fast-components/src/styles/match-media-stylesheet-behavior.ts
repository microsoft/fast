import { ElementStyles, FASTElement } from "@microsoft/fast-element";

/**
 * Construct a behavior to conditionally apply a stylesheet based
 * on a MediaQueryList
 */
export function matchMediaStylesheetBehaviorFactory(query: MediaQueryList) {
    const cache: WeakMap<
        typeof FASTElement,
        (this: MediaQueryList) => void
    > = new WeakMap();

    return (sheet: ElementStyles) => {
        return Object.freeze({
            query,
            cache,
            sheet,
            constructListener(source: typeof FASTElement, sheet: ElementStyles) {
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
            },
            bind(source: typeof FASTElement) {
                const { constructListener, query, cache } = this;
                const listener = constructListener(source, this.sheet);
                // Invoke immediately to add if the query currently matches
                listener.bind(query)();
                query.addListener(listener);
                cache.set(source, listener);
            },
            unbind(source: typeof FASTElement) {
                const { cache, query } = this;
                query.removeListener(cache.get(source)!);
                cache.delete(source);
            },
        });
    };
}

/**
 * Applies ElementStyles to a FASTElement when the
 * forced-colors media query is matched, removes the
 * ElementStyles when the query is no-longer matched
 */
export const forcedColorsStylesheetBehavior = matchMediaStylesheetBehaviorFactory(
    window.matchMedia("(forced-colors)")
);
