/* eslint-env node */
import commonJS from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import transformTaggedTemplate from "rollup-plugin-transform-tagged-template";
import typescript from "rollup-plugin-typescript2";
import {
    transformCSSFragment,
    transformHTMLFragment,
} from "../../../build/transform-fragments";

const parserOptions = {
    sourceType: "module",
};

export default [
    {
        context: "this",
        input: "src/index-rollup.ts",
        onwarn(warning, warn) {
            // The IIFE export doesn't have a namespace since component exports
            // are expected to be top-level objects
            if (warning.code === "MISSING_NAME_OPTION_FOR_IIFE_EXPORT") {
                return;
            }

            warn(warning);
        },
        output: [
            {
                file: "dist/fast-components.js",
                format: "esm",
            },
            {
                file: "dist/fast-components.min.js",
                format: "esm",
                plugins: [terser()],
            },
            {
                file: "dist/fast-components.iife.min.js",
                format: "iife",
                plugins: [terser()],
            },
        ],
        plugins: [
            resolve(),
            commonJS(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false,
                    },
                },
            }),
            transformTaggedTemplate({
                tagsToProcess: ["css"],
                transformer: transformCSSFragment,
                parserOptions,
            }),
            transformTaggedTemplate({
                tagsToProcess: ["html"],
                transformer: transformHTMLFragment,
                parserOptions,
            }),
            filesize({
                showMinifiedSize: false,
                showBrotliSize: true,
            }),
        ],
    },
];
