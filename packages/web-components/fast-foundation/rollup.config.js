import commonJS from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import minifyTaggedCSSTemplate from "rollup-plugin-minify-tagged-css-template";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import transformTaggedTemplate from "rollup-plugin-transform-tagged-template";
import typescript from "rollup-plugin-typescript2";
import transformHTMLFragment from "../../../build/transform-html-fragment";

const parserOptions = { sourceType: "module" };

export default [
    {
        input: "src/index-rollup.ts",
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
            minifyTaggedCSSTemplate({ parserOptions }),
            transformTaggedTemplate({
                tagsToProcess: ["html"],
                transformer: transformHTMLFragment,
                parserOptions,
            }),
            filesize({
                showMinifiedSize: false,
            }),
        ],
    },
];
