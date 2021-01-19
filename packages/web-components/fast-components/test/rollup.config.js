/* eslint-env node */
import path from "path";
import commonJS from "rollup-plugin-commonjs";
import copy from "rollup-plugin-copy";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

const srcDir = path.resolve(__dirname, "..", "src");
const distDir = path.resolve(__dirname, "public");

export default [
    {
        context: "this",
        input: path.resolve(srcDir, "index-rollup.ts"),
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
                file: path.resolve(distDir, "fast-components.js"),
                format: "esm",
                sourcemap: true,
            },
            {
                file: path.resolve(distDir, "fast-components.iife.js"),
                format: "iife",
                sourcemap: true,
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
            copy({
                targets: [
                    {
                        src: `${path.resolve(__dirname, "fixtures")}/*`,
                        dest: distDir,
                    },
                ],
            }),
        ],
    },
];
