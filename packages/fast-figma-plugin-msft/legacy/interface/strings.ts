const strings = {
    // The only string displayed when there is no valid element selected for the plugin to edit
    noValidElementSelected: "Select an element to see style options.",
    // Displayed where the active note type is when no valid node type is selected
    invalidActiveNodeType: "N/A",
    // Button text to clear plugin data
    clearPluginDataTriggerText: "Clear data",
    clearPluginDataTriggerTooltip:
        "Clear all site data from this node and all child nodes",
    // Label for the input to turn theme on and off
    toggleThemLabel: "Theme",
    setLightThemeLabel: "Light",
    setDarkThemeLabel: "Dark",
};

// Simple implementation of string retrieval that should support localization down the line
export function stringById(id: keyof typeof strings): string {
    return strings[id];
}
