import {
    checkIsDifferentSchema,
    getData,
    getErrorFromDataLocation,
    getLabel,
    getOneOfAnyOfSelectOptions,
    updateControlSectionState,
} from "./utilities/form";
import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./control.section.style";
import { get, uniqueId } from "lodash-es";
import {
    SectionControlClassNameContract,
    SectionControlProps,
    SectionControlState,
} from "./control.section.props";
import SectionControlValidation from "./utilities/section.validation";
import FormControlSwitch from "./utilities/control-switch";
import FormOneOfAnyOf from "./utilities/section.one-of-any-of";
import FormDictionary from "./utilities/dictionary";
import { classNames } from "@microsoft/fast-web-utilities";
import {
    MessageSystemType,
    Register,
    SchemaSetValidationAction,
    SchemaSetValidationMessageRequest,
    TreeNavigationItem,
} from "@microsoft/fast-tooling";

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
            return updateControlSectionState(props);
        }

        return null;
    }

    /**
     * The message system registration configuration
     */
    private messageSystemConfig: Register;

    /**
     * The ID of the requested validation
     */
    private oneOfAnyOfValidationRequestId: string;

    constructor(
        props: SectionControlProps & ManagedClasses<SectionControlClassNameContract>
    ) {
        super(props);

        this.messageSystemConfig = {
            onMessage: this.handleMessageSystem,
        };

        if (props.messageSystem !== undefined) {
            props.messageSystem.add(this.messageSystemConfig);
        }

        this.state = updateControlSectionState(props);
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
            const updatedState: SectionControlState = updateControlSectionState(
                this.props
            );

            if (updatedState.oneOfAnyOf !== null) {
                this.oneOfAnyOfValidationRequestId = uniqueId("schemaset");

                this.props.messageSystem.postMessage({
                    type: MessageSystemType.custom,
                    action: SchemaSetValidationAction.request,
                    id: this.oneOfAnyOfValidationRequestId,
                    schemas: this.props.schema[this.state.oneOfAnyOf.type],
                    data: this.props.value,
                } as SchemaSetValidationMessageRequest);
            }

            this.setState(updatedState);
        }
    }

    /**
     * React lifecycle hook
     */
    public componentWillUnmount(): void {
        if (this.props.messageSystem !== undefined) {
            this.props.messageSystem.remove(this.messageSystemConfig);
        }
    }

    /**
     * Handle the message system messages
     */
    private handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.custom:
                if (
                    e.data.action === SchemaSetValidationAction.response &&
                    e.data.id === this.oneOfAnyOfValidationRequestId
                ) {
                    this.setState({
                        oneOfAnyOf: {
                            type: this.state.oneOfAnyOf.type,
                            activeIndex: e.data.index,
                        },
                    });
                }
        }
    };

    /**
     * Handles updating the schema to another active oneOf/anyOf schema
     */
    private handleAnyOfOneOfClick = (activeIndex: number): void => {
        this.setState({
            oneOfAnyOf: {
                type: this.state.oneOfAnyOf.type,
                activeIndex,
            },
        });
    };

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
        if (
            schema.type === "object" &&
            propertyName === "" &&
            this.state.oneOfAnyOf === null
        ) {
            return this.getFormControls();
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
                messageSystem={this.props.messageSystem}
            />
        );
    };

    private getFormControl(item: string): React.ReactNode {
        const splitDataLocation: string[] = this.props.navigation[
            item
        ].relativeDataLocation.split(".");
        const propertyName: string = splitDataLocation[splitDataLocation.length - 1];
        const requiredArray: string[] | void = this.props.navigation[
            this.props.navigationConfigId
        ].schema.required;
        const isRequired: boolean =
            Array.isArray(requiredArray) && requiredArray.includes(propertyName);

        return this.renderFormControl(
            this.props.navigation[item].schema,
            propertyName,
            this.props.navigation[item].schemaLocation,
            this.props.navigation[item].relativeDataLocation,
            item,
            isRequired,
            this.props.navigation[item].disabled,
            this.props.navigation[item].schema.title || this.props.untitled,
            getErrorFromDataLocation(
                this.props.navigation[item].relativeDataLocation,
                this.props.validationErrors
            )
        );
    }

    private getFormControls(): React.ReactNode {
        const navigationItem: TreeNavigationItem = this.getActiveTreeNavigationItem();

        return navigationItem.items.map(
            (item: string): React.ReactNode => {
                return this.getFormControl(item);
            }
        );
    }

    /**
     * Renders a select if the root level has a oneOf or anyOf
     */
    private renderAnyOfOneOfSelect(): React.ReactNode {
        if (
            this.state.oneOfAnyOf !== null &&
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
        const navigationItem: TreeNavigationItem = this.getActiveTreeNavigationItem();

        if (
            typeof navigationItem.schema.additionalProperties === "object" ||
            navigationItem.schema.additionalProperties === false
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
                    schemaLocation={navigationItem.schemaLocation}
                    examples={get(navigationItem.schema, "examples")}
                    propertyLabel={get(
                        navigationItem.schema,
                        `propertyTitle`,
                        "Property key"
                    )}
                    additionalProperties={navigationItem.schema.additionalProperties}
                    enumeratedProperties={this.getEnumeratedProperties(
                        navigationItem.schema
                    )}
                    data={this.props.value}
                    schema={navigationItem.schema}
                    schemaDictionary={this.props.schemaDictionary}
                    required={navigationItem.schema.required}
                    label={navigationItem.schema.title || this.props.untitled}
                    onChange={this.props.onChange}
                    onUpdateSection={this.props.onUpdateSection}
                    validationErrors={this.props.validationErrors}
                    displayValidationBrowserDefault={
                        this.props.displayValidationBrowserDefault
                    }
                    displayValidationInline={this.props.displayValidationInline}
                    messageSystem={this.props.messageSystem}
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
                    validationErrors={this.props.validationErrors}
                    dataLocation={this.props.dataLocation}
                />
            );
        }
    }

    private renderSectionControl(invalidMessage: string): React.ReactNode {
        const navigationItem: TreeNavigationItem = this.getActiveTreeNavigationItem();

        return (
            <div>
                <div>
                    {this.renderAnyOfOneOfSelect()}
                    {this.renderFormControl(
                        navigationItem.schema,
                        "",
                        navigationItem.schemaLocation,
                        this.props.dataLocation,
                        navigationItem.self,
                        true,
                        this.props.disabled || this.state.schema.disabled,
                        "",
                        invalidMessage
                    )}
                    {this.renderAdditionalProperties()}
                </div>
            </div>
        );
    }

    private getActiveTreeNavigationItem(): TreeNavigationItem {
        return this.state.oneOfAnyOf === null
            ? this.props.navigation[this.props.navigationConfigId]
            : this.state.oneOfAnyOf.activeIndex === -1
                ? this.props.navigation[
                      this.props.navigation[this.props.navigationConfigId].items[0]
                  ]
                : this.props.navigation[
                      this.props.navigation[this.props.navigationConfigId].items[
                          this.state.oneOfAnyOf.activeIndex
                      ]
                  ];
    }

    /**
     * Get all enumerated properties for the object
     */
    private getEnumeratedProperties(schema: any): string[] {
        return Object.keys(schema.properties || {});
    }

    private isDisabled(): boolean {
        return this.props.disabled || this.state.schema.disabled;
    }
}

export { SectionControl };
export default manageJss(styles)(SectionControl);
