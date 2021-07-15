import { RelativeLuminance } from "./utilities/relative-luminance";
/**
 * Represents a color in a {@link Palette}
 * @public
 */
export interface Swatch extends RelativeLuminance {
    toColorString(): string;
    contrast(target: RelativeLuminance): number;
}
/** @public */
export interface SwatchRGB extends Swatch {
    r: number;
    g: number;
    b: number;
}
/** @public */
export declare const SwatchRGB: Readonly<{
    create(r: number, g: number, b: number): SwatchRGB;
    from(obj: { r: number; g: number; b: number }): SwatchRGB;
}>;
