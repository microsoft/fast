import { attr, FASTElement, observable } from "@microsoft/fast-element";
import uniqueId from "lodash-es/uniqueId";

/**
 * A List Picker Menu Custom HTML Element.
 *
 * @public
 */
export class PickerMenu extends FASTElement {
    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: show-loading
     */
    @attr({ attribute: "show-loading" })
    public showLoading: boolean = false;

    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: show-no-options
     */
    @attr({ attribute: "show-no-options" })
    public showNoOptions: boolean = false;

    /**
     * Children that are list items
     *
     * @internal
     */
    public optionElements: HTMLElement[] = [];

    /**
     *
     *
     *
     * @internal
     */
    @observable
    public menuElements: HTMLElement[];
    public menuElementsChanged(): void {
        this.updateOptions();
    }

    /**
     *
     *
     *
     * @internal
     */
    @observable
    public headerElements: HTMLElement[];
    public headerElementsChanged(): void {
        this.updateOptions();
    }

    /**
     *
     *
     *
     * @internal
     */
    @observable
    public footerElements: HTMLElement[];
    public footerElementsChanged(): void {
        this.updateOptions();
    }

    /**
     *
     *
     * @public
     */
    @observable
    public noSuggestionsText: string;

    /**
     *
     * @public
     */
    @observable
    public suggestionsAvailableText: string;

    /**
     *
     * @public
     */
    @observable
    public loadingText: string;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
    }

    private updateOptions(): void {
        this.optionElements.splice(0, this.optionElements.length);
        this.addSlottedListItems(this.headerElements);
        this.addSlottedListItems(this.menuElements);
        this.addSlottedListItems(this.footerElements);
        // TODO: emit a change?
    }

    private addSlottedListItems(slotChildren: HTMLElement[]) {
        if (slotChildren === undefined) {
            return;
        }
        slotChildren.forEach((child: HTMLElement): void => {
            if (child.nodeType === 1 && child.getAttribute("role") === "listitem") {
                child.id = child.id || uniqueId("option-");
                this.optionElements.push(child);
            }
        });
    }
}
