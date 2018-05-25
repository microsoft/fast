/**
 * Expose ltr and rtl strings
 */
export enum Direction {
    ltr = "ltr",
    rtl = "rtl"
}

export interface ILocaleDirectionMapping {
    [key: string]: Direction;
}

export const localeDirectionMapping: ILocaleDirectionMapping = {
    "en": Direction.ltr,
    "en-rtl": Direction.rtl
};

export default function isRTL(locale: string): boolean {
    if (localeDirectionMapping[locale]) {
        return localeDirectionMapping[locale] === Direction.rtl;
    }

    return false;
}
