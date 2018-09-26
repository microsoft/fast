import * as React from "react";
import { cloneDeep, uniqueId } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";
import { get } from "lodash-es";
import { SortableListItem, sortingProps } from "./sorting";
import { getChildOptionBySchemaId } from "./form.utilities";
import { generateExampleData } from "./form-section.utilities";
import { updateActiveSection } from "./form-section.props";
import { DataOnChange, IChildOptionItem } from "./form.props";
import { reactChildrenStringSchema } from "./form-item.children.text";
import styles from "./form-item.children.style";
import { IFormItemChildrenClassNameContract } from "../class-name-contracts/";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IComponentData {
    /**
     * The component schema id
     */
    id: string;

    /**
     * The props to be applied to the component which matches the id
     */
    props: any;
}

export interface IFormItemChildrenProps {
    /**
     * The location of the data
     */
    dataLocation: string;

    /**
     * The data
     */
    data: any;

    /**
     * The schema
     */
    schema: any;

    /**
     * The onChange event
     */
    onChange: DataOnChange;

    /**
     * The callback for activating a subcomponent
     */
    onUpdateActiveSection: updateActiveSection;

    /**
     * The potential children to be added
     */
    childOptions: any[];

    /**
     * The default children to be added
     */
    defaultChildOptions?: string[];

    /**
     * The title for the interface
     */
    title: string;
}

export enum Action {
    add = "add",
    edit = "edit",
    delete = "delete"
}

/**
 * State object for the FormItemChildren component
 */
