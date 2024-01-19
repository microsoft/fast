import type { StorybookConfig } from "@storybook/html-vite";
import { dirname, join } from "path";
import { mergeConfig } from "vite";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
    core: { disableTelemetry: true },
    stories: ["../src/**/*.stories.ts"],
    docs: { autodocs: true },
    addons: [
        // getAbsolutePath("@storybook/addon-interactions"),
        getAbsolutePath("@storybook/addon-essentials"),
    ],
    framework: {
        name: getAbsolutePath("@storybook/html-vite"),
        options: {},
    },
    async viteFinal(config) {
        // Merge custom configuration into the default config
        return mergeConfig(config, {
            resolve: {
                alias: [{ find: /^(.*\.svg)$/, replacement: "$1?raw" }],
            },
        });
    },
};
export default config;
