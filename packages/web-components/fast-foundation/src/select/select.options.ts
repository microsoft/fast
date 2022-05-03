/**
 * Positioning directions for the listbox when a select is open.
 * @public
 */
export const SelectPosition = {
    above: "above",
    below: "below",
} as const;

/**
 * Types for positioning the select element listbox when open
 * @public
 */
export type SelectPosition = typeof SelectPosition[keyof typeof SelectPosition];
