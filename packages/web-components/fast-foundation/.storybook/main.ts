import type { StorybookConfig } from "@storybook/html-vite";
// import { nodeResolve } from "@rollup/plugin-node-resolve";
// import image from "@rollup/plugin-image";

const config: StorybookConfig = {
    addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
    stories: ["../src/**/stories/*.stories.ts", "debug.stories.ts"],
    framework: "@storybook/html-vite",
    core: {
        disableTelemetry: true,
    },
    async viteFinal(config, options) {
        // config.build!.modulePreload = {
        //     // ...(config.build!.modulePreload ?? {}),
        //     polyfill: false
        // };
        // config.build!.target = "es2020";
        // config.optimizeDeps = {
        //     ...(config.optimizeDeps ?? {}),
        //     // exclude: ["@microsoft/fast-element"],
        //     // disabled: true,
        // };
        // config.build!.minify = "terser";
        // config.plugins = {
        //     ...(config.plugins ?? {}),
        //     {
        //         enforce: "pre",
        //         ...nodeResolve(),
        //     }
        // };
        // config.esbuild = false;
        return config;
    },
};

export default config;
