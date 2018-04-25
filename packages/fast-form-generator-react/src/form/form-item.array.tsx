import * as React from "react";
import { get } from "lodash-es";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";
import { ISortableOptions, SortableListItem, sortingProps } from "./sorting";
import IFormItemCommon from "./form-item";
import { updateActiveSection } from "./form-section.props";
import { generateExampleData } from "./form-section.utilities";
import { IFormLocation } from "./form.props";
import { isRootLocation } from "./form.utilities";
import { getArrayLinks } from "./form-item.array.utilities";

export enum ArrayAction {
    add = "add",
    remove = "remove"
}

export interface IArrayMenuItem {
    type?: ArrayAction;
    text: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface IFormItemArrayProps extends IFormItemCommon {
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
    location?: IFormLocation;
}

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemArray extends React.Component<IFormItemArrayProps, {}> {

    public render(): JSX.Element {
        return (
            <div>
                <div>
                    <label>{this.getLabelText()}</label>
                    <button>Open menu</button>
                    <ul>
                        {this.renderArrayMenuItems()}
                    </ul>
                </div>
                {this.generateArrayLinks()}
            </div>
        );
    }

    /**
     * Array add/remove item click handler factory
     */
    private arrayItemClickHandlerFactory(
        dataLocation: string,
        schema: any,
        type: string,
        index?: number
    ): (e: React.MouseEvent<HTMLElement>) => void {
        return (e: React.MouseEvent<HTMLElement>): void => {
            e.preventDefault();

            type === ArrayAction.add ? this.handleAddArrayItem(dataLocation, schema) : this.handleRemoveArrayItem(dataLocation, index);
        };
    }

    /**
     * Array section link click handler factory
     */
    private arrayClickHandlerFactory = (item: any, index: number): (e: React.MouseEvent<HTMLButtonElement>) => void => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            const oneOfAnyOfRegex: RegExp = /(oneOf|anyOf)\[\d+\]/;
            const schemaLocation: string = isRootLocation(this.props.schemaLocation) ? "items" : `${this.props.schemaLocation}.items`;
            let coercedSchemaLocation: string = this.props.schemaLocation;

            if (this.props.schemaLocation.replace(oneOfAnyOfRegex, "") === "") {
                coercedSchemaLocation = this.props.schemaLocation.replace(oneOfAnyOfRegex, "");
            }

            if (this.props.location && this.props.location.onChange) {
                this.props.location.onChange(
                    this.props.location.schemaLocation === ""
                        ? `${coercedSchemaLocation}.items`
                        : `${this.props.location.schemaLocation}.${coercedSchemaLocation}.items`,
                    `${this.props.dataLocation}[${index}]`
                );
            } else {
                this.props.onUpdateActiveSection(
                    coercedSchemaLocation,
                    `${this.props.dataLocation}[${index}]`,
                    get(this.props.schema, schemaLocation)
                );
            }
        };
    }

    /**
     * Handles adding an array item
     */
    private handleAddArrayItem(dataLocation: string, schema: any): void {
        if (typeof this.props.data === "undefined") {
            this.props.onChange(
                dataLocation,
                [generateExampleData(this.props.schema, `${this.props.schemaLocation}.items`)]
            );
        } else {
            this.props.onChange(
                dataLocation,
                generateExampleData(this.props.schema, `${this.props.schemaLocation}.items`),
                true
            );
        }
    }

    /**
     * Handles removing an array item
     */
    private handleRemoveArrayItem(dataLocation: string, index: number): void {
        this.props.onChange(dataLocation, void(0), true, index);
    }

    /**
     * Generates UI representing an item of an array
     */
    private generateArrayLinkItem = (value: any, index: number): JSX.Element => {
        return (
            <SortableListItem key={`item-${index}`} id={index.toString()}>
                <button onClick={this.arrayClickHandlerFactory(value, index)}>
                    {value}
                </button>
            </SortableListItem>
         );
    }

    /**
     * Generates UI for all items in an array
     */
    private generateArrayLinkItems(): JSX.Element[] {
        return getArrayLinks(this.props.data).map((value: any, index: number): JSX.Element => {
            const options: ISortableOptions = {
                key: `item-${index}`,
                index,
                value
            };

            return React.createElement(SortableElement(this.generateArrayLinkItem.bind(this, value, index)), options);
        });
    }

    /**
     * Handle user drag and drop interactions
     */
    private handleSort = ({oldIndex, newIndex}: any): void => {
        this.props.onChange(this.props.dataLocation, arrayMove(this.props.data, oldIndex, newIndex));
    }

    /**
     * Generates the links to an array section to be activated
     */
    private generateArrayLinks(): JSX.Element {
        const arraySections: string[] = getArrayLinks(this.props.data);
        const props: any = Object.assign({}, sortingProps, {
            onSortEnd: this.handleSort
        });

        if (arraySections.length > 0) {
            return React.createElement(SortableContainer(() => {
                return (
                    <ul>
                        {this.generateArrayLinkItems()}
                    </ul>
                );
            }), props);
        }
    }

    private getLabelText(): string | null {
        const schema: any = this.props.schemaLocation !== "" ? get(this.props.schema, this.props.schemaLocation) : this.props.schema;

        return schema ? schema.title || schema.description || this.props.untitled : null;
    }

    private getArrayLength(): number {
        return Array.isArray(this.props.data) ? this.props.data.length : 0;
    }

    private getSubschema(): any  {
        return this.props.schemaLocation !== "" ? get(this.props.schema, this.props.schemaLocation) : this.props.schema;
    }

    private getArrayMenuItem(action: ArrayAction, text: string, index?: number): IArrayMenuItem {
        return {
            type: action,
            text,
            onClick: this.arrayItemClickHandlerFactory(
                this.props.dataLocation, this.props.schema, action, index
            )
        };
    }

    private hasLessThanMaxItems(schema: any, arrayLength: number): boolean {
        const maxItems: boolean = Boolean(schema) && Boolean(schema.maxItems);
        return schema && ((maxItems && arrayLength < schema.maxItems) || !maxItems);
    }

    private hasMoreThanMinItems(schema: any, arrayLength: number): boolean {
        const minItems: boolean = Boolean(schema) && Boolean(schema.minItems);
        return schema && ((minItems && arrayLength > schema.minItems) || !minItems);
    }

    private renderArrayMenuItems(): JSX.Element[] {
        const arrayLength: number = this.getArrayLength();
        const schema: any = this.getSubschema();
        const lessThanMaxItems: boolean = this.hasLessThanMaxItems(schema, arrayLength);
        const moreThanMinItems: boolean = this.hasMoreThanMinItems(schema, arrayLength);
        const items: IArrayMenuItem[] = [];

        // if we have maxItems and the data is less than max items, allow adding items
        if (lessThanMaxItems) {
            items.push(this.getArrayMenuItem(ArrayAction.add, "Add item"));
        }

         // if we have minItems and the data is more than min items, allow removal of the items
        if (moreThanMinItems) {
            for (let index: number = 0; index < arrayLength; index++) {
                items.push(this.getArrayMenuItem(ArrayAction.remove, this.props.data[index].text || `Item ${index + 1}`, index));
            }
        }

        // we have nothing to add or delete
        if (items.length === 0) {
            items.push({text: "No actions available"});
        }

        return items.map((item: any, index: number) => {
            return (
                <li key={index}>
                    <button
                        onClick={item.onClick}
                    >
                        {item.type === ArrayAction.remove ? "-" : "+"} {item.text}
                    </button>
                </li>
            );
        });
    }
}

export default FormItemArray;
