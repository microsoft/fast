import type { ValuesOf } from "../utilities/index.js";

/**
 * Day format values for DateFormatter.
 * @public
 */
export const DayFormat = {
    "2-digit": "2-digit",
    numeric: "numeric",
} as const;

/**
 * Day format type for DateFormatter.
 * @public
 */
export type DayFormat = ValuesOf<typeof DayFormat>;

/**
 * Weekday format values for DateFormatter.
 * @public
 */
export const WeekdayFormat = {
    long: "long",
    narrow: "narrow",
    short: "short",
} as const;

/**
 * Weekday format type for DateFormatter.
 * @public
 */
export type WeekdayFormat = ValuesOf<typeof WeekdayFormat>;

/**
 * Month format values for DateFormatter.
 * @public
 */
export const MonthFormat = {
    "2-digit": "2-digit",
    numeric: "numeric",
    short: "short",
    long: "long",
    narrow: "narrow",
} as const;

/**
 * Month format type for DateFormatter.
 * @public
 */
export type MonthFormat = ValuesOf<typeof MonthFormat>;

/**
 * Year format values for DateFormatter.
 * @public
 */
export const YearFormat = {
    "2-digit": "2-digit",
    numeric: "numeric",
} as const;

/**
 * Year format type for DateFormatter.
 * @public
 */
export type YearFormat = ValuesOf<typeof YearFormat>;
