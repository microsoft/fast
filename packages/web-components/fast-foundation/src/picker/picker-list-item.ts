import {
    attr,
    FASTElement,
    html,
    HTMLView,
    observable,
    ViewTemplate,
} from "@microsoft/fast-element";
import { keyEnter } from "@microsoft/fast-web-utilities";

const defaultContentsTemplate: ViewTemplate<FASTPickerListItem> = html`
    <template>
        ${x => x.value}
    </template>
`;

/**
 * A picker list item Custom HTML Element.
 *
 * @beta
 */
export class FASTPickerListItem extends FASTElement {
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
