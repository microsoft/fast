import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { createColorPalette, FASTSlider } from "@microsoft/fast-components";
import {
    ColorHSL,
    ColorRGBA64,
    hslToRGB,
    parseColorHexRGB,
    rgbToHSL,
} from "@microsoft/fast-colors";
import { SiteColorSwatch } from "../color-swatch";

export const drawerBreakpoint: string = "660px";

export class FastFrame extends FASTElement {
    @attr({ attribute: "accent-color" })
    public accentColor: string = "#F33378";

    @attr({ attribute: "background-color" })
    public backgroundColor: string = "#212121";

    @attr
    public darkMode: boolean = true;

    @observable
    public previewBackgroundPalette: string[] = [
        "#212121",
        "#2B2B2B",
        "#333333",
        "#3B3B3B",
        "#424242",
    ];

    @observable
    public previewAccentPalette: string[] = [
        "#F33378",
        "#F34733",
        "#10A7B5",
        "#109B82",
        "#E1A054",
    ];

    private darkPallette: string[] = this.previewBackgroundPalette;

    @observable
    public lastSelectedIndex: number = 0;

    @observable
    public accentPalette: string[];

    @observable
    public density: number = 0;

    @observable
    public borderRadius: number = 3;

    @observable
    public outlineWidth: number = 1;

    @observable
    public baseHeightMultiplier: number = 10;

    @observable
    public baseHorizontalSpacingMultiplier: number = 3;

    @observable
    public saturation: number;

    @observable
    public hue: number;

    @observable
    public lightness: number;

    @observable
    public expanded: boolean;

    public accentChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof SiteColorSwatch) {
            if (e.target.checked) {
                this.accentColor = e.target.value;
                const accentColorHSL = rgbToHSL(parseColorHexRGB(this.accentColor)!);
                this.hue = accentColorHSL.h;
                this.saturation = accentColorHSL.s;
                this.lightness = accentColorHSL.l;
                const parsedColor = parseColorHexRGB(this.accentColor);
                this.accentPalette = createColorPalette(parsedColor as ColorRGBA64);
            }
        }
    };

    public backgroundChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof SiteColorSwatch) {
            if (e.target.checked) {
                this.backgroundColor = e.target.value;
                this.lastSelectedIndex = Array.from(
                    this.previewBackgroundPalette
                ).indexOf(e.target.value);
            }
        }
    };

    public densityChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof FASTSlider) {
            this.density = parseInt(e.target.value);
        }
    };

    public borderRadiusChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof FASTSlider) {
            this.borderRadius = parseInt(e.target.value);
        }
    };

    public outlineWidthChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof FASTSlider) {
            this.outlineWidth = parseInt(e.target.value);
        }
    };

    public baseHeightMultiplierChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof FASTSlider) {
            this.baseHeightMultiplier = parseInt(e.target.value);
        }
    };

    public baseHorizontalSpacingMultiplierChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof FASTSlider) {
            this.baseHorizontalSpacingMultiplier = parseInt(e.target.value);
        }
    };

    public saturationChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof FASTSlider) {
            this.saturation = parseFloat(e.target.value);
        }
        this.updateAccentColor();
    };

    public hueChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof FASTSlider) {
            this.hue = parseFloat(e.target.value);
        }
        this.updateAccentColor();
    };

    public handleExpandKeypress = (e: KeyboardEvent): void => {
        this.expanded = !this.expanded;
    };

    private updateAccentColor(): void {
        const accentHSL = new ColorHSL(this.hue, this.saturation, this.lightness);
        const accentRGB = hslToRGB(accentHSL);
        this.accentColor = accentRGB.toStringHexRGB();
        this.accentPalette = createColorPalette(accentRGB);
    }

    public themeChange = (e: CustomEvent): void => {
        this.darkMode = !this.darkMode;
        if (!this.darkMode) {
            this.previewBackgroundPalette = [
                "#FFFFFF",
                "#F0F0F0",
                "#DEDEDE",
                "#D6D6D6",
                "#C4C4C4",
            ];
        } else {
            this.previewBackgroundPalette = this.darkPallette;
        }
        this.backgroundColor = this.previewBackgroundPalette[this.lastSelectedIndex];
    };

    private resetExpanded = (): void => {
        this.expanded = false;
    };

    constructor() {
        super();

        const accentColorHSL = rgbToHSL(parseColorHexRGB(this.accentColor)!);
        this.hue = accentColorHSL.h;
        this.saturation = accentColorHSL.s;
        this.lightness = accentColorHSL.l;

        window
            .matchMedia(`(max-width: ${drawerBreakpoint})`)
            .addListener(this.resetExpanded);
    }
}
