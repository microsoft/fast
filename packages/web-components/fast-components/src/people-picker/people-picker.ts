import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { Picker } from "@microsoft/fast-foundation";
import { GroupType, PersonType, IDynamicPerson } from "@microsoft/mgt";

/**
 * A List Picker Custom HTML Element.
 *
 * @public
 */
export class PeoplePicker extends Picker {
    /**
     *  value determining if search is filtered to a group.
     *
     * @public
     * @remarks
     * HTML Attribute: group-id
     */
    @attr({ attribute: "group-id" })
    public groupId: string;
    public groupIdChanged() {
        // TODO: update
    }

    /**
     *  value determining if search is filtered to a group.
     *
     * @public
     * @remarks
     * HTML Attribute: type
     */
    @attr({ attribute: "type" })
    public type: PersonType = PersonType.any;
    public typeChanged(): void {
        // TODO: update
    }

    /**
     *  type of group to search for - requires personType to be set to "Group" or "All"
     *
     * @public
     * @remarks
     * HTML Attribute: group-type
     */
    @attr({ attribute: "group-type" })
    public groupType: GroupType;
    public groupTypeChanged(): void {
        // TODO: update
    }

    /**
     *  whether the return should contain a flat list of all nested members
     *
     * @public
     * @remarks
     * HTML Attribute: transitive-search
     */
    @attr({ attribute: "transitive-search", mode: "boolean" })
    public transitiveSearch: boolean;
    public transitiveSearchChanged(): void {
        // TODO: update
    }

    /**
     *  Placeholder text.
     *
     * @public
     * @remarks
     * HTML Attribute: placeholder
     */
    @attr({ attribute: "placeholder" })
    public placeholder: string;

    // Proposal - remove "selection-mode" from people picker api in favor of Picker's "max-selected" attribute which is more flexible than simply "single" or "multiple"
    // /**
    //  *
    //  *
    //  * @public
    //  * @remarks
    //  * HTML Attribute: selection-mode
    //  */
    // @attr({ attribute: "selection-mode" })
    // public selectionMode: SelectionMode;

    /**
     * The maximum number of options to display
     *
     * @public
     * @remarks
     * HTML Attribute: show-max
     */
    @attr({ attribute: "show-max" })
    public showMax: number | undefined;

    /**
     *
     *
     * @public
     */
    public people: IDynamicPerson[] = [];

    /**
     *
     *
     * @public
     */
    public selectedPeople: IDynamicPerson[] = [];

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}
