import { StyleStrategy, StyleTarget } from "@microsoft/fast-element";

const sheetsForTarget = new WeakMap<StyleTarget, Set<string | CSSStyleSheet>>();

function getOrCreateFor(target: StyleTarget): Set<string | CSSStyleSheet> {
    let set = sheetsForTarget.get(target);
    if (set) {
        return set;
    }

    set = new Set<string | CSSStyleSheet>();
    sheetsForTarget.set(target, set);

    return set;
}

export class FASTSSRStyleStrategy implements StyleStrategy {
    addStylesTo(target: StyleTarget) {
        const cache = getOrCreateFor(target);

        this.styles.forEach(style => cache?.add(style));
    }

    removeStylesFrom(target: StyleTarget) {
        const cache = getOrCreateFor(target);

        this.styles.forEach(style => cache?.delete(style));
    }

    constructor(private styles: (string | CSSStyleSheet)[]) {}

    public static getStylesFor(target: Element): Set<string | CSSStyleSheet> | null {
        return sheetsForTarget.get(target) || null;
    }
}
