import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnter,
} from "@microsoft/fast-web-utilities";
import { RadioControl } from "../radio";

export class RadioGroup extends FASTElement {
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean;
    private readOnlyChanged(): void {
        const filteredRadios = this.getFilteredRadioButtons();
        if (filteredRadios !== undefined) {
            filteredRadios.forEach((radio: HTMLInputElement) => {
                if (this.readOnly) {
                    radio.readOnly = true;
                } else {
                    radio.removeAttribute("readonly");
                }
            });
        }
    }

    @attr({ attribute: "disabled", mode: "boolean" })
    public disabled: boolean;
    private disabledChanged(): void {
        const filteredRadios = this.getFilteredRadioButtons();
        if (filteredRadios !== undefined) {
            filteredRadios.forEach((radio: HTMLInputElement) => {
                if (this.disabled) {
                    radio.setAttribute("disabled", "");
                } else {
                    radio.removeAttribute("disabled");
                }
            });
        }
    }

    @attr
    public name: string;
    protected nameChanged(): void {
        this.getFilteredRadioButtons().forEach((radio: HTMLInputElement) => {
            radio.setAttribute("name", this.name);
        });
    }

    @attr
    public value: string;

    @observable slottedRadioButtons: RadioControl[];
    private selectedRadio: RadioControl | null;

    constructor() {
        super();
        this.addEventListener("keydown", this.keydownHandler);
        this.addEventListener("change", this.handleRadioChange);
        this.addEventListener("keypress", this.keypressHandler);
        this.addEventListener("click", this.clickHandler);
        this.addEventListener("focusout", this.handleFocusOut);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        const radioButtons: RadioControl[] = this.getFilteredRadioButtons();
        radioButtons.forEach((radio: RadioControl) => {
            //(radio as HTMLInputElement).addEventListener("blur", this.handleBlur);
            if (this.name !== undefined) {
                radio.setAttribute("name", this.name);
            }

            if (this.disabled) {
                radio.disabled = true;
            }

            if (this.readOnly) {
                radio.readOnly = true;
            }

            if (this.value && this.value === radio.getAttribute("value")) {
                this.selectedRadio = radio;
                radio.setAttribute("checked", "");
                radio.setAttribute("tabindex", "0");
            } else {
                radio.setAttribute("tabindex", "-1");
            }
        });

        if (this.value === undefined) {
            radioButtons[0].setAttribute("tabindex", "0");
        }
    }

    private getFilteredRadioButtons = (): RadioControl[] => {
        const radioButtons: RadioControl[] = [];
        if (this.slottedRadioButtons !== undefined) {
            this.slottedRadioButtons.forEach((item: any) => {
                if (item instanceof HTMLElement) {
                    radioButtons.push(item as HTMLInputElement);
                }
            });
        }
        return radioButtons;
    };

    private keypressHandler = (e: KeyboardEvent): void => {
        const radio: HTMLInputElement | null = e.target as HTMLInputElement;
        if (radio) {
            radio.setAttribute("tabindex", radio.checked ? "0" : "-1");
        }
    };

    private handleRadioChange = (e: CustomEvent): void => {
        const changedRadio: HTMLInputElement = e.target as HTMLInputElement;
        if (changedRadio.checked) {
            this.getFilteredRadioButtons().forEach((radio: HTMLInputElement) => {
                if (radio !== changedRadio) {
                    radio.checked = false;
                    radio.setAttribute("tabindex", "-1");
                }
            });
            this.selectedRadio = changedRadio;
            this.value = changedRadio.value;
        }
    };

    private moveToRadioByIndex = (
        group: RadioControl[],
        index: number,
        inToolbar: boolean
    ) => {
        const radio: RadioControl = group[index];
        if (!radio.readOnly && !inToolbar) {
            radio.checked = true;
            radio.setAttribute("tabindex", "0");
        } else {
            radio.setAttribute("tabindex", "-1");
        }
        this.selectedRadio = radio;
        radio.focus();
    };

    private moveRightOffGroup = () => {
        this.selectedRadio = null;
        (this.nextElementSibling as HTMLInputElement).focus();
    };

    private moveLeftOffGroup = () => {
        this.selectedRadio = null;
        (this.previousElementSibling as HTMLInputElement).focus();
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private handleFocusOut = (e: FocusEvent) => {
        const group: RadioControl[] = this.getFilteredRadioButtons();
        if (!this.selectedRadio) {
            group[0].setAttribute("tabindex", "0");
        }
    };

    private clickHandler = (e: MouseEvent): void => {
        const radio: HTMLInputElement | null = e.target as HTMLInputElement;
        if (radio) {
            const group: RadioControl[] = this.getFilteredRadioButtons();
            if (radio.checked || group.indexOf(radio) === 0) {
                radio.setAttribute("tabindex", "0");
                this.selectedRadio = radio;
            } else {
                radio.setAttribute("tabindex", "-1");
                this.selectedRadio = null;
            }
        }
    };

    public keydownHandler = (e: KeyboardEvent): void => {
        const group: RadioControl[] = this.getFilteredRadioButtons();
        let index: number = 0;
        const toolbar: HTMLElement | null | undefined = this.parentElement?.closest(
            '[role="toolbar"]'
        );
        const inToolbar: boolean = toolbar !== undefined && toolbar !== null;
        switch (e.keyCode) {
            case keyCodeEnter:
                index = this.selectedRadio ? group.indexOf(this.selectedRadio) + 1 : 1;
                if (
                    this.selectedRadio &&
                    !this.selectedRadio.readOnly &&
                    !this.selectedRadio.checked
                ) {
                    this.selectedRadio.checked = true;
                    this.selectedRadio.setAttribute("tabindex", "0");
                    this.selectedRadio.focus();
                }
                break;
            case keyCodeArrowRight:
            case keyCodeArrowDown:
                index = this.selectedRadio ? group.indexOf(this.selectedRadio) + 1 : 1;
                if (
                    index === group.length &&
                    inToolbar &&
                    e.keyCode === keyCodeArrowRight
                ) {
                    this.moveRightOffGroup();
                    return;
                } else if (index === group.length) {
                    index = 0;
                }
                // matching native radio/radiogroup which does not select an item if there is only 1 in the group
                while (index < group.length && group.length > 1) {
                    if (!group[index].disabled) {
                        this.moveToRadioByIndex(group, index, inToolbar);
                        break;
                    } else if (index === group.indexOf(this.selectedRadio!)) {
                        break;
                    } else if (index + 1 >= group.length) {
                        if (inToolbar) {
                            break;
                        } else {
                            index = 0;
                        }
                    } else {
                        index += 1;
                    }
                }
                break;
            case keyCodeArrowLeft:
            case keyCodeArrowUp:
                index = this.selectedRadio ? group.indexOf(this.selectedRadio) - 1 : 0;

                if (index < 0 && inToolbar && e.keyCode === keyCodeArrowLeft) {
                    this.moveLeftOffGroup();
                    return;
                }

                index = index < 0 ? group.length - 1 : index;

                while (index >= 0 && group.length > 1) {
                    if (!group[index].disabled) {
                        this.moveToRadioByIndex(group, index, inToolbar);
                        break;
                    } else if (index === group.indexOf(this.selectedRadio!)) {
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
