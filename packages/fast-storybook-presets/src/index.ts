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

export function addons(entry = [], options?: FASTDNAPresetOptions): string[] {
    const withDefaults: FASTDNAPresetOptions = merge({}, optionDefaults, options);

    if (withDefaults.designSystemAddon.enabled) {
        entry = entry.concat([
            require.resolve("@microsoft/fast-storybook-design-system-addon/register"),
        ]);
    }

    return entry;
}

export function entries(entries: any): any {
    return [
        ...entries,
        ...glob.sync("./src/**/*.stories.tsx"),
        path.resolve(__dirname, "./fast-storybook-design-system-addon-setup.js"),
        path.resolve(__dirname, "./global-styles.js"),
    ];
}
