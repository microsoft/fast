import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { FASTRadio } from "@microsoft/fast-components";
import { SiteColorSwatch } from "../color-swatch";

export class FastFrame extends FASTElement {
    @attr({ attribute: "accent-color" })
    public accentColor: string = "#F33378";

    @attr({ attribute: "background-color" })
    public backgroundColor: string = "#1F1F1F";

    @attr
    public darkMode: boolean = true;

    @observable
    public colorPalette: string[] = [
        "#1F1F1F",
        "#2B2B2B",
        "#333333",
        "#3B3B3B",
        "#424242",
    ];

    private darkPallette: string[] = this.colorPalette;

    private lastSelectedIndex: number = 0;

    public accentChangeHandler = (e: any): void => {
        const element: HTMLInputElement = e.target;
        if (element.checked) {
            this.accentColor = e.target.value;
        }
    };

    public backgroundChangeHandler = (e: any): void => {
        const element: HTMLInputElement = e.target;
        if (element.checked) {
            this.backgroundColor = e.target.value;
            this.lastSelectedIndex = Array.from(this.colorPalette).indexOf(
                e.target.value
            );
        }
    };

    public themeChange = (e: any): void => {
        this.darkMode = !this.darkMode;
        if (!this.darkMode) {
            this.colorPalette = ["#FFFFFF", "#F0F0F0", "#DEDEDE", "#D6D6D6", "#C4C4C4"];
        } else {
            this.colorPalette = this.darkPallette;
        }
        this.backgroundColor = this.colorPalette[this.lastSelectedIndex];
    };
}
