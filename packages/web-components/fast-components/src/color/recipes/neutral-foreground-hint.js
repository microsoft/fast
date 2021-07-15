/**
 * The neutralForegroundHint color recipe
 * @param palette - The palette to operate on
 * @param reference - The reference color
 *
 * @internal
 */
export function neutralForegroundHint(palette, reference) {
    return palette.colorContrast(reference, 4.5);
}
