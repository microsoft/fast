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
    // private isActive: boolean = false;
    // private isInternalFocused: boolean = false;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        // this.addEventListener(eventFocusIn, this.handleFocusin);
        // this.addEventListener(eventFocusOut, this.handleFocusout);
        // this.addEventListener(eventKeyDown, this.handleKeydown);

        this.updateView();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        // this.removeEventListener(eventFocusIn, this.handleFocusin);
        // this.removeEventListener(eventFocusOut, this.handleFocusout);
        // this.removeEventListener(eventKeyDown, this.handleKeydown)
        this.disconnectView();
    }

    public handleFocusin(e: FocusEvent): void {
        // if (this.isActiveCell) {
        //     return;
        // }
        // this.isActiveCell = true;
        // if (
        //     this.columnDefinition !== null &&
        //     this.columnDefinition.cellInternalFocusQueue !== true &&
        //     typeof this.columnDefinition.cellFocusTargetCallback === "function"
        // ) {
        //     // move focus to the focus target
        //     const focusTarget: HTMLElement = this.columnDefinition.cellFocusTargetCallback(
        //         this
        //     );
        //     if (focusTarget !== null) {
        //         focusTarget.focus();
        //     }
        // }
        // this.$emit("cell-focused", this);
    }

    public handleFocusout(e: FocusEvent): void {
        if (this !== document.activeElement && !this.contains(document.activeElement)) {
            // this.isActiveCell = false;
            // this.isInternalFocused = false;
        }
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
