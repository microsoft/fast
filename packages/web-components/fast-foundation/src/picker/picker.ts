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
    public selection: string;

    /**
     *
     *
     * @public
     */
    @observable
    public selectedOptions: string[] = [];
    private selectedOptionsChanged(): void {}

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
        this.availableOptions = this.options.split(",");
    }

    /**
     *
     *
     * @public
     */
    @observable
    public availableOptions: string[] = [];
    private availableOptionsChanged(): void {}

    /**
     *
     *
     * @internal
     */
    @observable
    public itemTemplate: ViewTemplate;

    /**
     *
     *
     * @internal
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
    public listboxId: string = uniqueId("listbox-");

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
    public pickerinputtag: string;

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
    public inputElement: HTMLElement;

    /**
     * reference to the selected item list
     *
     * @internal
     */
    public selectedList: HTMLElement;

    /**
     * reference to the edit box
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
            this.availableOptions = this.options.split(",");
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

        this.inputElement = document.createElement(this.pickerinputtag);
        this.inputElement.addEventListener("focusout", this.handleFocusOut);
        this.inputElement.addEventListener("keydown", this.handleInputKeyDown);
        this.inputElement.addEventListener("input", this.handleTextInput);
        this.selectedList.appendChild(this.inputElement);

        this.itemsRepeatBehavior = new RepeatDirective(
            x => x.selectedOptions,
            x => x.itemTemplate,
            { positioning: true }
        ).createBehavior(this.itemsPlaceholder);

        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);
    }

    public handleTextInput = (e: InputEvent): void => {
        // e.stopPropagation();
        e.preventDefault();
    };

    public handleInputKeyDown = (e: KeyboardEvent): void => {
        this.toggleMenu(true);

        switch (e.key) {
            case "Home": {
                if (this.menuElement.optionElements.length > 0) {
                    this.setFocusedOption(0);
                }
                // e.stopPropagation();
                e.preventDefault();
            }

            case "ArrowDown": {
                if (this.menuElement.optionElements.length > 0) {
                    this.setFocusedOption(
                        Math.min(
                            this.listboxFocusIndex + 1,
                            this.menuElement.optionElements.length - 1
                        )
                    );
                }
                // e.stopPropagation();
                e.preventDefault();
            }

            case "ArrowUp": {
                if (this.menuElement.optionElements.length > 0) {
                    this.setFocusedOption(Math.max(this.listboxFocusIndex - 1, 0));
                }
                // e.stopPropagation();
                e.preventDefault();
            }

            case "End": {
                if (this.menuElement.optionElements.length > 0) {
                    this.setFocusedOption(this.menuElement.optionElements.length - 1);
                }
                // e.stopPropagation();
                e.preventDefault();
            }

            case "Enter": {
                if (this.menuElement.optionElements.length > 0) {
                }
                // e.stopPropagation();
                e.preventDefault();
            }
        }
    };

    public handleRegionLoaded = (e: Event): void => {
        if (
            this.menuElement === null ||
            this.menuElement === undefined ||
            this.optionsPlaceholder !== null
        ) {
            return;
        }

        this.optionsPlaceholder = document.createComment("");
        this.menuElement.append(this.optionsPlaceholder);

        this.optionsRepeatBehavior = new RepeatDirective(
            x => x.availableOptions,
            x => x.optionTemplate,
            { positioning: true }
        ).createBehavior(this.optionsPlaceholder);

        this.$fastController.addBehaviors([this.optionsRepeatBehavior!]);
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

    public handleOptionClick = (e: MouseEvent): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        // this.selectedOptions = this.selectedOptions.push();
        this.toggleMenu(false);
        return false;
    };

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
            if (this.menuElement.optionElements.length > 0) {
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
