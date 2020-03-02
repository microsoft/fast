import { uniqueId } from "lodash-es";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import React from "react";
import { getArrayLinks, isRootLocation } from "../utilities";
import styles, { ArrayControlClassNameContract } from "./control.array.style";
import { ArrayControlProps, ArrayControlState } from "./control.array.props";
import { DragItem } from "../templates";
import { ArrayAction } from "../templates/types";
import { classNames } from "@microsoft/fast-web-utilities";
import { ErrorObject } from "ajv";

/**
 * Form control definition
 */
class ArrayControl extends React.Component<
    ArrayControlProps & ManagedClasses<ArrayControlClassNameContract>,
    ArrayControlState
> {
    public static displayName: string = "ArrayControl";

    public static defaultProps: Partial<
        ArrayControlProps & ManagedClasses<ArrayControlClassNameContract>
    > = {
        managedClasses: {},
    };

    constructor(props: ArrayControlProps) {
        super(props);

        this.state = {
            data: props.value,
            isDragging: false,
        };
    }

    public render(): React.ReactNode {
        return (
            <div
                className={classNames(
                    this.props.managedClasses.arrayControl,
                    [
                        this.props.managedClasses.arrayControl__disabled,
                        this.props.disabled,
                    ],
                    [
                        this.props.managedClasses.arrayControl__invalid,
                        this.props.invalidMessage !== "" &&
                            !!this.props.displayValidationInline,
                    ]
                )}
            >
                {this.renderAddArrayItem()}
                {this.renderExistingArrayItems()}
            </div>
        );
    }

    /**
     * Render a button for adding an item to the array
     */
    private renderAddArrayItemTrigger(): React.ReactNode {
        return (
            <button
                className={this.props.managedClasses.arrayControl_addItemButton}
                aria-label={"Select to add item"}
                onClick={this.arrayItemClickHandlerFactory(ArrayAction.add)}
            />
        );
    }

    /**
     * Render an add array item section
     */
    private renderAddArrayItem(): React.ReactNode {
        const existingItemLength: number = Array.isArray(this.props.value)
            ? this.props.value.length
            : 0;
        const {
            arrayControl_addItem,
            arrayControl_addItemLabel,
        }: ArrayControlClassNameContract = this.props.managedClasses;

        if (this.props.maxItems > existingItemLength) {
            return (
                <div className={arrayControl_addItem}>
                    <div className={arrayControl_addItemLabel}>Add item</div>
                    {this.renderAddArrayItemTrigger()}
                </div>
            );
        }
    }

    /**
     * Renders an default array link item
     */
    private renderDefaultArrayLinkItem = (value: any, index: number): React.ReactNode => {
        const {
            arrayControl_existingItemListItem,
            arrayControl_existingItemListItemLink,
            arrayControl_existingItemListItemLink__default,
        }: ArrayControlClassNameContract = this.props.managedClasses;

        return (
            <li
                className={arrayControl_existingItemListItem}
                key={`item-${index}`}
                id={uniqueId(index.toString())}
            >
                <span
                    className={classNames(
                        arrayControl_existingItemListItemLink,
                        arrayControl_existingItemListItemLink__default
                    )}
                >
                    {value}
                </span>
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
        const hasData: boolean = Array.isArray(this.props.value);
        const hasDefault: boolean = Array.isArray(this.props.default);

        if (hasData) {
            return (
                <ul className={this.props.managedClasses.arrayControl_existingItemList}>
                    {this.renderArrayLinkItems()}
                </ul>
            );
        }

        if (hasDefault) {
            return (
                <ul className={this.props.managedClasses.arrayControl_existingItemList}>
                    {this.renderDefaultArrayLinkItems()}
                </ul>
            );
        }
    }

    /**
     * Render UI for all items in an array
     */
    private renderArrayLinkItems(): React.ReactNode {
        const data: unknown[] = this.state.isDragging
            ? this.state.data
            : this.props.value;
        const {
            arrayControl_existingItemRemoveButton,
            arrayControl_existingItemListItem,
            arrayControl_existingItemListItem__invalid,
            arrayControl_existingItemListItemLink,
        }: Partial<ArrayControlClassNameContract> = this.props.managedClasses;

        return getArrayLinks(data).map(
            (text: string, index: number): React.ReactNode => {
                const invalidError: React.ReactNode = this.renderValidationError(index);

                return (
                    <React.Fragment key={this.props.dataLocation + index}>
                        <DragItem
                            key={index}
                            index={index}
                            minItems={this.props.minItems}
                            itemLength={getArrayLinks(data).length}
                            itemRemoveClassName={arrayControl_existingItemRemoveButton}
                            itemClassName={classNames(arrayControl_existingItemListItem, [
                                arrayControl_existingItemListItem__invalid,
                                invalidError !== null,
                            ])}
                            itemLinkClassName={arrayControl_existingItemListItemLink}
                            removeDragItem={this.arrayItemClickHandlerFactory}
                            onClick={this.arrayClickHandlerFactory}
                            moveDragItem={this.handleMoveDragItem}
                            dropDragItem={this.handleDropDragItem}
                            dragStart={this.handleDragStart}
                            dragEnd={this.handleDragEnd}
                        >
                            {text}
                        </DragItem>
                        {!!this.props.displayValidationInline ? invalidError : null}
                    </React.Fragment>
                );
            }
        );
    }

    private renderValidationError(index: number): React.ReactNode {
        if (typeof this.props.validationErrors === "undefined") {
            return null;
        }

        for (const error of this.props.validationErrors) {
            if (error.dataPath.startsWith(`.${this.props.dataLocation}[${index}]`)) {
                return (
                    <div
                        className={this.props.managedClasses.arrayControl_invalidMessage}
                    >
                        {error.message}
                    </div>
                );
            }
        }

        return null;
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
                ? this.handleAddArrayItem()
                : this.handleRemoveArrayItem(index);
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

            this.props.onUpdateSection(
                this.props.dictionaryId,
                this.props.navigation[this.props.navigationConfigId].items[index]
            );
        };
    };

    /**
     * Handles adding an array item
     */
    private handleAddArrayItem(): void {
        if (typeof this.props.value === "undefined") {
            this.props.onChange({ value: [this.props.onAddExampleData("items")] });
        } else {
            this.props.onChange({
                value: this.props.onAddExampleData("items"),
                isArray: true,
            });
        }
    }

    /**
     * Handles removing an array item
     */
    private handleRemoveArrayItem(index: number): void {
        this.props.onChange({ value: void 0, isArray: true, index });
    }

    /**
     * Handle the start of the drag action
     */
    private handleDragStart = (): void => {
        this.setState({
            isDragging: true,
            data: [].concat(this.props.value || []),
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
        const currentData: unknown[] = [].concat(this.props.value);

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
        this.props.onChange({ value: this.state.data });
    };
}

export { ArrayControl };
export default manageJss(styles)(ArrayControl);
