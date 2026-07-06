import type { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
    stories: ["../src/**/stories/*.stories.ts", "debug.stories.ts"],
    framework: "@storybook/html-vite",
    addons: ["@storybook/addon-essentials"],
    core: {
        disableTelemetry: true,
        disableWhatsNewNotifications: true,
    },
    async viteFinal(config) {
        const { mergeConfig } = await import("vite");

        return mergeConfig(config, {
            build: { chunkSizeWarningLimit: 1000 },
            resolve: {
                alias: [{ find: /^(.*\.svg)$/, replacement: "$1?raw" }],
            },
        });
    },
};

export default config;
