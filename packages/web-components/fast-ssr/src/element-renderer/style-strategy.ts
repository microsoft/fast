import { StyleStrategy, StyleTarget } from "@microsoft/fast-element";

const sheetsForElement = new WeakMap<Element, Set<string | CSSStyleSheet>>();

function getOrCreateFor(target: Element): Set<string | CSSStyleSheet> {
    let set = sheetsForElement.get(target);
    if (set) {
        return set;
    }

    set = new Set<string | CSSStyleSheet>();
    sheetsForElement.set(target, set);

    return set;
}

function isShadowRoot(target: any): target is ShadowRoot {
    return !!target.host;
}

export class FASTSSRStyleStrategy implements StyleStrategy {
    addStylesTo(target: StyleTarget) {
        if (isShadowRoot(target)) {
            const cache = getOrCreateFor(target.host);

            this.styles.forEach(style => cache?.add(style));
        }
    }

    removeStylesFrom() {}

    constructor(private styles: (string | CSSStyleSheet)[]) {}

    public static getStylesFor(target: Element): Set<string | CSSStyleSheet> | null {
        return sheetsForElement.get(target) || null;
    }
}
