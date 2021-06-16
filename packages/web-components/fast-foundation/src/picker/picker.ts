import {
    attr,
    DOM,
    FASTElement,
    observable,
    RepeatBehavior,
    RepeatDirective,
    ViewTemplate,
} from "@microsoft/fast-element";
import uniqueId from "lodash-es/uniqueId";
import {
    AnchoredRegion,
    AnchoredRegionConfig,
    flyoutBelowScaling,
} from "../anchored-region";
import type { PickerMenu } from "./picker-menu";

/**
 *
 */
export type PickerMenuPosition = "top" | "bottom";

/**
 * A List Picker Custom HTML Element.
 *
 * @public
 */
export class Picker extends FASTElement {
    /**
     * Items pre-selected when component is first connected. Comma delineated string ie. "apples,oranges"
     * @public
     * @remarks
     * HTML Attribute: default-selection
     */
    @attr({ attribute: "default-selection" })
    public defaultSelection: string;

    /**
     * Currently selected items. Comma delineated string ie. "apples,oranges".
     *
     * @public
     * @remarks
     * HTML Attribute: selection
     */
    @attr({ attribute: "selection" })
    public selection: string = "";
    private selectionChanged(): void {
        if (this.$fastController.isConnected) {
            this.handleSelectionChange();
        }
    }

    /**
     * Currently available options. Comma delineated string ie. "apples,oranges".
     *
     * @public
     * @remarks
     * HTML Attribute: options
     */
    @attr({ attribute: "options" })
    public options: string;
    private optionsChanged(): void {
        //TODO: trim white space?
        this.optionsList = this.options.split(",");
    }

    /**
     * The maximum number of items that can be selected.
     *
     * @public
     * @remarks
     * HTML Attribute: max-selected
     */
    @attr({ attribute: "max-selected" })
    public maxSelected: number | undefined;
    private maxSelectedChanged(): void {
        if (this.$fastController.isConnected) {
        }
    }

    /**
     * The text to present to assistive technolgies when no suggestions are available.
     *
     * @public
     * @remarks
     * HTML Attribute: no-suggestions-text
     */
    @attr({ attribute: "no-suggestions-text" })
    public noSuggestionsText: string;

    /**
     *  The text to present to assistive technolgies when suggestions are available.
     *
     * @public
     * @remarks
     * HTML Attribute: suggestions-available-text
     */
    @attr({ attribute: "suggestions-available-text" })
    public suggestionsAvailableText: string;

    /**
     * The text to present to assistive technologies when suggestions are loading.
     *
     * @public
     * @remarks
     * HTML Attribute: loading-text
     */
    @attr({ attribute: "loading-text" })
    public loadingText: string;

    /**
     * Applied to the aria-label attribute of the input element
     *
     * @public
     * @remarks
     * HTML Attribute: label
     */
    @attr({ attribute: "label" })
    public label: string;

    /**
     * Applied to the aria-labelledby attribute of the input element
     *
     * @public
     * @remarks
     * HTML Attribute: labelledby
     */
    @attr({ attribute: "labelledby" })
    public labelledby: string;

    /**
     * Allows alternate flyout menu configurations.
     *
     * @public
     */
    @observable
    public menuConfig: AnchoredRegionConfig;
    private menuConfigChanged(): void {
        if (this.$fastController.isConnected && !this.menuConfig) {
            this.menuConfig = flyoutBelowScaling;
        }
    }

    /**
     * Template to use for selected items.
     *
     * @public
     */
    @observable
    public itemTemplate: ViewTemplate;

    /**
     * Default template to use for selected items (usually specified in the component template).
     *
     * @public
     */
    @observable
    public defaultItemTemplate: ViewTemplate;

    /**
     * Template to use for available options.
     *
     * @public
     */
    @observable
    public optionTemplate: ViewTemplate;

    /**
     * Default template to use for available options(usually specified in the template).
     *
     * @public
     */
    @observable
    public defaultOptionTemplate: ViewTemplate;

    /**
     *
     *
     * @internal
     */
    @observable
    public optionsList: string[] = [];
    private optionsListChanged(): void {
        if (this.$fastController.isConnected) {
            this.showNoOptions = this.optionsList.length === 0 ? true : false;
            this.setFocusedOption(this.optionsList.length === 0 ? -1 : 0);
        }
    }

    /**
     *
     *
     * @internal
     */
    @observable
    public flyoutOpen: boolean = false;
    private flyoutOpenChanged(): void {
        if (this.flyoutOpen) {
            DOM.queueUpdate(this.setRegionProps);
        }
    }

    /**
     *
     *
     * @internal
     */
    @observable
    public menuId: string;

