export const white: string = "#FFFFFF";
export const black: string = "#000000";
export const accent: string = "#0078D4";

/**
 * Default palette sources
 */
export const neutralPaletteSource: string[] = [white, black];
export const accentPaletteSource: string[] = [white, accent, black];

/**
 * Define named background color areas
 */
export enum LightTheme {
    L1 = 0,
    L1Alt = 2,
    L2 = 4,
    L3 = 5,
    L4 = 6,
}

// TODO: Confirm these index are correct
export enum DarkTheme {
    L1 = 57,
    L1Alt = 55,
    L2 = 54,
    L3 = 53,
    L4 = 52,
}
