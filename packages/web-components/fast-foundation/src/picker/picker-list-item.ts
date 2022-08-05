import { attr, html, HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import { keyEnter } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element/foundation-element.js";

const defaultContentsTemplate: ViewTemplate<PickerListItem> = html`
    <template>
        ${x => x.value}
    </template>
`;

/**
 * A picker list item Custom HTML Element.
 *
 * @alpha
 */
export class PickerListItem extends FoundationElement {
    /**
     * The underlying string value of the item
     *
     * @alpha
     * @remarks
     * HTML Attribute: value
     */
    @attr({ attribute: "value" })
    public value: string;

    /**
     *  The template used to render the contents of the list item
     *
     * @alpha
     */
    @observable
    public contentsTemplate: ViewTemplate;
    private contentsTemplateChanged(): void {
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
        if (e.defaultPrevented) {
            return false;
        }

        if (e.key === keyEnter) {
            this.handleInvoke();
            return false;
        }

        return true;
    }

    public handleClick(e: MouseEvent): boolean {
        if (!e.defaultPrevented) {
            this.handleInvoke();
        }
        return false;
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
