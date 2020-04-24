import { attr, observable, FASTElement } from "@microsoft/fast-element";
import {
    keyCodeArrowLeft,
    keyCodeArrowDown,
    keyCodeArrowRight,
    keyCodeArrowUp,
} from "@microsoft/fast-web-utilities";
import { FASTRadio } from "../radio";

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

    @observable slottedRadioButtons: Node[];

    constructor() {
        super();
        this.addEventListener("keydown", this.keydownHandler);
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.getFilteredRadioButtons().forEach((radio: HTMLElement) => {
            radio.addEventListener("change", this.handleRadioChange);
            if (this.name !== undefined) {
                radio.setAttribute("name", this.name);
            }
        });
        // for (let index = 0; index < this.children.length; index++) {
        //     const radio: FASTRadio = this.children[index] as FASTRadio;
        //     radio.addEventListener("change", this.handleRadioChange);
        //     if (this.name !== undefined) {
        //         radio.setAttribute("name", this.name);
        //     }
        // }
    }

    private getFilteredRadioButtons = (): any => {
        return this.slottedRadioButtons.filter((node: Node) => {
            if (node instanceof HTMLElement) {
                return node as HTMLElement;
            }
        });
    };

    private handleRadioChange = (e): void => {
        const changedRadio: FASTRadio = e.target as FASTRadio;
        if (changedRadio.checked) {
            //loop through and uncheck everybody else
            // for (let index = 0; index < this.children.length; index++) {
            //     const radio: FASTRadio = this.children[index] as FASTRadio;
            //     if (radio !== changedRadio) {
            //         radio.checked = false;
            //     }
            // }
            this.getFilteredRadioButtons().forEach((radio: FASTRadio) => {
                if (radio !== changedRadio) {
                    radio.checked = false;
                }
            });
        }
    };

    private moveToRadioByIndex = (group: any[], index: number) => {
        (group[index] as FASTRadio).checked = true;
        group[index].focus();
    };

    public keydownHandler = (e: KeyboardEvent): void => {
        const group = this.getFilteredRadioButtons();
        let index: number = 0;
        switch (e.keyCode) {
            case keyCodeArrowLeft:
            case keyCodeArrowDown:
                index = group.indexOf(this) + 1;
                index = index === group.length ? 0 : index;
                while (index < group.length) {
                    if (!group[index].disabled) {
                        this.moveToRadioByIndex(group, index);
                        break;
                    } else if (index === group.indexOf(this)) {
                        break;
                    } else if (index + 1 >= group.length) {
                        index = 0;
                    } else {
                        index += 1;
                    }
                }
                break;
            case keyCodeArrowRight:
            case keyCodeArrowUp:
                index = group.indexOf(this) - 1;
                index = index < 0 ? group.length - 1 : index;
                while (index >= 0) {
                    if (!group[index].disabled) {
                        this.moveToRadioByIndex(group, index);
                        break;
                    } else if (index === group.indexOf(this)) {
                        break;
                    } else if (index - 1 < 0) {
                        index = group.length - 1;
                    } else {
                        index -= 1;
                    }
                }
                break;
        }
    };
}
