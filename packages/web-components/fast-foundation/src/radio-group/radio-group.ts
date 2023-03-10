import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    ArrowKeys,
    Direction,
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEnter,
} from "@microsoft/fast-web-utilities";
import { FASTRadio } from "../radio/index.js";
import { getDirection } from "../utilities/direction.js";
import { RadioGroupOrientation } from "./radio-group.options.js";

/**
 * An Radio Group Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#radiogroup | ARIA radiogroup }.
 *
 * @slot label - The slot for the label
 * @slot - The default slot for radio buttons
 * @csspart positioning-region - The positioning region for laying out the radios
 * @fires change - Fires a custom 'change' event when the value changes
 *
 * @public
 */
export class FASTRadioGroup extends FASTElement {
    /**
     * When true, the child radios will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean;

    /**
     * Disables the radio group and child radios.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ attribute: "disabled", mode: "boolean" })
    public disabled: boolean;
    protected disabledChanged(): void {}

    /**
     * The name of the radio group. Setting this value will set the name value
     * for all child radio elements.
     *
     * @public
     * @remarks
     * HTML Attribute: name
     */
    @attr
    public name: string;
    protected nameChanged(): void {
        if (this.slottedRadioButtons) {
            this.slottedRadioButtons.forEach((radio: FASTRadio) => {
                radio.setAttribute("name", this.name);
            });
        }
    }

    /**
     * The value of the checked radio
     *
     * @public
     * @remarks
     * HTML Attribute: value
     */
    @attr
    public value: string;
    protected valueChanged(): void {
        if (this.slottedRadioButtons) {
            this.slottedRadioButtons.forEach((radio: FASTRadio) => {
                if (radio.value === this.value) {
                    radio.checked = true;
                    this.selectedRadio = radio;
                }
            });
        }
        this.$emit("change");
    }

    /**
     * The orientation of the group
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    @attr
    public orientation: RadioGroupOrientation = RadioGroupOrientation.horizontal;

    @observable
    public childItems: HTMLElement[];

    /**
     * @internal
     */
    @observable
    public slottedRadioButtons: HTMLElement[];
    protected slottedRadioButtonsChanged(
        oldValue: unknown,
        newValue: HTMLElement[]
    ): void {
        if (this.slottedRadioButtons && this.slottedRadioButtons.length > 0) {
            this.setupRadioButtons();
        }
    }

    private selectedRadio: FASTRadio | null;
    private focusedRadio: FASTRadio | null;
    private direction: Direction;

    private get parentToolbar(): HTMLElement | null {
        return this.closest('[role="toolbar"]');
    }

    private get isInsideToolbar(): boolean {
        return (this.parentToolbar ?? false) as boolean;
    }

    private get isInsideFoundationToolbar(): boolean {
        return !!this.parentToolbar?.["$fastController"];
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.direction = getDirection(this);

        this.setupRadioButtons();
    }

    public disconnectedCallback(): void {
        this.slottedRadioButtons.forEach((radio: FASTRadio) => {
            radio.removeEventListener("change", this.radioChangeHandler);
        });
    }

