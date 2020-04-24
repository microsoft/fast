import { attr, observable, FASTElement } from "@microsoft/fast-element";
import { keyCodeArrowLeft, keyCodeArrowDown } from "@microsoft/fast-web-utilities";
import { FASTRadio } from "src/radio";

export class RadioGroup extends FASTElement {
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        // TODO: set readonly on all the radio children
    }

    @attr({ attribute: "disabled", mode: "boolean" })
    public disabled: boolean; // Map to proxy element
    private disabledChanged(): void {
        // TODO: set disabled on all the radio children
    }

    @attr
    public name: string; // Map to proxy element
    protected nameChanged(): void {
        // TODO: set name attribute on all the radio children
    }

    @observable
    public selectedValue: string;
    private selectedValueChanged(): void {}

    constructor() {
        super();
        this.addEventListener("keydown", this.keydownHandler);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        for (let index = 0; index < this.children.length; index++) {
            const radio: FASTRadio = this.children[index] as FASTRadio;
            radio.addEventListener("change", this.handleRadioChange);
        }
    }

    private handleRadioChange = (e): void => {
        const radio: FASTRadio = e.target as FASTRadio;
        console.log(
            "radio value:",
            radio.value,
            " checked:",
            radio.checked,
            " name:",
            radio.name
        );
    };

    public keydownHandler = (e: KeyboardEvent): void => {
        switch (e.keyCode) {
            case keyCodeArrowLeft:
            case keyCodeArrowDown:
                break;
        }
    };
}
