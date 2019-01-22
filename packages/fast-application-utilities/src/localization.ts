/**
 * Expose ltr and rtl strings
 * @deprecated - use @microsoft/fast-web-utilties instead
 */
export enum Direction {
    ltr = "ltr",
    rtl = "rtl",
}

/**
 * @deprecated - use @microsoft/fast-web-utilties instead
 */
export const localeDirectionMapping: { [key: string]: Direction } = {
    en: Direction.ltr,
    "en-rtl": Direction.rtl,
};

/**
 * @deprecated - use @microsoft/fast-web-utilties instead
 */
export default function isRTL(locale: string): boolean {
    if (localeDirectionMapping[locale]) {
        return localeDirectionMapping[locale] === Direction.rtl;
    }

    return false;
}
