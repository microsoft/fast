import { FASTElement, attr } from "@microsoft/fast-element";
import { FASTRadio } from "@microsoft/fast-components";

export class FastFrame extends FASTElement {
    @attr
    public accentColor: string = "#F33378";

    @attr
    public backgroundColor: string = "#1F1F1F";

    public accentChangeHandler = (e: any): void => {
        const element: HTMLInputElement = e.target
        if(element.checked) {
            this.accentColor = e.target.value
        }
    }

    public backgroundChangeHandler = (e: any): void => {
        const element: HTMLInputElement = e.target
        if(element.checked) {
            this.backgroundColor = e.target.value
        }
    }
}