    /**
     *
     *
     * @internal
     */
    @observable
    public selectedlisttag: string;

    /**
     *
     *
     * @internal
     */
    @observable
    public pickermenutag: string;

    /**
     *
     *
     * @internal
     */
    @observable
    public menuFocusIndex: number = -1;

    /**
     *
     *
     * @internal
     */
    @observable
    public menuFocusOptionId: string | null = null;

    /**
     *
     *
     * @internal
     */
    @observable
    public showLoading: boolean = false;
    private showLoadingChanged(): void {
        if (this.$fastController.isConnected) {
            DOM.queueUpdate(() => {
                this.setFocusedOption(0);
            });
        }
    }

    /**
     *
     *
     * @internal
     */
    @observable
    public showNoOptions: boolean = false;
    private showNoOptionsChanged(): void {
        if (this.$fastController.isConnected) {
            DOM.queueUpdate(() => {
                this.setFocusedOption(0);
            });
        }
    }

    /**
     * reference to the edit box
     *
     * @internal
     */
    public inputElement: HTMLInputElement;

    /**
     * reference to the selected item list
     *
     * @internal
     */
    public selectedList: HTMLElement;

    /**
     * reference to the menu
     *
     * @internal
     */
    public menuElement: PickerMenu;

    /**
     *
     *
     * @internal
     */
    public region: AnchoredRegion;

    /**
     *
     *
     * @internal
     */
    @observable
    public selectedOptions: string[] = [];

    protected hasFocus = false;

    private itemsRepeatBehavior: RepeatBehavior | null;
    private itemsPlaceholder: Node | null = null;

