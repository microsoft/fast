import filesize from "rollup-plugin-filesize";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import transformTaggedTemplate from "rollup-plugin-transform-tagged-template";
import {
    transformCSSFragment,
    transformHTMLFragment,
} from "../../../build/transform-fragments.js";

const parserOptions = {
    sourceType: "module",
};

const plugins = [
    nodeResolve(),
    transformTaggedTemplate({
        tagsToProcess: ["css"],
        transformer: transformCSSFragment,
        parserOptions,
    }),
    transformTaggedTemplate({
        tagsToProcess: ["child", "html", "item"],
        transformer: transformHTMLFragment,
        parserOptions,
    }),
    filesize({
        showMinifiedSize: false,
        showBrotliSize: true,
    }),
];

export default [
    {
        input: "dist/esm/index.rollup.js",
        output: [
            {
                file: "dist/fast-foundation.js",
                format: "esm",
            },
            {
                file: "dist/fast-foundation.min.js",
                format: "esm",
                plugins: [terser()],
            },
        ],
        plugins,
    },
    {
        input: "dist/esm/index.rollup.debug.js",
        output: [
            {
                file: "dist/fast-foundation.debug.js",
                format: "esm",
            },
            {
                file: "dist/fast-foundation.debug.min.js",
                format: "esm",
                plugins: [terser()],
            },
        ],
        plugins,
    },
];