export interface IFormItemChildrenState {
    childrenSearchTerm: string;
    hideOptionMenu: boolean;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemChildren extends React.Component<IFormItemChildrenProps & IManagedClasses<IFormItemChildrenClassNameContract>, IFormItemChildrenState> {

    /**
     * Store a reference to the search input element
     */
    private searchRef: HTMLInputElement;

    /**
     * Store a reference to the options menu
     */
    private optionMenuRef: React.RefObject<HTMLUListElement>;

    /**
     * Store a reference to the option menu trigger
     */
    private optionMenuTriggerRef: React.RefObject<HTMLButtonElement>;

    constructor(props: IFormItemChildrenProps & IManagedClasses<IFormItemChildrenClassNameContract>) {
        super(props);

        this.optionMenuRef = React.createRef();
        this.optionMenuTriggerRef = React.createRef();

        this.state = {
            childrenSearchTerm: "",
            hideOptionMenu: true
        };
    }

    public render(): JSX.Element {
        // Convert to search component when #3006 has been completed
        return (
            <div className={this.props.managedClasses.formItemChildren}>
                {this.renderHeader()}
                {this.renderExistingChildren()}
                <div>
                    <div className={this.props.managedClasses.formItemChildren_inputWrapper}>
                        <input
                            aria-label="Enter your search"
                            type="search"
                            name="search-field"
                            placeholder="Filter"
                            value={this.state.childrenSearchTerm}
                            onChange={this.handleSearchInputChange}
                            autoComplete="off"
                            ref={this.storeSearchRef}
                        />
                        <button name="search-button">
                            <span>Search</span>
                        </button>
                    </div>
                    <ul className={this.props.managedClasses.formItemChildren_childOptionsMenu}>
                        {this.renderDefaultChildOptions()}
                        {this.renderChildOptions()}
                    </ul>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        if (canUseDOM()) {
            document.addEventListener("click", this.handleWindowClick);
        }
    }

    public componentWillUnmount(): void {
        if (canUseDOM()) {
            document.removeEventListener("click", this.handleWindowClick);
        }
    }

    private handleWindowClick = (e: MouseEvent): void => {
        if (
            e.target instanceof Element
            && !this.optionMenuRef.current.contains(e.target)
            && !this.optionMenuTriggerRef.current.contains(e.target)
            && this.optionMenuTriggerRef.current !== e.target
        ) {
            this.closeMenu();
        }
    }

    private toggleMenu = (): void => {
        this.setState({hideOptionMenu: !this.state.hideOptionMenu});
    }

    private closeMenu = (): void => {
        this.setState({hideOptionMenu: true});
    }

    /**
     * Click event for adding a component
     */
    private onAddComponent(item: any): void {
        const currentChildrenArray: React.ReactNode[] = this.getCurrentChildArray(this.props.data);

        if (typeof item === "object") {
            this.props.onChange(
                this.props.dataLocation,
                this.getReactComponents(currentChildrenArray, item),
                undefined,
                undefined,
                true
            );
        } else if (typeof item === "string") {
            this.props.onChange(
                this.props.dataLocation,
                this.getStringComponents(currentChildrenArray, item),
                undefined,
                undefined,
                true
            );
        }
    }

    private getReactComponents(currentChildrenArray: any[], item: any): any[] {
        const components: any[] = currentChildrenArray;
        components.push(this.getChildComponent(item));

        return components;
    }

    private getStringComponents(currentChildrenArray: any[], item: string): React.Component[] | string {
        const components: any[] = currentChildrenArray;

        if (components.length > 0) {
            components.push(item);
        }

        return components.length > 0 ? components : item;
    }

    private getCurrentChildArray(currentChildren: JSX.Element): React.ReactNode[] {
        return Array.isArray(currentChildren)
            ? currentChildren
            : typeof currentChildren !== "undefined" && currentChildren !== null
            ? [currentChildren]
            : [];
    }

    private getChildComponent(item: any): IComponentData {
        return {
            id: item.schema.id,
            props: generateExampleData(item.schema, "")
        };
    }

    private getDataLocation(component: any, index: number): string {
        const propLocation: string = typeof component === "string" ? "" : ".props";

        if (typeof index === "number") {
            return `${this.props.dataLocation}[${index}]${propLocation}`;
        }

        return `${this.props.dataLocation}${propLocation}`;
    }

    /**
     * Click handler for editing a component
     */
    private onEditComponent(componentObj: any, index: number): void {
        let childSchema: any;

        if (typeof componentObj.props === "string") {
            childSchema = reactChildrenStringSchema;
        } else if (typeof componentObj.props === "object") {
            this.props.childOptions.forEach((childOption: any) => {
                if (childOption.component === componentObj.type) {
                    childSchema = childOption.schema;
                }
            });
        }

        this.props.onUpdateActiveSection("", `${this.getDataLocation(componentObj, index)}`, childSchema);
    }

    /**
     * Click handler for deleting a component
     */
    private onDeleteComponent(index?: number): void {
        this.props.onChange(
            this.props.dataLocation,
            void(0),
            typeof index !== "undefined",
            index
        );
    }

    /**
     * Click factory for child items
     */
    private clickComponentFactory = (type: Action, componentObj?: any, index?: number): any => {
        return (e: React.MouseEvent<MouseEvent>): void => {
            e.preventDefault();

            if (!this.state.hideOptionMenu) {
                this.toggleMenu();
            }

            switch (type) {
                case Action.edit:
                    this.onEditComponent(componentObj, index);
                    break;
                case Action.delete:
                    this.onDeleteComponent(index);
                    break;
                case Action.add:
                    this.onAddComponent(componentObj);

                    // If we're searching for components, re-focus the text input
                    if (this.state.childrenSearchTerm !== "" && this.searchRef instanceof HTMLInputElement) {
                        this.searchRef.focus();
                    }

                    this.setState({
                        childrenSearchTerm: ""
                    });

                    break;
            }
        };
    }

    /**
     * Gets the items for the component action menu
     */
    private getActionMenuChildItems(): any[] {
        const items: string[] = [];

        if (Array.isArray(this.props.data)) {
            for (let index: number = 0, currentChildrenLength: number = this.props.data.length;
                index < currentChildrenLength;
                index++
            ) {
                const item: JSX.Element = this.props.data[index];

                items.push(this.generateChildOptionText(item));
            }
        } else if (typeof this.props.data === "object" && this.props.data !== null) {
            items.push(this.generateChildOptionText(this.props.data));
        }

        // we have nothing to add or delete
        if (items.length === 0) {
            return [(
                <li
                    key={0}
                    className={this.props.managedClasses.formItemChildren_optionMenu__listItem}
                >
                    <span>No actions available</span>
                </li>)
            ];
        }

        return items.map((item: any, index: number) => {
            return (
                <li key={uniqueId()} className={this.props.managedClasses.formItemChildren_optionMenu__listItem}>
                    <button onClick={this.clickComponentFactory(Action.delete, void(0), index)}>
                        {item}
                    </button>
                </li>
            );
        });
    }

    /**
     * Renders the default child options
     */
    private renderDefaultChildOptions(): JSX.Element[] {
        if (!Array.isArray(this.props.defaultChildOptions)) {
            return null;
        }

        const option: IChildOptionItem = {
            name: "Text",
            component: null,
            schema: reactChildrenStringSchema
        };

        return this.props.defaultChildOptions.map((defaultChildOption: string, index: number) => {
            switch (defaultChildOption) {
                case "text":
                    return (
                        <button
                            key={`${defaultChildOption}${index}`}
                            onClick={this.clickComponentFactory(Action.add, option)}
                            className={this.props.managedClasses.formItemChildren_childOptionsTextButton}
                        >
                            <span>Text</span>
                        </button>
                    );
                default:
                    return null;
            }
        });
    }

    /**
     * Renders the optional children
     */
    private renderChildOptions(): JSX.Element[] {
        return this.props.childOptions.filter((option: IChildOptionItem): boolean => {
            return option.name.toLowerCase().includes(this.state.childrenSearchTerm.toLowerCase());
        }).map((option: any, index: number): JSX.Element => {
            return (
                <li key={uniqueId()}>
                    <button
                        onClick={this.clickComponentFactory(Action.add, option)}
                    >
                        <span>{option.name}</span>
                    </button>
                </li>
            );
        });
    }

    private renderChildCaption(instance: any): JSX.Element {
        if (instance && instance.props && instance.props.text) {
            return <span>{instance.props.text}</span>;
        } else {
            return null;
        }
    }

    private renderChildItem = (item: any, index?: number): JSX.Element => {
        // The "react-sortable-hoc" library has an issue where a wrapping element
        // must be supplied in order to accurately show drag movement
        // see: https://github.com/clauderic/react-sortable-hoc/issues/305
        return (
            <div>
                <SortableListItem key={uniqueId()}>
                    <a
                        onClick={this.clickComponentFactory(Action.edit, item, index)}
                    >
                        {this.generateChildOptionText(item)}
                        {this.renderChildCaption(item)}
                    </a>
                </SortableListItem>
            </div>
        );
    }

    private generateChildOptionText(item: any): string {
        const childOption: IChildOptionItem = getChildOptionBySchemaId(item.id, this.props.childOptions);

        return typeof childOption === "object" && childOption !== null
            ? childOption.name
            : typeof item.props === "string"
            ? item.props
            : typeof item === "string"
            ? item
            : "Untitled";
    }

    /**
     * Generate all items for the list of existing children
     */
    private generateChildItems(): JSX.Element | JSX.Element[] {
        const currentChildren: JSX.Element = this.props.data;
        const currentChildrenArray: JSX.Element[] = Array.isArray(currentChildren) ? currentChildren : [currentChildren];

        if (currentChildren) {
            return currentChildrenArray.map((item: any, index: number): JSX.Element => {
                const options: any = {
                    key: `item-${index}`,
                    index,
                    value: typeof item === "object" ? this.generateChildOptionText(item) : item
                };

                return React.createElement(
                    SortableElement(
                        this.renderChildItem.bind(
                            this,
                            item,
                            currentChildrenArray.length > 1
                                ? index
                                : undefined
                        )
                    ),
                    options
                );
            });
        }

        return null;
    }

    /**
     * Generates the header region for existing children
     */
    private renderHeader(): JSX.Element | null {
        return (
            <div className={this.props.managedClasses.formItemChildren_existingChildren}>
                <div className={this.props.managedClasses.formItemChildren_header}>
                    <h3>{this.props.title}</h3>
                    {/* TODO: #460 Fix "identical-code" */}
                    <button
                        ref={this.optionMenuTriggerRef}
                        onClick={this.toggleMenu}
                        aria-expanded={!this.state.hideOptionMenu}
                    >
                        <span>Options</span>
                    </button>
                    <ul
                        className={this.props.managedClasses.formItemChildren_optionMenu}
                        aria-hidden={this.state.hideOptionMenu}
                        ref={this.optionMenuRef}
                    >
                        {this.getActionMenuChildItems()}
                    </ul>
                </div>
            </div>
        );
    }

    /**
     * Render the list of existing children for a component
     */
    private renderExistingChildren(): JSX.Element {
        const props: any = Object.assign({}, sortingProps, {
            onSortEnd: this.handleSort
        });

        const childItems: JSX.Element | JSX.Element[] = this.generateChildItems();

        if (childItems) {
            return React.createElement(SortableContainer((): JSX.Element => {
                return (
                    <ul className={this.props.managedClasses.formItemChildren_addedChildren}>
                        {childItems}
                    </ul>
                );
            }), props);
        }

        return <div>Nothing here</div>;
    }

    /**
     * Callback to call when children sorting has occured
     */
    private handleSort = ({oldIndex, newIndex}: any): void => {
        const childrenData: any = cloneDeep(this.props.data);

        if (Boolean(childrenData)) {
            this.props.onChange(this.props.dataLocation, arrayMove(childrenData, oldIndex, newIndex));
        }
    }

    private handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            childrenSearchTerm: e.target.value
        });
    }

    /**
     * Store search input ref
     */
    private storeSearchRef = (ref?: HTMLInputElement): void => {
        if (ref) {
            this.searchRef = ref;
        }
    }
}

export default manageJss(styles)(FormItemChildren);
