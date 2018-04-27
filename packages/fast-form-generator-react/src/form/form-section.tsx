import * as React from "react";
import { get, uniqueId } from "lodash-es";
import {
    IAssignedCategoryParams,
    IFormCategories,
    IFormItemParameters,
    IFormItemsWithConfigOptions,
    IFormSectionProps,
    IFormSectionState,
    IOneOfAnyOf,
    oneOfAnyOfType
} from "./form-section.props";
import IFormItemCommon, { mappingName } from "./form-item";
import FormItemCheckbox from "./form-item.checkbox";
import FormItemTextarea from "./form-item.textarea";
import FormItemTextField from "./form-item.text-field";
import FormItemNumberField from "./form-item.number-field";
import FormItemSelect from "./form-item.select";
import FormItemChildren from "./form-item.children";
import FormItemArray from "./form-item.array";
import FormItemMapping from "./form-item.mapping";
import { isRootLocation } from "./form.utilities";
import {
    IFormOrderByPropertyNamesCategories,
    IFormOrderByPropertyNamesProperties,
    ITextareaAttributeSettingsMappingToPropertyNames
} from "./form.props";
import {
    formItemAttributeMapping,
    formItemMapping,
    getArraySchemaLocation,
    getIsNotRequired,
    getIsRequired,
    getOneOfAnyOfActiveIndex,
    getOneOfAnyOfSelectOptions,
    getOptionalToggles,
    getSchemaSubsections,
    IOptionalToggle,
    resolveExampleDataWithCachedData
} from "./form-section.utilities";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormSection extends React.Component<IFormSectionProps, IFormSectionState> {

    constructor(props: IFormSectionProps) {
        super(props);

        let oneOfAnyOf: oneOfAnyOfType;
        let oneOfAnyOfState: IOneOfAnyOf;
        let activeIndex: number;
        let schemaState: any = this.props.schema;

        if (this.props.schema.oneOf || this.props.schema.anyOf) {
            oneOfAnyOf = this.props.schema.oneOf ? oneOfAnyOfType.oneOf : oneOfAnyOfType.anyOf;
            activeIndex = getOneOfAnyOfActiveIndex(oneOfAnyOf, this.props.schema, this.props.data);
            schemaState = this.props.schema[oneOfAnyOf][
                activeIndex
            ];
            oneOfAnyOfState = {
                type: oneOfAnyOf,
                activeIndex
            };
        }

        this.state = {
            schema: schemaState,
            oneOfAnyOf: oneOfAnyOfState,
            sections: getSchemaSubsections({schema: schemaState, oneOfAnyOf: oneOfAnyOfState}, this.props)
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.renderFormSection()}
                {this.generateChildrenElement()}
            </div>
        );
    }

    /**
     * React lifecycle hook
     */
    public componentWillUpdate(nextProps: IFormSectionProps, nextState: IFormSectionState): void {
        const state: any = {};

        if (this.checkIsDifferentSchema(this.props.schema, nextProps.schema)) {
            if (this.checkHasOneOfAnyOf(nextProps.schema.oneOf, nextProps.schema.anyOf)) {
                state.oneOfAnyOf = this.getOneOfAnyOfState(state.oneOfAnyOf, nextProps);
                state.schema = nextProps.schema[state.oneOfAnyOf.type][state.oneOfAnyOf.activeIndex];
            } else {
                state.oneOfAnyOf = void(0);
                state.schema = nextProps.schema;
            }

            state.sections = getSchemaSubsections(state, nextProps);

            this.setState(state);
        } else if (this.checkIsDifferentData(this.props.data, nextProps.data)) {
            state.sections = getSchemaSubsections(nextState, nextProps);

            this.setState(state);
        }
    }

    private getOneOfAnyOfState(oneOfAnyOf: IOneOfAnyOf, nextProps: IFormSectionProps): IOneOfAnyOf {
        const oneOfAnyOfState: Partial<IOneOfAnyOf> = oneOfAnyOf || {};

        oneOfAnyOfState.type = nextProps.schema.oneOf ? oneOfAnyOfType.oneOf : oneOfAnyOfType.anyOf;
        oneOfAnyOfState.activeIndex = getOneOfAnyOfActiveIndex(
            oneOfAnyOfState.type,
            nextProps.schema,
            nextProps.data
        );

        return oneOfAnyOfState as IOneOfAnyOf;
    }

    private checkHasOneOfAnyOf(oneOf: any, anyOf: any): boolean {
        return oneOf || anyOf;
    }

    private checkIsDifferentData(currentData: any, nextData: any): boolean {
        return currentData !== nextData;
    }

    private checkIsDifferentSchema(currentSchema: any, nextSchema: any): boolean {
        return nextSchema !== currentSchema;
    }

    /**
     * Handles updating the schema to another active oneOf/anyOf schema
     */
    private handleAnyOfOneOfClick = (event: any): void => {
        const updatedData: any = resolveExampleDataWithCachedData(
            this.props.schema[this.state.oneOfAnyOf.type][event.target.value],
            this.props.dataCache
        );

        this.props.onChange(this.props.dataLocation, updatedData);

        this.setState({
            schema: this.props.schema[this.state.oneOfAnyOf.type][event.target.value],
            sections: this.state.schema.properties
                ? getSchemaSubsections(this.state, this.props)
                : [],
            oneOfAnyOf: {
                type: this.state.oneOfAnyOf.type,
                activeIndex: event.target.value
            }
        });
    }

    /**
     * Handles updating to another active section
     */
    private handleUpdateSection(schemaLocation: string, dataLocation: string): void {
        this.props.onUpdateActiveSection(schemaLocation, dataLocation, this.props.schema);
    }

    /**
     * Handles the onClick of the section link, changes from controlled to uncontrolled if location is passed
     */
    private handleSectionLinkClick = (schemaLocation: string, dataLocation: string): any => {
        return this.props.location && this.props.location.onChange
            ? this.props.location.onChange(schemaLocation, dataLocation)
            : this.handleUpdateSection(schemaLocation, dataLocation);
    }

    private getDataLocation(location: string): string {
        return isRootLocation(this.props.dataLocation) || isRootLocation(location)
            ? `${this.props.dataLocation}${location}`
            : `${this.props.dataLocation}.${location}`;
    }

    private getData(location: string): any {
        return isRootLocation(location) ? this.props.data : get(this.props.data, location);
    }

    private getLabel(label: string): string {
        return label === "" && this.state.schema.title !== void(0) ? this.state.schema.title : label;
    }

    private generateFormItemTextarea(location: string, formItemProps: IFormItemCommon): JSX.Element {
        if (this.props.attributeSettingsMappingToPropertyNames && this.props.attributeSettingsMappingToPropertyNames.textarea) {
            const rowAttribute: number | null = formItemAttributeMapping(
                (this.props.attributeSettingsMappingToPropertyNames.textarea as ITextareaAttributeSettingsMappingToPropertyNames),
                location
            );
            return <FormItemTextarea rows={rowAttribute} {...formItemProps} />;
        }

        return <FormItemTextarea {...formItemProps} />;
    }

    private isMapping(location: string): boolean {
        return this.props.componentMappingToPropertyNames &&
        typeof formItemMapping(this.props.componentMappingToPropertyNames, location) === "string";
    }

    private isSelect(property: any): boolean {
        return typeof property.enum !== "undefined" && property.enum.length > 0;
    }

    private renderFormItemSelect(property: any, required: boolean, formItemProps: any): JSX.Element {
        const options: any[] = property.enum;

        if (!required && typeof options[0] !== "undefined") {
            options.unshift(void(0));
        }

        return <FormItemSelect options={options} {...formItemProps} />;
    }

    /**
     * Generates form elements based on field type
     */
    private generateFormElement(property: any, index: number, location: string, required: boolean, label: string): JSX.Element | any {
        const dataLocation: string = this.getDataLocation(location);
        const formItemProps: IFormItemCommon = {
            key: location + index,
            default: property.default || void(0),
            index,
            dataLocation,
            data: this.getData(location),
            required,
            label: this.getLabel(label),
            onChange: this.props.onChange
        };

        if (this.isMapping(location)) {
            const name: mappingName = formItemMapping(this.props.componentMappingToPropertyNames, location);

            return (
                <FormItemMapping
                    name={name}
                    options={property.enum}
                    {...formItemProps}
                />
            );
        }

        if (this.isSelect(property)) {
            return this.renderFormItemSelect(property, required, formItemProps);
        }

        return this.renderFormItem(property, formItemProps, location);
    }

    /**
     * Renders one of the standard form item corrensponding to a simple
     * JSON schema type
     */
    private renderFormItem(property: any, formItemProps: IFormItemCommon, location: string): JSX.Element | JSX.Element[] {
        switch (property.type) {
            case "boolean":
                return <FormItemCheckbox {...formItemProps} />;
            case "number":
                return (
                    <FormItemNumberField
                        min={property.minimum}
                        max={property.maximum}
                        step={property.multipleOf}
                        {...formItemProps}
                    />
                );
            case "string":
                return this.generateFormItemTextarea(location, formItemProps);
            case "array":
                const arraySchemaLocation: string = getArraySchemaLocation(
                    this.props.schemaLocation,
                    location,
                    this.props.schema,
                    this.state.oneOfAnyOf
                );

                return (
                    <FormItemArray
                        schema={this.props.schema}
                        schemaLocation={arraySchemaLocation}
                        untitled={this.props.untitled}
                        onUpdateActiveSection={this.props.onUpdateActiveSection}
                        onChange={this.props.onChange}
                        location={this.props.location}
                        {...formItemProps}
                    />
                );
            default:
                // check to see if this is a root level object
                // if so, use it to generate the form
                return this.generateFormObject(
                    property,
                    location,
                    property.required || undefined,
                    property.not ? property.not.required : undefined
                );
        }
    }

    /**
     * Generates categories to place items into
     */
    private generateFormItemCategories(categoryItems: JSX.Element[], title: string): JSX.Element {
        // Exit if the array is only one item long and that item is null or undefined
        if (categoryItems.length < 1 && categoryItems[0] === null ||
            categoryItems.length < 1 && categoryItems[0] === undefined) {
            return;
        }

        return (
            <div key={title}>
                <h3>{title}</h3>
                {categoryItems}
            </div>
        );
    }

    /**
     * Organizes the categories and items by weight
     */
    private getWeightedCategoriesAndItems(categoryParams: IFormCategories[]): IFormCategories[] {
        categoryParams.sort(function(a: any, b: any): number {
            return b.weight - a.weight;
        });

        for (const categoryParam of categoryParams) {
            categoryParam.items.sort(function(a: any, b: any): number {
                return b.weight - a.weight;
            });
        }

        return categoryParams;
    }

    private findOrderedByPropertyNames(
        category: IFormOrderByPropertyNamesCategories,
        formItemParameter: IFormItemParameters,
        assignedItemWeight: number
    ): IAssignedCategoryParams {
        for (const categoryProperty of category.properties) {
            const categoryProperties: string[] = Array.isArray(categoryProperty.propertyName)
                ? categoryProperty.propertyName
                : [categoryProperty.propertyName];

            const assignedParamsByCategoryProperties: IAssignedCategoryParams = this.findAssignedParamsByCategoryProperties(
                categoryProperties,
                formItemParameter,
                category,
                categoryProperty,
                assignedItemWeight
            );

            if (Boolean(assignedParamsByCategoryProperties)) {
                return assignedParamsByCategoryProperties;
            }
        }
    }

    private findAssignedParamsByCategoryProperties(
        categoryProperties: string[],
        formItemParameter: IFormItemParameters,
        category: IFormOrderByPropertyNamesCategories,
        categoryProperty: IFormOrderByPropertyNamesProperties,
        assignedItemWeight: number
    ): IAssignedCategoryParams {
        for (const propertyName of categoryProperties) {
            if (propertyName === formItemParameter.item) {
                return {
                    category: category.title,
                    categoryWeight: category.weight,
                    itemWeight: categoryProperty.weight || assignedItemWeight
                };
            }
        }
    }

    private getAssignedCategoryParams(
        formItemParameter: IFormItemParameters,
        assignedItemWeight: number
    ): IAssignedCategoryParams {
        for (const category of this.props.orderByPropertyNames.categories) {
            const formItemOrderedByPropertyNames: IAssignedCategoryParams = this.findOrderedByPropertyNames(
                category,
                formItemParameter,
                assignedItemWeight
            );

            if (Boolean(formItemOrderedByPropertyNames)) {
                return formItemOrderedByPropertyNames;
            }
        }

        return {
            category: "Default",
            categoryWeight: this.props.orderByPropertyNames.defaultCategoryWeight || 0,
            itemWeight: 0
        };
    }

    private getCategoryIndex(assignedCategoryParams: IAssignedCategoryParams, categoryParams: IFormCategories[]): number {
        for (let i: number = 0, categoryParamsLength: number = categoryParams.length; i < categoryParamsLength; i++) {
            if (assignedCategoryParams.category === categoryParams[i].title) {
                return i;
            }
        }
    }

    private getCategoryParams(formItemParameters: IFormItemParameters[]): IFormCategories[] {
        const categoryParams: IFormCategories[] = [];

        for (const formItemParameter of formItemParameters) {
            const assignedCategoryParams: IAssignedCategoryParams = this.getAssignedCategoryParams(formItemParameter, 0);
            const categoryIndex: number = this.getCategoryIndex(assignedCategoryParams, categoryParams);

            if (typeof categoryIndex === "number") {
                categoryParams[categoryIndex].items.push({
                    weight: assignedCategoryParams.itemWeight,
                    params: formItemParameter
                });
            } else {
                categoryParams.push({
                    title: assignedCategoryParams.category,
                    weight: assignedCategoryParams.categoryWeight,
                    items: [{
                        weight: assignedCategoryParams.itemWeight,
                        params: formItemParameter
                    }]
                });
            }
        }

        return this.getWeightedCategoriesAndItems(categoryParams);
    }

    /**
     * Gets the categories
     */
    private getCategories(formItemParameters: IFormItemParameters[]): JSX.Element[] {
        const categories: JSX.Element[] = [];
        const categoryParams: IFormCategories[] = this.getCategoryParams(formItemParameters);

        for (const category of categoryParams) {
            const categoryFormItems: JSX.Element[] = [];

            for (const item of category.items) {
                categoryFormItems.push(
                    this.generateFormElement(
                        item.params.property,
                        item.params.index,
                        item.params.item,
                        item.params.isRequired,
                        item.params.title
                    )
                );
            }

            categories.push(
                this.generateFormItemCategories(categoryFormItems, category.title)
            );
        }

        return categories;
    }

    private checkIsObject(property: any): boolean {
        return property.properties && property === this.state.schema;
    }

    private getFormItemsAndConfigurationOptions(property: any, required: string[], not: string[]): IFormItemsWithConfigOptions {
        const formItems: IFormItemsWithConfigOptions = {
            items: [],
            parameters: []
        };

        Object.keys(property.properties).forEach((item: any, index: number) => {
            const isRequired: boolean = getIsRequired(item, required);
            const isNotRequired: boolean = getIsNotRequired(item, not);

            if (!isNotRequired) {
                const params: any = {
                    property: property.properties[item],
                    index,
                    item,
                    isRequired,
                    title: property.properties[item].title || this.props.untitled
                };

                formItems.items.push(
                    this.generateFormElement(params.property, params.index, params.item, params.isRequired, params.title)
                );

                if (params.property.type !== "object" && typeof params.property.properties === "undefined") {
                    formItems.parameters.push(params);
                }
            }
        });

        return formItems;
    }

    private checkCategoryConfigPropertyCount(formItems: IFormItemsWithConfigOptions): boolean {
        return typeof this.props.orderByPropertyNames.showCategoriesAtPropertyCount === "number"
            && this.props.orderByPropertyNames.showCategoriesAtPropertyCount >= formItems.items.length;
    }

    private getFormObjectItemsOrConfigCategories(formItems: IFormItemsWithConfigOptions): JSX.Element[] {
        if (this.props.orderByPropertyNames) {
            if (this.checkCategoryConfigPropertyCount(formItems)) {
                return formItems.items;
            }

            return this.getCategories(formItems.parameters);
        }

        return formItems.items;
    }

    /**
     * Pushes a list of elements found inside an object to an array
     */
    private generateFormObject(property: any, location: string, required: string[], not?: string[]): JSX.Element[] {
        let formItems: IFormItemsWithConfigOptions;

        if (this.checkIsObject(property)) {
            // assign items to form elements
            formItems = this.getFormItemsAndConfigurationOptions(property, required, not);

            return this.getFormObjectItemsOrConfigCategories(formItems);
        }
    }

    /**
     * Generates a select if the root level has a oneOf or anyOf
     */
    private generateAnyOfOneOfSelect(): JSX.Element {
        if (
            typeof this.state.oneOfAnyOf !== "undefined"
            && this.props.schema[this.state.oneOfAnyOf.type]
        ) {
            const id: string = uniqueId();
            const options: JSX.Element[] = getOneOfAnyOfSelectOptions(this.props.schema, this.state);

            return (
                <React.Fragment>
                    <label htmlFor={id}>Configuration</label>
                    <select
                        id={id}
                        onChange={this.handleAnyOfOneOfClick}
                        value={this.state.oneOfAnyOf.activeIndex || 0}
                    >
                        {options}
                    </select>
                    <hr role="presentation" />
                </React.Fragment>
            );
        }

        return null;
    }

    /**
     * Generates toggles for each optional complex item
     * which includes objects, anyOf/oneOf
     */
    private generateOptionToggles(): JSX.Element[] {
        const optionToggles: IOptionalToggle[] = getOptionalToggles({
            schema: this.state.schema,
            onChange: this.props.onChange,
            dataLocation: this.props.dataLocation,
            data: this.props.data,
            dataCache: this.props.dataCache
        });

        return optionToggles.map((property: any, index: number): JSX.Element => {
            return (
                <div key={index}>
                    <label htmlFor={property.id}>
                        {property.label || this.props.untitled}
                        <button
                            role="switch"
                            aria-pressed={property.selected}
                            onClick={this.handleToggleClick(property.selected, property.id, property.updateRequested)}
                        >
                            {property.selected ? property.selectedString : property.unselectedString}
                        </button>
                    </label>
                    <input
                        id={property.id}
                        type="hidden"
                        aria-hidden="true"
                        value={property.selected ? property.selectedString : property.unselectedString}
                    />
                </div>
            );
        });
    }

    private handleToggleClick(value: any, id: string, updateRequested: any): any {
        return (e: React.MouseEvent<MouseEvent>): void => {
            e.preventDefault();

            updateRequested(value, id);
        };
    }

    /**
     * Generates the links to a new section to be activated
     */
    private generateSectionLinks(): JSX.Element {
        const sections: any[] = [];

        this.state.sections.map((property: any, index: number) => {
            if (typeof property.active !== "undefined" || property.required) {
                sections.push(
                    <li key={uniqueId()}>
                        <a
                            onClick={this.handleSectionLinkClick.bind(this, property.schemaLocation, property.dataLocation)}
                        >
                            {property.text}
                        </a>
                    </li>
                );
            }
        });

        if (sections.length < 1) {
            return;
        }

        return (
            <div>
                <h3>Sections</h3>
                <ul>
                    {sections}
                </ul>
            </div>
        );
    }

    /**
     * Generates the children form element if the section can have children
     */
    private generateChildrenElement(): JSX.Element {
        if (this.props.schema.children) {
            return (
                <FormItemChildren
                    untitled={this.props.untitled}
                    dataLocation={this.props.dataLocation}
                    data={this.props.data}
                    onChange={this.props.onChange}
                    childOptions={this.props.childOptions}
                    onUpdateActiveSection={this.props.onUpdateActiveSection}
                />
            );
        }

        return null;
    }

    private renderFormSection(): JSX.Element {
        return (
            <div>
                <div>
                    {this.generateAnyOfOneOfSelect()}
                    {this.generateFormElement(this.state.schema, 0, "", true, "")}
                </div>
                {this.generateOptionToggles()}
                {this.generateSectionLinks()}
            </div>
        );
    }
}

export default FormSection;
