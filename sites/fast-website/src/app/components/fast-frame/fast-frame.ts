import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { FASTRadio } from "@microsoft/fast-components";

export class FastFrame extends FASTElement {
    @attr
    public accentColor: string = "#F33378";

    @attr
    public backgroundColor: string = "#1F1F1F";

    @attr
    public darkMode: boolean = true;

    @observable
    public colorPallet: string[] = [
        "#1F1F1F",
        "#2B2B2B",
        "#333333",
        "#3B3B3B",
        "#424242",
    ];

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
        }
    };

    public themeChange = (e: any): void => {
        this.darkMode = !this.darkMode;
        if (!this.darkMode) {
            this.colorPallet = ["#FFFFFF", "#F0F0F0", "#DEDEDE", "#D6D6D6", "#C4C4C4"];
        } else {
            this.colorPallet = ["#1F1F1F", "#2B2B2B", "#333333", "#3B3B3B", "#424242"];
        }
        this.backgroundColor = this.colorPallet[0];
    };
}
