import React from "react";
import { get, uniqueId } from "lodash-es";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { SortableConfig, SortableListItem, sortingProps } from "./sorting";
import { generateExampleData, getArrayLinks, isRootLocation } from "../utilities";
import styles from "./form-item.array.style";
import FormItemBase from "./form-item.base";
import {
    ArrayAction,
    FormItemArrayClassNameContract,
    FormItemArrayProps,
} from "./form-item.array.props";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemArray extends FormItemBase<
    FormItemArrayProps & ManagedClasses<FormItemArrayClassNameContract>,
    {}
> {
    public static displayName: string = "FormItemArray";

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
                onClick={this.arrayItemClickHandlerFactory(
                    this.props.dataLocation,
                    ArrayAction.add
                )}
            />
        );
    }

    /**
     * Render a button for removing an item from the array
     */
    private renderDeleteArrayItemTrigger(index: number): React.ReactNode {
        const minItems: number = get(this.props, "schema.minItems", 0);

        if (
            !Array.isArray(this.props.data) ||
            (Array.isArray(this.props.data) && minItems < this.props.data.length)
        ) {
            return (
                <button
                    className={
                        this.props.managedClasses.formItemArray_existingItemRemoveButton
                    }
                    aria-label={"Select to remove item"}
                    onClick={this.arrayItemClickHandlerFactory(
                        this.props.dataLocation,
                        ArrayAction.remove,
                        index
                    )}
                />
            );
        }
    }

    /**
     * Render an add array item section
     */
    private renderAddArrayItem(): React.ReactNode {
        const maxItemLength: number = get(this.props, `schema.maxItems`, Infinity);
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
     * Array add/remove item click handler factory
     */
    private arrayItemClickHandlerFactory(
        dataLocation: string,
        type: ArrayAction,
        index?: number
    ): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            type === ArrayAction.add
                ? this.handleAddArrayItem(dataLocation)
                : this.handleRemoveArrayItem(dataLocation, index);
        };
    }

    /**
     * Array section link click handler factory
     */
    private arrayClickHandlerFactory = (
        item: any,
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
     * Generates UI representing an item of an array
     */
    private generateArrayLinkItem = (value: any, index: number): React.ReactNode => {
        return (
            <SortableListItem
                className={this.props.managedClasses.formItemArray_existingItemListItem}
                key={`item-${index}`}
                id={uniqueId(index.toString())}
            >
                <a
                    className={this.getArrayItemClassNames()}
                    onClick={this.arrayClickHandlerFactory(value, index)}
                >
                    {value}
                </a>
                {this.renderDeleteArrayItemTrigger(index)}
            </SortableListItem>
        );
    };

    private generateDefaultArrayLinkItem = (
        value: any,
        index: number
    ): React.ReactNode => {
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
     * Generates UI for all items in an array
     */
    private generateArrayLinkItems(): React.ReactNode {
        return getArrayLinks(this.props.data).map(
            (value: any, index: number): React.ReactNode => {
                const options: SortableConfig = {
                    key: `item-${index}`,
                    index,
                    value,
                };

                return React.createElement(
                    SortableElement(this.generateArrayLinkItem.bind(this, value, index)),
                    options
                );
            }
        );
    }

    private generateDefaultArrayLinkItems(): React.ReactNode {
        return getArrayLinks(this.props.default).map(
            (value: any, index: number): React.ReactNode => {
                return this.generateDefaultArrayLinkItem(value, index);
            }
        );
    }

    /**
     * Handle user drag and drop interactions
     */
    private handleSort = ({ oldIndex, newIndex }: any): void => {
        this.props.onChange(
            this.props.dataLocation,
            arrayMove(this.props.data, oldIndex, newIndex)
        );
    };

    /**
     * Generates the links to an array section to be activated
     */
    private renderExistingArrayItems(): React.ReactNode {
        const hasData: boolean = Array.isArray(this.props.data);
        const hasDefault: boolean = Array.isArray(this.props.default);

        if (hasData) {
            const props: any = Object.assign({}, sortingProps, {
                onSortEnd: this.handleSort,
                helperClass: this.props.managedClasses
                    .formItemArray_existingItemListItem__sorting,
            });

            return React.createElement(
                SortableContainer(() => {
                    return (
                        <ul
                            className={
                                this.props.managedClasses.formItemArray_existingItemList
                            }
                        >
                            {this.generateArrayLinkItems()}
                        </ul>
                    );
                }),
                props
            );
        }

        if (hasDefault) {
            return (
                <ul className={this.props.managedClasses.formItemArray_existingItemList}>
                    {this.generateDefaultArrayLinkItems()}
                </ul>
            );
        }
    }
}

export { FormItemArray };
export default manageJss(styles)(FormItemArray);
