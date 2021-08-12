import {
    attr,
    DOM,
    observable,
    RepeatBehavior,
    RepeatDirective,
    ViewTemplate,
} from "@microsoft/fast-element";
import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyBack,
    keyDelete,
    keyEnd,
    keyEnter,
    keyEscape,
    keyHome,
} from "@microsoft/fast-web-utilities";
import uniqueId from "lodash-es/uniqueId";
import { FoundationElement } from "../foundation-element";
import type { AnchoredRegion } from "../anchored-region";
import type { PickerMenu } from "./picker-menu";
import type { PickerList } from "./picker-list";
import { PickerMenuOption } from "./picker-menu-option";
import { PickerListItem } from "./picker-list-item";
import { FormAssociatedPicker } from "./picker.form-associated";

/**
 * A Picker Custom HTML Element.  This is an early "alpha" version of the component.
 * Developers should expect the api to evolve, breaking changes are possible.
 *
 * @alpha
 */
export class Picker extends FormAssociatedPicker {
    /**
     * Currently selected items. Comma delineated string ie. "apples,oranges".
     *
     * @alpha
     * @remarks
     * HTML Attribute: selection
     */
    @attr({ attribute: "selection" })
    public selection: string = "";
    private selectionChanged(): void {
        if (this.$fastController.isConnected) {
            this.handleSelectionChange();
            if (this.proxy instanceof HTMLInputElement) {
                this.proxy.value = this.selection;
                this.validate();
            }
        }
    }

    /**
     * Currently available options. Comma delineated string ie. "apples,oranges".
     *
     * @alpha
     * @remarks
     * HTML Attribute: options
     */
    @attr({ attribute: "options" })
    public options: string;
    private optionsChanged(): void {
        this.optionsList = this.options
            .split(",")
            .map(opt => opt.trim())
            .filter(opt => opt !== "");
    }

    /**
     * Whether the component should remove an option from the list when it is in the selection
     *
     * @alpha
     * @remarks
     * HTML Attribute: filter-selected
     */
    @attr({ attribute: "filter-selected", mode: "boolean" })
    public filterSelected: boolean = true;

    /**
     * Whether the component should remove options based on the current query
     *
     * @alpha
     * @remarks
     * HTML Attribute: filter-query
     */
    @attr({ attribute: "filter-query", mode: "boolean" })
    public filterQuery: boolean = true;

    /**
     * The maximum number of items that can be selected.
     *
     * @alpha
     * @remarks
     * HTML Attribute: max-selected
     */
    @attr({ attribute: "max-selected" })
    public maxSelected: number | undefined;

    /**
     * The text to present to assistive technolgies when no suggestions are available.
     *
     * @alpha
     * @remarks
     * HTML Attribute: no-suggestions-text
     */
    @attr({ attribute: "no-suggestions-text" })
    public noSuggestionsText: string = "No suggestions available";

    /**
     *  The text to present to assistive technolgies when suggestions are available.
     *
     * @alpha
     * @remarks
     * HTML Attribute: suggestions-available-text
     */
    @attr({ attribute: "suggestions-available-text" })
    public suggestionsAvailableText: string = "Suggestions available";

    /**
     * The text to present to assistive technologies when suggestions are loading.
     *
     * @alpha
     * @remarks
     * HTML Attribute: loading-text
     */
    @attr({ attribute: "loading-text" })
    public loadingText: string = "Loading suggestions";

    /**
     * Applied to the aria-label attribute of the input element
     *
     * @alpha
     * @remarks
     * HTML Attribute: label
     */
    @attr({ attribute: "label" })
    public label: string;
    private labelChanged(): void {
        if (this.$fastController.isConnected) {
            this.listElement?.setAttribute("label", this.label);
        }
    }

    /**
     * Applied to the aria-labelledby attribute of the input element
     *
     * @alpha
     * @remarks
     * HTML Attribute: labelledby
     */
    @attr({ attribute: "labelledby" })
    public labelledBy: string;
    private labelledbyChanged(): void {
        if (this.$fastController.isConnected) {
            this.listElement?.setAttribute("labelledby", this.labelledBy);
        }
    }

