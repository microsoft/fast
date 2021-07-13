import {
    attr,
    DOM,
    observable,
    RepeatBehavior,
    RepeatDirective,
    ViewTemplate,
} from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import uniqueId from "lodash-es/uniqueId";
import {
    AnchoredRegion,
    AnchoredRegionConfig,
    flyoutBelowScaling,
} from "../anchored-region";
import type { PickerMenu } from "./picker-menu";
import type { PickerList } from "./picker-list";

/**
 *
 */
export type PickerMenuPosition = "top" | "bottom";

/**
 * A List Picker Custom HTML Element.
 *
 * @public
 */
export class Picker extends FoundationElement {
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

    /**
     * The text to present to assistive technolgies when no suggestions are available.
     *
     * @public
     * @remarks
     * HTML Attribute: no-suggestions-text
     */
    @attr({ attribute: "no-suggestions-text" })
    public noSuggestionsText: string = "No suggestions available";

    /**
     *  The text to present to assistive technolgies when suggestions are available.
     *
     * @public
     * @remarks
     * HTML Attribute: suggestions-available-text
     */
    @attr({ attribute: "suggestions-available-text" })
    public suggestionsAvailableText: string = "Suggestions available";

    /**
     * The text to present to assistive technologies when suggestions are loading.
     *
     * @public
     * @remarks
     * HTML Attribute: loading-text
     */
    @attr({ attribute: "loading-text" })
    public loadingText: string = "Loading suggestions";

    /**
     * Applied to the aria-label attribute of the input element
     *
     * @public
     * @remarks
     * HTML Attribute: label
     */
    @attr({ attribute: "label" })
    public label: string;
    private labelChanged(): void {
        if (this.$fastController.isConnected && this.selectedList !== undefined) {
            this.selectedList.setAttribute("label", this.label);
        }
    }

    /**
     * Applied to the aria-labelledby attribute of the input element
     *
     * @public
     * @remarks
     * HTML Attribute: labelledby
     */
    @attr({ attribute: "labelledby" })
    public labelledby: string;
    private labelledbyChanged(): void {
        if (this.$fastController.isConnected && this.selectedList !== undefined) {
            this.selectedList.setAttribute("labelledby", this.labelledby);
        }
    }

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
    public listItemTemplate: ViewTemplate;
    private listItemTemplateChanged(): void {
        this.updateListItemTemplate();
    }

    /**
     * Default template to use for selected items (usually specified in the component template).
     *
     * @public
     */
    @observable
    public defaultListItemTemplate?: ViewTemplate;

    /**
     * The item template currently in use.
     *
     * @internal
     */
    @observable
    public activeListItemTemplate?: ViewTemplate;

    /**
     * Template to use for available options.
     *
     * @public
     */
    @observable
    public menuOptionTemplate: ViewTemplate;
    private menuOptionTemplateChanged(): void {
        this.updateOptionTemplate();
    }

    /**
     * Default template to use for available options(usually specified in the template).
     *
     * @public
     */
    @observable
    public defaultMenuOptionTemplate?: ViewTemplate;

    /**
     * The option template currently in use.
     *
     * @internal
     */
    @observable
    public activeMenuOptionTemplate?: ViewTemplate;

    /**
     *
     *
     * @public
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
     * The text value currently in the input field
     *
     * @public
     */
    @observable
    public query: string;
    private queryChanged(): void {
        if (this.$fastController.isConnected) {
            if (this.selectedList.inputElement.value !== this.query) {
                this.selectedList.inputElement.value = this.query;
            }
            this.$emit("querychange", { bubbles: false });
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
            this.$emit("menuopening", { bubbles: false });
        } else {
            this.$emit("menuclosing", { bubbles: false });
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
    public menuFocusOptionId: string | undefined;

    /**
     *  todo: attribute for this
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
     * reference to the selected item list
     *
     * @internal
     */
    public selectedList: PickerList;

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

    private optionsRepeatBehavior: RepeatBehavior | null;
    private optionsPlaceholder: Node;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.menuConfig === undefined) {
            this.menuConfig = flyoutBelowScaling;
        }

        if (this.options !== undefined) {
            this.optionsList = this.options.split(",");
        }

        this.selectedList = document.createElement(this.selectedlisttag) as PickerList;
        this.selectedList.label = this.label;
        this.selectedList.labelledby = this.labelledby;
        this.appendChild(this.selectedList);

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
        this.optionsPlaceholder = document.createComment("");
        this.menuElement.append(this.optionsPlaceholder);

        DOM.queueUpdate(() => this.initialize());
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.toggleFlyout(false);
        this.selectedList.inputElement.removeEventListener("input", this.handleTextInput);
        this.selectedList.inputElement.removeEventListener(
            "click",
            this.handleInputClick
        );
    }

