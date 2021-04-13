export interface RelativeLuminance {
    /**
     * A number between 0 and 1, calculated by {@link https://www.w3.org/WAI/GL/wiki/Relative_luminance}
     */
    readonly relativeLuminance: number;
}

export function contrast(a: RelativeLuminance, b: RelativeLuminance): number {
    ``;
    return (a.relativeLuminance + 0.05) / (b.relativeLuminance + 0.05);
}
