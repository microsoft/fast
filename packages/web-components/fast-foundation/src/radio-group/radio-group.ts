import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnter,
    keyCodeTab,
} from "@microsoft/fast-web-utilities";
import { RadioControl } from "../radio/index";

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
                    radio.readOnly = false;
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
                    radio.disabled = true;
                } else {
                    radio.disabled = false;
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

    @attr
    public orientation: Orientation = Orientation.horizontal;

    @observable slottedRadioButtons: RadioControl[];
    private selectedRadio: RadioControl | null;
    private focusedRadio: RadioControl | null;
    private parentToolbar: HTMLElement | null | undefined;
    private isInsideToolbar: boolean = false;

    constructor() {
        super();
        this.addEventListener("keydown", this.keydownHandler);
        this.addEventListener("change", this.radioChangeHandler);
        this.addEventListener("keypress", this.keypressHandler);
        this.addEventListener("click", this.clickHandler);
        this.addEventListener("focusout", this.focusOutHandler);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        const radioButtons: RadioControl[] = this.getFilteredRadioButtons();
        radioButtons.forEach((radio: RadioControl) => {
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
                this.focusedRadio = radio;
                radio.checked = true;
                radio.setAttribute("tabindex", "0");
            } else {
                radio.setAttribute("tabindex", "-1");
            }
        });

        if (this.value === undefined && radioButtons.length > 0) {
            radioButtons[0].setAttribute("tabindex", "0");
            this.focusedRadio = radioButtons[0];
        }

        this.parentToolbar = this.parentElement?.closest('[role="toolbar"]');
        this.isInsideToolbar =
            this.parentToolbar !== undefined && this.parentToolbar !== null;
    }

    private getFilteredRadioButtons = (): RadioControl[] => {
        const radioButtons: RadioControl[] = [];
        if (this.slottedRadioButtons !== undefined) {
            this.slottedRadioButtons.forEach((item: any) => {
                if (item instanceof HTMLElement) {
                    radioButtons.push(item as any);
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

    private radioChangeHandler = (e: CustomEvent): void => {
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

    private moveToRadioByIndex = (group: RadioControl[], index: number) => {
        const radio: RadioControl = group[index];
        if (!this.isInsideToolbar) {
            radio.setAttribute("tabindex", "0");
            if (radio.readOnly) {
                this.getFilteredRadioButtons().forEach((nextRadio: HTMLInputElement) => {
                    if (nextRadio !== radio) {
                        nextRadio.setAttribute("tabindex", "-1");
                    }
                });
            } else {
                radio.checked = true;
                this.selectedRadio = radio;
            }
        }
        this.focusedRadio = radio;
        radio.focus();
    };

    private moveRightOffGroup = () => {
        (this.nextElementSibling as HTMLInputElement).focus();
    };

    private moveLeftOffGroup = () => {
        (this.previousElementSibling as HTMLInputElement).focus();
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private focusOutHandler = (e: FocusEvent) => {
        const group: RadioControl[] = this.getFilteredRadioButtons();
        const radio: HTMLInputElement | null = e.target as HTMLInputElement;
        const index: number = radio !== null ? group.indexOf(radio) : 0;
        const focusedIndex: number = this.focusedRadio
            ? group.indexOf(this.focusedRadio)
            : -1;

        if (
            (focusedIndex === 0 && index === focusedIndex) ||
            (focusedIndex === group.length - 1 && focusedIndex === index)
        ) {
            if (!this.selectedRadio) {
                this.focusedRadio = group[0];
                this.focusedRadio.setAttribute("tabindex", "0");
                group.forEach((nextRadio: HTMLInputElement) => {
                    if (nextRadio !== this.focusedRadio) {
                        nextRadio.setAttribute("tabindex", "-1");
                    }
                });
            } else {
                this.selectedRadio.setAttribute("tabindex", "0");
                this.focusedRadio = this.selectedRadio;
                group.forEach((nextRadio: HTMLInputElement) => {
                    if (nextRadio !== this.selectedRadio) {
                        nextRadio.setAttribute("tabindex", "-1");
                    }
                });
            }
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
            this.focusedRadio = radio;
        }
        e.preventDefault();
    };

    private shouldMoveOffGroupToTheRight = (
        index: number,
        group: RadioControl[],
        keyCode: number
    ): boolean => {
        return (
            index === group.length &&
            this.isInsideToolbar &&
            keyCode === keyCodeArrowRight
        );
    };

    private shouldMoveOffGroupToTheLeft = (
        group: RadioControl[],
        keyCode: number
    ): boolean => {
        const index = this.focusedRadio ? group.indexOf(this.focusedRadio) - 1 : 0;
        return index < 0 && this.isInsideToolbar && keyCode === keyCodeArrowLeft;
    };

    private checkFocusedRadio = (): void => {
        if (
            this.focusedRadio !== null &&
            !this.focusedRadio.readOnly &&
            !this.focusedRadio.checked
        ) {
            this.focusedRadio.checked = true;
            this.focusedRadio.setAttribute("tabindex", "0");
            this.focusedRadio.focus();
            this.selectedRadio = this.focusedRadio;
        }
    };

    /* keyboard handling per https://w3c.github.io/aria-practices/#for-radio-groups-not-contained-in-a-toolbar */
    /* navigation is different when there is an ancestor with role='toolbar' */
    public keydownHandler = (e: KeyboardEvent): void => {
        const group: RadioControl[] = this.getFilteredRadioButtons();
        let index: number = 0;
        if (e.keyCode !== keyCodeTab) {
            e.preventDefault();
        }
        switch (e.keyCode) {
            case keyCodeEnter:
                this.checkFocusedRadio();
                break;
            case keyCodeArrowRight:
            case keyCodeArrowDown:
                index = this.focusedRadio ? group.indexOf(this.focusedRadio) + 1 : 1;
                if (this.shouldMoveOffGroupToTheRight(index, group, e.keyCode)) {
                    this.moveRightOffGroup();
                    return;
                } else if (index === group.length) {
                    index = 0;
                }
                /* looping to get to next radio that is not disabled */
                /* matching native radio/radiogroup which does not select an item if there is only 1 in the group */
                while (index < group.length && group.length > 1) {
                    if (!group[index].disabled) {
                        this.moveToRadioByIndex(group, index);
                        break;
                    } else if (
                        this.focusedRadio &&
                        index === group.indexOf(this.focusedRadio)
                    ) {
                        break;
                    } else if (index + 1 >= group.length) {
                        if (this.isInsideToolbar) {
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
                if (this.shouldMoveOffGroupToTheLeft(group, e.keyCode)) {
                    this.moveLeftOffGroup();
                    return;
                }
                index = this.focusedRadio ? group.indexOf(this.focusedRadio) - 1 : 0;
                index = index < 0 ? group.length - 1 : index;

                /* looping to get to next radio that is not disabled */
                while (index >= 0 && group.length > 1) {
                    if (!group[index].disabled) {
                        this.moveToRadioByIndex(group, index);
                        break;
                    } else if (
                        this.focusedRadio &&
                        index === group.indexOf(this.focusedRadio)
                    ) {
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
