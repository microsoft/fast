import filesize from "rollup-plugin-filesize";
import minifyTaggedCSSTemplate from "rollup-plugin-minify-tagged-css-template";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/fast-element.js",
                format: "esm",
            },
            {
                file: "dist/fast-element.min.js",
                format: "esm",
                plugins: [terser()],
            },
        ],
        plugins: [
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false,
                    },
                },
            }),
            minifyTaggedCSSTemplate({
                parserOptions: {
                    sourceType: "module",
                },
            }),
            filesize({
                showMinifiedSize: false,
            }),
        ],
    },
];
