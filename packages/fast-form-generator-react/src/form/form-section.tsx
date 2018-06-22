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
    checkCategoryConfigPropertyCount,
    checkHasOneOfAnyOf,
    checkIsDifferentData,
    checkIsDifferentSchema,
    checkIsObject,
    findAssignedParamsByCategoryProperties,
    findOrderedByPropertyNames,
    formItemAttributeMapping,
    formItemMapping,
    getArraySchemaLocation,
    getCategoryIndex,
    getCategoryParams,
    getData,
    getDataLocationRelativeToRoot,
    getIsNotRequired,
    getIsRequired,
    getLabel,
    getOneOfAnyOfActiveIndex,
    getOneOfAnyOfSelectOptions,
    getOneOfAnyOfState,
    getOptionalToggles,
    getSchemaSubsections,
    getWeightedCategoriesAndItems,
    handleToggleClick,
    IOptionalToggle,
    isMapping,
    isSelect,
    resolveExampleDataWithCachedData
} from "./form-section.utilities";
import styles from "./form-section.style";
import { IFormSectionClassNameContract } from "../class-name-contracts/";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormSection extends React.Component<IFormSectionProps & IManagedClasses<IFormSectionClassNameContract>, IFormSectionState> {

    constructor(props: IFormSectionProps & IManagedClasses<IFormSectionClassNameContract>) {
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

        if (checkIsDifferentSchema(this.props.schema, nextProps.schema)) {
            if (checkHasOneOfAnyOf(nextProps.schema.oneOf, nextProps.schema.anyOf)) {
                state.oneOfAnyOf = getOneOfAnyOfState(state.oneOfAnyOf, nextProps);
                state.schema = nextProps.schema[state.oneOfAnyOf.type][state.oneOfAnyOf.activeIndex];
            } else {
                state.oneOfAnyOf = void(0);
                state.schema = nextProps.schema;
            }

            state.sections = getSchemaSubsections(state, nextProps);

            this.setState(state);
        } else if (checkIsDifferentData(this.props.data, nextProps.data)) {
            state.sections = getSchemaSubsections(nextState, nextProps);

            this.setState(state);
        }
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
        const dataLocation: string = getDataLocationRelativeToRoot(location, this.props.dataLocation);
        const formItemProps: IFormItemCommon = {
            key: location + index,
            default: property.default || void(0),
            index,
            dataLocation,
            data: getData(location, this.props.data),
            required,
            label: getLabel(label, this.state.schema.title),
            onChange: this.props.onChange
        };

        if (isMapping(location, this.props.componentMappingToPropertyNames)) {
            const name: mappingName = formItemMapping(this.props.componentMappingToPropertyNames, location);

            return (
                <FormItemMapping
                    name={name}
                    options={property.enum}
                    {...formItemProps}
                />
            );
        }

        if (isSelect(property)) {
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
                <h3 className={this.props.managedClasses.formSection_header}>{title}</h3>
                {categoryItems}
            </div>
        );
    }

    /**
     * Gets the categories
     */
    private getCategories(formItemParameters: IFormItemParameters[]): JSX.Element[] {
        const categories: JSX.Element[] = [];
        const categoryParams: IFormCategories[] = getCategoryParams(formItemParameters, this.props.orderByPropertyNames);

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

    private getFormObjectItemsOrConfigCategories(formItems: IFormItemsWithConfigOptions): JSX.Element[] {
        if (this.props.orderByPropertyNames) {
            if (checkCategoryConfigPropertyCount(formItems, this.props.orderByPropertyNames)) {
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

        if (checkIsObject(property, this.state.schema)) {
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
                <div className={this.props.managedClasses.formSection_selectWrapper}>
                    <label htmlFor={id} className={this.props.managedClasses.formSection_selectLabel}>Configuration</label>
                    <span className={this.props.managedClasses.formSection_selectSpan}>
                        <select
                            className={this.props.managedClasses.formSection_selectInput}
                            id={id}
                            onChange={this.handleAnyOfOneOfClick}
                            value={this.state.oneOfAnyOf.activeIndex || 0}
                        >
                            {options}
                        </select>
                    </span>
                </div>
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
                <div className={this.props.managedClasses.formSection_toggleWrapper} key={index}>
                    <label htmlFor={property.id}>
                        {property.label || this.props.untitled}
                        <button
                            className={this.props.managedClasses.formSection_toggle}
                            role="switch"
                            aria-pressed={property.selected}
                            onClick={handleToggleClick(property.selected, property.id, property.updateRequested)}
                        >
                            <span />
                        </button>
                        <span>{property.selected ? property.selectedString : property.unselectedString}</span>
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

    /**
     * Generates the links to a new section to be activated
     */
    private generateSectionLinks(): JSX.Element {
        const sections: any[] = [];

        this.state.sections.map((property: any, index: number) => {
            if (typeof property.active !== "undefined" || property.required) {
                sections.push(
                    <li onClick={this.handleSectionLinkClick.bind(this, property.schemaLocation, property.dataLocation)} key={uniqueId()}>
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
            <div className={this.props.managedClasses.formSection}>
                <h3 className={this.props.managedClasses.formSection_header}>Sections</h3>
                <ul className={this.props.managedClasses.formSection_menu}>
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

export default manageJss(styles)(FormSection);
