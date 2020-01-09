import {
    checkIsDifferentSchema,
    checkIsObject,
    generateExampleData,
    getData,
    getErrorFromDataLocation,
    getInitialOneOfAnyOfState,
    getIsNotRequired,
    getIsRequired,
    getLabel,
    getOneOfAnyOfSelectOptions,
    PropertyKeyword,
} from "./utilities";
import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormCategory from "./form-category";
import styles from "./form-section.style";
import { get, omit } from "lodash-es";
import {
    FormCategoryConfig,
    FormControlItem,
    FormControlParameters,
    FormControlsWithConfigOptions,
    FormSectionClassNameContract,
    FormSectionProps,
    FormSectionState,
    InitialOneOfAnyOfState,
} from "./form-section.props";
import FormSectionValidation from "./form-section-validation";
import FormControlSwitch from "./form-control-switch";
import FormOneOfAnyOf from "./form-one-of-any-of";
import FormDictionary from "./form-dictionary";
import { classNames } from "@microsoft/fast-web-utilities";
import { ErrorObject } from "ajv";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormSection extends React.Component<
    FormSectionProps & ManagedClasses<FormSectionClassNameContract>,
    FormSectionState
> {
    public static displayName: string = "FormSection";

    public static defaultProps: Partial<
        FormSectionProps & ManagedClasses<FormSectionClassNameContract>
    > = {
        managedClasses: {},
    };

    public static getDerivedStateFromProps(
        props: FormSectionProps,
        state: FormSectionState
    ): Partial<FormSectionState> {
        if (props.schema !== state.schema) {
            return getInitialOneOfAnyOfState(props.schema, props.data);
        }

        return null;
    }

    constructor(props: FormSectionProps & ManagedClasses<FormSectionClassNameContract>) {
        super(props);

        this.state = getInitialOneOfAnyOfState(this.props.schema, this.props.data);
    }

    public render(): React.ReactNode {
        const invalidMessage: string = getErrorFromDataLocation(
            this.props.dataLocation,
            this.props.validationErrors
        );
        const isDisabled: boolean = this.isDisabled();

        return (
            <fieldset
                className={classNames(this.props.managedClasses.formSection, [
                    this.props.managedClasses.formSection__disabled,
                    isDisabled,
                ])}
                disabled={isDisabled}
            >
                {this.renderFormValidation(invalidMessage)}
                {this.renderFormSection(invalidMessage)}
            </fieldset>
        );
    }

    /**
     * React lifecycle hook
     */
    public componentDidUpdate(prevProps: FormSectionProps): void {
        if (checkIsDifferentSchema(prevProps.schema, this.props.schema)) {
            const initialOneOfAnyOfState: InitialOneOfAnyOfState = getInitialOneOfAnyOfState(
                this.props.schema,
                this.props.data
            );

            this.setState(initialOneOfAnyOfState);
        }
    }

    /**
     * Handles updating the schema to another active oneOf/anyOf schema
     */
    private handleAnyOfOneOfClick = (activeIndex: number): void => {
        const updatedSchema: any = Object.assign(
            omit(this.props.schema, [this.state.oneOfAnyOf.type]),
            this.props.schema[this.state.oneOfAnyOf.type][activeIndex]
        );
        const updatedData: any = generateExampleData(updatedSchema, "");

        this.props.onChange({
            dataLocation: this.props.dataLocation,
            value: updatedData,
        });

        this.setState({
            schema: updatedSchema,
            oneOfAnyOf: {
                type: this.state.oneOfAnyOf.type,
                activeIndex,
            },
        });
    };

    /**
     * Renders the form
     */
    private renderRootObject(schema: any): React.ReactNode {
        return this.generateFormObject(
            schema,
            schema.required || undefined,
            schema.not ? schema.not.required : undefined
        );
    }

    /**
     * Generates form elements based on field type
     */
    private renderFormControl = (
        schema: any,
        propertyName: string,
        schemaLocation: string,
        dataLocation: string,
        required: boolean,
        disabled: boolean,
        label: string,
        invalidMessage: string | null
    ): React.ReactNode => {
        // if this is a root level object use it to generate the form and do not generate a link
        if (schema.type === "object" && propertyName === "") {
            return this.renderRootObject(schema);
        }

        return (
            <FormControlSwitch
                key={[this.props.dataLocation, propertyName].join(".")}
                controls={this.props.controls}
                controlPlugins={this.props.controlPlugins}
                untitled={this.props.untitled}
                required={required}
                disabled={disabled}
                default={get(this.props.default, propertyName)}
                label={getLabel(label, this.state.schema.title)}
                data={getData(propertyName, this.props.data)}
                dataLocation={dataLocation}
                schemaLocation={schemaLocation}
                childOptions={this.props.childOptions}
                propertyName={propertyName}
                schema={schema}
                onChange={this.props.onChange}
                onUpdateSection={this.props.onUpdateSection}
                invalidMessage={invalidMessage}
                validationErrors={this.props.validationErrors}
                displayValidationBrowserDefault={
                    this.props.displayValidationBrowserDefault
                }
                displayValidationInline={this.props.displayValidationInline}
            />
        );
    };

    /**
     * Renders form items into categories
     */
    private renderCategories(
        categories: FormCategoryConfig[] = [],
        controls: FormControlsWithConfigOptions
    ): React.ReactNode {
        return this.getAllCategories(categories).map(
            (category: FormCategoryConfig, index: number): React.ReactNode => {
                if (category.title === null) {
                    return controls.items
                        .concat([
                            {
                                propertyName: void 0,
                                render: this.renderAdditionalProperties(),
                            },
                        ])
                        .map(
                            (
                                controlItem: FormControlItem,
                                itemIndex: number
                            ): React.ReactNode => {
                                if (
                                    category.items.includes(controlItem.propertyName) ||
                                    controlItem.propertyName === undefined
                                ) {
                                    return (
                                        <React.Fragment key={itemIndex}>
                                            {controlItem.render}
                                        </React.Fragment>
                                    );
                                }
                            }
                        );
                }

                return (
                    <FormCategory
                        key={index}
                        expandable={category.expandable}
                        title={category.title}
                    >
                        {this.getCategoryItems(controls, category)}
                    </FormCategory>
                );
            }
        );
    }

    private getCategoryItems(
        controls: FormControlsWithConfigOptions,
        category: FormCategoryConfig
    ): React.ReactNode {
        return controls.items.map(
            (controlItem: FormControlItem): React.ReactNode => {
                if (category.items.includes(controlItem.propertyName)) {
                    return controlItem.render;
                }
            }
        );
    }

    private getAllCategories(categories: FormCategoryConfig[]): FormCategoryConfig[] {
        // All categorized properties
        const categorized: string[] = categories.reduce<string[]>(
            (accumulator: string[], category: FormCategoryConfig): string[] => {
                return accumulator.concat(category.items);
            },
            []
        );
        // All uncategorized properties
        const uncategorized: string[] = Object.keys(
            get(this.state.schema, PropertyKeyword.reactProperties, {})
        )
            .concat(Object.keys(get(this.state.schema, PropertyKeyword.properties, {})))
            .filter((category: string) => {
                return categorized.indexOf(category) < 0;
            });
        // All categorized and uncategorized properties
        return [
            {
                title: null,
                items: uncategorized,
            },
        ].concat(categories);
    }

    private getFormControlsAndConfigurationOptions(
        schema: any,
        required: string[],
        not: string[]
    ): FormControlsWithConfigOptions {
        const formControls: FormControlsWithConfigOptions = {
            items: [],
        };

        const propertyKeys: string[] = [];

        if (schema.properties) {
            propertyKeys.push("properties");
        }

        if (schema.reactProperties) {
            propertyKeys.push("reactProperties");
        }

        propertyKeys.forEach(
            (propertyKey: string): void => {
                Object.keys(schema[propertyKey]).forEach(
                    (propertyName: string, index: number) => {
                        const isRequired: boolean = getIsRequired(propertyName, required);
                        const isNotRequired: boolean = getIsNotRequired(
                            propertyName,
                            not
                        );
                        const schemaLocation: string =
                            this.getSchemaLocation() === ""
                                ? [propertyKey, propertyName].join(".")
                                : [
                                      this.getSchemaLocation(),
                                      propertyKey,
                                      propertyName,
                                  ].join(".");
                        const dataLocation: string =
                            this.props.dataLocation !== ""
                                ? [this.props.dataLocation, propertyName].join(".")
                                : propertyName;

                        if (!isNotRequired) {
                            const params: FormControlParameters = {
                                index,
                                schemaLocation,
                                dataLocation,
                                propertyName,
                                schema: schema[propertyKey][propertyName],
                                isRequired,
                                isDisabled: this.isDisabled(),
                                title:
                                    schema[propertyKey][propertyName].title ||
                                    this.props.untitled,
                                invalidMessage: getErrorFromDataLocation(
                                    dataLocation,
                                    this.props.validationErrors
                                ),
                            };

                            formControls.items.push({
                                propertyName: params.propertyName,
                                render: this.renderFormControl(
                                    params.schema,
                                    params.propertyName,
                                    params.schemaLocation,
                                    params.dataLocation,
                                    params.isRequired,
                                    params.isDisabled,
                                    params.title,
                                    params.invalidMessage
                                ),
                            });
                        }
                    }
                );
            }
        );

        return formControls;
    }

    /**
     * Pushes a list of elements found inside an object to an array
     */
    private generateFormObject(
        schema: any,
        required: string[],
        not?: string[]
    ): React.ReactNode {
        let formControls: FormControlsWithConfigOptions;

        if (checkIsObject(schema, this.state.schema)) {
            // assign items to form elements
            formControls = this.getFormControlsAndConfigurationOptions(
                schema,
                required,
                not
            );

            return this.renderCategories(
                get(schema, "formConfig.categories"),
                formControls
            );
        }
    }

    /**
     * Renders a select if the root level has a oneOf or anyOf
     */
    private renderAnyOfOneOfSelect(): React.ReactNode {
        if (
            typeof this.state.oneOfAnyOf !== "undefined" &&
            this.props.schema[this.state.oneOfAnyOf.type]
        ) {
            const unselectedOption: React.ReactNode = (
                <option value={-1}>{"Select an option"}</option>
            );
            const options: React.ReactNode = getOneOfAnyOfSelectOptions(
                this.props.schema,
                this.state
            );

            return (
                <FormOneOfAnyOf
                    label={get(this.props, "schema.title", "Configuration")}
                    activeIndex={this.state.oneOfAnyOf.activeIndex}
                    onUpdate={this.handleAnyOfOneOfClick}
                >
                    {unselectedOption}
                    {options}
                </FormOneOfAnyOf>
            );
        }

        return null;
    }

    /**
     * Renders additional properties if they have been declared
     */
    private renderAdditionalProperties(): React.ReactNode {
        const schemaLocation: string = this.getSchemaLocation();
        const schema: any = get(this.state.schema, schemaLocation, this.state.schema);

        if (
            typeof schema.additionalProperties === "object" ||
            schema.additionalProperties === false
        ) {
            return (
                <FormDictionary
                    index={0}
                    controls={this.props.controls}
                    controlPlugins={this.props.controlPlugins}
                    formControlId={this.state.schema.formControlId}
                    dataLocation={this.props.dataLocation}
                    schemaLocation={schemaLocation}
                    examples={get(schema, "examples")}
                    propertyLabel={get(schema, `propertyTitle`, "Property key")}
                    additionalProperties={schema.additionalProperties}
                    enumeratedProperties={this.getEnumeratedProperties(schema)}
                    data={this.props.data}
                    schema={schema}
                    required={schema.required}
                    label={schema.title || this.props.untitled}
                    childOptions={this.props.childOptions}
                    onChange={this.props.onChange}
                    onUpdateSection={this.props.onUpdateSection}
                    validationErrors={this.props.validationErrors}
                    displayValidationBrowserDefault={
                        this.props.displayValidationBrowserDefault
                    }
                    displayValidationInline={this.props.displayValidationInline}
                />
            );
        }

        return null;
    }

    private renderFormValidation(invalidMessage: string): React.ReactNode {
        if (invalidMessage !== "") {
            return (
                <FormSectionValidation
                    invalidMessage={invalidMessage}
                    validationErrors={this.getValidationErrorsForSectionValidation()}
                    dataLocation={this.props.dataLocation}
                />
            );
        }
    }

    private renderFormSection(invalidMessage: string): React.ReactNode {
        return (
            <div>
                <div>
                    {this.renderAnyOfOneOfSelect()}
                    {this.renderFormControl(
                        this.state.schema,
                        "",
                        this.getSchemaLocation(),
                        this.props.dataLocation,
                        true,
                        this.props.disabled || this.state.schema.disabled,
                        "",
                        invalidMessage
                    )}
                </div>
            </div>
        );
    }

    /**
     * Gets the validation errors for the top level section,
     * these should only be passed if they are arrays with 2 or more items
     */
    private getValidationErrorsForSectionValidation(): ErrorObject[] {
        if (
            Array.isArray(this.props.validationErrors) &&
            this.props.validationErrors.length > 1
        ) {
            return this.props.validationErrors;
        }

        return [];
    }

    /**
     * Get all enumerated properties for the object
     */
    private getEnumeratedProperties(schema: any): string[] {
        return Object.keys(schema.properties || {}).concat(
            Object.keys(schema.reactProperties || {})
        );
    }

    private getSchemaLocation(): string {
        if (this.state.oneOfAnyOf) {
            const separator: string = this.props.schemaLocation === "" ? "" : ".";
            return `${this.props.schemaLocation}${separator}${
                this.state.oneOfAnyOf.type
            }[${this.state.oneOfAnyOf.activeIndex}]`;
        } else {
            return this.props.schemaLocation;
        }
    }

    private isDisabled(): boolean {
        return this.props.disabled || this.state.schema.disabled;
    }
}

export { FormSection };
export default manageJss(styles)(FormSection);
