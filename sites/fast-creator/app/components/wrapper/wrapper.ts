import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";

/**
 * A Wrapper Custom HTML Element.
 *
 * @public
 */
export class Wrapper extends FASTElement {
    /**
     * Indicates the Wrapper should have a dictionary id.
     * @public
     * @remarks
     * HTML Attribute: dictionary-id
     */
    @attr({ attribute: "dictionary-id" })
    public dictionaryId: string;

    /**
     * The x coord
     * @public
     * @remarks
     * HTML Attribute: x
     */
    @attr({ converter: nullableNumberConverter })
    public x: number = 0;

    /**
     * The y coord
     * @public
     * @remarks
     * HTML Attribute: y
     */
    @attr({ converter: nullableNumberConverter })
    public y: number = 0;

    /**
     * The width
     * @public
     * @remarks
     * HTML Attribute: width
     */
    @attr({ converter: nullableNumberConverter })
    public width: number = 0;

    /**
     * The height
     * @public
     * @remarks
     * HTML Attribute: height
     */
    @attr({ converter: nullableNumberConverter })
    public height: number = 0;

    /**
     * The active state
     * When true, the control shows an outline and
     * indicators around the current component
     * @public
     * @remarks
     * HTML Attribute: active
     */
    @attr({ attribute: "active", mode: "boolean" })
    public active: boolean = true;

    /**
     * The preselect state
     * When true, the control shows a faded outline and
     * indicators around the preselected component
     * @public
     * @remarks
     * HTML Attribute: preselect
     */
    @attr({ attribute: "preselect", mode: "boolean" })
    public preselect: boolean = false;
}
