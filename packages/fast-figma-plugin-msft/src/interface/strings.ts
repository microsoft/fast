const strings = {
    // The only string displayed when there is no valid element selected for the plugin to edit
    noValidElementSelected: "Select an element to see style options.",
};

// Simple implementation of string retrieval that should support localization down the line
export function stringById(id: keyof typeof strings): string {
    return strings[id];
}
