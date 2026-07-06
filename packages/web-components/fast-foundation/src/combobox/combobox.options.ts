import type { ValuesOf } from "../utilities/index.js";

/**
 * Autocomplete values for combobox.
 * @public
 */
export const ComboboxAutocomplete = {
    inline: "inline",
    list: "list",
    both: "both",
    none: "none",
} as const;

/**
 * Autocomplete type for combobox.
 * @public
 */
export type ComboboxAutocomplete = ValuesOf<typeof ComboboxAutocomplete>;
