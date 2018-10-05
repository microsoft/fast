/**
 * Expose ltr and rtl strings
 */
export enum Direction {
    ltr = "ltr",
    rtl = "rtl"
}

export const localeDirectionMapping: {[key: string]: Direction} = {
    "en": Direction.ltr,
    "en-rtl": Direction.rtl
};

export default function isRTL(locale: string): boolean {
    if (localeDirectionMapping[locale]) {
        return localeDirectionMapping[locale] === Direction.rtl;
    }

    return false;
}
