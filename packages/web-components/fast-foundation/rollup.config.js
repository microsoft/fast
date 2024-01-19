import { nodeResolve } from "@rollup/plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import inlineSvg from "rollup-plugin-inline-svg";
import typescript from "@rollup/plugin-typescript";

const plugins = [
    nodeResolve(),
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
    {
        input: "test/bundle.ts",
        output: {
            file: "test/public/dist/bundle.js",
            format: "cjs",
        },
        context: "window",
        plugins: [
            nodeResolve(),
            inlineSvg(),
            typescript({
                tsconfig: "./tsconfig.test.json",
            }),
        ],
    },
];
