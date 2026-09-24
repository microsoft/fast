import {
    isComment,
    legacyBindingEndMarker,
    legacyElementBoundaryEndMarker,
    legacyElementBoundaryStartMarker,
    legacyRepeatViewEndMarker,
    legacyRepeatViewStartMarker,
    resolveLegacyAttributeBindings,
    resolveLegacyContentBinding,
} from "./legacy-markers.js";
import {
    createHydrationMarkers,
    type HydrationMarkerResolution,
    type HydrationMarkers,
} from "./markers.js";

/**
 * FAST Element 2.x indexed hydration markers.
 *
 * This strategy accepts only the legacy indexed marker format. Use it when
 * hydrating server output that exclusively emits FAST Element 2.x markers.
 * The default `HydrationMarkup` strategy already accepts these markers as a
 * fallback alongside FAST Element 3.x data-free markers, so `markers_v2` is
 * only required when a client must reject the newer data-free format.
 *
 * @example
 * ```ts
 * import { enableHydration, markers_v2 } from "@microsoft/fast-element/hydration.js";
 *
 * enableHydration({ markers: markers_v2 });
 * ```
 * @public
 */
export const markers_v2: HydrationMarkers = createHydrationMarkers({
    resolveAttributeBindings(
        node: Element,
        factoryPointer: number,
        hydrationIndexOffset: number,
    ): HydrationMarkerResolution | null {
        return resolveLegacyAttributeBindings(node, factoryPointer, hydrationIndexOffset);
    },
    resolveContentBinding(
        data: string,
        factoryPointer: number,
        hydrationIndexOffset: number,
    ): HydrationMarkerResolution | null {
        return resolveLegacyContentBinding(data, factoryPointer, hydrationIndexOffset);
    },
    isContentBindingStartMarker(data: string): boolean {
        return resolveLegacyContentBinding(data, 0, 0) !== null;
    },
    isContentBindingEndMarker(data: string): boolean {
        return legacyBindingEndMarker.test(data);
    },
    isRepeatViewStartMarker(data: string): boolean {
        return legacyRepeatViewStartMarker.test(data);
    },
    isRepeatViewEndMarker(data: string): boolean {
        return legacyRepeatViewEndMarker.test(data);
    },
    isElementBoundaryStartMarker(node: Node): boolean {
        return isComment(node) && legacyElementBoundaryStartMarker.test(node.data);
    },
    isElementBoundaryEndMarker(node: Node): boolean {
        return isComment(node) && legacyElementBoundaryEndMarker.test(node.data);
    },
});
