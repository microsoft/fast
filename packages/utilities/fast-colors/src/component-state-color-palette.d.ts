import { ColorRGBA64 } from "./color-rgba-64";
/**
 * Configuration for {@link ComponentStateColorPalette}
 * @public
 */
export interface ComponentStateColorPaletteConfig {
    /**
     * The color to create the palette from
     */
    baseColor?: ColorRGBA64;
    /**
     * The number of steps in the palette
     */
    steps?: number;
}
/**
 * Creates a color palette for UI components
 * @public
 */
export declare class ComponentStateColorPalette {
    static readonly defaultPaletteConfig: ComponentStateColorPaletteConfig;
    palette: ColorRGBA64[];
    private readonly config;
    constructor(config?: ComponentStateColorPaletteConfig);
    private regenPalettes;
    private matchRelativeLuminanceIndex;
}
