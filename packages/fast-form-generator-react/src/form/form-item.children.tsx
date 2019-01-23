import { generateExampleData } from "./form-section.utilities";
import * as React from "react";
import { canUseDOM } from "exenv-es6";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";
import { get } from "lodash-es";
import {
    ChildOptionItem,
    getChildOptionBySchemaId,
} from "@microsoft/fast-data-utilities-react";
import { SortableListItem, sortingProps } from "./sorting";
import { cloneDeep, uniqueId } from "lodash-es";
import { updateActiveSection } from "./form-section.props";
import FormItemCommon from "./form-item";
import { DataOnChange } from "./form.props";
import { reactChildrenStringSchema } from "./form-item.children.text";
import styles from "./form-item.children.style";
import { FormItemChildrenClassNameContract } from "../class-name-contracts/";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormItemBase from "./form-item.base";

export interface ChildComponentDataMapping {
    [T: string]: any;
}

export interface ChildComponentConfig {
    /**
     * The JSON schema id for the component
     */
    id: string;

    /**
     * The props for the component
     */
    props: ChildComponentDataMapping;
}

export type ChildComponent = ChildComponentConfig | string;

export interface FormItemChildrenProps extends FormItemCommon {
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
    childOptions: ChildOptionItem[];

    /**
     * The default children to be added
     */
    defaultChildOptions?: string[];
}

export enum Action {
    add = "add",
    edit = "edit",
    delete = "delete",
}

/**
 * State object for the FormItemChildren component
 */
