import {
    attr,
    FASTElement,
    html,
    HTMLView,
    observable,
    ViewTemplate,
} from "@microsoft/fast-element";

const defaultContentsTemplate: ViewTemplate<FASTPickerMenuOption> = html`
    <template>
        ${x => x.value}
    </template>
`;

/**
 * A picker list item Custom HTML Element.
 *
 * @beta
 */
export class FASTPickerMenuOption extends FASTElement {
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
        super.disconnectedCallback();
        this.disconnectView();
    }

    public handleClick(e: MouseEvent): boolean {
        if (e.defaultPrevented) {
            return false;
        }
        this.handleInvoked();
        return false;
    }

    private handleInvoked(): void {
        this.$emit("pickeroptioninvoked");
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
