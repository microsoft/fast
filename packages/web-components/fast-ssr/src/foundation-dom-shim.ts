import {
    createWindow as createMinimalWindow,
    Document as MinimalDocument,
} from "./dom-shim.js";

/**
 * Shim of MediaQueryList.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList} */
export class MediaQueryList {
    /** No-op */
    addListener() {}

    /** Always false */
    matches = false;
}

export function createWindow(
    props: { [key: string]: unknown } = {}
): { [key: string]: unknown } {
    return createMinimalWindow({
        MediaQueryList,
        matchMedia: () => new MediaQueryList(),
        ...props,
    });
}