export interface FormItemChildrenState {
    childrenSearchTerm: string;
    indexOfSelectedFilteredChildOption: number;
    filteredChildOptions: ChildOptionItem[];
    hideChildrenList: boolean;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
/* tslint:disable-next-line */
class FormItemChildren extends FormItemBase<
    FormItemChildrenProps & ManagedClasses<FormItemChildrenClassNameContract>,
    FormItemChildrenState
> {
    /**
     * Store a reference to the children list
     */
    private filteredChildrenList: React.RefObject<HTMLUListElement>;

    /**
     * Store a reference to the children list trigger
     */
    private filteredChildrenListTrigger: React.RefObject<HTMLButtonElement>;

    /**
     * Store a reference to the combobox input
     */
    private filteredChildrenInput: React.RefObject<HTMLInputElement>;

    /**
     * Store a reference to the selected child option
     */
    private selectedChildOption: React.RefObject<HTMLLIElement>;

    /**
     * The child options available to be filtered
     */
    private childOptions: ChildOptionItem[];

    constructor(
        props: FormItemChildrenProps & ManagedClasses<FormItemChildrenClassNameContract>
    ) {
        super(props);

        this.filteredChildrenList = React.createRef();
        this.filteredChildrenListTrigger = React.createRef();
        this.filteredChildrenInput = React.createRef();
        this.selectedChildOption = React.createRef();

        const defaultOptions: ChildOptionItem[] = [];

        if (
            Array.isArray(this.props.defaultChildOptions) &&
            this.props.defaultChildOptions.includes("text")
        ) {
            defaultOptions.push({
                name: "Text",
                component: null,
                schema: reactChildrenStringSchema,
            });
        }

        this.childOptions = defaultOptions.concat(this.props.childOptions);

        this.state = {
            childrenSearchTerm: "",
            indexOfSelectedFilteredChildOption: 0,
            filteredChildOptions: this.childOptions,
            hideChildrenList: true,
        };
    }

    public render(): JSX.Element {
        // Convert to search component when #3006 has been completed
        return (
            <div className={this.props.managedClasses.formItemChildren}>
                <div className={this.props.managedClasses.formItemChildren_control}>
                    <label
                        className={
                            this.props.managedClasses.formItemChildren_controlLabel
                        }
                        id={this.getLabelId()}
                    >
                        {this.props.label}
                    </label>
                </div>
                {this.renderExistingChildren()}
                {this.renderAddChild()}
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

    /**
     * Renders the input, button and listbox for
     * adding a child
     */
    private renderAddChild(): React.ReactNode {
        return (
            <div>
                <div
                    className={
                        this.props.managedClasses.formItemChildren_childrenListControl
                    }
                >
                    <input
                        className={
                            this.props.managedClasses.formItemChildren_childrenListInput
                        }
                        type={"text"}
                        aria-autocomplete={"list"}
                        aria-controls={this.getFilteredChildrenInputId()}
                        aria-labelledby={this.getLabelId()}
                        value={this.state.childrenSearchTerm}
                        placeholder="Add"
                        onChange={this.handleChildOptionFilterInputChange}
                        onKeyDown={this.handleChildrenListInputKeydown}
                        ref={this.filteredChildrenInput}
                    />
                    <button
                        className={
                            this.props.managedClasses.formItemChildren_childrenListTrigger
                        }
                        tabIndex={-1}
                        aria-label={"Show children options"}
                        onClick={this.handleChildrenListTriggerClick}
                        ref={this.filteredChildrenListTrigger}
                    />
                </div>
                <ul
                    id={this.getFilteredChildrenInputId()}
                    aria-labelledby={this.getLabelId()}
                    aria-hidden={this.state.hideChildrenList}
                    className={this.props.managedClasses.formItemChildren_childrenList}
                    role={"listbox"}
                    ref={this.filteredChildrenList}
                >
                    {this.renderFilteredChildOptions()}
                </ul>
            </div>
        );
    }

    /**
     * Renders the optional children
     */
    private renderFilteredChildOptions(): JSX.Element[] {
        return this.state.filteredChildOptions.map(
            (option: ChildOptionItem, index: number): JSX.Element => {
                const selected: boolean =
                    this.state.filteredChildOptions[
                        this.state.indexOfSelectedFilteredChildOption
                    ] === option;

                return (
                    <li
                        className={
                            this.props.managedClasses.formItemChildren_childrenListItem
                        }
                        key={uniqueId()}
                        role={"option"}
                        aria-selected={selected}
                        onClick={this.clickAddComponentFactory(option)}
                        ref={selected ? this.selectedChildOption : null}
                    >
                        <span>{option.name}</span>
                    </li>
                );
            }
        );
    }

    /**
     * Renders a caption for an existing child item
     */
    private renderExistingChildCaption(instance: ChildComponent): JSX.Element {
        if (
            instance &&
            (instance as ChildComponentConfig).props &&
            (instance as ChildComponentConfig).props.text
        ) {
            return (
                <React.Fragment>
                    <br />
                    <i
                        className={
                            this.props.managedClasses
                                .formItemChildren_existingChildrenItemContent
                        }
                    >
                        {(instance as ChildComponentConfig).props.text}
                    </i>
                </React.Fragment>
            );
        }

        return null;
    }

    /**
     * Renders an existing child item
     */
    private renderExistingChild = (item: ChildComponent, index?: number): JSX.Element => {
        // The "react-sortable-hoc" library has an issue where a wrapping element
        // must be supplied in order to accurately show drag movement
        // see: https://github.com/clauderic/react-sortable-hoc/issues/305
        return (
            <SortableListItem
                className={
                    this.props.managedClasses.formItemChildren_existingChildrenItem
                }
                key={`item-${index}`}
                id={uniqueId(index ? index.toString() : "")}
            >
                <a
                    aria-label={"Select to edit"}
                    className={
                        this.props.managedClasses
                            .formItemChildren_existingChildrenItemLink
                    }
                    onClick={this.clickEditComponentFactory(item, index)}
                >
                    <span
                        className={
                            this.props.managedClasses
                                .formItemChildren_existingChildrenItemName
                        }
                    >
                        {this.generateChildOptionText(item)}
                    </span>
                    {this.renderExistingChildCaption(item)}
                </a>
                {this.renderExistingChildDelete(index)}
            </SortableListItem>
        );
    };

    /**
     * Renders the delete button for an existing child
     */
    private renderExistingChildDelete(index: number): JSX.Element {
        return (
            <button
                aria-label={"Select to remove"}
                className={this.props.managedClasses.formItemChildren_deleteButton}
                onClick={this.clickDeleteComponentFactory(index)}
            />
        );
    }

    /**
     * Generate the text to use as display for a child option
     */
    private generateChildOptionText(item: any): string {
        const childOption: ChildOptionItem = getChildOptionBySchemaId(
            item.id,
            this.childOptions
        );

        if (typeof childOption === "object" && childOption !== null) {
            return childOption.name;
        } else {
            return this.getChildOptionTextString(item);
        }
    }

    /**
     * Generate all items for the list of existing children
     */
    private renderExistingChildItems(): JSX.Element | JSX.Element[] {
        const currentChildren: ChildComponent = this.props.data;
        const currentChildrenArray: ChildComponent[] = Array.isArray(currentChildren)
            ? currentChildren
            : [currentChildren];

        if (currentChildren) {
            return currentChildrenArray.map(
                (item: ChildComponent, index: number): JSX.Element => {
                    const options: any = {
                        key: `item-${index}`,
                        index,
                        value:
                            typeof item === "object"
                                ? this.generateChildOptionText(item)
                                : item,
                    };

                    return React.createElement(
                        SortableElement(
                            this.renderExistingChild.bind(
                                this,
                                item,
                                currentChildrenArray.length > 1 ? index : undefined
                            )
                        ),
                        options
                    );
                }
            );
        }

        return null;
    }

    /**
     * Render the list of existing children for a component
     */
    private renderExistingChildren(): JSX.Element {
        const props: any = Object.assign({}, sortingProps, {
            onSortEnd: this.handleSort,
            helperClass: this.props.managedClasses
                .formItemChildren_existingChildrenItem__sorting,
        });

        const childItems: JSX.Element | JSX.Element[] = this.renderExistingChildItems();

        if (childItems) {
            return React.createElement(
                SortableContainer(
                    (): JSX.Element => {
                        return (
                            <ul
                                className={
                                    this.props.managedClasses
                                        .formItemChildren_existingChildren
                                }
                            >
                                {childItems}
                            </ul>
                        );
                    }
                ),
                props
            );
        }

        return null;
    }

    /**
     * Keydown handler for the child option filter
     */
    private handleChildrenListInputKeydown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ): void => {
        switch (e.keyCode) {
            case KeyCodes.enter:
                e.preventDefault();
            case KeyCodes.tab:
                if (this.state.childrenSearchTerm !== "") {
                    this.onAddComponent(
                        this.state.filteredChildOptions[
                            this.state.indexOfSelectedFilteredChildOption
                        ]
                    );
                }

                this.setState({
                    hideChildrenList: true,
                });
                break;
            case KeyCodes.arrowUp:
                this.selectPreviousFilteredChildOption();
                break;
            case KeyCodes.arrowDown:
                this.selectNextFilteredChildOption();
                break;
        }
    };

    /**
     * Click handler for the children list trigger
     */
    private handleChildrenListTriggerClick = (
        e: React.MouseEvent<HTMLButtonElement>
    ): void => {
        this.handleToggleChildrenListVisibility(e);

        if (this.filteredChildrenInput.current instanceof HTMLElement) {
            this.filteredChildrenInput.current.focus();
        }
    };

    /**
     * Click handler for toggling the visibility of the children list
     */
    private handleToggleChildrenListVisibility = (
        e: React.MouseEvent<HTMLButtonElement>
    ): void => {
        this.setState({
            hideChildrenList: !this.state.hideChildrenList,
        });

        if (this.filteredChildrenList.current instanceof HTMLElement) {
            this.filteredChildrenList.current.scrollTop = 0;
        }
    };

    /**
     * Click handler for the window
     */
    private handleWindowClick = (e: MouseEvent): void => {
        if (this.isTargetingChildrenList(e)) {
            this.setState({ hideChildrenList: true });
        }
    };

    /**
     * Callback to call when children sorting has occured
     */
    private handleSort = ({ oldIndex, newIndex }: any): void => {
        const childrenData: any = cloneDeep(this.props.data);

        if (Boolean(childrenData)) {
            this.props.onChange(
                this.props.dataLocation,
                arrayMove(childrenData, oldIndex, newIndex)
            );
        }
    };

    /**
     * Change handler for editing the child option filter
     */
    private handleChildOptionFilterInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const filteredChildOptions: ChildOptionItem[] = this.childOptions.filter(
            (option: ChildOptionItem): boolean => {
                return option.name.toLowerCase().includes(e.target.value.toLowerCase());
            }
        );

        this.setState({
            childrenSearchTerm: e.target.value,
            indexOfSelectedFilteredChildOption: 0,
            filteredChildOptions,
            hideChildrenList: e.target.value === "",
        });
    };

    /**
     * Click handler for editing a component
     */
    private onEditComponent(component: ChildComponent, index: number): void {
        let childSchema: any;

        if (typeof component === "string") {
            childSchema = reactChildrenStringSchema;
        } else if (
            typeof component === "object" &&
            typeof (component as ChildComponentConfig).props === "object"
        ) {
            this.childOptions.forEach((childOption: ChildOptionItem) => {
                if (childOption.schema.id === (component as ChildComponentConfig).id) {
                    childSchema = childOption.schema;
                }
            });
        }

        this.props.onUpdateActiveSection(
            "",
            `${this.getDataLocation(component, index)}`,
            childSchema
        );
    }

    /**
     * Click handler for deleting a component
     */
    private onDeleteComponent(index?: number): void {
        this.props.onChange(
            this.props.dataLocation,
            undefined,
            typeof index === "number",
            index,
            true
        );
    }

    /**
     * Click event for adding a component
     */
    private onAddComponent(item: ChildOptionItem): void {
        const currentChildren: ChildComponent[] = this.getCurrentChildren(
            this.props.data
        );

        if (typeof item === "object" && item !== null) {
            this.props.onChange(
                this.props.dataLocation,
                this.getChildComponents(currentChildren, item),
                undefined,
                undefined,
                true
            );
        } else if (typeof item === "string") {
            this.props.onChange(
                this.props.dataLocation,
                this.getChildStrings(currentChildren, item),
                undefined,
                undefined,
                true
            );
        }

        this.setState({
            hideChildrenList: true,
            childrenSearchTerm: "",
        });
    }

    /**
     * Click factory for adding a child item
     */
    private clickAddComponentFactory = (
        component: ChildOptionItem
    ): ((e: React.MouseEvent<HTMLLIElement>) => void) => {
        return (e: React.MouseEvent<HTMLLIElement>): void => {
            this.onAddComponent(component);
        };
    };

    /**
     * Click factory for editing a child item
     */
    private clickEditComponentFactory = (
        component: ChildComponent,
        index?: number
    ): ((e: React.MouseEvent<HTMLAnchorElement>) => void) => {
        return (e: React.MouseEvent<HTMLAnchorElement>): void => {
            e.preventDefault();

            this.onEditComponent(component, index);
        };
    };

    /**
     * Click factory for removing a child item
     */
    private clickDeleteComponentFactory = (
        index?: number
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            this.onDeleteComponent(index);
        };
    };

