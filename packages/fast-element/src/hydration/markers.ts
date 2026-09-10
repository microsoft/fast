import { Message } from "../interfaces.js";
import { FAST } from "../platform.js";

const hydrationMarkersBrand: unique symbol = Symbol();

/**
 * Identifies a supported hydration marker format.
 * @public
 */
export interface HydrationMarkers {
    readonly [hydrationMarkersBrand]: true;
}

/**
 * Resolves hydration marker metadata to compiled factory indices.
 * @internal
 */
export interface HydrationMarkerResolution {
    factoryIndices: readonly number[];
    nextFactoryPointer: number;
    cleanup?(): void;
}

/**
 * Defines how server-rendered hydration markers are interpreted.
 * @internal
 */
export interface HydrationMarkerStrategy extends HydrationMarkers {
    resolveAttributeBindings(
        node: Element,
        factoryPointer: number,
        hydrationIndexOffset: number,
    ): HydrationMarkerResolution | null;
    resolveContentBinding(
        data: string,
        factoryPointer: number,
        hydrationIndexOffset: number,
    ): HydrationMarkerResolution | null;
    isContentBindingStartMarker(data: string): boolean;
    isContentBindingEndMarker(data: string): boolean;
    isRepeatViewStartMarker(data: string): boolean;
    isRepeatViewEndMarker(data: string): boolean;
    isElementBoundaryStartMarker(node: Node): boolean;
    isElementBoundaryEndMarker(node: Node): boolean;
}

type HydrationMarkerImplementation = Omit<
    HydrationMarkerStrategy,
    typeof hydrationMarkersBrand
>;

const markerStrategies = new WeakMap<HydrationMarkers, HydrationMarkerStrategy>();

/**
 * Creates a registered hydration marker strategy.
 * @internal
 */
export function createHydrationMarkers<
    TImplementation extends HydrationMarkerImplementation,
>(implementation: TImplementation): HydrationMarkers & TImplementation {
    const markers = Object.freeze({
        ...implementation,
        [hydrationMarkersBrand]: true as const,
    });
    markerStrategies.set(markers, markers);
    return markers;
}

function isComment(node: Node): node is Comment {
    return node.nodeType === Node.COMMENT_NODE;
}

function parseAttributeBindingCount(node: Element): number | null {
    const attr = node.getAttribute("data-fe");
    if (attr === null) {
        return null;
    }

    const trimmed = attr.trim();

    if (!/^\d+$/.test(trimmed)) {
        throw FAST.error(Message.invalidHydrationAttributeMarker, {
            value: attr,
        });
    }

    const count = parseInt(trimmed, 10);

    if (count < 1) {
        throw FAST.error(Message.invalidHydrationAttributeMarker, {
            value: attr,
        });
    }

    return count;
}

/**
 * Data-free sequential hydration markers used by FAST Element 3.x.
 * @internal
 */
export const HydrationMarkup = createHydrationMarkers({
    attributeMarkerName: "data-fe",

    contentBindingStartMarker(): string {
        return "fe:b";
    },
    contentBindingEndMarker(): string {
        return "fe:/b";
    },
    repeatStartMarker(): string {
        return "fe:r";
    },
    repeatEndMarker(): string {
        return "fe:/r";
    },
    elementBoundaryStartMarker(): string {
        return "fe:e";
    },
    elementBoundaryEndMarker(): string {
        return "fe:/e";
    },
    parseAttributeBindingCount,
    resolveAttributeBindings(
        node: Element,
        factoryPointer: number,
        _hydrationIndexOffset: number,
    ): HydrationMarkerResolution | null {
        const count = parseAttributeBindingCount(node);
        if (count === null) {
            return null;
        }

        const factoryIndices = Array.from(
            { length: count },
            (_, index) => factoryPointer + index,
        );

        return {
            factoryIndices,
            nextFactoryPointer: factoryPointer + count,
            cleanup: () => node.removeAttribute("data-fe"),
        };
    },
    resolveContentBinding(
        data: string,
        factoryPointer: number,
        _hydrationIndexOffset: number,
    ): HydrationMarkerResolution | null {
        if (data !== "fe:b") {
            return null;
        }

        return {
            factoryIndices: [factoryPointer],
            nextFactoryPointer: factoryPointer + 1,
        };
    },
    isContentBindingStartMarker(data: string): boolean {
        return data === "fe:b";
    },
    isContentBindingEndMarker(data: string): boolean {
        return data === "fe:/b";
    },
    isRepeatViewStartMarker(data: string): boolean {
        return data === "fe:r";
    },
    isRepeatViewEndMarker(data: string): boolean {
        return data === "fe:/r";
    },
    isElementBoundaryStartMarker(node: Node): boolean {
        return isComment(node) && node.data === "fe:e";
    },
    isElementBoundaryEndMarker(node: Node): boolean {
        return isComment(node) && node.data === "fe:/e";
    },
});

let activeHydrationMarkers = markerStrategies.get(HydrationMarkup)!;

/**
 * Selects the hydration marker format used by hydratable views.
 * @internal
 */
export function installHydrationMarkers(markers: HydrationMarkers): void {
    activeHydrationMarkers = markerStrategies.get(markers)!;
}

/**
 * Gets the hydration marker format used by hydratable views.
 * @internal
 */
export function getHydrationMarkers(): HydrationMarkerStrategy {
    return activeHydrationMarkers;
}
