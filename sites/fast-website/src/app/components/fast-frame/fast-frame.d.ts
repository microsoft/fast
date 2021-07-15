import { FASTElement } from "@microsoft/fast-element";
import { PaletteRGB } from "@microsoft/fast-components";
export declare const drawerBreakpoint: string;
export declare class FastFrame extends FASTElement {
    preview: HTMLElement;
    accentColor: string;
    darkMode: boolean;
    baseLayerLuminance: number;
    baseLayerLuminanceChanged(): void;
    previewNeutralPalette: string[];
    previewAccentPalette: string[];
    private mql;
    neutralPalette: PaletteRGB;
    neutralPaletteChanged(): void;
    accentPalette: PaletteRGB;
    accentPaletteChanged(): void;
    density: number;
    densityChanged(): void;
    borderRadius: number;
    borderRadiusChanged(): void;
    strokeWidth: number;
    strokeWidthChanged(): void;
    saturation: number;
    hue: number;
    lightness: number;
    expanded: boolean;
    isMobile: boolean;
    accentChangeHandler: (e: CustomEvent) => void;
    neutralChangeHandler: (e: CustomEvent) => void;
    densityChangeHandler: (e: CustomEvent) => void;
    borderRadiusChangeHandler: (e: CustomEvent) => void;
    strokeWidthChangeHandler: (e: CustomEvent) => void;
    saturationChangeHandler: (e: CustomEvent) => void;
    hueChangeHandler: (e: CustomEvent) => void;
    handleExpandKeypress: (e: KeyboardEvent) => void;
    private updateAccentColor;
    modeChange: (e: CustomEvent) => void;
    private resetExpandedResponsive;
    setTabIndex: () => string;
    constructor();
    /**
     * @internal
     */
    connectedCallback(): void;
}
