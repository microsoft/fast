import { DesignToken } from "@microsoft/fast-foundation";
import { create } from "./create.js";

/**
 * Standard font wights.
 *
 * @public
 */
export const StandardFontWeight = {
    Thin: 100,
    ExtraLight: 200,
    Light: 300,
    Normal: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
    ExtraBold: 800,
    Black: 900,
} as const;

/** @public */
export const bodyFont = create<string>("body-font").withDefault(
    '"Segoe UI Variable", "Segoe UI", sans-serif'
);

/** @public */
export const fontWeight = create<number>("font-weight").withDefault(
    StandardFontWeight.Normal
);

function fontVariations(
    sizeToken: DesignToken<string>
): (element: HTMLElement) => string {
    return (element: HTMLElement): string => {
        const size = sizeToken.getValueFor(element);
        const weight = fontWeight.getValueFor(element);
        if (size.endsWith("px")) {
            const px = Number.parseFloat(size.replace("px", ""));
            if (px <= 12) {
                return `"wght" ${weight}, "opsz" 8`;
            } else if (px > 24) {
                return `"wght" ${weight}, "opsz" 36`;
            }
        }
        return `"wght" ${weight}, "opsz" 10.5`;
    };
}

/** @public */
export const typeRampBaseFontSize = create<string>(
    "type-ramp-base-font-size"
).withDefault("14px");

/** @public */
export const typeRampBaseLineHeight = create<string>(
    "type-ramp-base-line-height"
).withDefault("20px");

/** @public */
export const typeRampBaseFontVariations = create<string>(
    "type-ramp-base-font-variations"
).withDefault(fontVariations(typeRampBaseFontSize));

/** @public */
export const typeRampMinus1FontSize = create<string>(
    "type-ramp-minus-1-font-size"
).withDefault("12px");

/** @public */
export const typeRampMinus1LineHeight = create<string>(
    "type-ramp-minus-1-line-height"
).withDefault("16px");

/** @public */
export const typeRampMinus1FontVariations = create<string>(
    "type-ramp-minus-1-font-variations"
).withDefault(fontVariations(typeRampMinus1FontSize));

/** @public */
export const typeRampMinus2FontSize = create<string>(
    "type-ramp-minus-2-font-size"
).withDefault("10px");

/** @public */
export const typeRampMinus2LineHeight = create<string>(
    "type-ramp-minus-2-line-height"
).withDefault("14px");

/** @public */
export const typeRampMinus2FontVariations = create<string>(
    "type-ramp-minus-2-font-variations"
).withDefault(fontVariations(typeRampMinus2FontSize));

/** @public */
export const typeRampPlus1FontSize = create<string>(
    "type-ramp-plus-1-font-size"
).withDefault("16px");

/** @public */
export const typeRampPlus1LineHeight = create<string>(
    "type-ramp-plus-1-line-height"
).withDefault("22px");

/** @public */
export const typeRampPlus1FontVariations = create<string>(
    "type-ramp-plus-1-font-variations"
).withDefault(fontVariations(typeRampPlus1FontSize));

/** @public */
export const typeRampPlus2FontSize = create<string>(
    "type-ramp-plus-2-font-size"
).withDefault("20px");

/** @public */
export const typeRampPlus2LineHeight = create<string>(
    "type-ramp-plus-2-line-height"
).withDefault("26px");

/** @public */
export const typeRampPlus2FontVariations = create<string>(
    "type-ramp-plus-2-font-variations"
).withDefault(fontVariations(typeRampPlus2FontSize));

/** @public */
export const typeRampPlus3FontSize = create<string>(
    "type-ramp-plus-3-font-size"
).withDefault("24px");

/** @public */
export const typeRampPlus3LineHeight = create<string>(
    "type-ramp-plus-3-line-height"
).withDefault("32px");

/** @public */
export const typeRampPlus3FontVariations = create<string>(
    "type-ramp-plus-3-font-variations"
).withDefault(fontVariations(typeRampPlus3FontSize));

/** @public */
export const typeRampPlus4FontSize = create<string>(
    "type-ramp-plus-4-font-size"
).withDefault("28px");

/** @public */
export const typeRampPlus4LineHeight = create<string>(
    "type-ramp-plus-4-line-height"
).withDefault("36px");

/** @public */
export const typeRampPlus4FontVariations = create<string>(
    "type-ramp-plus-4-font-variations"
).withDefault(fontVariations(typeRampPlus4FontSize));

/** @public */
export const typeRampPlus5FontSize = create<string>(
    "type-ramp-plus-5-font-size"
).withDefault("32px");

/** @public */
export const typeRampPlus5LineHeight = create<string>(
    "type-ramp-plus-5-line-height"
).withDefault("40px");

/** @public */
export const typeRampPlus5FontVariations = create<string>(
    "type-ramp-plus-5-font-variations"
).withDefault(fontVariations(typeRampPlus5FontSize));

/** @public */
export const typeRampPlus6FontSize = create<string>(
    "type-ramp-plus-6-font-size"
).withDefault("40px");

/** @public */
export const typeRampPlus6LineHeight = create<string>(
    "type-ramp-plus-6-line-height"
).withDefault("52px");

/** @public */
export const typeRampPlus6FontVariations = create<string>(
    "type-ramp-plus-6-font-variations"
).withDefault(fontVariations(typeRampPlus6FontSize));
