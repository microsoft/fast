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
export type DayFormat = typeof DayFormat[keyof typeof DayFormat];

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
export type WeekdayFormat = typeof WeekdayFormat[keyof typeof WeekdayFormat];

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
export type MonthFormat = typeof MonthFormat[keyof typeof MonthFormat];

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
export type YearFormat = typeof YearFormat[keyof typeof YearFormat];