    /**
     * Whether to display a loading state if the menu is opened.
     *
     * @alpha
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
     * Template used to generate selected items.
     * This is used in a repeat directive.
     *
     * @alpha
     */
    @observable
    public listItemTemplate: ViewTemplate;
    private listItemTemplateChanged(): void {
        this.updateListItemTemplate();
    }

    /**
     * Default template to use for selected items (usually specified in the component template).
     * This is used in a repeat directive.
     *
     * @alpha
     */
    @observable
    public defaultListItemTemplate?: ViewTemplate;
    private defaultListItemTemplateChanged(): void {
        this.updateListItemTemplate();
    }

    /**
     * The item template currently in use.
     *
     * @internal
     */
    @observable
    public activeListItemTemplate?: ViewTemplate;

    /**
     * Template to use for available options.
     * This is used in a repeat directive.
     *
     * @alpha
     */
    @observable
    public menuOptionTemplate: ViewTemplate;
    private menuOptionTemplateChanged(): void {
        this.updateOptionTemplate();
    }

    /**
     * Default template to use for available options (usually specified in the template).
     * This is used in a repeat directive.
     *
     * @alpha
     */
    @observable
    public defaultMenuOptionTemplate?: ViewTemplate;
    private defaultMenuOptionTemplateChanged(): void {
        this.updateOptionTemplate();
    }

    /**
     * The option template currently in use.
     *
     * @internal
     */
    @observable
    public activeMenuOptionTemplate?: ViewTemplate;

    /**
     *  Template to use for the contents of a selected list item
     *
     * @alpha
     */
    @observable
    public listItemContentsTemplate: ViewTemplate;

    /**
     *  Template to use for the contents of menu options
     *
     * @alpha
     */
    @observable
    public menuOptionContentsTemplate: ViewTemplate;

    /**
     *  Current list of options in array form
     *
     * @alpha
     */
    @observable
    public optionsList: string[] = [];
    private optionsListChanged(): void {
        this.updateFilteredOptions();
    }

    /**
     * The text value currently in the input field
     *
     * @alpha
     */
    @observable
    public query: string;
    private queryChanged(): void {
        if (this.$fastController.isConnected) {
            if (this.listElement.inputElement.value !== this.query) {
                this.listElement.inputElement.value = this.query;
            }
            this.updateFilteredOptions();
            this.$emit("querychange", { bubbles: false });
        }
    }

    /**
     *  Current list of filtered options in array form
     *
     * @internal
     */
    @observable
    public filteredOptionsList: string[] = [];
    private filteredOptionsListChanged(): void {
        if (this.$fastController.isConnected) {
            this.showNoOptions = this.filteredOptionsList.length === 0;
            this.setFocusedOption(this.filteredOptionsList.length === 0 ? -1 : 0);
        }
    }

    /**
     *  Indicates if the flyout menu is open or not
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
     *  The id of the menu element
     *
     * @internal
     */
    @observable
    public menuId: string;

    /**
     *  The tag for the selected list element (ie. "fast-picker-list" vs. "fluent-picker-list")
     *
     * @internal
     */
    @observable
    public selectedListTag: string;

    /**
     * The tag for the menu element (ie. "fast-picker-menu" vs. "fluent-picker-menu")
     *
     * @internal
     */
    @observable
    public pickerMenuTag: string;

    /**
     *  Index of currently active menu option
     *
     * @internal
     */
    @observable
    public menuFocusIndex: number = -1;

    /**
     *  Id of currently active menu option.
     *
     * @internal
     */
    @observable
    public menuFocusOptionId: string | undefined;

    /**
     *  Internal flag to indicate no options available display should be shown.
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
     * reference to the selected list element
     *
     * @internal
     */
    public listElement: PickerList;

    /**
     * reference to the menu element
     *
     * @internal
     */
    public menuElement: PickerMenu;

