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
import { eventTouchEnd } from "../../../../utilities/fast-web-utilities/dist";
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
    public listboxOpen: boolean = false;
    private listboxOpenChanged(): void {
        if (this.listboxOpen) {
            DOM.queueUpdate(this.setRegionProps);
        }
    }

    /**
     *
     *
     * @internal
     */
    @observable
    public listboxId: string;

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
    public listboxFocusIndex: number = -1;

    /**
     *
     *
     * @internal
     */
    @observable
    public listboxFocusOptionId: string | null = null;

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
        this.menuElement.id = this.listboxId;
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
        this.listboxId = this.menuElement.id;

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
                    this.toggleMenu(true);
                    this.setFocusedOption(
                        Math.min(
                            this.listboxFocusIndex + 1,
                            this.menuElement.optionElements.length - 1
                        )
                    );
                }
                return false;
            }

            case "ArrowUp": {
                if (this.menuElement.optionElements.length > 0) {
                    this.toggleMenu(true);
                    this.setFocusedOption(Math.max(this.listboxFocusIndex - 1, 0));
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
                    this.listboxFocusIndex !== -1 &&
                    this.menuElement.optionElements.length > this.listboxFocusIndex
                ) {
                    this.menuElement.optionElements[this.listboxFocusIndex].click();
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
        }
        this.toggleMenu(true);
        return true;
    };

    public handleRegionLoaded = (e: Event): void => {
        return;
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
        return false;
    };

    public handleItemClick = (e: MouseEvent, itemIndex: number): boolean => {
        if (e.defaultPrevented) {
            return false;
        }

        this.selectedOptions.splice(itemIndex, 1);
        return false;
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
        if (optionIndex === this.listboxFocusIndex) {
            return;
        }
        if (
            optionIndex === -1 ||
            optionIndex > this.menuElement.optionElements.length - 1
        ) {
            this.listboxFocusIndex = -1;
            this.listboxFocusOptionId = null;
            this.inputElement.setAttribute("aria-activedescendant", "unset");
            return;
        }

        this.listboxFocusIndex = optionIndex;
        this.listboxFocusOptionId = this.menuElement.optionElements[optionIndex].id;
        this.inputElement.setAttribute(
            "aria-activedescendant",
            this.listboxFocusOptionId
        );
    };

    private toggleMenu = (open: boolean): void => {
        if (this.listboxOpen === open) {
            return;
        }

        if (open) {
            this.listboxOpen = open;
            this.inputElement.setAttribute("aria-owns", this.listboxId);
            this.inputElement.setAttribute("aria-expanded", "true");
            if (
                this.menuElement !== undefined &&
                this.menuElement.optionElements.length > 0
            ) {
                this.listboxFocusIndex = 0;
                this.inputElement.setAttribute(
                    "aria-activedescendant",
                    this.menuElement.optionElements[0].id
                );
            } else {
                this.listboxFocusIndex = -1;
                this.inputElement.setAttribute("aria-activedescendant", "unset");
            }
            return;
        }

        this.listboxOpen = false;
        this.listboxFocusIndex = -1;
        this.inputElement.setAttribute("aria-owns", "unset");
        this.inputElement.setAttribute("aria-activedescendant", "unset");
        this.inputElement.setAttribute("aria-expanded", "false");
        return;
    };

    private setRegionProps = (): void => {
        if (!this.listboxOpen) {
            return;
        }
        if (this.region === null || this.region === undefined) {
            DOM.queueUpdate(this.setRegionProps);
            return;
        }
        this.region.viewportElement = document.body;
        this.region.anchorElement = this.inputElement;
    };
}
