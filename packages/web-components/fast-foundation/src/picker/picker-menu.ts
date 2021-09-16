import { observable } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import uniqueId from "lodash-es/uniqueId";

/**
 * A List Picker Menu Custom HTML Element.
 *
 * @public
 */
export class PickerMenu extends FoundationElement {
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
     * @public
     */
    @observable
    public suggestionsAvailableText: string;

    /**
     * Children that are list items
     *
     * @internal
     */
    public optionElements: HTMLElement[] = [];

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
        this.$emit("optionsupdated", { bubbles: false });
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
