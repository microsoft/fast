import { uniqueId } from "@microsoft/fast-web-utilities";
import { FASTElement, observable } from "@microsoft/fast-element";

/**
 * A List Picker Menu Custom HTML Element.
 *
 * @beta
 */
export class FASTPickerMenu extends FASTElement {
    /**
     *  Elements in the default slot
     *
     * @internal
     */
    @observable
    public menuElements: HTMLElement[];
    public menuElementsChanged(): void {
        this.updateOptions();
    }

    /**
     *  Elements in the header slot
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
     *  Elements in the footer slot
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
     * Text to display to assistive technology when
     * suggestions are available
     *
     */
    @observable
    public suggestionsAvailableText: string;

    /**
     * Children that are list items
     *
     * @internal
     */
    public optionElements: HTMLElement[] = [];

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
