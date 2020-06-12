import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import commonJS from "rollup-plugin-commonjs";

export default [
    {
        input: "src/index-rollup.ts",
        output: [
            {
                file: "dist/fast-components-msft.js",
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
        input: "src/index-rollup.ts",
        output: [
            {
                file: "dist/fast-components-msft.min.js",
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
