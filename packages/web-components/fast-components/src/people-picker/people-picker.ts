import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { ListPicker } from "@microsoft/fast-foundation";
import { GroupType, PersonType, IDynamicPerson } from "@microsoft/mgt";

export type SelectionMode = "single" | "multiple";

/**
 * A List Picker Custom HTML Element.
 *
 * @public
 */
export class PeoplePicker extends ListPicker {
    /**
     *  value determining if search is filtered to a group.
     *
     * @public
     * @remarks
     * HTML Attribute: group-id
     */
    @attr({ attribute: "group-id" })
    public groupId: string;

    /**
     *  value determining if search is filtered to a group.
     *
     * @public
     * @remarks
     * HTML Attribute: type
     */
    @attr({ attribute: "type" })
    public type: PersonType;

    /**
     *  type of group to search for - requires personType to be set to "Group" or "All"
     *
     * @public
     * @remarks
     * HTML Attribute: group-type
     */
    @attr({ attribute: "group-type" })
    public groupType: GroupType;

    /**
     *  whether the return should contain a flat list of all nested members
     *
     * @public
     * @remarks
     * HTML Attribute: transitive-search
     */
    @attr({ attribute: "transitive-search", mode: "boolean" })
    public transitiveSearch: boolean;

    /**
     *  Placeholder text.
     *
     * @public
     * @remarks
     * HTML Attribute: placeholder
     */
    @attr({ attribute: "placeholder" })
    public placeholder: string;

    /**
     *  Placeholder text.
     *
     * @public
     * @remarks
     * HTML Attribute: selection-mode
     */
    @attr({ attribute: "selection-mode" })
    public selectionMode: SelectionMode;

    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: show-max
     */
    @attr({ attribute: "show-max" })
    public showMax: number;

    /**
     *
     *
     * @public
     */
    public people: IDynamicPerson[];

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
    }
}
