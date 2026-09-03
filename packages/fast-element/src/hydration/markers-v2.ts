import { Message } from "../interfaces.js";
import { FAST } from "../platform.js";
import {
    createHydrationMarkers,
    type HydrationMarkerResolution,
    type HydrationMarkers,
} from "./markers.js";

const bindingStartMarker = /fe-b\$\$start\$\$(\d+)\$\$(.+)\$\$fe-b/;
const bindingEndMarker = /fe-b\$\$end\$\$(\d+)\$\$(.+)\$\$fe-b/;
const repeatViewStartMarker = /fe-repeat\$\$start\$\$(\d+)\$\$fe-repeat/;
const repeatViewEndMarker = /fe-repeat\$\$end\$\$(\d+)\$\$fe-repeat/;
const elementBoundaryStartMarker = /^(?:.{0,1000})fe-eb\$\$start\$\$(.+?)\$\$fe-eb/;
const elementBoundaryEndMarker = /fe-eb\$\$end\$\$(.{0,1000})\$\$fe-eb(?:.{0,1000})$/;
const attributeMarkerName = "data-fe-b";
const compactAttributeMarkerName = "data-fe-c";

function isComment(node: Node): node is Comment {
    return node.nodeType === Node.COMMENT_NODE;
}

function parseMarkerIndex(pattern: RegExp, data: string): number | null {
    const match = pattern.exec(data);
    return match === null ? null : Number(match[1]);
}

function parseAttributeBindingIndices(node: Element): number[] | null {
    const indices: number[] = [];
    const attr = node.getAttribute(attributeMarkerName);

    if (attr !== null) {
        for (const value of attr.trim().split(/\s+/)) {
            if (value === "") {
                continue;
            }

            const index = Number(value);

            if (!Number.isInteger(index) || index < 0) {
                throw FAST.error(Message.invalidHydrationAttributeMarker, {
                    value: attr,
                });
            }

            indices.push(index);
        }
    }

    const enumeratedPrefix = `${attributeMarkerName}-`;
    const compactPrefix = `${compactAttributeMarkerName}-`;

    for (const name of node.getAttributeNames()) {
        if (name.startsWith(enumeratedPrefix)) {
            const index = Number(name.slice(enumeratedPrefix.length));

            if (!Number.isInteger(index) || index < 0) {
                throw FAST.error(Message.invalidHydrationAttributeMarker, {
                    value: name,
                });
            }

            indices.push(index);
        } else if (name.startsWith(compactPrefix)) {
            const [start, count] = name
                .slice(compactPrefix.length)
                .split("-")
                .map(value => Number(value));

            if (
                !Number.isInteger(start) ||
                !Number.isInteger(count) ||
                start < 0 ||
                count < 1
            ) {
                throw FAST.error(Message.invalidHydrationAttributeMarker, {
                    value: name,
                });
            }

            for (let i = 0; i < count; i++) {
                indices.push(start + i);
            }
        }
    }

    return indices.length === 0 ? null : indices;
}

function removeAttributeBindingMarkers(node: Element): void {
    node.removeAttribute(attributeMarkerName);

    for (const name of node.getAttributeNames()) {
        if (
            name.startsWith(`${attributeMarkerName}-`) ||
            name.startsWith(`${compactAttributeMarkerName}-`)
        ) {
            node.removeAttribute(name);
        }
    }
}

/**
 * FAST Element 2.x indexed hydration markers.
 *
 * @example
 * ```ts
 * import { enableHydration, v2 } from "@microsoft/fast-element/hydration.js";
 *
 * enableHydration({ markers: v2 });
 * ```
 * @public
 */
export const v2: HydrationMarkers = createHydrationMarkers({
    expectedContentAfterStartMarker:
        "content following a `fe-b$$start$$...$$fe-b` content binding marker",
    expectedContentEndMarker:
        "matching `fe-b$$end$$...$$fe-b` content binding close marker",
    expectedElementBoundaryEndMarker:
        "matching `fe-eb$$end$$...$$fe-eb` element boundary close marker",
    resolveAttributeBindings(
        node: Element,
        factoryPointer: number,
        hydrationIndexOffset: number,
    ): HydrationMarkerResolution | null {
        const indices = parseAttributeBindingIndices(node);
        if (indices === null) {
            return null;
        }

        const factoryIndices = indices.map(index => index + hydrationIndexOffset);
        return {
            factoryIndices,
            nextFactoryPointer: Math.max(
                factoryPointer,
                ...factoryIndices.map(index => index + 1),
            ),
            cleanup: () => removeAttributeBindingMarkers(node),
        };
    },
    resolveContentBinding(
        data: string,
        factoryPointer: number,
        hydrationIndexOffset: number,
    ): HydrationMarkerResolution | null {
        const index = parseMarkerIndex(bindingStartMarker, data);
        if (index === null) {
            return null;
        }

        const factoryIndex = index + hydrationIndexOffset;

        return {
            factoryIndices: [factoryIndex],
            nextFactoryPointer: Math.max(factoryPointer, factoryIndex + 1),
        };
    },
    isContentBindingStartMarker(data: string): boolean {
        return bindingStartMarker.test(data);
    },
    isContentBindingEndMarker(data: string): boolean {
        return bindingEndMarker.test(data);
    },
    isRepeatViewStartMarker(data: string): boolean {
        return repeatViewStartMarker.test(data);
    },
    isRepeatViewEndMarker(data: string): boolean {
        return repeatViewEndMarker.test(data);
    },
    isElementBoundaryStartMarker(node: Node): boolean {
        return isComment(node) && elementBoundaryStartMarker.test(node.data);
    },
    isElementBoundaryEndMarker(node: Node): boolean {
        return isComment(node) && elementBoundaryEndMarker.test(node.data);
    },
});
