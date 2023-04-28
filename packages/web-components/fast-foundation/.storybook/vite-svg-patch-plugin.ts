/**
This module is a workaround for Vite not supporting SVG imports as strings.
Rather than adding the `?raw` query to every SVG import, it uses the
`svg-inline-loader` plugin to inline the SVGs as strings.
https://github.com/vitejs/vite/issues/1204#issuecomment-846189641
*/

import { getExtractedSVG } from "svg-inline-loader";
import type { Plugin } from "vite";
import fs from "fs";

//TODO: remove this once https://github.com/vitejs/vite/pull/2909 gets merged
export const svgLoader: (options?: {
    classPrefix?: string;
    idPrefix?: string;
    removeSVGTagAttrs?: boolean;
    warnTags?: boolean;
    removeTags?: boolean;
    warnTagAttrs?: boolean;
    removingTagAttrs?: boolean;
}) => Plugin = (options?: {}) => {
    return {
        name: "vite-svg-patch-plugin",
        transform: function (code, id) {
            if (id.endsWith(".svg")) {
                const extractedSvg = fs.readFileSync(id, "utf8");
                return `export default "${getExtractedSVG(extractedSvg, options)}"`;
            }
            return code;
        },
    };
};
