import { attr, html, HTMLView, observable, ViewTemplate } from "@microsoft/fast-element";
import { keyEnter } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";

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

    public handleItemKeyDown = (e: KeyboardEvent): boolean => {
        if (e.defaultPrevented) {
            return false;
        }

        if (e.key === keyEnter) {
            this.handleItemInvoke();
            return false;
        }

        return true;
    };

    public handleItemClick = (e: MouseEvent): boolean => {
        if (!e.defaultPrevented) {
            this.handleItemInvoke();
        }
        return false;
    };

    private handleItemInvoke = (): void => {
        this.$emit("pickeriteminvoked");
    };

    private updateView(): void {
        this.disconnectView();

        this.customView =
            this.contentsTemplate !== undefined
                ? this.contentsTemplate.render(this, this)
                : defaultContentsTemplate.render(this, this);
    }

    private disconnectView(): void {
        this.customView?.dispose();
        this.customView = undefined;
    }
}
