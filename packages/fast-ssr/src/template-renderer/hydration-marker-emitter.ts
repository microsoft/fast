import { HydrationMarkup } from "@microsoft/fast-element/element-hydration.js";

export const hydrationMarker = Object.freeze({
    contentBindingStart(index: number, uniqueId: string) {
        return `<!--${HydrationMarkup.contentBindingStartMarker(index, uniqueId)}-->`;
    },
    contentBindingEnd(index: number, uniqueId: string) {
        return `<!--${HydrationMarkup.contentBindingEndMarker(index, uniqueId)}-->`;
    },
    attribute(indexes: number[]) {
        return `${HydrationMarkup.attributeMarkerName}="${indexes.join(
            HydrationMarkup.attributeBindingSeparator
        )}"`;
    },
});
