import { Behavior, ElementStyles, FASTElement } from "@microsoft/fast-element";

type MediaQueryListListener = (this: MediaQueryList, ev?: MediaQueryListEvent) => any;

interface MatchMediaStyleSheetBehavior extends Behavior {
    query: MediaQueryList;
    cache: WeakMap<
        typeof FASTElement,
        MediaQueryListListener | Array<MediaQueryListListener>
    >;
    sheet: ElementStyles;
    constructListener: (
        source: typeof FASTElement,
        sheet: ElementStyles
    ) => MediaQueryListListener;
}

/**
 * Construct a behavior factory that will conditionally apply a stylesheet based
 * on a MediaQueryList
 * 
 * @param query - The MediaQueryList to subscribe to matches for.
 * 
 * @public
 */
export function matchMediaStylesheetBehaviorFactory(query: MediaQueryList) {
    const cache: WeakMap<
        typeof FASTElement,
        ((this: MediaQueryList) => void) | Array<(this: MediaQueryList) => void>
    > = new WeakMap();

    return (sheet: ElementStyles) => {
        return Object.freeze({
            query,
            cache,
            sheet,
            constructListener(
                this: MatchMediaStyleSheetBehavior,
                source: typeof FASTElement,
                sheet: ElementStyles
            ): MediaQueryListListener {
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
            bind(this: MatchMediaStyleSheetBehavior, source: typeof FASTElement) {
                const { constructListener, query, cache } = this;
                const listener = constructListener(source, this.sheet);
                const cached = cache.get(source);

                // Invoke immediately to add if the query currently matches
                listener.bind(query)();
                query.addListener(listener);

                if (cached !== void 0) {
                    // Support multiple bindings of the same behavior
                    if (Array.isArray(cached)) {
                        cached.push(listener);
                    } else {
                        cache.set(source, [cached, listener]);
                    }
                } else {
                    cache.set(source, listener);
                }
            },
            unbind(this: MatchMediaStyleSheetBehavior, source: typeof FASTElement) {
                const { cache, query } = this;
                const cached = cache.get(source);

                if (cached !== void 0) {
                    if (Array.isArray(cached)) {
                        cached.forEach(listener => query.removeListener(listener));
                    } else {
                        query.removeListener(cached);
                    }

                    cache.delete(source);
                }
            },
        });
    };
}

/**
 * Implements {@link matchMediaStylesheetBehaviorFactory} for the {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors | forced-colors} query.
 * This can be used to construct a behavior to apply a forced-colors only stylesheet.
 * @public
 */
export const forcedColorsStylesheetBehavior = matchMediaStylesheetBehaviorFactory(
    window.matchMedia("(forced-colors)")
);
