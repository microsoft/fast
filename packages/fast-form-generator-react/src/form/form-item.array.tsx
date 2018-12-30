import * as React from "react";
import { get, uniqueId } from "lodash-es";
import { canUseDOM } from "exenv-es6";
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
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.formItemArray}>
                {this.renderLabel()}
                {this.renderExistingArrayItems()}
            </div>
        );
    }

    private renderLabel(): React.ReactNode {
        const schema: any =
            this.props.schemaLocation !== ""
                ? get(this.props.schema, this.props.schemaLocation)
                : this.props.schema;
        const label: string = schema
            ? schema.title || schema.description || this.props.untitled
            : null;

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
                        this.props.schema,
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
        const minItems: number =
            this.props.schemaLocation === ""
                ? get(this.props, "schema.minItems", 0)
                : get(this.props, `schema.${this.props.schemaLocation}.minItems`, 0);

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
                        this.props.schema,
                        ArrayAction.remove,
                        index
                    )}
                />
            );
        }
    }

    private getLabelId(): string {
        return `${this.props.dataLocation}-label`;
    }

    /**
     * Array add/remove item click handler factory
     */
    private arrayItemClickHandlerFactory(
        dataLocation: string,
        schema: any,
        type: ArrayAction,
        index?: number
    ): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            type === ArrayAction.add
                ? this.handleAddArrayItem(dataLocation, schema)
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

            const oneOfAnyOfRegex: RegExp = /(oneOf|anyOf)\[\d+\]/;
            const schemaLocation: string = isRootLocation(this.props.schemaLocation)
                ? "items"
                : `${this.props.schemaLocation}.items`;
            let coercedSchemaLocation: string = this.props.schemaLocation;

            if (this.props.schemaLocation.replace(oneOfAnyOfRegex, "") === "") {
                coercedSchemaLocation = this.props.schemaLocation.replace(
                    oneOfAnyOfRegex,
                    ""
                );
            }

            if (this.props.location && this.props.location.onChange) {
                const itemsKeyword: string =
                    coercedSchemaLocation === "" ? "items" : ".items";

                this.props.location.onChange(
                    this.props.location.schemaLocation === ""
                        ? `${coercedSchemaLocation}${itemsKeyword}`
                        : `${
                              this.props.location.schemaLocation
                          }.${coercedSchemaLocation}${itemsKeyword}`,
                    `${this.props.dataLocation}[${index}]`
                );
            } else {
                this.props.onUpdateActiveSection(
                    schemaLocation,
                    `${this.props.dataLocation}[${index}]`,
                    get(this.props.schema, schemaLocation)
                );
            }
        };
    };

    /**
     * Handles adding an array item
     */
    private handleAddArrayItem(dataLocation: string, schema: any): void {
        const itemsKeyword: string =
            this.props.schemaLocation === "" ? "items" : ".items";

        if (typeof this.props.data === "undefined") {
            this.props.onChange(dataLocation, [
                generateExampleData(
                    this.props.schema,
                    `${this.props.schemaLocation}${itemsKeyword}`
                ),
            ]);
        } else {
            this.props.onChange(
                dataLocation,
                generateExampleData(
                    this.props.schema,
                    `${this.props.schemaLocation}${itemsKeyword}`
                ),
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
    private generateArrayLinkItem = (value: any, index: number): JSX.Element => {
        return (
            <SortableListItem
                className={this.props.managedClasses.formItemArray_existingItemListItem}
                key={`item-${index}`}
                id={uniqueId(index.toString())}
            >
                <a
                    className={
                        this.props.managedClasses.formItemArray_existingItemListItemAnchor
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
    private generateArrayLinkItems(): JSX.Element[] {
        return getArrayLinks(this.props.data).map(
            (value: any, index: number): JSX.Element => {
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
    private renderExistingArrayItems(): JSX.Element {
        const arraySections: string[] = getArrayLinks(this.props.data);
        const props: any = Object.assign({}, sortingProps, {
            onSortEnd: this.handleSort,
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
