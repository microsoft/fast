import React from "react";
import { get, omit } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormCategory from "./form-category";
import styles from "./form-section.style";
import {
    checkCategoryConfigPropertyCount,
    checkIsDifferentSchema,
    checkIsObject,
    generateExampleData,
    getCategoryParams,
    getData,
    getErrorFromDataLocation,
    getInitialOneOfAnyOfState,
    getIsNotRequired,
    getIsRequired,
    getLabel,
    getOneOfAnyOfSelectOptions,
} from "./utilities";
import {
    FormCategoryItems,
    FormCategoryProps,
    FormControlParameters,
    FormControlsWithConfigOptions,
    FormSectionClassNameContract,
    FormSectionProps,
    FormSectionState,
    InitialOneOfAnyOfState,
} from "./form-section.props";
import FormControlSwitch from "./form-control-switch";
import FormOneOfAnyOf from "./form-one-of-any-of";
import FormDictionary from "./form-dictionary";
import { classNames } from "@microsoft/fast-web-utilities";

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

    constructor(props: FormSectionProps & ManagedClasses<FormSectionClassNameContract>) {
        super(props);

        this.state = getInitialOneOfAnyOfState(this.props.schema, this.props.data);
    }

    public render(): React.ReactNode {
        const invalidMessage: string = getErrorFromDataLocation(
            this.props.dataLocation,
            this.props.validationErrors
        );

        return (
            <div className={classNames(this.props.managedClasses.formSection)}>
                {this.renderFormValidation(invalidMessage)}
                {this.renderFormSection(invalidMessage)}
            </div>
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
    private renderForm(dataLocation: string, schema: any): React.ReactNode {
        // check to see if this is a root level object
        // if so, use it to generate the form and do not generate a link
        if (dataLocation === "") {
            return this.generateFormObject(
                schema,
                schema.required || undefined,
                schema.not ? schema.not.required : undefined
            );
        }
    }

    /**
     * Generates form elements based on field type
     */
    private renderFormControl(
        schema: any,
        propertyName: string,
        schemaLocation: string,
        dataLocation: string,
        required: boolean,
        label: string,
        invalidMessage: string | null
    ): React.ReactNode {
        if (schema.type === "object" && propertyName === "") {
            return this.renderForm(propertyName, schema);
        }

        return (
            <FormControlSwitch
                key={[this.props.dataLocation, propertyName].join(".")}
                controls={this.props.controls}
                controlPlugins={this.props.controlPlugins}
                untitled={this.props.untitled}
                required={required}
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
                displayValidationBrowserDefault={
                    this.props.displayValidationBrowserDefault
                }
                displayValidationInline={this.props.displayValidationInline}
            />
        );
    }

    /**
     * Renders form items into categories
     */
    private renderCategories(
        formControlParameters: FormControlParameters[]
    ): React.ReactNode {
        const categoryParams: FormCategoryProps[] = getCategoryParams(
            formControlParameters,
            this.props.orderByPropertyNames
        );

        return categoryParams.map((categoryParam: FormCategoryProps, index: number) => {
            return (
                <FormCategory
                    key={index}
                    expandable={categoryParam.expandable}
                    title={categoryParam.title}
                >
                    {this.renderCategoryItems(categoryParam.items)}
                </FormCategory>
            );
        });
    }

    /**
     * Renders category items
     */
    private renderCategoryItems(items: FormCategoryItems[]): React.ReactNode {
        return items.map((item: FormCategoryItems) => {
            return this.renderFormControl(
                item.params.schema,
                item.params.propertyName,
                item.params.schemaLocation,
                item.params.dataLocation,
                item.params.isRequired,
                item.params.title,
                getErrorFromDataLocation(
                    item.params.dataLocation,
                    this.props.validationErrors
                )
            );
        });
    }

    private getFormControlsAndConfigurationOptions(
        schema: any,
        required: string[],
        not: string[]
    ): FormControlsWithConfigOptions {
        const formControls: FormControlsWithConfigOptions = {
            items: [],
            parameters: [],
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
                            const params: any = {
                                property: schema[propertyKey][propertyName],
                                index,
                                schemaLocation,
                                dataLocation,
                                propertyName,
                                schema: get(
                                    this.state.schema,
                                    `${propertyKey}.${propertyName}`
                                ),
                                isRequired,
                                title:
                                    schema[propertyKey][propertyName].title ||
                                    this.props.untitled,
                                invalidMessage: getErrorFromDataLocation(
                                    dataLocation,
                                    this.props.validationErrors
                                ),
                            };

                            formControls.items.push(
                                this.renderFormControl(
                                    params.property,
                                    params.propertyName,
                                    params.schemaLocation,
                                    params.dataLocation,
                                    params.isRequired,
                                    params.title,
                                    params.invalidMessage
                                )
                            );

                            if (
                                params.property.type !== "object" &&
                                typeof params.property[propertyKey] === "undefined"
                            ) {
                                formControls.parameters.push(params);
                            }
                        }
                    }
                );
            }
        );

        return formControls;
    }

    private getFormObjectItemsOrConfigCategories(
        formControls: FormControlsWithConfigOptions
    ): React.ReactNode {
        if (this.props.orderByPropertyNames) {
            if (
                checkCategoryConfigPropertyCount(
                    formControls,
                    this.props.orderByPropertyNames
                )
            ) {
                return formControls.items;
            }

            return this.renderCategories(formControls.parameters);
        }

        return formControls.items;
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

            return this.getFormObjectItemsOrConfigCategories(formControls);
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
                    {options}
                </FormOneOfAnyOf>
            );
        }

        return null;
    }

    /**
     * Renders additional properties if they have been declared
     */
    private renderAdditionalProperties(invalidMessage: string): React.ReactNode {
        const schema: any = get(
            this.props.schema,
            this.getSchemaLocation(),
            this.props.schema
        );

        if (typeof schema.additionalProperties === "object") {
            return (
                <FormDictionary
                    index={0}
                    controls={this.props.controls}
                    controlPlugins={this.props.controlPlugins}
                    formControlId={this.props.schema.formControlId}
                    dataLocation={this.props.dataLocation}
                    schemaLocation={this.getSchemaLocation()}
                    examples={get(schema, "examples")}
                    propertyLabel={get(schema, "propertyTitle", "Property key")}
                    additionalProperties={schema.additionalProperties}
                    enumeratedProperties={this.getEnumeratedProperties(schema)}
                    data={this.props.data}
                    required={schema.required}
                    label={schema.title || this.props.untitled}
                    childOptions={this.props.childOptions}
                    onChange={this.props.onChange}
                    onUpdateSection={this.props.onUpdateSection}
                    invalidMessage={invalidMessage}
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
                <div className={this.props.managedClasses.formSection_invalidMessage}>
                    {invalidMessage}
                </div>
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
                        "",
                        invalidMessage
                    )}
                    {this.renderAdditionalProperties(invalidMessage)}
                </div>
            </div>
        );
    }

    /**
     * Get all enumerated properties for the object
     */
    private getEnumeratedProperties(schema: any): string[] {
        if (schema.properties === undefined) {
            return [];
        }

        return Object.keys(schema.properties);
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
}

export { FormSection };
export default manageJss(styles)(FormSection);
