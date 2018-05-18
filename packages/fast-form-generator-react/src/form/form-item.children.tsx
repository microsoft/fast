import * as React from "react";
import { uniqueId } from "lodash-es";
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { get } from "lodash-es";
import { SortableListItem, sortingProps } from "./sorting";
import { isRootLocation } from "./form.utilities";
import { generateExampleData } from "./form-section.utilities";
import { updateActiveSection } from "./form-section.props";
import { ComponentTree, DataOnChange } from "./form.props";
import styles from "./form-item.children.style";
import { IFormItemChildrenClassNameContract } from "../class-name-contracts/";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IFormItemChildrenProps {
    /**
     * The untitled string
     */
    untitled: string;

    /**
     * The location of the data
     */
    dataLocation: string;

    /**
     * The data
     */
    data: any;

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

    constructor(props: IFormItemChildrenProps & IManagedClasses<IFormItemChildrenClassNameContract>) {
        super(props);

        this.state = {
            childrenSearchTerm: "",
            hideOptionMenu: true
        };
    }

    public render(): JSX.Element {
        // Convert to search component when #3006 has been completed
        return (
            <div className={this.props.managedClasses.formItemChildren}>
                {this.generateExistingChildrenHeader()}
                {this.generateExistingChildren()}
                <div>
                    <h3>Add building blocks</h3>
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
                        {this.generateChildOptions()}
                    </ul>
                </div>
            </div>
        );
    }

    /**
     * Click event for adding a component
     */
    private onAddComponent(componentObj: any): void {
        const dataLocation: string = "children";
        const currentChildren: JSX.Element = get(this.props.data, dataLocation);
        let components: JSX.Element[] = [];

        if (Array.isArray(currentChildren)) {
            components = components.concat(currentChildren);
        } else if (typeof currentChildren === "object") {
            components = components.concat([currentChildren]);
        }

        const component: JSX.Element = (
            <componentObj.component
                key={uniqueId()}
                {...generateExampleData(componentObj.schema, "")}
            />
        );

        components.push(component);

        this.props.onChange(
            isRootLocation(this.props.dataLocation) ? `children` : `${this.props.dataLocation}.children`,
            components
        );
    }

    private getDataLocation(index?: number): string {
        if (typeof index === "number") {
            return isRootLocation(this.props.dataLocation)
                ? `children[${index}].props`
                : `${this.props.dataLocation}.children[${index}].props`;
        }

        return isRootLocation(this.props.dataLocation)
            ? `children.props`
            : `${this.props.dataLocation}.children.props`;
    }

    /**
     * Click handler for editing a component
     */
    private onEditComponent(componentObj: any, index: number): void {
        let schema: any;
        const dataLocation: string = this.getDataLocation(index);

        this.props.childOptions.forEach((childOption: any) => {
            if (childOption.component === componentObj.type) {
                schema = childOption.schema;
            }
        });

        this.props.onUpdateActiveSection("", dataLocation, schema);
    }

    /**
     * Click handler for deleting a component
     */
    private onDeleteComponent(index?: number): void {
        this.props.onChange(
            isRootLocation(this.props.dataLocation)
                ? `children`
                : `${this.props.dataLocation}.children`,
            void(0),
            typeof index !== "undefined",
            index
        );
    }

    /**
     * Click factory for child items
     */
    private clickComponentFactory = (type: string, componentObj?: any, index?: number): any => {
        return (e: React.MouseEvent<MouseEvent>): void => {
            e.preventDefault();

            if (!this.state.hideOptionMenu) {
                this.toggleMenu();
            }

            switch (type) {
                case "edit":
                    this.onEditComponent(componentObj, index);
                    break;
                case "delete":
                    this.onDeleteComponent(index);
                    break;
                case "add":
                    this.onAddComponent(componentObj);

                    // If we"re searching for components, re-focus the text input
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
        const dataLocation: string = "children";
        const currentChildren: JSX.Element[] = get(this.props.data, dataLocation);
        const items: string[] = [];

        if (Array.isArray(currentChildren)) {
            for (let index: number = 0, currentChildrenLength: number = currentChildren.length;
                index < currentChildrenLength;
                index++
            ) {
                const item: JSX.Element = currentChildren[index];

                items.push(this.generateChildOptionText(item));
            }
        } else if (typeof currentChildren === "object") {
            items.push(this.generateChildOptionText(currentChildren));
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
                    <button onClick={this.clickComponentFactory("delete", void(0), index)}>
                        {item}
                    </button>
                </li>
            );
        });
    }

    /**
     * Generate the optional children
     */
    private generateChildOptions(): JSX.Element[] {
        return this.props.childOptions.filter((option: any): string => {
            return option.name.toLowerCase().includes(this.state.childrenSearchTerm.toLowerCase());
        }).map((option: any, index: number): JSX.Element => {
            return (
                <li key={uniqueId()}>
                    <button onClick={this.clickComponentFactory("add", option)}>
                        <span>{option.name}</span>
                    </button>
                </li>
            );
        });
    }

    private generateChildCaption(instance: any): JSX.Element {
        if (Boolean(instance.props.text)) {
            return <span>{instance.props.text}</span>;
        } else {
            return null;
        }
    }

    private generateChildItem = (item: any, index?: number): JSX.Element => {
        return (
            <SortableListItem key={uniqueId()}>
                <a onClick={this.clickComponentFactory("edit", item, index)}>
                    {this.generateChildOptionText(item)}
                    {this.generateChildCaption(item)}
                </a>
            </SortableListItem>
        );
    }

    private generateChildOptionText(instance: any): string {
        const item: any = this.getChildOptionByConstructor(instance.type);
        return item.name || "Untitled";
    }

    /**
     * Return the child-option object where the constructor matches the passed function
     */
    private getChildOptionByConstructor(constructorMethod: () => any): JSX.Element {
        return this.props.childOptions.find((item: any): any => {
            return item.component === constructorMethod;
        });
    }

    /**
     * Generate all items for the list of existing children
     */
    private generateChildItems(): JSX.Element | JSX.Element[] {
        const dataLocation: string = "children";
        const currentChildren: JSX.Element = get(this.props.data, dataLocation);

        if (Array.isArray(currentChildren)) {
            return currentChildren.map((item: any, index: number): JSX.Element => {
                const options: any = {
                    key: `item-${index}`,
                    index,
                    value: this.generateChildOptionText(item)
                };

                return React.createElement(SortableElement(this.generateChildItem.bind(this, item, index)), options);
            });
        } else if (typeof currentChildren === "object") {
            const options: any = {
                key: `item`,
                index: 0,
                value: this.generateChildOptionText(currentChildren)
            };

            return React.createElement(SortableElement(this.generateChildItem.bind(this, currentChildren)), options);
        }

        return null;
    }

    /**
     * Generates the header region for existing children
     */
    private generateExistingChildrenHeader(): JSX.Element | null {
        const currentChildren: JSX.Element = get(this.props.data, "children");

        if (typeof currentChildren !== "undefined") {
            return (
                <div className={this.props.managedClasses.formItemChildren_existingChildren}>
                    <div>
                        <h3>Building blocks</h3>
                        <button onClick={this.toggleMenu} aria-expanded={!this.state.hideOptionMenu}><span>Options</span></button>
                        <ul className={this.props.managedClasses.formItemChildren_optionMenu} aria-hidden={this.state.hideOptionMenu}>
                            {this.getActionMenuChildItems()}
                        </ul>
                    </div>
                </div>
            );
        }
    }

    private toggleMenu = (): void => {
        this.setState({hideOptionMenu: !this.state.hideOptionMenu});
    }

    /**
     * Generate the list of existing children for a component
     */
    private generateExistingChildren(): JSX.Element {
        const props: any = Object.assign({}, sortingProps, {
            onSortEnd: this.handleSort
        });

        return React.createElement(SortableContainer((): JSX.Element => {
            return (
                <ul className={this.props.managedClasses.formItemChildren_addedChildren}>
                    {this.generateChildItems()}
                </ul>
            );
        }), props);
    }

    /**
     * Callback to call when children sorting has occured
     */
    private handleSort = ({oldIndex, newIndex}: any): void => {
        const location: string = isRootLocation(this.props.dataLocation) ? `children` : `${this.props.dataLocation}.children`;
        const childrenData: any = get(this.props.data, location);

        if (Boolean(childrenData)) {
            this.props.onChange(location, arrayMove(childrenData, oldIndex, newIndex));
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
