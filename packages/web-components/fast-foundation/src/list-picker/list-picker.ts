import {
    attr,
    DOM,
    FASTElement,
    observable,
    RepeatBehavior,
    RepeatDirective,
    ViewTemplate,
} from "@microsoft/fast-element";
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
     * Listbox children that are options
     *
     * @internal
     */
    @observable
    public optionElements: HTMLElement[];

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

        this.itemsPlaceholder = document.createComment("");
        this.insertBefore(this.itemsPlaceholder, this.firstChild);

        this.itemsRepeatBehavior = new RepeatDirective(
            x => x.selectedOptions,
            x => x.itemTemplate,
            { positioning: true }
        ).createBehavior(this.itemsPlaceholder);

        this.$fastController.addBehaviors([this.itemsRepeatBehavior!]);
    }

    public handleTextInput = (e: InputEvent): void => {
        if (!this.listboxOpen) {
            this.listboxOpen = true;
        }
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
        this.listbox.insertBefore(this.optionsPlaceholder, this.listbox.firstChild);

        this.optionsRepeatBehavior = new RepeatDirective(
            x => x.availableOptions,
            x => x.optionTemplate,
            { positioning: true }
        ).createBehavior(this.optionsPlaceholder);

        this.$fastController.addBehaviors([this.optionsRepeatBehavior!]);
    };

    public handleFocusOut = (e: FocusEvent): void => {
        if (
            this.listbox === undefined ||
            !this.listbox.contains(e.relatedTarget as Element)
        ) {
            this.listboxOpen = false;
        }
    };

    public handleOptionClick = (e: MouseEvent): boolean => {
        if (e.defaultPrevented) {
            return true;
        }
        // this.selectedOptions = this.selectedOptions.push();
        this.listboxOpen = false;
        return true;
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