    /**
     * reference to the anchored region element
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
    public selectedItems: string[] = [];
    private itemsRepeatBehavior: RepeatBehavior | null;

    private optionsRepeatBehavior: RepeatBehavior | null;
    private optionsPlaceholder: Node;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.listElement = document.createElement(this.selectedListTag) as PickerList;

        this.listElement.label = this.label;
        this.listElement.labelledby = this.labelledBy;
        this.appendChild(this.listElement);

        const match: string = this.pickerMenuTag.toUpperCase();
        this.menuElement = Array.from(this.children).find((element: HTMLElement) => {
            return element.tagName === match;
        }) as PickerMenu;

        if (this.menuElement === undefined) {
            this.menuElement = document.createElement(this.pickerMenuTag) as PickerMenu;
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
        this.listElement.inputElement.removeEventListener("input", this.handleTextInput);
        this.listElement.inputElement.removeEventListener("click", this.handleInputClick);
    }

    /**
     * Move focus to the input element
     * @public
     */
    public focus() {
        this.listElement?.inputElement.focus();
    }

    /**
     * Initialize the component.  This is delayed a frame to ensure children are connected as well.
     */
    private initialize(): void {
        this.updateListItemTemplate();
        this.updateOptionTemplate();

        this.itemsRepeatBehavior = new RepeatDirective(
            x => x.selectedItems,
            x => x.activeListItemTemplate,
            { positioning: true }
        ).createBehavior(this.listElement.itemsPlaceholderElement);

        this.listElement.inputElement.addEventListener("input", this.handleTextInput);
        this.listElement.inputElement.addEventListener("click", this.handleInputClick);
        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);

        this.menuElement.suggestionsAvailableText = this.suggestionsAvailableText;
        this.menuElement.addEventListener(
            "optionsupdated",
            this.handleMenuOptionsUpdated
        );

        this.optionsRepeatBehavior = new RepeatDirective(
            x => x.filteredOptionsList,
            x => x.activeMenuOptionTemplate,
            { positioning: true }
        ).createBehavior(this.optionsPlaceholder);

        this.$fastController.addBehaviors([this.optionsRepeatBehavior!]);

