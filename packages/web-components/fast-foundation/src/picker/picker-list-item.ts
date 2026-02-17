import type { HTMLView, ViewTemplate } from "@microsoft/fast-element";
import { attr, FASTElement, html, observable } from "@microsoft/fast-element";
import { keyEnter } from "@microsoft/fast-web-utilities";
import { PickerContext } from "./picker-context.js";

const defaultContentsTemplate: ViewTemplate<FASTPickerListItem> = html`
    <template>${x => x.value}</template>
`;

/**
 * A picker list item Custom HTML Element.
 *
 * @beta
 */
export class FASTPickerListItem extends FASTElement {
    /**
     * Context object for the parent picker
     *
     */
    @PickerContext
    pickerContext: PickerContext;

    /**
     * The underlying string value of the item
     *
     * @remarks
     * HTML Attribute: value
     */
    @attr({ attribute: "value" })
    public value: string;

    /**
     *  The template used to render the contents of the list item
     *
     */
    @observable
    public contentsTemplate: ViewTemplate;
    protected contentsTemplateChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

    private customView: HTMLView | undefined;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.updateView();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        this.disconnectView();
        super.disconnectedCallback();
    }

    public handleKeyDown(e: KeyboardEvent): boolean {
        if (e.defaultPrevented || this.pickerContext.disabled) {
            return true;
        }

        if (e.key === keyEnter) {
            this.handleInvoke();
            return false;
        }

        return true;
    }

    public handleClick(e: MouseEvent): void {
        if (e.defaultPrevented || this.pickerContext.disabled) {
            return;
        }
        this.handleInvoke();
    }

    private handleInvoke(): void {
        this.$emit("pickeriteminvoked");
    }

    private updateView(): void {
        this.disconnectView();

        this.customView =
            this.contentsTemplate?.render(this, this) ??
            defaultContentsTemplate.render(this, this);
    }

    private disconnectView(): void {
        this.customView?.dispose();
        this.customView = undefined;
    }
}
