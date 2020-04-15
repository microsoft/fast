import path from "path";
import glob from "glob";
import { merge } from "lodash";

/**
 * Options object to configure the FAST DNA presets
 */
interface FASTDNAPresetOptions {
    designSystemAddon: {
        enabled: boolean;
    };
}

const optionDefaults: FASTDNAPresetOptions = {
    designSystemAddon: {
        enabled: true,
    },
};

export function addons(entry: string[] = [], options?: FASTDNAPresetOptions): string[] {
    const withDefaults: FASTDNAPresetOptions = merge({}, optionDefaults, options);

    if (withDefaults.designSystemAddon.enabled) {
        entry = entry.concat([
            require.resolve("@microsoft/fast-storybook-design-system-addon/register"),
        ]);
    }

    entry = entry.concat([
        require.resolve("@storybook/addon-a11y/register"),
        require.resolve("@storybook/addon-viewport/register"),
        require.resolve("@storybook/addon-actions/register"),
        require.resolve("storybook-addon-performance/register"),
    ]);

    return entry;
}

export function entries(entry: string[] = [], options?: FASTDNAPresetOptions): any {
    const withDefaults: FASTDNAPresetOptions = merge({}, optionDefaults, options);

    if (withDefaults.designSystemAddon.enabled) {
        entry = entry.concat([
            path.resolve(__dirname, "./fast-design-system-addon-setup.js"),
        ]);
    }

    entry = entry.concat([
        ...glob.sync("./src/**/*.stories.tsx"),
        path.resolve(__dirname, "./setup.js"),
    ]);

    return entry;
}

import theme from "./theme";
export { theme };
