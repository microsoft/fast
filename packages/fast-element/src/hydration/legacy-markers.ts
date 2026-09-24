import { Message } from "../interfaces.js";
import { FAST } from "../platform.js";
import type { HydrationMarkerResolution } from "./markers.js";

/**
 * FAST Element 2.x indexed hydration marker patterns.
 *
 * WebUI versions that predate the data-free marker format still emit these
 * indexed markers. They are parsed only by the strict, opt-in `markers_v2`
 * strategy — the default `HydrationMarkup` strategy does not reference this
 * module, so this parsing logic is tree-shaken out of the bundle unless
 * `markers_v2` is explicitly imported.
 * @internal
 */
export const legacyBindingStartMarker = /fe-b\$\$start\$\$(\d+)\$\$(.+)\$\$fe-b/;
export const legacyBindingEndMarker = /fe-b\$\$end\$\$(\d+)\$\$(.+)\$\$fe-b/;
export const legacyRepeatViewStartMarker = /fe-repeat\$\$start\$\$(\d+)\$\$fe-repeat/;
export const legacyRepeatViewEndMarker = /fe-repeat\$\$end\$\$(\d+)\$\$fe-repeat/;
export const legacyElementBoundaryStartMarker =
    /^(?:.{0,1000})fe-eb\$\$start\$\$(.+?)\$\$fe-eb/;
export const legacyElementBoundaryEndMarker =
    /fe-eb\$\$end\$\$(.{0,1000})\$\$fe-eb(?:.{0,1000})$/;
export const legacyAttributeMarkerName = "data-fe-b";
export const legacyCompactAttributeMarkerName = "data-fe-c";

export function isComment(node: Node): node is Comment {
    return node.nodeType === Node.COMMENT_NODE;
}

export function parseLegacyMarkerIndex(pattern: RegExp, data: string): number | null {
    const match = pattern.exec(data);
    return match === null ? null : Number(match[1]);
}

/**
 * Parses the legacy indexed attribute binding markers (`data-fe-b`,
 * `data-fe-b-N`, and the compact `data-fe-c-start-count` form) into a list
 * of factory indices, or returns `null` when no legacy markers are present.
 */
export function parseLegacyAttributeBindingIndices(node: Element): number[] | null {
    const indices: number[] = [];
    const attr = node.getAttribute(legacyAttributeMarkerName);

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

    const enumeratedPrefix = `${legacyAttributeMarkerName}-`;
    const compactPrefix = `${legacyCompactAttributeMarkerName}-`;

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

export function removeLegacyAttributeBindingMarkers(node: Element): void {
    node.removeAttribute(legacyAttributeMarkerName);

    for (const name of node.getAttributeNames()) {
        if (
            name.startsWith(`${legacyAttributeMarkerName}-`) ||
            name.startsWith(`${legacyCompactAttributeMarkerName}-`)
        ) {
            node.removeAttribute(name);
        }
    }
}

/**
 * Resolves the legacy indexed attribute binding markers on an element into a
 * {@link HydrationMarkerResolution}, or `null` when none are present.
 */
export function resolveLegacyAttributeBindings(
    node: Element,
    factoryPointer: number,
    hydrationIndexOffset: number,
): HydrationMarkerResolution | null {
    const indices = parseLegacyAttributeBindingIndices(node);
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
        cleanup: () => removeLegacyAttributeBindingMarkers(node),
    };
}

/**
 * Resolves a legacy indexed content binding start marker into a
 * {@link HydrationMarkerResolution}, or `null` when the data does not match
 * the legacy format.
 */
export function resolveLegacyContentBinding(
    data: string,
    factoryPointer: number,
    hydrationIndexOffset: number,
): HydrationMarkerResolution | null {
    const index = parseLegacyMarkerIndex(legacyBindingStartMarker, data);
    if (index === null) {
        return null;
    }

    const factoryIndex = index + hydrationIndexOffset;

    return {
        factoryIndices: [factoryIndex],
        nextFactoryPointer: Math.max(factoryPointer, factoryIndex + 1),
    };
}
