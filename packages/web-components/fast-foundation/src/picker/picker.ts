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
import { AnchoredRegion } from "../anchored-region";
import { PickerMenu } from "./picker-menu";

/**
 * A List Picker Custom HTML Element.
 *
 * @public
 */
export class Picker extends FASTElement {
    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: default-selection
     */
    @attr({ attribute: "default-selection" })
    public defaultSelection: string;

    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: selection
     */
    @attr({ attribute: "selection" })
    public selection: string = "";
    private selectionChanged(): void {
        if (this.$fastController.isConnected) {
            if (this.selectedOptions.toString() !== this.selection) {
                this.selectedOptions = this.selection.split(",");
                this.$emit("selectionchange");
            }
        }
    }

    /**
     *
     *
     * @public
     */
    @observable
    public selectedOptions: string[] = [];
    private selectedOptionsChanged(): void {
        if (this.$fastController.isConnected) {
            if (this.selectedOptions !== this.selection.split(",")) {
                this.selection = this.selectedOptions.toString();
                this.$emit("selectionchange");
                this.checkMaxItems();
            }
        }
    }

    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: options
     */
    @attr({ attribute: "options" })
    public options: string;
    private optionsChanged(): void {
        this.optionsList = this.options.split(",");
    }

    /**
     *
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
     *
     *
     * @public
     */
    @observable
    public optionsList: string[] = [];
    private optionsListChanged(): void {}

    /**
     *
     *
     * @public
     */
    @observable
    public itemTemplate: ViewTemplate;

    /**
     *
     *
     * @public
     */
    @observable
    public defaultItemTemplate: ViewTemplate;

    /**
     *
     *
     * @internal
     */
    @observable
    public optionTemplate: ViewTemplate;

    /**
     *
     *
     * @internal
     */
    @observable
    public defaultOptionTemplate: ViewTemplate;

    /**
     *
     *
     * @internal
     */
    @observable
    public menuOpen: boolean = false;
    private menuOpenChanged(): void {
        if (this.menuOpen) {
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
     * reference to the menu
     *
     * @internal
     */
    public slottedMenuElements: HTMLElement[];

    /**
     *
     *
     * @internal
     */
    public region: AnchoredRegion;

    private itemsRepeatBehavior: RepeatBehavior | null;
    private itemsPlaceholder: Node | null = null;

    private optionsRepeatBehavior: RepeatBehavior | null;
    private optionsPlaceholder: Node | null = null;

    /**
     * The timer that controls the time between position updates
     */
    private updateTimer: number | null = null;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.defaultSelection !== undefined) {
            this.selectedOptions = this.defaultSelection.split(",");
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

        this.menuElement = document.createElement(this.pickermenutag) as PickerMenu;
        this.menuElement.slot = "menu-region";
        this.menuElement.id = this.menuId;
        this.appendChild(this.menuElement);

        this.itemsPlaceholder = document.createComment("");
        this.selectedList.append(this.itemsPlaceholder);

        this.inputElement = document.createElement("input");
        this.inputElement.setAttribute("role", "combobox");
        this.inputElement.setAttribute("type", "text");
        this.inputElement.setAttribute("autocapitalize", "off");
        this.inputElement.setAttribute("autocomplete", "off");
        this.inputElement.setAttribute("haspopup", "list");
        this.inputElement.setAttribute("aria-label", "the label");
        this.inputElement.setAttribute("part", "input-element");
        this.inputElement.classList.add("input-element");

        this.selectedList.appendChild(this.inputElement);
        this.inputElement.addEventListener("input", this.handleTextInput);
        this.inputElement.addEventListener("click", this.handleInputClick);

        this.checkMaxItems();

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
            this.appendChild(this.menuElement);
        }

        if (this.menuElement.id === "") {
            this.menuElement.id = uniqueId("listbox-");
        }

        this.menuElement.slot = "menu-region";
        this.menuId = this.menuElement.id;

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
        this.clearUpdateTimer();
        this.inputElement.removeEventListener("input", this.handleTextInput);
        this.inputElement.removeEventListener("click", this.handleInputClick);
    }

    public handleTextInput = (e: InputEvent): void => {
        // e.stopPropagation();
        // e.preventDefault();
    };

    public handleInputClick = (e: MouseEvent): void => {
        this.toggleMenu(true);
        e.preventDefault();
    };

