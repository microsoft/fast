import { FASTElement, attr, observable } from "@microsoft/fast-element";
import {
    StandardLuminance,
    PaletteRGB,
    SwatchRGB,
    NeutralLayerL1,
    baseLayerLuminance,
    neutralPalette,
    accentPalette,
    fillColor,
    density,
    baseHeightMultiplier,
    baseHorizontalSpacingMultiplier,
    cornerRadius,
    outlineWidth,
} from "@microsoft/fast-components";
import { DI, RadioGroup, Slider } from "@microsoft/fast-foundation";
import { ColorHSL, hslToRGB, parseColorHexRGB, rgbToHSL } from "@microsoft/fast-colors";

export const drawerBreakpoint: string = "660px";

export class FastFrame extends FASTElement {
    @attr({ attribute: "accent-color" })
    public accentColor: string = "#F33378";

    @attr({ attribute: "background-color" })
    public backgroundColor: string;
    backgroundColorChanged() {
        const color = parseColorHexRGB(this.backgroundColor);

        if (color) {
            fillColor.setValueFor(this, SwatchRGB.create(color.r, color.g, color.b));
        }
    }

    @attr
    public darkMode: boolean = true;

    @attr
    public baseLayerLuminance: number = StandardLuminance.DarkMode;
    baseLayerLuminanceChanged() {
        if (typeof this.baseLayerLuminance === "number") {
            baseLayerLuminance.setValueFor(this, this.baseLayerLuminance);
        }
    }

    @observable
    public previewNeutralPalette: string[] = [
        "#808080",
        "#35719F",
        "#2D5F2D",
        "#5D437C",
        "#A35436",
    ];

    @observable
    public previewAccentPalette: string[] = [
        "#F33378",
        "#F34733",
        "#10A7B5",
        "#109B82",
        "#E1A054",
    ];

    private mql: MediaQueryList = window.matchMedia(`(max-width: ${drawerBreakpoint})`);

    @observable
    public neutralPalette: PaletteRGB;
    neutralPaletteChanged() {
        if (this.neutralPalette) {
            neutralPalette.setValueFor(this, this.neutralPalette);
        }
    }

    @observable
    public accentPalette: PaletteRGB;
    accentPaletteChanged() {
        if (this.accentPalette) {
            accentPalette.setValueFor(this, this.accentPalette);
        }
    }

    @observable
    public density: number = 0;
    densityChanged() {
        density.setValueFor(this, this.density);
    }

    @observable
    public borderRadius: number = 3;
    borderRadiusChanged() {
        cornerRadius.setValueFor(this, this.borderRadius);
    }

    @observable
    public outlineWidth: number = 1;
    outlineWidthChanged() {
        outlineWidth.setValueFor(this, this.outlineWidth);
    }

    @observable
    public saturation: number;

    @observable
    public hue: number;

    @observable
    public lightness: number;

    @observable
    public expanded: boolean = false;

    @observable
    public isMobile: boolean = this.mql.matches;

    public accentChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof RadioGroup) {
            this.accentColor = e.target.value;
            const accentColorHSL = rgbToHSL(parseColorHexRGB(this.accentColor)!);
            this.hue = accentColorHSL.h;
            this.saturation = accentColorHSL.s;
            this.lightness = accentColorHSL.l;
            const parsedColor = parseColorHexRGB(this.accentColor);

            if (parsedColor) {
                this.accentPalette = PaletteRGB.create(
                    SwatchRGB.create(parsedColor.r, parsedColor.g, parsedColor.b)
                );
            }
        }
    };

    public neutralChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof RadioGroup) {
            const parsedColor = parseColorHexRGB(e.target.value);

            if (parsedColor) {
                this.neutralPalette = PaletteRGB.create(
                    SwatchRGB.create(parsedColor.r, parsedColor.g, parsedColor.b)
                );
                this.updateBackgroundColor();
            }
        }
    };

    public densityChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof Slider) {
            this.density = parseInt(e.target.value);
        }
    };

    public borderRadiusChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof Slider) {
            this.borderRadius = parseInt(e.target.value);
        }
    };

    public outlineWidthChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof Slider) {
            this.outlineWidth = parseInt(e.target.value);
        }
    };

    public saturationChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof Slider) {
            this.saturation = parseFloat(e.target.value);
        }
        this.updateAccentColor();
    };

    public hueChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof Slider) {
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
        this.accentPalette = PaletteRGB.create(
            SwatchRGB.create(accentRGB.r, accentRGB.g, accentRGB.b)
        );
    }

    private updateBackgroundColor(): void {
        this.backgroundColor = DI.getOrCreateDOMContainer(this)
            .get(NeutralLayerL1)(this)
            .toColorString();
    }

    public modeChange = (e: CustomEvent): void => {
        this.darkMode = !this.darkMode;
        this.baseLayerLuminance = this.darkMode
            ? StandardLuminance.DarkMode
            : StandardLuminance.LightMode;
        this.updateBackgroundColor();
    };

    private resetExpandedResponsive = (e): void => {
        this.expanded = false;
        this.isMobile = e.matches;
    };

    public setTabIndex = (): string => (!this.expanded && this.isMobile ? "-1" : "0");

    constructor() {
        super();

        const accentColorHSL = rgbToHSL(parseColorHexRGB(this.accentColor)!);
        this.hue = accentColorHSL.h;
        this.saturation = accentColorHSL.s;
        this.lightness = accentColorHSL.l;

        this.mql.addListener(this.resetExpandedResponsive);
    }

    /**
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback();

        this.updateBackgroundColor();
        density.setValueFor(this, 0);
        baseHeightMultiplier.setValueFor(this, 10);
        baseHorizontalSpacingMultiplier.setValueFor(this, 3);
    }
}
