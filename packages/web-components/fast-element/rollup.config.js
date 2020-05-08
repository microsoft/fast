import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/fast-element.js",
                format: "esm",
            },
        ],
        plugins: [
            typescript({
                cacheRoot: ".rollupcache",
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
