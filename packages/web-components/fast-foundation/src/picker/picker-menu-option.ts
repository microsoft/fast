import { attr, html, HTMLView, ViewTemplate } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";

const defaultContentsTemplate: ViewTemplate<PickerMenuOption> = html`
    <template>
        ${x => x.value}
    </template>
`;

/**
 * A picker list item Custom HTML Element.
 *
 * @alpha
 */
export class PickerMenuOption extends FoundationElement {
    /**
     * The underlying string value of the item
     *
     * @alpha
     * @remarks
     * HTML Attribute: value
     */
    @attr({ attribute: "value" })
    public value: string;

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
        super.disconnectedCallback();
        this.disconnectView();
    }

    public handleOptionClick = (e: MouseEvent): boolean => {
        if (e.defaultPrevented) {
            return false;
        }
        this.handleOptionInvoked();
        return false;
    };

    private handleOptionInvoked = (): void => {
        this.$emit("pickeroptioninvoked");
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
