import { FASTElement } from "@microsoft/fast-element";
/**
 * A Wrapper Custom HTML Element.
 *
 * @public
 */
export declare class Wrapper extends FASTElement {
    /**
     * Indicates the Wrapper should have a dictionary id.
     * @public
     * @remarks
     * HTML Attribute: dictionary-id
     */
    dictionaryId: string;
    /**
     * The x coord
     * @public
     * @remarks
     * HTML Attribute: x
     */
    x: number;
    /**
     * The y coord
     * @public
     * @remarks
     * HTML Attribute: y
     */
    y: number;
    /**
     * The width
     * @public
     * @remarks
     * HTML Attribute: width
     */
    width: number;
    /**
     * The height
     * @public
     * @remarks
     * HTML Attribute: height
     */
    height: number;
    /**
     * The active state
     * When true, the control shows an outline and
     * indicators around the current component
     * @public
     * @remarks
     * HTML Attribute: active
     */
    active: boolean;
    /**
     * The preselect state
     * When true, the control shows a faded outline and
     * indicators around the preselected component
     * @public
     * @remarks
     * HTML Attribute: preselect
     */
    preselect: boolean;
}
