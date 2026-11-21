import { strictEqual } from "node:assert";
import { describe, test } from "node:test";
import { findClosestAnchor } from "./links.utils.js";

function createElement(
    tagName: string,
    attributes: Record<string, string> = {},
): Element {
    return {
        nodeType: 1,
        tagName,
        hasAttribute(name: string) {
            return name in attributes;
        },
        getAttribute(name: string) {
            return attributes[name] ?? null;
        },
    } as unknown as Element;
}

function createEvent(path: EventTarget[], target: EventTarget): MouseEvent {
    return {
        composedPath: () => path,
        target,
        which: 1,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
    } as MouseEvent;
}

describe("findClosestAnchor", () => {
    test("does not treat non-anchor elements with a relative href as links", () => {
        const use = createElement("USE", { href: "assets/icons.svg#chevron-right" });
        const anchor = findClosestAnchor(createEvent([use], use));

        strictEqual(anchor, null);
    });

    test("finds SVG anchors whose tag name is lowercase", () => {
        const circle = createElement("circle");
        const anchor = createElement("a", { href: "/dashboard" });
        const result = findClosestAnchor(createEvent([circle, anchor], circle));

        strictEqual(result, anchor);
    });
});
