/**
 * @internal
 */
export function neutralForeground(palette, reference) {
    return palette.colorContrast(reference, 14);
}
