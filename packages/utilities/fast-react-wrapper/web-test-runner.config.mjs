import { playwrightLauncher } from "@web/test-runner-playwright";
import { rollupBundlePlugin } from '@web/dev-server-rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
    concurrency: 10,
    coverage: true,
    nodeResolve: true,
    // in a monorepo you need to set set the root dir to resolve modules
    rootDir: "../../../",
    playwright: true,
    browsers: [
        playwrightLauncher({ product: "chromium" }),
    ],
    files: [
        "dist/esm/**/*.spec.js",
        "!**/node_modules/**"
    ],
    plugins: [
        rollupBundlePlugin({
            rollupConfig: {
              input: [
                'dist/esm/index.spec.js',
              ],
              plugins: [
                commonjs(),
                nodeResolve(),
                replace({
                  preventAssignment: false,
                  'process.env.NODE_ENV': JSON.stringify('development'),
                }),
              ],
              onwarn(warning, console) {
                if (warning.code === 'THIS_IS_UNDEFINED') return;
                console.warn(warning);
              },
            },
        })
      ],
};
