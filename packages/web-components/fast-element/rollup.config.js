import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

const plugins = [
    typescript({
        compilerOptions: {
            declaration: false,
            declarationDir: undefined,
        },
    }),
    filesize({
        showMinifiedSize: false,
        showBrotliSize: true,
    }),
];

export default [
    {
        input: "src/index.rollup.ts",
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
        plugins,
    },
    {
        input: "src/index.rollup.debug.ts",
        output: [
            {
                file: "dist/fast-element.debug.js",
                format: "esm",
            },
            {
                file: "dist/fast-element.debug.min.js",
                format: "esm",
                plugins: [terser()],
            },
        ],
        plugins,
    },
];
