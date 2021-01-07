import path from "path";
import commonJS from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

const srcDir = path.resolve(__dirname, "..", "src");
const distDir = path.resolve(__dirname, "dist");

export default [
    {
        context: "this",
        input: path.resolve(srcDir, "index-rollup.ts"),
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
        ],
    },
];
