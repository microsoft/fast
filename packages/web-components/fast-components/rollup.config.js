import resolve from "rollup-plugin-node-resolve";
import path from "path";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";

export default [
    {
        input: path.resolve(__dirname, "./build/generate-default-palettes.js"),
        output: {
            file: ".tmp/generate-palettes.js",
            format: "cjs",
        },
        plugins: [resolve(), typescript()],
        external: ["fs", "path"],
    },
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/fast-components.js",
                format: "esm",
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
            terser(),
            filesize(),
        ],
    },
];