    public handleKeyDown = (e: KeyboardEvent): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        switch (e.key) {
            case "Home": {
                if (this.menuElement.optionElements.length > 0) {
                    this.toggleMenu(true);
                    this.setFocusedOption(0);
                }
                return false;
            }

            case "ArrowDown": {
                if (this.menuElement.optionElements.length > 0) {
                    const nextFocusOptionIndex = this.menuOpen
                        ? Math.min(
                              this.menuFocusIndex + 1,
                              this.menuElement.optionElements.length - 1
                          )
                        : 0;

                    this.toggleMenu(true);
                    this.setFocusedOption(nextFocusOptionIndex);
                }
                return false;
            }

            case "ArrowUp": {
                if (this.menuElement.optionElements.length > 0) {
                    const previousFocusOptionIndex = this.menuOpen
                        ? Math.max(this.menuFocusIndex - 1, 0)
                        : 0;
                    this.toggleMenu(true);
                    this.setFocusedOption(previousFocusOptionIndex);
                }
                return false;
            }

            case "End": {
                if (this.menuElement.optionElements.length > 0) {
                    this.toggleMenu(true);
                    this.setFocusedOption(this.menuElement.optionElements.length - 1);
                }
                return false;
            }

            case "Escape": {
                this.toggleMenu(false);
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
                this.incrementFocusedItem(1);
                return false;
            }

            case "ArrowLeft": {
                this.incrementFocusedItem(-1);
                return false;
            }

            case "Delete":
            case "Backspace": {
                if (
                    this.inputElement.value.length === 0 &&
                    this.selectedOptions.length > 0
                ) {
                    this.selectedOptions.splice(this.selectedOptions.length - 1, 1);
                    this.toggleMenu(false);
                    return false;
                } else {
                    return true;
                }
            }
        }
        this.toggleMenu(true);
        return true;
    };

    public handleRegionLoaded = (e: Event): void => {
        // TODO: make updating configurable
        if (!this.menuOpen || this.updateTimer !== null) {
            return;
        }
        this.updateTimer = window.setTimeout((): void => {
            this.startUpdateTimer();
        }, 100);
    };

    public handleFocusOut = (e: FocusEvent): void => {
        if (
            this.menuElement === undefined ||
            !this.menuElement.contains(e.relatedTarget as Element)
        ) {
            this.toggleMenu(false);
        }

        return;
    };

    public handleOptionClick = (e: MouseEvent, value: string): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        this.selectedOptions.push(value);
        this.toggleMenu(false);
        this.inputElement.value = "";
        this.checkMaxItems();
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

    public handleItemClick = (e: MouseEvent, itemIndex: number): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        this.handleItemInvoke(itemIndex);
        return false;
    };

    private handleItemInvoke = (itemIndex: number): void => {
        this.selectedOptions.splice(itemIndex, 1);
        this.checkMaxItems();
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

    private setFocusedOption = (optionIndex: number): void => {
        if (optionIndex === this.menuFocusIndex || !this.menuOpen) {
            return;
        }

        this.menuElement.optionElements.forEach((element: HTMLElement) => {
            element.setAttribute("aria-selected", "false");
        });

        if (
            optionIndex === -1 ||
            optionIndex > this.menuElement.optionElements.length - 1
        ) {
            this.menuFocusIndex = -1;
            this.menuFocusOptionId = null;
            this.inputElement.setAttribute("aria-activedescendant", "unset");
            return;
        }

        this.menuFocusIndex = optionIndex;
        this.menuFocusOptionId = this.menuElement.optionElements[optionIndex].id;
        this.inputElement.setAttribute("aria-activedescendant", this.menuFocusOptionId);

        this.menuElement.optionElements[this.menuFocusIndex].setAttribute(
            "aria-selected",
            "true"
        );
    };

    private toggleMenu = (open: boolean): void => {
        if (this.menuOpen === open) {
            return;
        }

        if (open && document.activeElement === this.inputElement) {
            this.menuOpen = open;
            this.inputElement.setAttribute("aria-owns", this.menuId);
            this.inputElement.setAttribute("aria-expanded", "true");
            if (
                this.menuElement !== undefined &&
                this.menuElement.optionElements.length > 0
            ) {
                this.menuFocusIndex = 0;
                this.inputElement.setAttribute(
                    "aria-activedescendant",
                    this.menuElement.optionElements[0].id
                );
            } else {
                this.menuFocusIndex = -1;
                this.inputElement.setAttribute("aria-activedescendant", "unset");
            }
            return;
        }

        this.menuOpen = false;
        this.menuFocusIndex = -1;
        this.region.classList.toggle("loaded", false);
        this.inputElement.setAttribute("aria-owns", "unset");
        this.inputElement.setAttribute("aria-activedescendant", "unset");
        this.inputElement.setAttribute("aria-expanded", "false");
        return;
    };

    private setRegionProps = (): void => {
        if (!this.menuOpen) {
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

    /**
     * starts the update timer if not currently running
     */
    private startUpdateTimer = (): void => {
        DOM.queueUpdate(() => {
            this.region.classList.toggle("loaded", true);
        });

        this.updateTimer = window.setTimeout((): void => {
            this.updateTimerTick();
        }, 100);
    };

    private updateTimerTick = (): void => {
        this.clearUpdateTimer();
        if (this.menuOpen) {
            if (this.region !== undefined) {
                this.region.update();
            }
            this.updateTimer = window.setTimeout((): void => {
                this.updateTimerTick();
            }, 100);
        }
    };

    /**
     * clears the update timer
     */
    private clearUpdateTimer = (): void => {
        if (this.updateTimer !== null) {
            clearTimeout(this.updateTimer);
            this.updateTimer = null;
        }
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
}
