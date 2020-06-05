import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import commonJS from "rollup-plugin-commonjs";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/fast-foundation.js",
                format: "esm",
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
        ],
    },
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/fast-foundation.min.js",
                format: "esm",
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
            terser(),
            filesize(),
        ],
    },
];
