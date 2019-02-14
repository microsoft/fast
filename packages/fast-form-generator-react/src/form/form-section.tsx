import styles from "./form-section.style";
import * as React from "react";
import FormCategory from "./form-category";
import { get, uniqueId } from "lodash-es";
import {
    checkCategoryConfigPropertyCount,
    checkIsDifferentSchema,
    checkIsObject,
    generateExampleData,
    getCategoryParams,
    getData,
    getInitialOneOfAnyOfState,
    getIsNotRequired,
    getIsRequired,
    getLabel,
    getOneOfAnyOfSelectOptions,
} from "./form-section.utilities";
import {
    FormCategoryItems,
    FormCategoryProps,
    FormItemParameters,
    FormItemsWithConfigOptions,
    FormSectionProps,
    FormSectionState,
} from "./form-section.props";
import { FormSectionClassNameContract } from "../class-name-contracts/";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormControl from "./form-control";
import FormOneOfAnyOf from "./form-one-of-any-of";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormSection extends React.Component<
    FormSectionProps & ManagedClasses<FormSectionClassNameContract>,
    FormSectionState
> {
    public static displayName: string = "FormSection";

    constructor(props: FormSectionProps & ManagedClasses<FormSectionClassNameContract>) {
        super(props);

        this.state = getInitialOneOfAnyOfState(this.props.schema, this.props.data);
    }

    public render(): React.ReactNode {
        return <div>{this.renderFormSection()}</div>;
    }

    /**
     * React lifecycle hook
     */
    public componentWillUpdate(nextProps: FormSectionProps): void {
        if (checkIsDifferentSchema(this.props.schema, nextProps.schema)) {
            this.setState(getInitialOneOfAnyOfState(nextProps.schema, nextProps.data));
        }
    }

    /**
     * Handles updating the schema to another active oneOf/anyOf schema
     */
    private handleAnyOfOneOfClick = (activeIndex: number): void => {
        const updatedData: any = generateExampleData(
            this.props.schema[this.state.oneOfAnyOf.type][activeIndex],
            ""
        );

        this.props.onChange(this.props.dataLocation, updatedData);

        this.setState({
            schema: this.props.schema[this.state.oneOfAnyOf.type][activeIndex],
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
        index: number,
        propertyName: string,
        schemaLocation: string,
        dataLocation: string,
        required: boolean,
        label: string
    ): React.ReactNode {
        if (schema.type === "object" && propertyName === "") {
            return this.renderForm(propertyName, schema);
        }

        return (
            <FormControl
                key={[this.props.dataLocation, propertyName].join(".")}
                index={index}
                untitled={this.props.untitled}
                required={required}
                default={schema.default || void 0}
                label={getLabel(label, this.state.schema.title)}
                data={getData(propertyName, this.props.data)}
                dataLocation={dataLocation}
                schemaLocation={schemaLocation}
                childOptions={this.props.childOptions}
                propertyName={propertyName}
                schema={schema}
                onChange={this.props.onChange}
                onUpdateActiveSection={this.props.onUpdateActiveSection}
                attributeSettingsMappingToPropertyNames={
                    this.props.attributeSettingsMappingToPropertyNames
                }
                componentMappingToPropertyNames={
                    this.props.componentMappingToPropertyNames
                }
            />
        );
    }

    /**
     * Renders form items into categories
     */
    private renderCategories(formItemParameters: FormItemParameters[]): React.ReactNode {
        const categoryParams: FormCategoryProps[] = getCategoryParams(
            formItemParameters,
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
                item.params.index,
                item.params.propertyName,
                item.params.schemaLocation,
                item.params.dataLocation,
                item.params.isRequired,
                item.params.title
            );
        });
    }

    private getFormItemsAndConfigurationOptions(
        schema: any,
        required: string[],
        not: string[]
    ): FormItemsWithConfigOptions {
        const formItems: FormItemsWithConfigOptions = {
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
                            };

                            formItems.items.push(
                                this.renderFormControl(
                                    params.property,
                                    params.index,
                                    params.propertyName,
                                    params.schemaLocation,
                                    params.dataLocation,
                                    params.isRequired,
                                    params.title
                                )
                            );

                            if (
                                params.property.type !== "object" &&
                                typeof params.property[propertyKey] === "undefined"
                            ) {
                                formItems.parameters.push(params);
                            }
                        }
                    }
                );
            }
        );

        return formItems;
    }

    private getFormObjectItemsOrConfigCategories(
        formItems: FormItemsWithConfigOptions
    ): React.ReactNode {
        if (this.props.orderByPropertyNames) {
            if (
                checkCategoryConfigPropertyCount(
                    formItems,
                    this.props.orderByPropertyNames
                )
            ) {
                return formItems.items;
            }

            return this.renderCategories(formItems.parameters);
        }

        return formItems.items;
    }

    /**
     * Pushes a list of elements found inside an object to an array
     */
    private generateFormObject(
        schema: any,
        required: string[],
        not?: string[]
    ): React.ReactNode {
        let formItems: FormItemsWithConfigOptions;

        if (checkIsObject(schema, this.state.schema)) {
            // assign items to form elements
            formItems = this.getFormItemsAndConfigurationOptions(schema, required, not);

            return this.getFormObjectItemsOrConfigCategories(formItems);
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
            const id: string = uniqueId();
            const options: React.ReactNode = getOneOfAnyOfSelectOptions(
                this.props.schema,
                this.state
            );

            return (
                <FormOneOfAnyOf
                    label={"Configuration"}
                    activeIndex={this.state.oneOfAnyOf.activeIndex}
                    onUpdate={this.handleAnyOfOneOfClick}
                >
                    {options}
                </FormOneOfAnyOf>
            );
        }

        return null;
    }

    private renderFormSection(): React.ReactNode {
        return (
            <div>
                <div>
                    {this.renderAnyOfOneOfSelect()}
                    {this.renderFormControl(
                        this.state.schema,
                        0,
                        "",
                        this.getSchemaLocation(),
                        this.props.dataLocation,
                        true,
                        ""
                    )}
                </div>
            </div>
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
}

export default manageJss(styles)(FormSection);
