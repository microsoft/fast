import type { ValuesOf } from "../utilities/index.js";

/**
 * Button type values.
 *
 * @public
 */
export const ButtonType = {
    submit: "submit",
    reset: "reset",
    button: "button",
} as const;

/**
 * Type for button type values.
 *
 * @public
 */
export type ButtonType = ValuesOf<typeof ButtonType>;