    private initialize(): void {
        console.debug("initialize");

        this.updateListItemTemplate();
        this.updateOptionTemplate();

        this.itemsRepeatBehavior = new RepeatDirective(
            x => x.selectedOptions,
            x => x.activeListItemTemplate,
            { positioning: true }
        ).createBehavior(this.selectedList.itemsPlaceholderElement);

        this.selectedList.inputElement.addEventListener("input", this.handleTextInput);
        this.selectedList.inputElement.addEventListener("click", this.handleInputClick);
        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);

        this.menuElement.suggestionsAvailableText = this.suggestionsAvailableText;
        this.menuElement.addEventListener(
            "optionsupdated",
            this.handleMenuOptionsUpdated
        );

        this.optionsRepeatBehavior = new RepeatDirective(
            x => x.optionsList,
            x => x.activeMenuOptionTemplate,
            { positioning: true }
        ).createBehavior(this.optionsPlaceholder);

        this.$fastController.addBehaviors([this.optionsRepeatBehavior!]);

        this.handleSelectionChange();
    }

    private toggleFlyout(open: boolean): void {
        if (this.flyoutOpen === open) {
            return;
        }

        if (open && document.activeElement === this.selectedList.inputElement) {
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

    private handleTextInput = (e: InputEvent): void => {
        this.query = this.selectedList.inputElement.value;
    };

    private handleInputClick = (e: MouseEvent): void => {
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
                if (document.activeElement !== this.selectedList.inputElement) {
                    this.incrementFocusedItem(1);
                    return false;
                }
                // don't block if arrow keys moving caret in input element
                return true;
            }

            case "ArrowLeft": {
                if (this.selectedList.inputElement.selectionStart === 0) {
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

                if (document.activeElement === this.selectedList.inputElement) {
                    if (this.selectedList.inputElement.selectionStart === 0) {
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
        this.selectedList.inputElement.value = "";
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
        if (this.selectedList.inputElement) {
            this.selectedList.inputElement.focus();
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
            this.$emit("menuloaded", { bubbles: false });
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
        this.region.anchorElement = this.selectedList.inputElement;
    };

    private checkMaxItems = (): void => {
        if (this.selectedList.inputElement === undefined) {
            return;
        }
        if (
            this.maxSelected !== undefined &&
            this.selectedOptions.length >= this.maxSelected
        ) {
            this.selectedList.inputElement.hidden = true;
        } else {
            this.selectedList.inputElement.hidden = false;
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
            this.selectedList.inputElement.focus();
            return;
        }

        if (document.activeElement !== null) {
            const currentFocusedItemIndex: number = selectedItems.indexOf(
                document.activeElement
            );
            const newFocusedItemIndex = Math.min(
                selectedItems.length,
                Math.max(0, currentFocusedItemIndex + increment)
            );
            if (newFocusedItemIndex === selectedItems.length) {
                this.selectedList.inputElement.focus();
            } else {
                (selectedItems[newFocusedItemIndex] as HTMLElement).focus();
            }
        }
    }

    private disableMenu = (): void => {
        this.menuFocusIndex = -1;
        this.menuFocusOptionId = undefined;
        this.selectedList?.inputElement?.removeAttribute("aria-activedescendant");
        this.selectedList?.inputElement?.removeAttribute("aria-owns");
        this.selectedList?.inputElement?.removeAttribute("aria-expanded");
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

        this.selectedList.inputElement.setAttribute("aria-owns", this.menuId);
        this.selectedList.inputElement.setAttribute("aria-expanded", "true");
        this.selectedList.inputElement.setAttribute(
            "aria-activedescendant",
            this.menuFocusOptionId
        );

        const focusedOption = this.menuElement.optionElements[this.menuFocusIndex];

        focusedOption.setAttribute("aria-selected", "true");

        this.menuElement.scrollTo(0, focusedOption.offsetTop);
    };

    private updateListItemTemplate(): void {
        console.debug("item template");
        this.activeListItemTemplate =
            this.listItemTemplate === undefined
                ? this.defaultListItemTemplate
                : this.listItemTemplate;
    }

    private updateOptionTemplate(): void {
        console.debug("option template");
        this.activeMenuOptionTemplate =
            this.menuOptionTemplate === undefined
                ? this.defaultMenuOptionTemplate
                : this.menuOptionTemplate;
    }
}
