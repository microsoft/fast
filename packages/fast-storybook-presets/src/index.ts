/**
 * Options object to configure the FAST DNA presets
 */
interface FASTDNAPresetOptions {}

export function addons(entry = []): string[] {
    return [
        ...entry,
        require.resolve("@microsoft/fast-storybook-design-system-addon/register"),
    ];
}
