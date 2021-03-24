import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { Picker } from "@microsoft/fast-foundation";
import { PersonType, Providers, ProviderState, IDynamicPerson } from "@microsoft/mgt";
import { findPeople, getPeople } from "./graph/graph.people";
import {
    findUsers,
    findGroupMembers,
    getUser,
    getUsersForUserIds,
} from "./graph/graph.user";
import { GroupType, findGroups, findGroupsFromGroup } from "./graph/graph.groups";

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
     * @internal
     */
    @observable
    public people: IDynamicPerson[];

    // /**
    //  *
    //  *
    //  * @internal
    //  */
    // @observable
    // public selectedPeople: IDynamicPerson[] = [];

    /**
     *
     *
     * @internal
     */
    @observable
    public defaultPeople: IDynamicPerson[];
    private defaultPeopleChanged(): void {
        const newOptions: string[] = this.defaultPeople.map(p => p.id);
        this.optionsList = newOptions;
    }

    /**
     *
     *
     * @internal
     */
    @observable
    public groupPeople: IDynamicPerson[];

    /**
     *
     *
     * @internal
     */
    @observable
    public foundPeople: IDynamicPerson[];
    private foundPeopleChanged(): void {
        const newOptions: string[] = this.foundPeople.map(p => p.id);
        this.optionsList = newOptions;
    }

    private _debouncedSearch: { (): void; (): void };
    private defaultSelectedUsers: IDynamicPerson[];

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

    protected handleTextInput = (e: InputEvent): void => {
        super.handleTextInput(e);

        this.startSearch();
    };

    protected toggleMenu(open: boolean): void {
        this.startSearch();
        super.toggleMenu(open);
    }

    private startSearch = (): void => {
        if (!this._debouncedSearch) {
            this._debouncedSearch = debounce(async () => {
                this.showLoading = true;
                await this.loadState();
                this.showLoading = false;
            }, 400);
        }

        this._debouncedSearch();
    };

    /**
     * Async query to Graph for members of group if determined by developer.
     * set's `this.groupPeople` to those members.
     */
    protected async loadState(): Promise<void> {
        let people = this.people;
        const input = this.inputElement.value.toLowerCase();
        const provider = Providers.globalProvider;
        if (!people && provider && provider.state === ProviderState.SignedIn) {
            const graph = provider.graph.forComponent(this);
            if (!input.length && this.contains(document.activeElement)) {
                if (this.defaultPeople) {
                    people = this.defaultPeople;
                } else {
                    if (this.groupId) {
                        if (this.groupPeople === null) {
                            try {
                                this.groupPeople = await findGroupMembers(
                                    graph,
                                    null,
                                    this.groupId,
                                    this.showMax,
                                    this.type,
                                    this.transitiveSearch
                                );
                            } catch (_) {
                                this.groupPeople = [];
                            }
                        }
                        people = this.groupPeople || [];
                    } else if (
                        this.type === PersonType.person ||
                        this.type === PersonType.any
                    ) {
                        people = await getPeople(graph);
                    } else if (this.type === PersonType.group) {
                        // @ts-ignore
                        const groups =
                            (await findGroups(graph, "", this.showMax, this.groupType)) ||
                            [];
                        people = groups;
                    }
                    this.defaultPeople = people;
                }
            }
            this.showLoading = false;
            if (
                this.defaultSelection &&
                !this.selectedOptions.length &&
                !this.defaultSelectedUsers
            ) {
                this.defaultSelectedUsers = await getUsersForUserIds(
                    graph,
                    this.defaultSelection.split(",")
                );
                // this.selectedPeople = [...this.defaultSelectedUsers];
                // this.requestUpdate();
                // this.fireCustomEvent('selectionChanged', this.selectedPeople);
            }
            if (input) {
                people = [];
                if (this.groupId) {
                    people =
                        (await findGroupMembers(
                            graph,
                            input,
                            this.groupId,
                            this.showMax,
                            this.type,
                            this.transitiveSearch
                        )) || [];
                } else {
                    if (this.type === PersonType.person || this.type === PersonType.any) {
                        try {
                            people = (await findPeople(graph, input, this.showMax)) || [];
                        } catch (e) {
                            // nop
                        }
                        if (people.length < this.showMax) {
                            try {
                                const users =
                                    (await findUsers(graph, input, this.showMax)) || [];
                                // make sure only unique people
                                const peopleIds = new Set(people.map(p => p.id));
                                for (const user of users) {
                                    if (!peopleIds.has(user.id)) {
                                        people.push(user);
                                    }
                                }
                            } catch (e) {
                                // nop
                            }
                        }
                    }
                    if (
                        (this.type === PersonType.group ||
                            this.type === PersonType.any) &&
                        people.length < this.showMax
                    ) {
                        let groups = [];
                        try {
                            // @ts-ignore
                            groups =
                                (await findGroups(
                                    graph,
                                    input,
                                    this.showMax,
                                    this.groupType
                                )) || [];
                            people = people.concat(groups);
                        } catch (e) {
                            // nop
                        }
                    }
                }
            }
        }
        this.foundPeople = this.filterPeople(people);
    }

    /**
     * Filters people searched from already selected people
     * @param people - array of people returned from query to Graph
     */
    private filterPeople(people: IDynamicPerson[]): IDynamicPerson[] {
        // check if people need to be updated
        // ensuring people list is displayed
        // find ids from selected people
        const idFilter = this.selectedOptions;

        if (people) {
            // filter id's
            const filtered = people.filter((person: IDynamicPerson) => {
                if (person.id) {
                    return idFilter.indexOf(person.id) === -1;
                } else {
                    return idFilter.indexOf(person.displayName) === -1;
                }
            });

            return filtered;
        }
    }
}
