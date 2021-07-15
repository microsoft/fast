/**
 * @internal
 */
export function contrast(a, b) {
    const L1 = a.relativeLuminance > b.relativeLuminance ? a : b;
    const L2 = a.relativeLuminance > b.relativeLuminance ? b : a;
    return (L1.relativeLuminance + 0.05) / (L2.relativeLuminance + 0.05);
}
