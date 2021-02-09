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

/**
 * A List Picker Custom HTML Element.
 *
 * @public
 */
export class ListPicker extends FASTElement {
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
     * Children that are options
     *
     * @internal
     */
    @observable
    public generatedOptionElements: HTMLElement[] = [];
    private generatedOptionElementsChanged(): void {
        this.generatedOptionElements.forEach(o => {
            o.id = o.id || uniqueId("option-");
        });
        if (this.$fastController.isConnected) {
            this.allOptions = this.getAllOptions();
        }
    }

    /**
     *
     *
     * @internal
     */
    @observable
    public slottedPreOptions: HTMLElement[] = [];
    private slottedPreOptionsChanged(): void {
        this.slottedPreOptions.forEach(o => {
            o.id = o.id || uniqueId("option-");
        });
        if (this.$fastController.isConnected) {
            this.allOptions = this.getAllOptions();
        }
    }

    /**
     *
     *
     * @internal
     */
    @observable
    public slottedPostOptions: HTMLElement[] = [];
    private slottedPostOptionsChanged(): void {
        this.slottedPostOptions.forEach(o => {
            o.id = o.id || uniqueId("option-");
        });
        if (this.$fastController.isConnected) {
            this.allOptions = this.getAllOptions();
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
    public inputBox: HTMLElement;

    /**
     * reference to the edit box
     *
     * @internal
     */
    public listbox: HTMLElement;

    /**
     * reference to the edit box
     *
     * @internal
     */
    public preOptionRegion: HTMLElement;

    /**
     * reference to the edit box
     *
     * @internal
     */
    public postOptionRegion: HTMLElement;

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

    private allOptions: HTMLElement[] = [];

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

        this.itemsPlaceholder = document.createComment("");
        this.insertBefore(this.itemsPlaceholder, this.firstChild);

        this.itemsRepeatBehavior = new RepeatDirective(
            x => x.selectedOptions,
            x => x.itemTemplate,
            { positioning: true }
        ).createBehavior(this.itemsPlaceholder);

        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);
    }

    public handleTextInput = (e: InputEvent): boolean => {
        // e.stopPropagation();
        return false;
    };

    public handleInputKeyDown = (e: KeyboardEvent): boolean => {
        this.toggleMenu(true);

        switch (e.key) {
            case "Home": {
                if (this.allOptions.length > 0) {
                    this.setFocusedOption(0);
                }
                // e.stopPropagation();
                return false;
            }

            case "ArrowDown": {
                if (this.allOptions.length > 0) {
                    this.setFocusedOption(
                        Math.min(this.listboxFocusIndex + 1, this.allOptions.length - 1)
                    );
                }
                // e.stopPropagation();
                return false;
            }

            case "ArrowUp": {
                if (this.allOptions.length > 0) {
                    this.setFocusedOption(Math.max(this.listboxFocusIndex - 1, 0));
                }
                // e.stopPropagation();
                return false;
            }

            case "End": {
                if (this.allOptions.length > 0) {
                    this.setFocusedOption(this.allOptions.length - 1);
                }
                // e.stopPropagation();
                return false;
            }

            case "Enter": {
                if (this.allOptions.length > 0) {
                }
                // e.stopPropagation();
                return false;
            }
        }

        // e.stopPropagation();
        return true;
    };

    public handleRegionLoaded = (e: Event): void => {
        if (
            this.listbox === null ||
            this.listbox === undefined ||
            this.optionsPlaceholder !== null
        ) {
            return;
        }

        this.optionsPlaceholder = document.createComment("");
        this.listbox.insertBefore(this.optionsPlaceholder, this.postOptionRegion);

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
            this.listbox === undefined ||
            !this.listbox.contains(e.relatedTarget as Element)
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
        if (optionIndex === -1 || optionIndex > this.allOptions.length - 1) {
            this.listboxFocusIndex = -1;
            this.listboxFocusOptionId = null;
            return;
        }

        this.listboxFocusIndex = optionIndex;
        this.listboxFocusOptionId = this.allOptions[optionIndex].id;
    };

    private toggleMenu = (open: boolean): void => {
        if (this.listboxOpen !== open) {
            this.listboxOpen = open;
            if (this.allOptions.length > 0) {
                this.listboxFocusIndex = 0;
            } else {
                this.listboxFocusIndex = -1;
            }
        }
    };

    private getAllOptions = (): HTMLElement[] => {
        const allOptions: HTMLElement[] = [];
        allOptions.splice(0, 0, ...this.slottedPostOptions);
        allOptions.splice(0, 0, ...this.generatedOptionElements);
        allOptions.splice(0, 0, ...this.slottedPreOptions);
        return allOptions;
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
        this.region.anchorElement = this.inputBox;
    };
}