    private setupRadioButtons(): void {
        const checkedRadios: HTMLElement[] = this.slottedRadioButtons.filter(
            (radio: FASTRadio) => {
                return radio.hasAttribute("checked");
            }
        );
        const numberOfCheckedRadios: number = checkedRadios ? checkedRadios.length : 0;
        if (numberOfCheckedRadios > 1) {
            const lastCheckedRadio: FASTRadio = checkedRadios[
                numberOfCheckedRadios - 1
            ] as FASTRadio;
            lastCheckedRadio.checked = true;
        }
        let foundMatchingVal: boolean = false;

        this.slottedRadioButtons.forEach((radio: FASTRadio) => {
            if (this.name !== undefined) {
                radio.setAttribute("name", this.name);
            }

            if (this.value && this.value === radio.value) {
                this.selectedRadio = radio;
                this.focusedRadio = radio;
                radio.checked = true;
                radio.setAttribute("tabindex", "0");
                foundMatchingVal = true;
            } else {
                if (!this.isInsideFoundationToolbar) {
                    radio.setAttribute("tabindex", "-1");
                }
                radio.checked = false;
            }

            radio.addEventListener("change", this.radioChangeHandler);
        });

        if (this.value === undefined && this.slottedRadioButtons.length > 0) {
            const checkedRadios: HTMLElement[] = this.slottedRadioButtons.filter(
                (radio: FASTRadio) => {
                    return radio.hasAttribute("checked");
                }
            );
            const numberOfCheckedRadios: number =
                checkedRadios !== null ? checkedRadios.length : 0;
            if (numberOfCheckedRadios > 0 && !foundMatchingVal) {
                const lastCheckedRadio: FASTRadio = checkedRadios[
                    numberOfCheckedRadios - 1
                ] as FASTRadio;
                lastCheckedRadio.checked = true;
                this.focusedRadio = lastCheckedRadio;
                lastCheckedRadio.setAttribute("tabindex", "0");
            } else {
                this.slottedRadioButtons[0].setAttribute("tabindex", "0");
                this.focusedRadio = this.slottedRadioButtons[0] as FASTRadio;
            }
        }
    }

    private radioChangeHandler = (e: CustomEvent): boolean | void => {
        const changedRadio: FASTRadio = e.target as FASTRadio;

        if (changedRadio.checked) {
            this.slottedRadioButtons.forEach((radio: FASTRadio) => {
                if (radio !== changedRadio) {
                    radio.checked = false;
                    if (!this.isInsideFoundationToolbar) {
                        radio.setAttribute("tabindex", "-1");
                    }
                }
            });
            this.selectedRadio = changedRadio;
            this.value = changedRadio.value;
            changedRadio.setAttribute("tabindex", "0");
            this.focusedRadio = changedRadio;
        }
        e.stopPropagation();
    };

    private moveToRadioByIndex = (group: HTMLElement[], index: number) => {
        const radio: FASTRadio = group[index] as FASTRadio;
        if (!this.isInsideToolbar) {
            radio.setAttribute("tabindex", "0");
            radio.checked = true;
            this.selectedRadio = radio;
        }
        this.focusedRadio = radio;
        radio.focus();
    };

    private moveRightOffGroup = () => {
        (this.nextElementSibling as FASTRadio)?.focus();
    };

    private moveLeftOffGroup = () => {
        (this.previousElementSibling as FASTRadio)?.focus();
    };

    /**
     * @internal
     */
    public focusOutHandler = (e: FocusEvent): boolean | void => {
        const group: HTMLElement[] = this.slottedRadioButtons;
        const radio: FASTRadio | null = e.target as FASTRadio;
        const index: number = radio !== null ? group.indexOf(radio) : 0;
        const focusedIndex: number = this.focusedRadio
            ? group.indexOf(this.focusedRadio)
            : -1;

        if (
            (focusedIndex === 0 && index === focusedIndex) ||
            (focusedIndex === group.length - 1 && focusedIndex === index)
        ) {
            if (!this.selectedRadio) {
                this.focusedRadio = group[0] as FASTRadio;
                this.focusedRadio.setAttribute("tabindex", "0");
                group.forEach((nextRadio: FASTRadio) => {
                    if (nextRadio !== this.focusedRadio) {
                        nextRadio.setAttribute("tabindex", "-1");
                    }
                });
            } else {
                this.focusedRadio = this.selectedRadio;

                if (!this.isInsideFoundationToolbar) {
                    this.selectedRadio.setAttribute("tabindex", "0");
                    group.forEach((nextRadio: FASTRadio) => {
                        if (nextRadio !== this.selectedRadio) {
                            nextRadio.setAttribute("tabindex", "-1");
                        }
                    });
                }
            }
        }
        return true;
    };

    /**
     * @internal
     */
    public handleDisabledClick = (e: MouseEvent): void | boolean => {
        // prevent focus events on items from the click handler when disabled
        if (this.disabled) {
            e.preventDefault();
            return;
        }

        return true;
    };

