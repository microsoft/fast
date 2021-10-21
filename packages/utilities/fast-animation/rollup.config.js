import commonJS from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/fast-animation.js",
                format: "esm",
            },
            {
                file: "dist/fast-animation.min.js",
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
            filesize({
                showMinifiedSize: false,
                showBrotliSize: true,
            }),
        ],
    },
];
