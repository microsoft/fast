import { attr, FASTElement } from "@microsoft/fast-element";

/**
 * A List Picker Menu Custom HTML Element.
 *
 * @public
 */
export class ListPickerMenu extends FASTElement {
    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: testing
     */
    @attr({ attribute: "testing" })
    public testing: string = "test";
    private testingChanged(): void {}

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
    }
}