    /**
     * Updates the filtered child options to select the next child
     */
    private selectNextFilteredChildOption(): void {
        if (this.state.filteredChildOptions.length > 1) {
            if (
                this.state.indexOfSelectedFilteredChildOption ===
                this.state.filteredChildOptions.length - 1
            ) {
                this.setState({
                    indexOfSelectedFilteredChildOption: 0,
                });

                this.filteredChildrenList.current.scrollTop = 0;
            } else {
                this.setState({
                    indexOfSelectedFilteredChildOption:
                        this.state.indexOfSelectedFilteredChildOption + 1,
                });

                this.filteredChildrenList.current.scrollTop = (this.selectedChildOption
                    .current.nextSibling as HTMLLIElement).offsetTop;
            }
        }
    }

    /**
     * Updates the filtered child options to select the previous child
     */
    private selectPreviousFilteredChildOption(): void {
        if (this.state.filteredChildOptions.length > 1) {
            if (this.state.indexOfSelectedFilteredChildOption === 0) {
                this.setState({
                    indexOfSelectedFilteredChildOption:
                        this.state.filteredChildOptions.length - 1,
                });

                this.filteredChildrenList.current.scrollTop = this.filteredChildrenList.current.scrollHeight;
            } else {
                this.setState({
                    indexOfSelectedFilteredChildOption:
                        this.state.indexOfSelectedFilteredChildOption - 1,
                });

                this.filteredChildrenList.current.scrollTop = (this.selectedChildOption
                    .current.previousSibling as HTMLLIElement).offsetTop;
            }
        }
    }

