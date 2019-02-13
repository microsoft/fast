import * as React from "react";
import { get, uniqueId } from "lodash-es";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";
import { SortableConfig, SortableListItem, sortingProps } from "./sorting";
import FormItemCommon from "./form-item";
import { updateActiveSection } from "./form-section.props";
import { generateExampleData } from "./form-section.utilities";
import { FormLocation } from "./form.props";
import { isRootLocation } from "./form.utilities";
import { getArrayLinks } from "./form-item.array.utilities";
import styles from "./form-item.array.style";
import { FormItemArrayClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormItemBase from "./form-item.base";

export enum ItemConstraints {
    minItems = "minItems",
    maxItems = "maxItems",
}

export enum ArrayAction {
    add = "add",
    remove = "remove",
}

export interface FormItemArrayProps extends FormItemCommon {
    /**
     * The schema
     */
    schema: any;

    /**
     * The location of the schema
     */
    schemaLocation: string;

    /**
     * The location of the data
     */
    dataLocation: string;

    /**
     * The string to use for an untitled schema
     */
    untitled: string;

    /**
     * The callback to update a different active section and/or component
     */
    onUpdateActiveSection: updateActiveSection;

    /**
     * The location passed
     */
    location?: FormLocation;
}

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
                <label className={this.props.managedClasses.formItemArray_controlLabel}>
                    {label}
                </label>
                {this.renderAddArrayItemTrigger()}
            </div>
        );
    }

    /**
     * Render a button for adding an item to the array
     */
    private renderAddArrayItemTrigger(): React.ReactNode {
        const maxItems: number =
            this.props.schemaLocation === ""
                ? get(this.props, "schema.maxItems", Infinity)
                : get(
                      this.props,
                      `schema.${this.props.schemaLocation}.maxItems`,
                      Infinity
                  );
        const items: number = Array.isArray(this.props.data) ? this.props.data.length : 0;

        if (maxItems > items) {
            return (
                <button
                    className={this.props.managedClasses.formItemArray_controlAddButton}
                    aria-label={"Select to add item"}
                    onClick={this.arrayItemClickHandlerFactory(
                        this.props.dataLocation,
                        ArrayAction.add
                    )}
                />
            );
        }
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

            if (this.props.location && this.props.location.onChange) {
                this.props.location.onChange(`${this.props.dataLocation}[${index}]`);
            } else {
                this.props.onUpdateActiveSection(
                    schemaLocation,
                    `${this.props.dataLocation}[${index}]`,
                    this.props.schema
                );
            }
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
                    className={
                        this.props.managedClasses.formItemArray_existingItemListItemLink
                    }
                    onClick={this.arrayClickHandlerFactory(value, index)}
                >
                    {value}
                </a>
                {this.renderDeleteArrayItemTrigger(index)}
            </SortableListItem>
        );
    };

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
        const arraySections: string[] = getArrayLinks(this.props.data);
        const props: any = Object.assign({}, sortingProps, {
            onSortEnd: this.handleSort,
            helperClass: this.props.managedClasses
                .formItemArray_existingItemListItem__sorting,
        });

        if (arraySections.length > 0) {
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
    }
}

export { FormItemArray };
export default manageJss(styles)(FormItemArray);
