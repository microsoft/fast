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
 * The default `HydrationMarkup` strategy only recognizes FAST Element 3.x
 * data-free markers; server output that emits the legacy 2.x indexed marker
 * format will fail to hydrate unless this strategy is explicitly installed.
 * Import and pass `markers_v2` to `enableHydration` for interoperability with
 * backend systems that still emit that legacy format. Because this module is
 * only referenced when explicitly imported, the legacy parsing logic is
 * tree-shaken out of the bundle for consumers who don't use it.
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
