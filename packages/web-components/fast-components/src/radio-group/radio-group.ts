import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
} from "@microsoft/fast-web-utilities";
import { FASTRadio } from "../radio";

export class RadioGroup extends FASTElement {
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        const filteredRadios = this.getFilteredRadioButtons();
        console.log("filteredRadios:", filteredRadios);
        if (filteredRadios !== undefined) {
            filteredRadios.forEach((radio: HTMLElement) => {
                if (this.disabled) {
                    radio.setAttribute("readonly", "");
                } else {
                    radio.removeAttribute("readonly");
                }
            });
        }
    }

    @attr({ attribute: "disabled", mode: "boolean" })
    public disabled: boolean; // Map to proxy element
    private disabledChanged(): void {
        const filteredRadios = this.getFilteredRadioButtons();
        if (filteredRadios !== undefined) {
            filteredRadios.forEach((radio: HTMLElement) => {
                if (this.disabled) {
                    radio.setAttribute("disabled", "");
                } else {
                    radio.removeAttribute("disabled");
                }
            });
        }
    }

    @attr
    public name: string; // Map to proxy element
    protected nameChanged(): void {
        this.getFilteredRadioButtons().forEach((radio: HTMLElement) => {
            radio.setAttribute("name", this.name);
        });
    }

    @attr({ attribute: "selected-value" })
    public selectedValue: string;
    private selectedValueChanged(): void {
        this.$emit("change");
    }

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

            if (this.disabled) {
                radio.setAttribute("disabled", "");
            }

            if (this.readOnly) {
                radio.setAttribute("readonly", "");
            }
        });
    }

    private getFilteredRadioButtons = (): any[] => {
        if (this.slottedRadioButtons !== undefined) {
            return this.slottedRadioButtons.filter((node: Node) => {
                if (node instanceof HTMLElement) {
                    return node as HTMLElement;
                }
            });
        } else {
            return [];
        }
    };

    private handleRadioChange = (e): void => {
        const changedRadio: FASTRadio = e.target as FASTRadio;
        if (changedRadio.checked) {
            this.getFilteredRadioButtons().forEach((radio: FASTRadio) => {
                if (radio !== changedRadio) {
                    radio.checked = false;
                }
            });
            this.selectedValue = changedRadio.value;
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
