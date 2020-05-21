import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { createColorPalette } from "@microsoft/fast-components";
import {
    ColorHSL,
    ColorRGBA64,
    hslToRGB,
    parseColorHexRGB,
    rgbToHSL,
} from "@microsoft/fast-colors";

export class FastFrame extends FASTElement {
    @attr({ attribute: "accent-color" })
    public accentColor: string = "#F33378";

    @attr({ attribute: "background-color" })
    public backgroundColor: string = "#1F1F1F";

    @attr
    public darkMode: boolean = true;

    @observable
    public previewBackgroundPalette: string[] = [
        "#1F1F1F",
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

    private parsedColor = parseColorHexRGB(this.accentColor);

    @observable
    public saturation: number;

    @observable
    public hue: number;

    @observable
    public lightness: number;

    public accentChangeHandler = (e: any): void => {
        const element: HTMLInputElement = e.target;
        if (element.checked) {
            this.accentColor = e.target.value;
            const accentColorHSL = rgbToHSL(parseColorHexRGB(this.accentColor)!);
            this.hue = accentColorHSL.h;
            this.saturation = accentColorHSL.s;
            this.lightness = accentColorHSL.l;
            this.parsedColor = parseColorHexRGB(this.accentColor);
            this.accentPalette = createColorPalette(this.parsedColor as ColorRGBA64);
        }
    };

    public backgroundChangeHandler = (e: any): void => {
        const element: HTMLInputElement = e.target;
        if (element.checked) {
            this.backgroundColor = e.target.value;
            this.lastSelectedIndex = Array.from(this.previewBackgroundPalette).indexOf(
                e.target.value
            );
        }
    };

    public densityChangeHandler = (e: any): void => {
        this.density = e.target.value;
    };

    public borderRadiusChangeHandler = (e: any): void => {
        this.borderRadius = e.target.value;
    };

    public outlineWidthChangeHandler = (e: any): void => {
        this.outlineWidth = e.target.value;
    };

    public baseHeightMultiplierChangeHandler = (e: any): void => {
        this.baseHeightMultiplier = e.target.value;
    };

    public baseHorizontalSpacingMultiplierChangeHandler = (e: any): void => {
        this.baseHorizontalSpacingMultiplier = e.target.value;
    };

    public saturationChangeHandler = (e: any): void => {
        this.saturation = e.target.value;
        this.updateAccentColor();
    };

    public hueChangeHandler = (e: any): void => {
        this.hue = e.target.value;
        this.updateAccentColor();
    };

    private updateAccentColor(): void {
        const accentHSL = new ColorHSL(this.hue, this.saturation, this.lightness);
        const accentRGB = hslToRGB(accentHSL);
        this.accentColor = accentRGB.toStringHexRGB();
        this.accentPalette = createColorPalette(accentRGB);
    }

    public themeChange = (e: any): void => {
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

    constructor() {
        super();

        const accentColorHSL = rgbToHSL(parseColorHexRGB(this.accentColor)!);
        this.hue = accentColorHSL.h;
        this.saturation = accentColorHSL.s;
        this.lightness = accentColorHSL.l;
    }
}
