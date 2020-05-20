import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { createColorPalette } from "@microsoft/fast-components";
import { parseColor, ColorRGBA64 } from "@microsoft/fast-colors";

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

    public accentChangeHandler = (e: any): void => {
        const element: HTMLInputElement = e.target;
        if (element.checked) {
            this.accentColor = e.target.value;
            const parsedColor = parseColor(this.accentColor);
            this.accentPalette = createColorPalette(parsedColor as ColorRGBA64);
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
}
