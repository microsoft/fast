const strings = {
    // The only string displayed when there is no valid element selected for the plugin to edit
    noValidElementSelected: "Select an element to see style options.",
    // Displayed where the active note type is when no valid node type is selected
    invalidActiveNodeType: "N/A",
};

// Simple implementation of string retrieval that should support localization down the line
export function stringById(id: keyof typeof strings): string {
    return strings[id];
}
