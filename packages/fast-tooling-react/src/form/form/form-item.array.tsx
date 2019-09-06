import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { ContextComponent, DragDropContext } from "react-dnd";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { get, uniqueId } from "lodash-es";
import { generateExampleData, getArrayLinks, isRootLocation } from "../utilities";
import styles from "./form-item.array.style";
import DragItem from "./form-item.drag-item";
import FormItemBase from "./form-item.base";
import {
    ArrayAction,
    FormItemArrayClassNameContract,
    FormItemArrayProps,
    FormItemArrayState,
    ItemConstraints,
} from "./form-item.array.props";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemArray extends FormItemBase<
    FormItemArrayProps & ManagedClasses<FormItemArrayClassNameContract>,
    FormItemArrayState
> {
    public static displayName: string = "FormItemArray";

    constructor(props: FormItemArrayProps) {
        super(props);

        this.state = {
            data: props.data,
            isDragging: false,
        };
    }

    public render(): React.ReactNode {
        return (
            <div className={this.props.managedClasses.formItemArray}>
                {this.renderLabel()}
                {this.renderAddArrayItem()}
                {this.renderExistingArrayItems()}
            </div>
        );
    }

    private renderLabel(): React.ReactNode {
        const label: string =
            get(this.props.schema, "title") ||
            get(this.props.schema, "description") ||
            this.props.untitled;

        return (
            <div className={this.props.managedClasses.formItemArray_control}>
                <div
                    className={get(
                        this.props,
                        "managedClasses.formItemArray_controlRegion"
                    )}
                >
                    <div
                        className={get(
                            this.props,
                            "managedClasses.formItemArray_controlLabelRegion"
                        )}
                    >
                        <label className={this.getLabelClassNames()}>{label}</label>
                        {this.renderDefaultValueIndicator(
                            get(
                                this.props,
                                "managedClasses.formItemArray_defaultValueIndicator"
                            )
                        )}
                        {this.renderBadge(
                            get(this.props, "managedClasses.formItemArray_badge")
                        )}
                    </div>
                    <div
                        className={get(
                            this.props,
                            "managedClasses.formItemArray_softRemove"
                        )}
                    >
                        {this.renderSoftRemove(
                            get(
                                this.props,
                                "managedClasses.formItemArray_softRemoveInput"
                            )
                        )}
                    </div>
                </div>
                {this.renderInvalidMessage(
                    get(this.props, "managedClasses.formItemArray_invalidMessage")
                )}
            </div>
        );
    }

    /**
     * Render a button for adding an item to the array
     */
    private renderAddArrayItemTrigger(): React.ReactNode {
        return (
            <button
                className={get(this.props, "managedClasses.formItemArray_addItemButton")}
                aria-label={"Select to add item"}
                onClick={this.arrayItemClickHandlerFactory(ArrayAction.add)}
            />
        );
    }

    /**
     * Render an add array item section
     */
    private renderAddArrayItem(): React.ReactNode {
        const maxItemLength: number = get(
            this.props.schema,
            ItemConstraints.maxItems,
            Infinity
        );
        const existingItemLength: number = Array.isArray(this.props.data)
            ? this.props.data.length
            : 0;

        if (maxItemLength > existingItemLength) {
            return (
                <div className={get(this.props, "managedClasses.formItemArray_addItem")}>
                    <div
                        className={get(
                            this.props,
                            "managedClasses.formItemArray_addItemLabel"
                        )}
                    >
                        Add item
                    </div>
                    {this.renderAddArrayItemTrigger()}
                </div>
            );
        }
    }

    /**
     * Renders an default array link item
     */
    private renderDefaultArrayLinkItem = (value: any, index: number): React.ReactNode => {
        return (
            <li
                className={this.props.managedClasses.formItemArray_existingItemListItem}
                key={`item-${index}`}
                id={uniqueId(index.toString())}
            >
                <span className={this.getArrayItemClassNames(true)}>{value}</span>
            </li>
        );
    };

    /**
     * Renders default array items
     */
    private renderDefaultArrayLinkItems(): React.ReactNode {
        return getArrayLinks(this.props.default).map(
            (value: any, index: number): React.ReactNode => {
                return this.renderDefaultArrayLinkItem(value, index);
            }
        );
    }

    /**
     * Renders the links to an array section to be activated
     */
    private renderExistingArrayItems(): React.ReactNode {
        const hasData: boolean = Array.isArray(this.props.data);
        const hasDefault: boolean = Array.isArray(this.props.default);

        if (hasData) {
            return (
                <ul className={this.props.managedClasses.formItemArray_existingItemList}>
                    {this.renderArrayLinkItems()}
                </ul>
            );
        }

        if (hasDefault) {
            return (
                <ul className={this.props.managedClasses.formItemArray_existingItemList}>
                    {this.renderDefaultArrayLinkItems()}
                </ul>
            );
        }
    }

    /**
     * Render UI for all items in an array
     */
    private renderArrayLinkItems(): React.ReactNode {
        const data: unknown[] = this.state.isDragging ? this.state.data : this.props.data;
        const {
            formItemArray_existingItemRemoveButton,
            formItemArray_existingItemListItem,
            formItemArray_existingItemListItemLink,
        }: Partial<FormItemArrayClassNameContract> = this.props.managedClasses;

        return getArrayLinks(data).map(
            (text: string, index: number): React.ReactNode => {
                return (
                    <DragItem
                        key={index}
                        index={index}
                        minItems={get(this.props.schema, ItemConstraints.minItems)}
                        itemLength={getArrayLinks(data).length}
                        itemRemoveClassName={formItemArray_existingItemRemoveButton}
                        itemClassName={formItemArray_existingItemListItem}
                        itemLinkClassName={formItemArray_existingItemListItemLink}
                        removeDragItem={this.arrayItemClickHandlerFactory}
                        onClick={this.arrayClickHandlerFactory}
                        moveDragItem={this.handleMoveDragItem}
                        dropDragItem={this.handleDropDragItem}
                        dragStart={this.handleDragStart}
                        dragEnd={this.handleDragEnd}
                    >
                        {text}
                    </DragItem>
                );
            }
        );
    }

    private getArrayItemClassNames(isDefault?: boolean): string {
        let classes: string = get(
            this.props,
            "managedClasses.formItemArray_existingItemListItemLink"
        );

        if (isDefault) {
            classes = `${classes} ${get(
                this.props,
                "managedClasses.formItemArray_existingItemListItemLink__default"
            )}`;
        }

        return classes;
    }

    private getLabelClassNames(): string {
        let classes: string = get(
            this.props,
            "managedClasses.formItemArray_controlLabel"
        );

        if (this.props.invalidMessage !== "") {
            classes += ` ${get(
                this.props,
                "managedClasses.formItemArray_controlLabel__invalid"
            )}`;
        }

        return classes;
    }

    /**
     * Array add/remove item click handler factory
     */
    private arrayItemClickHandlerFactory = (
        type: ArrayAction,
        index?: number
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            type === ArrayAction.add
                ? this.handleAddArrayItem(this.props.dataLocation)
                : this.handleRemoveArrayItem(this.props.dataLocation, index);
        };
    };

    /**
     * Array section link click handler factory
     */
    private arrayClickHandlerFactory = (
        index: number
    ): ((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
            e.preventDefault();

            const schemaLocation: string = isRootLocation(this.props.schemaLocation)
                ? "items"
                : `${this.props.schemaLocation}.items`;

            this.props.onUpdateActiveSection(
                schemaLocation,
                `${this.props.dataLocation}[${index}]`,
                this.props.schema
            );
        };
    };

    /**
     * Handles adding an array item
     */
    private handleAddArrayItem(dataLocation: string): void {
        if (typeof this.props.data === "undefined") {
            this.props.onChange(dataLocation, [
                generateExampleData(this.props.schema, "items"),
            ]);
        } else {
            this.props.onChange(
                dataLocation,
                generateExampleData(this.props.schema, "items"),
                true
            );
        }
    }

    /**
     * Handles removing an array item
     */
    private handleRemoveArrayItem(dataLocation: string, index: number): void {
        this.props.onChange(dataLocation, void 0, true, index);
    }

    /**
     * Handle the start of the drag action
     */
    private handleDragStart = (): void => {
        this.setState({
            isDragging: true,
            data: [].concat(this.props.data || []),
        });
    };

    /**
     * Handle the end of the drag action
     */
    private handleDragEnd = (): void => {
        this.setState({
            isDragging: false,
        });
    };

    /**
     * Handle moving the drag item
     */
    private handleMoveDragItem = (sourceIndex: number, targetIndex: number): void => {
        const currentData: unknown[] = [].concat(this.props.data);

        if (sourceIndex !== targetIndex) {
            currentData.splice(targetIndex, 0, currentData.splice(sourceIndex, 1)[0]);
        }

        this.setState({
            data: currentData,
        });
    };

    /**
     * Handle dropping the drag item
     * Triggers the onChange
     */
    private handleDropDragItem = (): void => {
        this.props.onChange(this.props.dataLocation, this.state.data);
    };
}

const TestFormItemArray: typeof FormItemArray & ContextComponent<any> = DragDropContext(
    HTML5Backend
)(FormItemArray);

export { TestFormItemArray };
export default DragDropContext(HTML5Backend)(manageJss(styles)(FormItemArray));
