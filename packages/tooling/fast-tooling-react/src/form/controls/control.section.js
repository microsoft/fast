import {
    checkIsDifferentSchema,
    getData,
    getErrorFromDataLocation,
    getLabel,
    getOneOfAnyOfSelectOptions,
    getUpdatedCategories,
    updateControlSectionState,
} from "./utilities/form";
import React from "react";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./control.section.style";
import { get, uniqueId } from "lodash-es";
import SectionControlValidation from "./utilities/section.validation";
import FormControlSwitch from "./utilities/control-switch";
import FormOneOfAnyOf from "./utilities/section.one-of-any-of";
import FormDictionary from "./utilities/dictionary";
import { classNames } from "@microsoft/fast-web-utilities";
import { MessageSystemType, SchemaSetValidationAction } from "@microsoft/fast-tooling";
/**
 * Schema form component definition
 * @extends React.Component
 */
class SectionControl extends React.Component {
    constructor(props) {
        super(props);
        /**
         * Handle the message system messages
         */
        this.handleMessageSystem = e => {
            switch (e.data.type) {
                case MessageSystemType.custom:
                    if (
                        e.data.action === SchemaSetValidationAction.response &&
                        e.data.id === this.oneOfAnyOfValidationRequestId &&
                        this.state.oneOfAnyOf !== null
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
        this.handleAnyOfOneOfClick = activeIndex => {
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
        this.renderFormControl = (
            schema,
            propertyName,
            schemaLocation,
            dataLocation,
            navigationId,
            required,
            disabled,
            label,
            invalidMessage,
            index
        ) => {
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
                    strings={this.props.strings}
                    messageSystemOptions={this.props.messageSystemOptions}
                    type={this.props.type}
                    categories={this.props.categories}
                    index={index}
                />
            );
        };
        this.handleCategoryExpandTriggerClick = index => {
            return () => {
                const updatedCategories = getUpdatedCategories(
                    this.state.categories,
                    index
                );
                this.setState({
                    categories: updatedCategories,
                });
            };
        };
        this.messageSystemConfig = {
            onMessage: this.handleMessageSystem,
        };
        if (props.messageSystem !== undefined) {
            props.messageSystem.add(this.messageSystemConfig);
        }
        this.state = updateControlSectionState(props);
    }
    static getDerivedStateFromProps(props, state) {
        if (props.schema !== state.schema) {
            return updateControlSectionState(props, state);
        }
        return null;
    }
    render() {
        const invalidMessage = getErrorFromDataLocation(
            this.props.dataLocation,
            this.props.validationErrors
        );
        const isDisabled = this.isDisabled();
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
    componentDidUpdate(prevProps) {
        if (checkIsDifferentSchema(prevProps.schema, this.props.schema)) {
            const updatedState = updateControlSectionState(this.props, this.state);
            if (updatedState.oneOfAnyOf !== null) {
                this.oneOfAnyOfValidationRequestId = uniqueId("schemaset");
                this.props.messageSystem.postMessage({
                    type: MessageSystemType.custom,
                    action: SchemaSetValidationAction.request,
                    id: this.oneOfAnyOfValidationRequestId,
                    schemas: this.props.schema[this.state.oneOfAnyOf.type],
                    data: this.props.value,
                });
            }
            this.setState(updatedState);
        }
    }
    /**
     * React lifecycle hook
     */
    componentWillUnmount() {
        if (this.props.messageSystem !== undefined) {
            this.props.messageSystem.remove(this.messageSystemConfig);
        }
    }
    getFormControl(item, index) {
        const splitDataLocation = this.props.navigation[item].relativeDataLocation.split(
            "."
        );
        const propertyName = splitDataLocation[splitDataLocation.length - 1];
        const requiredArray = this.props.navigation[this.props.navigationConfigId].schema
            .required;
        const isRequired =
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
            ),
            index
        );
    }
    getFormControls() {
        const navigationItem = this.getActiveTreeNavigationItem();
        if (
            this.state.categories &&
            this.props.categories &&
            this.props.categories[
                this.props.dataDictionary[0][this.props.dictionaryId].schemaId
            ] &&
            this.props.categories[
                this.props.dataDictionary[0][this.props.dictionaryId].schemaId
            ][this.props.dataLocation]
        ) {
            const formControls = [];
            const categorizedControls = [];
            this.state.categories.forEach((categoryItem, index) => {
                const category = this.props.categories[
                    this.props.dataDictionary[0][this.props.dictionaryId].schemaId
                ][this.props.dataLocation][index];
                formControls.push(
                    <fieldset
                        key={index}
                        className={classNames(
                            this.props.managedClasses.sectionControl_category,
                            [
                                this.props.managedClasses
                                    .sectionControl_category__expanded,
                                categoryItem.expanded,
                            ]
                        )}
                    >
                        <div
                            className={
                                this.props.managedClasses
                                    .sectionControl_categoryTitleRegion
                            }
                        >
                            <legend
                                className={
                                    this.props.managedClasses.sectionControl_categoryTitle
                                }
                            >
                                {category.title}
                            </legend>
                            <button
                                className={
                                    this.props.managedClasses
                                        .sectionControl_categoryExpandTrigger
                                }
                                onClick={this.handleCategoryExpandTriggerClick(index)}
                            />
                        </div>
                        <div
                            className={
                                this.props.managedClasses
                                    .sectionControl_categoryContentRegion
                            }
                        >
                            {category.dataLocations.map((dataLocation, index) => {
                                if (
                                    navigationItem.items.findIndex(
                                        item => item === dataLocation
                                    ) !== -1
                                ) {
                                    categorizedControls.push(dataLocation);
                                    return this.getFormControl(dataLocation, index);
                                }
                                return null;
                            })}
                        </div>
                    </fieldset>
                );
            });
            return [
                ...navigationItem.items
                    .reduce((accumulation, item) => {
                        if (
                            categorizedControls.findIndex(
                                categorizedControl => categorizedControl === item
                            ) === -1
                        ) {
                            accumulation.push(item);
                        }
                        return accumulation;
                    }, [])
                    .map((uncategorizedControl, index) => {
                        return this.getFormControl(uncategorizedControl, index);
                    }),
                ...formControls,
            ];
        }
        return navigationItem.items.map((item, index) => {
            return this.getFormControl(item, index);
        });
    }
    /**
     * Renders a select if the root level has a oneOf or anyOf
     */
    renderAnyOfOneOfSelect() {
        if (
            this.state.oneOfAnyOf !== null &&
            this.props.schema[this.state.oneOfAnyOf.type]
        ) {
            const unselectedOption = (
                <option value={-1}>{this.props.strings.sectionSelectDefault}</option>
            );
            const options = getOneOfAnyOfSelectOptions(this.props.schema, this.state);
            return (
                <FormOneOfAnyOf
                    label={get(
                        this.props,
                        "schema.title",
                        this.props.strings.sectionSelectLabel
                    )}
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
    renderAdditionalProperties() {
        const navigationItem = this.getActiveTreeNavigationItem();
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
                    examples={get(
                        navigationItem.schema,
                        this.props.strings.sectionAdditionalPropExample
                    )}
                    propertyLabel={get(
                        navigationItem.schema,
                        `propertyTitle`,
                        this.props.strings.sectionAdditionalPropLabel
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
                    strings={this.props.strings}
                    messageSystemOptions={this.props.messageSystemOptions}
                    categories={this.props.categories}
                />
            );
        }
        return null;
    }
    renderFormValidation(invalidMessage) {
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
    renderSectionControl(invalidMessage) {
        const navigationItem = this.getActiveTreeNavigationItem();
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
                        invalidMessage,
                        0
                    )}
                    {this.renderAdditionalProperties()}
                </div>
            </div>
        );
    }
    getActiveTreeNavigationItem() {
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
    getEnumeratedProperties(schema) {
        return Object.keys(schema.properties || {});
    }
    isDisabled() {
        return this.props.disabled || this.state.schema.disabled;
    }
}
SectionControl.displayName = "SectionControl";
SectionControl.defaultProps = {
    managedClasses: {},
};
export { SectionControl };
export default manageJss(styles)(SectionControl);
