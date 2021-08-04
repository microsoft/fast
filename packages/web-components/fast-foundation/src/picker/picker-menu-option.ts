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
 * @public
 */
export class PickerMenuOption extends FoundationElement {
    /**
     * The underlying string value of the item
     *
     * @public
     * @remarks
     * HTML Attribute: value
     */
    @attr({ attribute: "value" })
    public value: string;

    public contentsTemplate: ViewTemplate;

    private customView: HTMLView | null = null;

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

        if (this.contentsTemplate !== undefined) {
            this.customView = this.contentsTemplate.render(this, this);
        } else {
            this.customView = defaultContentsTemplate.render(this, this);
        }
    }

    private disconnectView(): void {
        if (this.customView !== null) {
            this.customView.dispose();
            this.customView = null;
        }
    }
}