    private optionsRepeatBehavior: RepeatBehavior | null;
    private optionsPlaceholder: Node | null = null;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.menuConfig === undefined) {
            this.menuConfig = flyoutBelowScaling;
        }

        if (this.defaultSelection !== undefined && this.selection === "") {
            this.selection = this.defaultSelection;
        }

        if (this.options !== undefined) {
            this.optionsList = this.options.split(",");
        }

        if (this.itemTemplate === undefined) {
            this.itemTemplate = this.defaultItemTemplate;
        }

        if (this.optionTemplate === undefined) {
            this.optionTemplate = this.defaultOptionTemplate;
        }

        this.selectedList = document.createElement(this.selectedlisttag);
        this.selectedList.slot = "list-region";
        this.appendChild(this.selectedList);

        this.itemsPlaceholder = document.createComment("");
        this.selectedList.append(this.itemsPlaceholder);

        this.inputElement = document.createElement("input");
        this.inputElement.setAttribute("role", "combobox");
        this.inputElement.setAttribute("type", "text");
        this.inputElement.setAttribute("autocapitalize", "off");
        this.inputElement.setAttribute("autocomplete", "off");
        this.inputElement.setAttribute("haspopup", "list");
        this.inputElement.setAttribute("aria-label", this.label);
        this.inputElement.setAttribute("aria-labelledby", this.labelledby);
        this.inputElement.setAttribute("part", "input-element");
        this.inputElement.classList.add("input-element");

        this.selectedList.appendChild(this.inputElement);
        this.inputElement.addEventListener("input", this.handleTextInput);
        this.inputElement.addEventListener("click", this.handleInputClick);

        this.handleSelectionChange();

        this.itemsRepeatBehavior = new RepeatDirective(
            x => x.selectedOptions,
            x => x.itemTemplate,
            { positioning: true }
        ).createBehavior(this.itemsPlaceholder);

        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);

        const match: string = this.pickermenutag.toUpperCase();
        this.menuElement = Array.from(this.children).find((element: HTMLElement) => {
            return element.tagName === match;
        }) as PickerMenu;

        if (this.menuElement === undefined) {
            this.menuElement = document.createElement(this.pickermenutag) as PickerMenu;
            this.menuElement.slot = "menu-region";
            this.appendChild(this.menuElement);
        }

        if (this.menuElement.id === "") {
            this.menuElement.id = uniqueId("listbox-");
        }

        this.menuId = this.menuElement.id;

        this.menuElement.suggestionsAvailableText = this.suggestionsAvailableText;
        this.menuElement.addEventListener(
            "optionsupdated",
            this.handleMenuOptionsUpdated
        );

        this.optionsPlaceholder = document.createComment("");
        this.menuElement.append(this.optionsPlaceholder);

        this.optionsRepeatBehavior = new RepeatDirective(
            x => x.optionsList,
            x => x.optionTemplate,
            { positioning: true }
        ).createBehavior(this.optionsPlaceholder);

        this.$fastController.addBehaviors([this.optionsRepeatBehavior!]);
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.toggleFlyout(false);
        this.inputElement.removeEventListener("input", this.handleTextInput);
        this.inputElement.removeEventListener("click", this.handleInputClick);
    }

    protected toggleFlyout(open: boolean): void {
        if (this.flyoutOpen === open) {
            return;
        }

        if (open && document.activeElement === this.inputElement) {
            this.flyoutOpen = open;
            DOM.queueUpdate(() => {
                if (this.menuElement !== undefined) {
                    this.setFocusedOption(0);
                } else {
                    this.disableMenu();
                }
            });
            return;
        }

        this.flyoutOpen = false;
        this.disableMenu();
        return;
    }

    protected handleTextInput(e: InputEvent): void {}

    public handleInputClick = (e: MouseEvent): void => {
        e.preventDefault();
    };

    private handleMenuOptionsUpdated = (e: Event): void => {
        e.preventDefault();
        if (this.flyoutOpen) {
            this.setFocusedOption(0);
        }
    };

    public handleKeyDown = (e: KeyboardEvent): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        switch (e.key) {
            case "Home": {
                if (!this.flyoutOpen) {
                    this.toggleFlyout(true);
                } else {
                    if (this.menuElement.optionElements.length > 0) {
                        this.setFocusedOption(0);
                    }
                }
                return false;
            }

            case "ArrowDown": {
                if (!this.flyoutOpen) {
                    this.toggleFlyout(true);
                } else {
                    const nextFocusOptionIndex = this.flyoutOpen
                        ? Math.min(
                              this.menuFocusIndex + 1,
                              this.menuElement.optionElements.length - 1
                          )
                        : 0;
                    this.setFocusedOption(nextFocusOptionIndex);
                }
                return false;
            }

            case "ArrowUp": {
                if (!this.flyoutOpen) {
                    this.toggleFlyout(true);
                } else {
                    const previousFocusOptionIndex = this.flyoutOpen
                        ? Math.max(this.menuFocusIndex - 1, 0)
                        : 0;
                    this.setFocusedOption(previousFocusOptionIndex);
                }
                return false;
            }

            case "End": {
                if (!this.flyoutOpen) {
                    this.toggleFlyout(true);
                } else {
                    if (this.menuElement.optionElements.length > 0) {
                        this.toggleFlyout(true);
                        this.setFocusedOption(this.menuElement.optionElements.length - 1);
                    }
                }
                return false;
            }

            case "Escape": {
                this.toggleFlyout(false);
                return false;
            }

            case "Enter": {
                if (
                    this.menuFocusIndex !== -1 &&
                    this.menuElement.optionElements.length > this.menuFocusIndex
                ) {
                    this.menuElement.optionElements[this.menuFocusIndex].click();
                }
                return false;
            }

            case "ArrowRight": {
                if (document.activeElement !== this.inputElement) {
                    this.incrementFocusedItem(1);
                    return false;
                }
                // don't block if arrow keys moving caret in input element
                return true;
            }

            case "ArrowLeft": {
                if (this.inputElement.selectionStart === 0) {
                    this.incrementFocusedItem(-1);
                    return false;
                }
                // don't block if arrow keys moving caret in input element
                return true;
            }

            case "Delete":
            case "Backspace": {
                if (document.activeElement === null) {
                    return true;
                }

                if (document.activeElement === this.inputElement) {
                    if (this.inputElement.selectionStart === 0) {
                        this.selection = this.selectedOptions
                            .slice(0, this.selectedOptions.length - 1)
                            .toString();
                        this.toggleFlyout(false);
                        return false;
                    }
                    // let text deletion proceed
                    return true;
                }

                const selectedItems: Element[] = Array.from(this.selectedList.children);
                const currentFocusedItemIndex: number = selectedItems.indexOf(
                    document.activeElement
                );

                if (currentFocusedItemIndex > -1) {
                    // delete currently focused item
                    this.selection = this.selectedOptions
                        .splice(currentFocusedItemIndex, 1)
                        .toString();
                    DOM.queueUpdate(() => {
                        (selectedItems[
                            Math.min(selectedItems.length, currentFocusedItemIndex)
                        ] as HTMLElement).focus();
                    });
                    return false;
                }
                return true;
            }
        }
        this.toggleFlyout(true);
        return true;
    };

    public handleFocusIn = (e: FocusEvent): boolean => {
        if (!this.hasFocus) {
            this.hasFocus = true;
        }
        return false;
    };

    public handleFocusOut = (e: FocusEvent): boolean => {
        if (
            this.menuElement === undefined ||
            !this.menuElement.contains(e.relatedTarget as Element)
        ) {
            this.toggleFlyout(false);
        }

        if (!this.contains(document.activeElement)) {
            this.hasFocus = false;
        }

        return false;
    };

    public handleOptionClick = (e: MouseEvent, value: string): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        this.selection = `${this.selection}${this.selection === "" ? "" : ","}${value}`;
        this.toggleFlyout(false);
        this.inputElement.value = "";
        return false;
    };

    public handleItemKeyDown = (e: KeyboardEvent, itemIndex: number): boolean => {
        if (e.defaultPrevented) {
            return false;
        }

        if (e.key === "Enter") {
            this.handleItemInvoke(itemIndex);
            return false;
        }

        return true;
    };

    public handleClick = (e: MouseEvent): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        if (this.inputElement) {
            this.inputElement.focus();
        }
        return false;
    };

    public handleItemClick = (e: MouseEvent, itemIndex: number): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        this.handleItemInvoke(itemIndex);
        return false;
    };

    public updatePosition = (): void => {
        if (this.region !== undefined) {
            this.region.update();
        }
    };

    public handleRegionLoaded = (e: Event): void => {
        DOM.queueUpdate(() => {
            this.setFocusedOption(0);
        });
    };

    public handleSelectionChange(): void {
        if (this.selectedOptions.toString() === this.selection) {
            return;
        }

        //TODO: trim white space?
        this.selectedOptions = this.selection === "" ? [] : this.selection.split(",");

        this.checkMaxItems();
        this.$emit("selectionchange", { bubbles: false });
    }

    private setRegionProps = (): void => {
        if (!this.flyoutOpen) {
            return;
        }
        if (this.region === null || this.region === undefined) {
            // TODO: limit this
            DOM.queueUpdate(this.setRegionProps);
            return;
        }
        this.region.viewportElement = document.body;
        this.region.anchorElement = this.inputElement;
    };

    private checkMaxItems = (): void => {
        if (this.inputElement === undefined) {
            return;
        }
        if (
            this.maxSelected !== undefined &&
            this.selectedOptions.length >= this.maxSelected
        ) {
            this.inputElement.hidden = true;
        } else {
            this.inputElement.hidden = false;
        }
    };

    private handleItemInvoke = (itemIndex: number): void => {
        const newSelection: string[] = this.selectedOptions.slice();
        newSelection.splice(itemIndex, 1);
        this.selection = newSelection.toString();
        DOM.queueUpdate(() => this.incrementFocusedItem(0));
    };

    private incrementFocusedItem(increment: number) {
        const selectedItems: Element[] = Array.from(this.selectedList.children);
        if (selectedItems.length === 0) {
            this.inputElement.focus();
            return;
        }

        if (document.activeElement !== null) {
            const currentFocusedItemIndex: number = selectedItems.indexOf(
                document.activeElement
            );
            let newFocusedItemIndex = Math.min(
                selectedItems.length,
                Math.max(0, currentFocusedItemIndex + increment)
            );
            if (newFocusedItemIndex === selectedItems.length) {
                this.inputElement.focus();
            } else {
                (selectedItems[newFocusedItemIndex] as HTMLElement).focus();
            }
        }
    }

    private disableMenu = (): void => {
        this.menuFocusIndex = -1;
        this.menuFocusOptionId = null;
        if (this.inputElement !== undefined) {
            this.inputElement.removeAttribute("aria-activedescendant");
            this.inputElement.removeAttribute("aria-owns");
            this.inputElement.removeAttribute("aria-expanded");
        }
        //this.menuElement.scrollTo(0, 0);
    };

    private setFocusedOption = (optionIndex: number): void => {
        if (
            !this.flyoutOpen ||
            optionIndex === -1 ||
            this.showNoOptions ||
            this.showLoading
        ) {
            this.disableMenu();
            return;
        }

        if (this.menuElement.optionElements.length === 0) {
            return;
        }

        this.menuElement.optionElements.forEach((element: HTMLElement) => {
            element.setAttribute("aria-selected", "false");
        });

        this.menuFocusIndex = optionIndex;
        if (this.menuFocusIndex > this.menuElement.optionElements.length - 1) {
            this.menuFocusIndex = this.menuElement.optionElements.length - 1;
        }

        this.menuFocusOptionId = this.menuElement.optionElements[this.menuFocusIndex].id;

        this.inputElement.setAttribute("aria-owns", this.menuId);
        this.inputElement.setAttribute("aria-expanded", "true");
        this.inputElement.setAttribute("aria-activedescendant", this.menuFocusOptionId);

        const focusedOption = this.menuElement.optionElements[this.menuFocusIndex];

        focusedOption.setAttribute("aria-selected", "true");

        this.menuElement.scrollTo(0, focusedOption.offsetTop);
    };
}