    private isTargetingChildrenList(e: MouseEvent): boolean {
        return (
            e.target instanceof Element &&
            get(this.filteredChildrenList, "current") &&
            get(this.filteredChildrenListTrigger, "current") &&
            !this.filteredChildrenList.current.contains(e.target) &&
            !this.filteredChildrenListTrigger.current.contains(e.target) &&
            this.filteredChildrenListTrigger.current !== e.target
        );
    }

    private getLabelId(): string {
        return `${this.props.dataLocation}-label`;
    }

    private getFilteredChildrenInputId(): string {
        return `${this.props.dataLocation}-input`;
    }

    private getChildComponents(
        currentChildren: ChildComponent[],
        item: ChildOptionItem
    ): ChildComponent[] {
        const components: ChildComponent[] = currentChildren;
        components.push(this.getChildComponent(item));

        return components;
    }

    private getChildStrings(
        currentChildren: ChildComponent[],
        item: string
    ): ChildComponent[] | ChildComponent {
        const components: ChildComponent[] = currentChildren;

        if (components.length > 0) {
            components.push(item);
        }

        return components.length > 0 ? components : item;
    }

    private getCurrentChildren(currentChildren: ChildComponent): ChildComponent[] {
        return Array.isArray(currentChildren)
            ? currentChildren
            : typeof currentChildren !== "undefined" && currentChildren !== null
                ? [currentChildren]
                : [];
    }

    private getChildComponent(item: ChildOptionItem): ChildComponentConfig {
        return {
            id: item.schema.id,
            props: generateExampleData(item.schema, ""),
        };
    }

    private getDataLocation(component: ChildComponent, index: number): string {
        const propLocation: string = typeof component === "string" ? "" : ".props";

        if (typeof index === "number") {
            return `${this.props.dataLocation}[${index}]${propLocation}`;
        }

        return `${this.props.dataLocation}${propLocation}`;
    }

    private getChildOptionTextString(item: any): string {
        const textString: string = typeof item.props === "string" ? item.props : item;

        return textString ? textString : "Untitled";
    }
}

export default manageJss(styles)(FormItemChildren);
