import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { Picker } from "@microsoft/fast-foundation";
import {
    GroupType,
    PersonType,
    Providers,
    ProviderState,
    IDynamicPerson,
} from "@microsoft/mgt";

/**
 * ensures one call at a time
 *
 * @export
 * @param {*} func
 * @param {*} time
 * @returns
 */
export function debounce(func, time) {
    let timeout;

    return function () {
        const functionCall = () => func.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    };
}

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
    public showMax: number = 6;

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

    private _debouncedSearch: { (): void; (): void };

    private defaultPeople: IDynamicPerson[];
    private _groupPeople: IDynamicPerson[];

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

    protected handleSelectionChange(): void {
        super.handleSelectionChange();
    }

    protected handleTextInput = (e: InputEvent): boolean => {
        if (!this._debouncedSearch) {
            this._debouncedSearch = debounce(async () => {
                // this.showOptions = false;
                await this.loadState();
                // this.showOptions = true;
            }, 400);
        }

        this._debouncedSearch();

        return super.handleTextInput(e);
    };

    /**
     * Async query to Graph for members of group if determined by developer.
     * set's `this.groupPeople` to those members.
     */
    protected async loadState(): Promise<void> {
        // let people = this.people;
        // const input = this.inputElement.value.toLowerCase();
        // const provider = Providers.globalProvider;
        // if (!people && provider && provider.state === ProviderState.SignedIn) {
        //   const graph = provider.graph.forComponent(this);
        //   if (!input.length && this.contains(document.activeElement)) {
        //     if (this.defaultPeople) {
        //       people = this.defaultPeople;
        //     } else {
        //       if (this.groupId) {
        //         if (this._groupPeople === null) {
        //           try {
        //             this._groupPeople = await findGroupMembers(
        //               graph,
        //               null,
        //               this.groupId,
        //               this.showMax,
        //               this.type,
        //               this.transitiveSearch
        //             );
        //           } catch (_) {
        //             this._groupPeople = [];
        //           }
        //         }
        //         people = this._groupPeople || [];
        //       } else if (this.type === PersonType.person || this.type === PersonType.any) {
        //         people = await getPeople(graph);
        //       } else if (this.type === PersonType.group) {
        //         const groups = (await findGroups(graph, '', this.showMax, this.groupType)) || [];
        //         people = groups;
        //       }
        //       this.defaultPeople = people;
        //     }
        //   }
        //   this._showLoading = false;
        //   if (this.defaultSelectedUserIds && !this.selectedPeople.length && !this.defaultSelectedUsers) {
        //     this.defaultSelectedUsers = await getUsersForUserIds(graph, this.defaultSelectedUserIds);
        //     this.selectedPeople = [...this.defaultSelectedUsers];
        //     this.requestUpdate();
        //     this.fireCustomEvent('selectionChanged', this.selectedPeople);
        //   }
        //   if (input) {
        //     people = [];
        //     if (this.groupId) {
        //       people =
        //         (await findGroupMembers(graph, input, this.groupId, this.showMax, this.type, this.transitiveSearch)) || [];
        //     } else {
        //       if (this.type === PersonType.person || this.type === PersonType.any) {
        //         try {
        //           people = (await findPeople(graph, input, this.showMax)) || [];
        //         } catch (e) {
        //           // nop
        //         }
        //         if (people.length < this.showMax) {
        //           try {
        //             const users = (await findUsers(graph, input, this.showMax)) || [];
        //             // make sure only unique people
        //             const peopleIds = new Set(people.map(p => p.id));
        //             for (const user of users) {
        //               if (!peopleIds.has(user.id)) {
        //                 people.push(user);
        //               }
        //             }
        //           } catch (e) {
        //             // nop
        //           }
        //         }
        //       }
        //       if ((this.type === PersonType.group || this.type === PersonType.any) && people.length < this.showMax) {
        //         let groups = [];
        //         try {
        //           groups = (await findGroups(graph, input, this.showMax, this.groupType)) || [];
        //           people = people.concat(groups);
        //         } catch (e) {
        //           // nop
        //         }
        //       }
        //     }
        //   }
        // }
        // //people = this.getUniquePeople(people);
        // this._foundPeople = this.filterPeople(people);
    }
}
