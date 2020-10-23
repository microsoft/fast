import { FASTElement, attr, observable } from "@microsoft/fast-element";
import {
    createColorPalette,
    FASTSlider,
    FASTDesignSystem,
    fastDesignSystemDefaults,
    StandardLuminance,
    neutralLayerCardContainer,
    FASTRadioGroup,
} from "@microsoft/fast-components";
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
    public backgroundColor: string;

    @attr
    public darkMode: boolean = true;

    @attr
    public baseLayerLuminance: number = StandardLuminance.DarkMode;

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
    public neutralPalette: string[];

    @observable
    public accentPalette: string[];

    @observable
    public density: number = 0;

    @observable
    public borderRadius: number = 3;

    @observable
    public outlineWidth: number = 1;

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

    public neutralChangeHandler = (e: CustomEvent): void => {
        if (e.target instanceof FASTRadioGroup) {
            const parsedColor = parseColorHexRGB(e.target.value);
            this.neutralPalette = createColorPalette(parsedColor as ColorRGBA64);
            this.updateBackgroundColor();
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

    private updateBackgroundColor(): void {
        const designSystem: FASTDesignSystem = Object.assign(
            {},
            fastDesignSystemDefaults,
            {
                baseLayerLuminance: this.baseLayerLuminance,
                neutralPalette: this.neutralPalette,
            }
        );

        this.backgroundColor = neutralLayerCardContainer(designSystem);
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
    }
}
