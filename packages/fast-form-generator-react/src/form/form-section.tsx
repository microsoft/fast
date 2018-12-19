import FormItemChildren from "./form-item.children";
import * as React from "react";
import { ChildOptionItem } from "@microsoft/fast-data-utilities-react";
import {
    FormCategories,
    FormItemParameters,
    FormItemsWithConfigOptions,
    FormSectionProps,
    FormSectionState,
    OneOfAnyOf,
    oneOfAnyOfType,
} from "./form-section.props";
import FormItemCommon, { mappingName } from "./form-item";
import FormCategory from "./form-category";
import FormItemCheckbox from "./form-item.checkbox";
import FormItemSectionLink from "./form-item.section-link";
import FormItemTextarea from "./form-item.textarea";
import FormItemNumberField from "./form-item.number-field";
import FormItemSelect from "./form-item.select";
import { uniqueId } from "lodash-es";
import FormItemArray from "./form-item.array";
import FormItemMapping from "./form-item.mapping";
import { TextareaAttributeSettingsMappingToPropertyNames } from "./form.props";
import {
    checkCategoryConfigPropertyCount,
    checkHasOneOfAnyOf,
    checkIsDifferentData,
    checkIsDifferentSchema,
    checkIsObject,
    formItemAttributeMapping,
    formItemMapping,
    getArraySchemaLocation,
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
    handleToggleClick,
    isMapping,
    isSelect,
    OptionalToggle,
    resolveExampleDataWithCachedData,
} from "./form-section.utilities";
import styles from "./form-section.style";
import { FormSectionClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormSection extends React.Component<
    FormSectionProps & ManagedClasses<FormSectionClassNameContract>,
    FormSectionState
> {
    constructor(props: FormSectionProps & ManagedClasses<FormSectionClassNameContract>) {
        super(props);

        let oneOfAnyOf: oneOfAnyOfType;
        let oneOfAnyOfState: OneOfAnyOf;
        let activeIndex: number;
        let schemaState: any = this.props.schema;

        if (this.props.schema.oneOf || this.props.schema.anyOf) {
            oneOfAnyOf = this.props.schema.oneOf
                ? oneOfAnyOfType.oneOf
                : oneOfAnyOfType.anyOf;
            activeIndex = getOneOfAnyOfActiveIndex(
                oneOfAnyOf,
                this.props.schema,
                this.props.data
            );
            schemaState = this.props.schema[oneOfAnyOf][activeIndex];
            oneOfAnyOfState = {
                type: oneOfAnyOf,
                activeIndex,
            };
        }

        this.state = {
            schema: schemaState,
            oneOfAnyOf: oneOfAnyOfState,
            sections: getSchemaSubsections(
                { schema: schemaState, oneOfAnyOf: oneOfAnyOfState },
                this.props
            ),
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
    public componentWillUpdate(
        nextProps: FormSectionProps,
        nextState: FormSectionState
    ): void {
        const state: any = {};

        if (checkIsDifferentSchema(this.props.schema, nextProps.schema)) {
            if (checkHasOneOfAnyOf(nextProps.schema.oneOf, nextProps.schema.anyOf)) {
                state.oneOfAnyOf = getOneOfAnyOfState(state.oneOfAnyOf, nextProps);
                state.schema =
                    nextProps.schema[state.oneOfAnyOf.type][state.oneOfAnyOf.activeIndex];
            } else {
                state.oneOfAnyOf = void 0;
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
                activeIndex: event.target.value,
            },
        });
    };

    /**
     * Handles updating to another active section
     */
    private handleUpdateSection(schemaLocation: string, dataLocation: string): void {
        this.props.onUpdateActiveSection(schemaLocation, dataLocation, this.props.schema);
    }

    /**
     * Handles the onClick of the section link, changes from controlled to uncontrolled if location is passed
     */
    private handleSectionLinkClick = (
        schemaLocation: string,
        dataLocation: string
    ): any => {
        this.props.location && this.props.location.onChange
            ? this.props.location.onChange(schemaLocation, dataLocation)
            : this.handleUpdateSection(schemaLocation, dataLocation);
    };

    /**
     * Generates a section link for properties
     * that are objects
     */
    private generateFormItemSectionLink(
        location: string,
        property: any,
        formItemProps: FormItemCommon
    ): any {
        // check to see if this is a root level object
        // if so, use it to generate the form and do not generate a link
        if (location === "") {
            return this.generateFormObject(
                property,
                property.required || undefined,
                property.not ? property.not.required : undefined
            );
        }

        return (
            <FormItemSectionLink
                {...formItemProps}
                onUpdateSection={this.handleSectionLinkClick}
                schemaLocation={location}
            />
        );
    }

    /**
     * Generate a textarea
     */
    private generateFormItemTextarea(
        location: string,
        formItemProps: FormItemCommon
    ): JSX.Element {
        if (
            this.props.attributeSettingsMappingToPropertyNames &&
            this.props.attributeSettingsMappingToPropertyNames.textarea
        ) {
            const rowAttribute: number | null = formItemAttributeMapping(
                this.props.attributeSettingsMappingToPropertyNames
                    .textarea as TextareaAttributeSettingsMappingToPropertyNames,
                location
            );
            return <FormItemTextarea rows={rowAttribute} {...formItemProps} />;
        }

        return <FormItemTextarea {...formItemProps} />;
    }

    private renderFormItemSelect(
        property: any,
        required: boolean,
        formItemProps: any
    ): JSX.Element {
        const options: any[] = property.enum;

        if (!required && typeof options[0] !== "undefined") {
            options.unshift(void 0);
        }

        return <FormItemSelect options={options} {...formItemProps} />;
    }

    /**
     * Generates form elements based on field type
     */
    private generateFormElement(
        property: any,
        index: number,
        location: string,
        required: boolean,
        label: string
    ): JSX.Element | any {
        const dataLocation: string = getDataLocationRelativeToRoot(
            location,
            this.props.dataLocation
        );
        const formItemProps: FormItemCommon = {
            key: location + index,
            default: property.default || void 0,
            index,
            dataLocation,
            data: getData(location, this.props.data),
            required,
            label: getLabel(label, this.state.schema.title),
            onChange: this.props.onChange,
        };

        if (isMapping(location, this.props.componentMappingToPropertyNames)) {
            const name: mappingName = formItemMapping(
                this.props.componentMappingToPropertyNames,
                location
            );

            return (
                <FormItemMapping name={name} options={property.enum} {...formItemProps} />
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
    private renderFormItem(
        property: any,
        formItemProps: FormItemCommon,
        location: string
    ): JSX.Element | JSX.Element[] {
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
                return this.generateFormItemSectionLink(
                    location,
                    property,
                    formItemProps
                );
        }
    }

    /**
     * Gets the categories
     */
    private getCategories(formItemParameters: FormItemParameters[]): JSX.Element[] {
        const categories: JSX.Element[] = [];
        const categoryParams: FormCategories[] = getCategoryParams(
            formItemParameters,
            this.props.orderByPropertyNames
        );

        for (
            let i: number = 0, categoryParamLength: number = categoryParams.length;
            i < categoryParamLength;
            i++
        ) {
            const categoryFormItems: JSX.Element[] = [];
            const contentId: string = uniqueId(
                this.convertToHyphenated(categoryParams[i].title)
            );

            for (const item of categoryParams[i].items) {
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
                <FormCategory
                    id={contentId}
                    key={i}
                    expandable={categoryParams[i].expandable}
                    categoryItem={categoryFormItems}
                    title={categoryParams[i].title}
                />
            );
        }

        return categories;
    }

    private convertToHyphenated(name: string): string {
        return name.toLowerCase().replace(/\s/g, "-");
    }

    private getFormItemsAndConfigurationOptions(
        property: any,
        required: string[],
        not: string[]
    ): FormItemsWithConfigOptions {
        const formItems: FormItemsWithConfigOptions = {
            items: [],
            parameters: [],
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
                    title: property.properties[item].title || this.props.untitled,
                };

                formItems.items.push(
                    this.generateFormElement(
                        params.property,
                        params.index,
                        params.item,
                        params.isRequired,
                        params.title
                    )
                );

                if (
                    params.property.type !== "object" &&
                    typeof params.property.properties === "undefined"
                ) {
                    formItems.parameters.push(params);
                }
            }
        });

        return formItems;
    }

    private getFormObjectItemsOrConfigCategories(
        formItems: FormItemsWithConfigOptions
    ): JSX.Element[] {
        if (this.props.orderByPropertyNames) {
            if (
                checkCategoryConfigPropertyCount(
                    formItems,
                    this.props.orderByPropertyNames
                )
            ) {
                return formItems.items;
            }

            return this.getCategories(formItems.parameters);
        }

        return formItems.items;
    }

    /**
     * Pushes a list of elements found inside an object to an array
     */
    private generateFormObject(
        property: any,
        required: string[],
        not?: string[]
    ): JSX.Element[] {
        let formItems: FormItemsWithConfigOptions;

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
            typeof this.state.oneOfAnyOf !== "undefined" &&
            this.props.schema[this.state.oneOfAnyOf.type]
        ) {
            const id: string = uniqueId();
            const options: JSX.Element[] = getOneOfAnyOfSelectOptions(
                this.props.schema,
                this.state
            );

            return (
                <div className={this.props.managedClasses.formSection_selectWrapper}>
                    <label
                        htmlFor={id}
                        className={this.props.managedClasses.formSection_selectLabel}
                    >
                        Configuration
                    </label>
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
     * Generates the children form element if the section can have children
     */
    private generateChildrenElement(): JSX.Element[] {
        if (this.props.schema.reactProperties) {
            return Object.keys(this.props.schema.reactProperties)
                .filter(
                    (reactProperty: string) =>
                        this.props.schema.reactProperties[reactProperty].type ===
                        "children"
                )
                .map((reactProperty: string) => {
                    let childOptions: ChildOptionItem[] = [];

                    if (this.props.schema.reactProperties[reactProperty].ids) {
                        childOptions = this.props.childOptions.filter(
                            (childOption: ChildOptionItem) => {
                                return !!this.props.schema.reactProperties[
                                    reactProperty
                                ].ids.find((id: string) => childOption.schema.id === id);
                            }
                        );
                    } else {
                        childOptions = childOptions.concat(this.props.childOptions);
                    }

                    return (
                        <FormItemChildren
                            key={reactProperty}
                            title={
                                this.props.schema.reactProperties[reactProperty].title ||
                                this.props.untitled
                            }
                            dataLocation={`${
                                this.props.dataLocation === ""
                                    ? ""
                                    : `${this.props.dataLocation}.`
                            }${reactProperty}`}
                            data={
                                this.props.data[reactProperty]
                                    ? this.props.data[reactProperty]
                                    : null
                            }
                            schema={this.props.schema}
                            onChange={this.props.onChange}
                            defaultChildOptions={
                                this.props.schema.reactProperties[reactProperty]
                                    .defaults || null
                            }
                            childOptions={childOptions}
                            onUpdateActiveSection={this.props.onUpdateActiveSection}
                        />
                    );
                });
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
            </div>
        );
    }
}

export default manageJss(styles)(FormSection);