    /**
     * @internal
     */
    public clickHandler = (e: MouseEvent): void | boolean => {
        if (this.disabled) {
            return;
        }

        e.preventDefault();
        const radio: FASTRadio | null = e.target as FASTRadio;

        if (radio && radio instanceof FASTRadio) {
            radio.checked = true;
            radio.setAttribute("tabindex", "0");
            this.selectedRadio = radio;
            this.focusedRadio = radio;
        }
    };

    private shouldMoveOffGroupToTheRight = (
        index: number,
        group: HTMLElement[],
        key: string
    ): boolean => {
        return index === group.length && this.isInsideToolbar && key === keyArrowRight;
    };

    private shouldMoveOffGroupToTheLeft = (
        group: HTMLElement[],
        key: string
    ): boolean => {
        const index = this.focusedRadio ? group.indexOf(this.focusedRadio) - 1 : 0;
        return index < 0 && this.isInsideToolbar && key === keyArrowLeft;
    };

    private checkFocusedRadio = (): void => {
        if (this.focusedRadio !== null && !this.focusedRadio.checked) {
            this.focusedRadio.checked = true;
            this.focusedRadio.setAttribute("tabindex", "0");
            this.focusedRadio.focus();
            this.selectedRadio = this.focusedRadio;
        }
    };

    private moveRight = (e: KeyboardEvent): void => {
        const group: HTMLElement[] = this.slottedRadioButtons;
        let index: number = 0;

        index = this.focusedRadio ? group.indexOf(this.focusedRadio) + 1 : 1;
        if (this.shouldMoveOffGroupToTheRight(index, group, e.key)) {
            this.moveRightOffGroup();
            return;
        } else if (index === group.length) {
            index = 0;
        }
        /* looping to get to next radio that is not disabled */
        /* matching native radio/radiogroup which does not select an item if there is only 1 in the group */
        while (index < group.length && group.length > 1) {
            if (!(group[index] as FASTRadio).disabled) {
                this.moveToRadioByIndex(group, index);
                break;
            } else if (this.focusedRadio && index === group.indexOf(this.focusedRadio)) {
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
    };

    private moveLeft = (e: KeyboardEvent): void => {
        const group: HTMLElement[] = this.slottedRadioButtons;
        let index: number = 0;

        index = this.focusedRadio ? group.indexOf(this.focusedRadio) - 1 : 0;
        index = index < 0 ? group.length - 1 : index;

        if (this.shouldMoveOffGroupToTheLeft(group, e.key)) {
            this.moveLeftOffGroup();
            return;
        }
        /* looping to get to next radio that is not disabled */
        while (index >= 0 && group.length > 1) {
            if (!(group[index] as FASTRadio).disabled) {
                this.moveToRadioByIndex(group, index);
                break;
            } else if (this.focusedRadio && index === group.indexOf(this.focusedRadio)) {
                break;
            } else if (index - 1 < 0) {
                index = group.length - 1;
            } else {
                index -= 1;
            }
        }
    };

    /**
     * keyboard handling per https://w3c.github.io/aria-practices/#for-radio-groups-not-contained-in-a-toolbar
     * navigation is different when there is an ancestor with role='toolbar'
     *
     * @internal
     */
    public keydownHandler = (e: KeyboardEvent): boolean | void => {
        const key = e.key;

        if (key in ArrowKeys && (this.isInsideFoundationToolbar || this.disabled)) {
            return true;
        }

        switch (key) {
            case keyEnter: {
                this.checkFocusedRadio();
                break;
            }

            case keyArrowRight:
            case keyArrowDown: {
                if (this.direction === Direction.ltr) {
                    this.moveRight(e);
                } else {
                    this.moveLeft(e);
                }
                break;
            }

            case keyArrowLeft:
            case keyArrowUp: {
                if (this.direction === Direction.ltr) {
                    this.moveLeft(e);
                } else {
                    this.moveRight(e);
                }
                break;
            }

            default: {
                return true;
            }
        }
    };
}
