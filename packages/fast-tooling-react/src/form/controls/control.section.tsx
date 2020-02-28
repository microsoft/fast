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
} from "../utilities";
import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./control.section.style";
import { get, omit } from "lodash-es";
import {
    FormControlItem,
    FormControlParameters,
    FormControlsWithConfigOptions,
    InitialOneOfAnyOfState,
    SectionControlClassNameContract,
    SectionControlProps,
    SectionControlState,
} from "./control.section.props";
import SectionControlValidation from "./utilities/section.validation";
import FormControlSwitch from "./utilities/control-switch";
import FormOneOfAnyOf from "./utilities/section.one-of-any-of";
import FormDictionary from "./utilities/dictionary";
import { classNames } from "@microsoft/fast-web-utilities";
import { ErrorObject } from "ajv";
import { validateData } from "../../utilities/ajv-validation";
import { CombiningKeyword } from "../../data-utilities/types";

/**
 * Schema form component definition
 * @extends React.Component
 */
class SectionControl extends React.Component<
    SectionControlProps & ManagedClasses<SectionControlClassNameContract>,
    SectionControlState
> {
    public static displayName: string = "SectionControl";

    public static defaultProps: Partial<
        SectionControlProps & ManagedClasses<SectionControlClassNameContract>
    > = {
        managedClasses: {},
    };

    public static getDerivedStateFromProps(
        props: SectionControlProps,
        state: SectionControlState
    ): Partial<SectionControlState> {
        if (props.schema !== state.schema) {
            return getInitialOneOfAnyOfState(props.schema, props.value);
        }

        return null;
    }

    constructor(
        props: SectionControlProps & ManagedClasses<SectionControlClassNameContract>
    ) {
        super(props);

        this.state = getInitialOneOfAnyOfState(this.props.schema, this.props.value);
    }

    public render(): React.ReactNode {
        const invalidMessage: string = getErrorFromDataLocation(
            this.props.dataLocation,
            this.props.validationErrors
        );
        const isDisabled: boolean = this.isDisabled();

        return (
            <fieldset
                className={classNames(this.props.managedClasses.sectionControl, [
                    this.props.managedClasses.sectionControl__disabled,
                    isDisabled,
                ])}
                disabled={isDisabled}
            >
                {this.renderFormValidation(invalidMessage)}
                {this.renderSectionControl(invalidMessage)}
            </fieldset>
        );
    }

    /**
     * React lifecycle hook
     */
    public componentDidUpdate(prevProps: SectionControlProps): void {
        if (checkIsDifferentSchema(prevProps.schema, this.props.schema)) {
            const initialOneOfAnyOfState: InitialOneOfAnyOfState = getInitialOneOfAnyOfState(
                this.props.schema,
                this.props.value
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

        this.props.onChange({
            dataLocation: this.props.dataLocation,
            value: generateExampleData(updatedSchema, ""),
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
        navigationId: string,
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
                key={dataLocation}
                controls={this.props.controls}
                controlPlugins={this.props.controlPlugins}
                controlComponents={this.props.controlComponents}
                untitled={this.props.untitled}
                required={required}
                disabled={disabled}
                default={get(this.props.default, propertyName)}
                label={getLabel(label, this.state.schema.title)}
                data={getData(propertyName, this.props.value)}
                dataLocation={dataLocation}
                dictionaryId={this.props.dictionaryId}
                dataDictionary={this.props.dataDictionary}
                schemaDictionary={this.props.schemaDictionary}
                navigationConfigId={navigationId}
                navigation={this.props.navigation}
                schemaLocation={schemaLocation}
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
            propertyKeys.push(PropertyKeyword.properties);
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
                        const navigationId: string = this.props.navigation[
                            this.props.navigationConfigId
                        ].items[index];

                        if (!isNotRequired) {
                            const params: FormControlParameters = {
                                index,
                                schemaLocation,
                                dataLocation,
                                navigationId,
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
                                    params.navigationId,
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
        if (checkIsObject(schema, this.state.schema)) {
            // assign items to form elements
            return this.getFormControlsAndConfigurationOptions(schema, required, not)
                .items.concat([
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
                        return (
                            <React.Fragment key={itemIndex}>
                                {controlItem.render}
                            </React.Fragment>
                        );
                    }
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

            const combiningKeyword: CombiningKeyword = this.props.schema[
                CombiningKeyword.oneOf
            ]
                ? CombiningKeyword.oneOf
                : CombiningKeyword.anyOf;

            const activeIndex: number = this.props.schema[combiningKeyword].findIndex(
                (schemaItem: any) => {
                    return validateData(schemaItem, this.props.value);
                }
            );

            return (
                <FormOneOfAnyOf
                    label={get(this.props, "schema.title", "Configuration")}
                    activeIndex={activeIndex}
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
                    type={this.props.type}
                    controls={this.props.controls}
                    controlPlugins={this.props.controlPlugins}
                    controlComponents={this.props.controlComponents}
                    formControlId={this.state.schema.formControlId}
                    dataLocation={this.props.dataLocation}
                    navigationConfigId={this.props.navigationConfigId}
                    dictionaryId={this.props.dictionaryId}
                    dataDictionary={this.props.dataDictionary}
                    navigation={this.props.navigation}
                    schemaLocation={schemaLocation}
                    examples={get(schema, "examples")}
                    propertyLabel={get(schema, `propertyTitle`, "Property key")}
                    additionalProperties={schema.additionalProperties}
                    enumeratedProperties={this.getEnumeratedProperties(schema)}
                    data={this.props.value}
                    schema={schema}
                    schemaDictionary={this.props.schemaDictionary}
                    required={schema.required}
                    label={schema.title || this.props.untitled}
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
                <SectionControlValidation
                    invalidMessage={invalidMessage}
                    validationErrors={this.getValidationErrorsForSectionValidation()}
                    dataLocation={this.props.dataLocation}
                />
            );
        }
    }

    private renderSectionControl(invalidMessage: string): React.ReactNode {
        return (
            <div>
                <div>
                    {this.renderAnyOfOneOfSelect()}
                    {this.renderFormControl(
                        this.state.schema,
                        "",
                        this.getSchemaLocation(),
                        this.props.dataLocation,
                        this.props.navigationConfigId,
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
        return Object.keys(schema.properties || {});
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

export { SectionControl };
export default manageJss(styles)(SectionControl);