        this.handleSelectionChange();
    }

    /**
     * Toggles the menu flyout
     */
    private toggleFlyout(open: boolean): void {
        if (this.flyoutOpen === open) {
            return;
        }

        if (open && document.activeElement === this.listElement.inputElement) {
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

    /**
     * Handle input event from input element
     */
    private handleTextInput = (e: InputEvent): void => {
        this.query = this.listElement.inputElement.value;
    };

    /**
     * Handle click event from input element
     */
    private handleInputClick = (e: MouseEvent): void => {
        e.preventDefault();
        this.toggleFlyout(true);
    };

    /**
     * Handle the menu options updated event from the child menu
     */
    private handleMenuOptionsUpdated = (e: Event): void => {
        e.preventDefault();
        if (this.flyoutOpen) {
            this.setFocusedOption(0);
        }
    };

    /**
     * Handle key down events.
     */
    public handleKeyDown = (e: KeyboardEvent): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        switch (e.key) {
            // TODO: what should "home" and "end" keys do, exactly?
            //
            // case keyHome: {
            //     if (!this.flyoutOpen) {
            //         this.toggleFlyout(true);
            //     } else {
            //         if (this.menuElement.optionElements.length > 0) {
            //             this.setFocusedOption(0);
            //         }
            //     }
            //     return false;
            // }

            // case keyEnd: {
            //     if (!this.flyoutOpen) {
            //         this.toggleFlyout(true);
            //     } else {
            //         if (this.menuElement.optionElements.length > 0) {
            //             this.toggleFlyout(true);
            //             this.setFocusedOption(this.menuElement.optionElements.length - 1);
            //         }
            //     }
            //     return false;
            // }

            case keyArrowDown: {
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

            case keyArrowUp: {
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

            case keyEscape: {
                this.toggleFlyout(false);
                return false;
            }

            case keyEnter: {
                if (
                    this.menuFocusIndex !== -1 &&
                    this.menuElement.optionElements.length > this.menuFocusIndex
                ) {
                    this.menuElement.optionElements[this.menuFocusIndex].click();
                }
                return false;
            }

            case keyArrowRight: {
                if (document.activeElement !== this.listElement.inputElement) {
                    this.incrementFocusedItem(1);
                    return false;
                }
                // don't block if arrow keys moving caret in input element
                return true;
            }

            case keyArrowLeft: {
                if (this.listElement.inputElement.selectionStart === 0) {
                    this.incrementFocusedItem(-1);
                    return false;
                }
                // don't block if arrow keys moving caret in input element
                return true;
            }

            case keyDelete:
            case keyBack: {
                if (document.activeElement === null) {
                    return true;
                }

                if (document.activeElement === this.listElement.inputElement) {
                    if (this.listElement.inputElement.selectionStart === 0) {
                        this.selection = this.selectedItems
                            .slice(0, this.selectedItems.length - 1)
                            .toString();
                        this.toggleFlyout(false);
                        return false;
                    }
                    // let text deletion proceed
                    return true;
                }

                const selectedItems: Element[] = Array.from(this.listElement.children);
                const currentFocusedItemIndex: number = selectedItems.indexOf(
                    document.activeElement
                );

                if (currentFocusedItemIndex > -1) {
                    // delete currently focused item
                    this.selection = this.selectedItems
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

    /**
     * Handle focus in events.
     */
    public handleFocusIn = (e: FocusEvent): boolean => {
        return false;
    };

    /**
     * Handle focus out events.
     */
    public handleFocusOut = (e: FocusEvent): boolean => {
        if (
            this.menuElement === undefined ||
            !this.menuElement.contains(e.relatedTarget as Element)
        ) {
            this.toggleFlyout(false);
        }

        return false;
    };

    /**
     * The list of selected items has changed
     */
    public handleSelectionChange(): void {
        if (this.selectedItems.toString() === this.selection) {
            return;
        }

        this.selectedItems = this.selection === "" ? [] : this.selection.split(",");

        this.updateFilteredOptions();

        DOM.queueUpdate(() => {
            this.checkMaxItems();
        });
        this.$emit("selectionchange", { bubbles: false });
    }

    /**
     * Anchored region is loaded, menu and options exist in the DOM.
     */
    public handleRegionLoaded = (e: Event): void => {
        DOM.queueUpdate(() => {
            this.setFocusedOption(0);
            this.$emit("menuloaded", { bubbles: false });
        });
    };

    /**
     * Sets properties on the anchored region once it is instanciated.
     */
    private setRegionProps = (): void => {
        if (!this.flyoutOpen) {
            return;
        }
        if (this.region === null || this.region === undefined) {
            // TODO: limit this
            DOM.queueUpdate(this.setRegionProps);
            return;
        }
        this.region.anchorElement = this.listElement.inputElement;
    };

    /**
     * Checks if the maximum number of items has been chosen and updates the ui.
     */
    private checkMaxItems = (): void => {
        if (this.listElement.inputElement === undefined) {
            return;
        }
        if (
            this.maxSelected !== undefined &&
            this.selectedItems.length >= this.maxSelected
        ) {
            if (document.activeElement === this.listElement.inputElement) {
                const selectedItemInstances: Element[] = Array.from(
                    this.listElement.querySelectorAll("[role='listitem']")
                );
                (selectedItemInstances[
                    selectedItemInstances.length - 1
                ] as HTMLElement).focus();
            }
            this.listElement.inputElement.hidden = true;
        } else {
            this.listElement.inputElement.hidden = false;
        }
    };

    /**
     * A list item has been invoked.
     */
    public handleItemInvoke = (e: Event): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        if (e.target instanceof PickerListItem) {
            const listItems: Element[] = Array.from(
                this.listElement.querySelectorAll("[role='listitem']")
            );
            const itemIndex: number = listItems.indexOf(e.target as Element);
            if (itemIndex !== -1) {
                const newSelection: string[] = this.selectedItems.slice();
                newSelection.splice(itemIndex, 1);
                this.selection = newSelection.toString();
                DOM.queueUpdate(() => this.incrementFocusedItem(0));
            }
            return false;
        }
        return true;
    };

    /**
     * A menu option has been invoked.
     */
    public handleOptionInvoke = (e: Event): boolean => {
        if (e.defaultPrevented) {
            return false;
        }

        if (e.target instanceof PickerMenuOption) {
            this.selection = `${this.selection}${this.selection === "" ? "" : ","}${
                e.target.value
            }`;
            this.toggleFlyout(false);
            this.listElement.inputElement.value = "";
            return false;
        }

        // const value: string = (e.target as PickerMenuOption).value;

        return true;
    };

    /**
     * Increments the focused list item by the specified amount
     */
    private incrementFocusedItem(increment: number) {
        if (this.selectedItems.length === 0) {
            this.listElement.inputElement.focus();
            return;
        }

        const selectedItemsAsElements: Element[] = Array.from(
            this.listElement.querySelectorAll("[role='listitem']")
        );

        if (document.activeElement !== null) {
            let currentFocusedItemIndex: number = selectedItemsAsElements.indexOf(
                document.activeElement
            );
            if (currentFocusedItemIndex === -1) {
                // use the input element
                currentFocusedItemIndex = selectedItemsAsElements.length;
            }

            const newFocusedItemIndex = Math.min(
                selectedItemsAsElements.length,
                Math.max(0, currentFocusedItemIndex + increment)
            );
            if (newFocusedItemIndex === selectedItemsAsElements.length) {
                if (
                    this.maxSelected !== undefined &&
                    this.selectedItems.length >= this.maxSelected
                ) {
                    (selectedItemsAsElements[
                        newFocusedItemIndex - 1
                    ] as HTMLElement).focus();
                } else {
                    this.listElement.inputElement.focus();
                }
            } else {
                (selectedItemsAsElements[newFocusedItemIndex] as HTMLElement).focus();
            }
        }
    }

    /**
     * Disables the menu. Note that the menu can be open, just doens't have any valid options on display.
     */
    private disableMenu = (): void => {
        this.menuFocusIndex = -1;
        this.menuFocusOptionId = undefined;
        this.listElement?.inputElement?.removeAttribute("aria-activedescendant");
        this.listElement?.inputElement?.removeAttribute("aria-owns");
        this.listElement?.inputElement?.removeAttribute("aria-expanded");
    };

    /**
     * Sets the currently focused menu option by index
     */
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

        this.listElement.inputElement.setAttribute("aria-owns", this.menuId);
        this.listElement.inputElement.setAttribute("aria-expanded", "true");
        this.listElement.inputElement.setAttribute(
            "aria-activedescendant",
            this.menuFocusOptionId
        );

        const focusedOption = this.menuElement.optionElements[this.menuFocusIndex];

        focusedOption.setAttribute("aria-selected", "true");

        this.menuElement.scrollTo(0, focusedOption.offsetTop);
    };

    /**
     * Updates the template used for the list item repeat behavior
     */
    private updateListItemTemplate(): void {
        this.activeListItemTemplate =
            this.listItemTemplate ?? this.defaultListItemTemplate;
    }

    /**
     * Updates the template used for the menu option repeat behavior
     */
    private updateOptionTemplate(): void {
        this.activeMenuOptionTemplate =
            this.menuOptionTemplate ?? this.defaultMenuOptionTemplate;
    }

    /**
     * Updates the filtered options array
     */
    private updateFilteredOptions(): void {
        this.filteredOptionsList = this.optionsList.slice(0);
        if (this.filterSelected) {
            this.filteredOptionsList = this.filteredOptionsList.filter(
                el => this.selectedItems.indexOf(el) === -1
            );
        }
        if (this.filterQuery && this.query !== "" && this.query !== undefined) {
            this.filteredOptionsList = this.filteredOptionsList.filter(
                el => el.indexOf(this.query) !== -1
            );
        }
    }
}
