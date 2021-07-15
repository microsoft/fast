import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    DisplayControl,
    LinkedDataControl,
    NumberFieldControl,
    SectionControl,
    SectionLinkControl,
    SelectControl,
    TextareaControl,
} from "./controls";
import {
    BareControlPlugin,
    ControlType,
    SingleLineControlPlugin,
    StandardControlPlugin,
} from "./templates";
import { ControlContext, LinkedDataActionType } from "./templates/types";
import { getDictionaryBreadcrumbs } from "./utilities";
import { cloneDeep, get } from "lodash-es";
import manageJss from "@microsoft/fast-jss-manager-react";
import React from "react";
import styles from "./form.style";
import defaultStrings from "./form.strings";
import { classNames } from "@microsoft/fast-web-utilities";
import {
    dataSetName,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
} from "@microsoft/fast-tooling";
export const formId = "fast-tooling-react::form";
/**
 * Schema form component definition
 * @extends React.Component
 */
class Form extends React.Component {
    constructor(props) {
        super(props);
        /**
         * The default form components as a dictionary
         * by type
         */
        this.controlComponents = {};
        this.strings = defaultStrings;
        /**
         * Handle messages from the message system
         */
        this.handleMessageSystem = e => {
            switch (e.data.type) {
                case MessageSystemType.initialize:
                    this.setState({
                        schema: e.data.schema,
                        schemaDictionary: e.data.schemaDictionary,
                        data: e.data.data,
                        dataDictionary: e.data.dataDictionary,
                        navigation: e.data.navigation,
                        navigationDictionary: e.data.navigationDictionary,
                        activeDictionaryId: e.data.activeDictionaryId,
                        activeNavigationConfigId: e.data.activeNavigationConfigId,
                        options: e.data.options,
                    });
                    break;
                case MessageSystemType.data:
                    this.setState({
                        data: e.data.data,
                        dataDictionary: e.data.dataDictionary,
                        navigation: e.data.navigation,
                        navigationDictionary: e.data.navigationDictionary,
                        options: e.data.options,
                    });
                    break;
                case MessageSystemType.navigation:
                    this.setState({
                        activeDictionaryId: e.data.activeDictionaryId,
                        activeNavigationConfigId: e.data.activeNavigationConfigId,
                        options: e.data.options,
                    });
                    break;
                case MessageSystemType.validation:
                    this.setState({
                        validationErrors: Object.assign(
                            Object.assign({}, this.state.validationErrors),
                            { [e.data.dictionaryId]: e.data.validationErrors }
                        ),
                        options: e.data.options,
                    });
                    break;
                case MessageSystemType.schemaDictionary:
                    this.setState({
                        schemaDictionary: e.data.schemaDictionary,
                    });
                    break;
            }
        };
        this.handleBreadcrumbClick = (dictionaryId, navigationConfigId) => {
            return e => {
                e.preventDefault();
                this.handleUpdateActiveSection(dictionaryId, navigationConfigId);
            };
        };
        this.handleOnChange = config => {
            if (this.props.messageSystem) {
                if (config.isLinkedData) {
                    if (config.linkedDataAction === LinkedDataActionType.add) {
                        this.props.messageSystem.postMessage({
                            type: MessageSystemType.data,
                            action: MessageSystemDataTypeAction.addLinkedData,
                            dataLocation: config.dataLocation,
                            linkedData: config.value,
                            options: {
                                originatorId: formId,
                            },
                        });
                    } else if (config.linkedDataAction === LinkedDataActionType.reorder) {
                        this.props.messageSystem.postMessage({
                            type: MessageSystemType.data,
                            action: MessageSystemDataTypeAction.reorderLinkedData,
                            dataLocation: config.dataLocation,
                            linkedData: config.value,
                            options: {
                                originatorId: formId,
                            },
                        });
                    } else if (config.linkedDataAction === LinkedDataActionType.remove) {
                        this.props.messageSystem.postMessage({
                            type: MessageSystemType.data,
                            action: MessageSystemDataTypeAction.removeLinkedData,
                            dataLocation: config.dataLocation,
                            linkedData: config.value,
                            options: {
                                originatorId: formId,
                            },
                        });
                    }
                } else if (config.isArray) {
                    const updatedData = cloneDeep(
                        get(this.state.data, config.dataLocation)
                    );
                    let newArray;
                    if (typeof config.index !== "undefined") {
                        newArray = updatedData.filter((item, itemIndex) => {
                            return itemIndex !== config.index;
                        });
                    } else {
                        newArray = updatedData;
                        newArray.push(config.value);
                    }
                    this.props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        dataLocation: config.dataLocation,
                        data: newArray,
                        options: {
                            originatorId: formId,
                        },
                    });
                } else {
                    if (config.value === undefined) {
                        this.props.messageSystem.postMessage({
                            type: MessageSystemType.data,
                            action: MessageSystemDataTypeAction.remove,
                            dataLocation: config.dataLocation,
                            options: {
                                originatorId: formId,
                            },
                        });
                    } else {
                        this.props.messageSystem.postMessage({
                            type: MessageSystemType.data,
                            action: MessageSystemDataTypeAction.update,
                            dataLocation: config.dataLocation,
                            data: config.value,
                            options: {
                                originatorId: formId,
                            },
                        });
                    }
                }
            }
        };
        /**
         * Handles the form submit
         */
        this.handleSubmit = e => {
            e.preventDefault();
        };
        /**
         * Handles an update to the active section and component
         */
        this.handleUpdateActiveSection = (dictionaryId, navigationConfigId) => {
            if (this.props.messageSystem) {
                this.props.messageSystem.postMessage({
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeNavigationConfigId:
                        navigationConfigId !== undefined
                            ? navigationConfigId
                            : this.state.navigationDictionary[0][dictionaryId][1],
                    activeDictionaryId: dictionaryId,
                });
            }
        };
        this.untitled = "Untitled";
        this.updateControls();
        this.messageSystemConfig = {
            onMessage: this.handleMessageSystem,
            config: {
                displayTextDataLocation: dataSetName,
            },
        };
        if (props.messageSystem !== undefined) {
            props.messageSystem.add(this.messageSystemConfig);
        }
        if (!!props.strings) {
            this.strings = props.strings;
        }
        this.state = {
            activeDictionaryId: "",
            activeNavigationConfigId: "",
            data: void 0,
            dataDictionary: void 0,
            schema: {},
            schemaDictionary: {},
            navigation: void 0,
            navigationDictionary: void 0,
            validationErrors: {},
            options: null,
        };
    }
    render() {
        return (
            <div className={classNames(this.props.managedClasses.form)}>
                {this.renderForm()}
            </div>
        );
    }
    componentWillUnmount() {
        if (this.props.messageSystem !== undefined) {
            this.props.messageSystem.remove(this.messageSystemConfig);
        }
    }
    renderForm() {
        return this.state.navigationDictionary ? (
            <form onSubmit={this.handleSubmit}>
                {this.renderBreadcrumbs()}
                {this.renderSection()}
            </form>
        ) : null;
    }
    /**
     * Find all type controls passed and use them in
     * place of the default controls
     */
    findControlPlugin(hasCustomControlPlugins, type) {
        const controlPluginConfig = this.getComponentByType(type);
        if (hasCustomControlPlugins) {
            const controlPlugin = this.props.controls.find(control => {
                return control.matchesType(type);
            });
            if (controlPlugin !== undefined) {
                this.controlComponents[type] =
                    controlPlugin.config.component !== undefined
                        ? controlPlugin.config.component
                        : controlPluginConfig.component;
                return controlPlugin;
            }
            const allControlsPlugin = this.props.controls.find(control => {
                return control.matchesAllTypes();
            });
            if (allControlsPlugin !== undefined) {
                this.controlComponents[type] =
                    allControlsPlugin.config.component !== undefined
                        ? allControlsPlugin.config.component
                        : controlPluginConfig.component;
                return allControlsPlugin;
            }
        }
        this.controlComponents[type] = controlPluginConfig.component;
        return new controlPluginConfig.plugin(
            Object.assign(Object.assign({}, controlPluginConfig), {
                type,
                control: config => {
                    return <controlPluginConfig.component {...config} />;
                },
            })
        );
    }
    getComponentByType(type) {
        switch (type) {
            case ControlType.select:
                return {
                    plugin: StandardControlPlugin,
                    component: SelectControl,
                    context: ControlContext.fill,
                };
            case ControlType.array:
                return {
                    plugin: StandardControlPlugin,
                    component: ArrayControl,
                    context: ControlContext.fill,
                };
            case ControlType.linkedData:
                return {
                    plugin: StandardControlPlugin,
                    component: LinkedDataControl,
                    context: ControlContext.fill,
                };
            case ControlType.numberField:
                return {
                    plugin: StandardControlPlugin,
                    component: NumberFieldControl,
                    context: ControlContext.fill,
                };
            case ControlType.checkbox:
                return {
                    plugin: SingleLineControlPlugin,
                    component: CheckboxControl,
                    context: ControlContext.default,
                };
            case ControlType.sectionLink:
                return {
                    plugin: StandardControlPlugin,
                    component: SectionLinkControl,
                    context: ControlContext.fill,
                };
            case ControlType.textarea:
                return {
                    plugin: StandardControlPlugin,
                    component: TextareaControl,
                    context: ControlContext.fill,
                };
            case ControlType.display:
                return {
                    plugin: StandardControlPlugin,
                    component: DisplayControl,
                    context: ControlContext.fill,
                };
            case ControlType.button:
                return {
                    plugin: StandardControlPlugin,
                    component: ButtonControl,
                    context: ControlContext.fill,
                };
            default:
                return {
                    plugin: BareControlPlugin,
                    component: SectionControl,
                    context: ControlContext.default,
                };
        }
    }
    updateControls() {
        const hasCustomControlPlugins = Array.isArray(this.props.controls);
        this.selectControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.select
        );
        this.arrayControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.array
        );
        this.linkedDataControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.linkedData
        );
        this.numberFieldControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.numberField
        );
        this.checkboxControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.checkbox
        );
        this.sectionLinkControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.sectionLink
        );
        this.textareaControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.textarea
        );
        this.displayControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.display
        );
        this.buttonControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.button
        );
        this.sectionControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.section
        );
    }
    /**
     * Generates the breadcrumb navigation
     */
    renderBreadcrumbs() {
        const breadcrumbs = getDictionaryBreadcrumbs(
            this.state.navigationDictionary,
            this.state.activeDictionaryId,
            this.state.activeNavigationConfigId,
            this.handleBreadcrumbClick
        );
        if (breadcrumbs.length > 1) {
            return (
                <ul className={this.props.managedClasses.form_breadcrumbs}>
                    {this.renderBreadcrumbItems(breadcrumbs)}
                </ul>
            );
        }
    }
    renderBreadcrumbItems(items) {
        return items.map((item, index) => {
            if (index === items.length - 1) {
                return (
                    <li key={index}>
                        <span>{item.text}</span>
                    </li>
                );
            }
            return (
                <li key={index}>
                    <a href={item.href} onClick={item.onClick}>
                        {item.text}
                    </a>
                </li>
            );
        });
    }
    /**
     * Render the section to be shown
     */
    renderSection() {
        let control = this.sectionControl;
        const navigationItem = this.state.navigationDictionary[0][
            this.state.activeDictionaryId
        ][0][this.state.activeNavigationConfigId];
        // Check to see if there is any associated `formControlId`
        // then check for the id within the passed controlPlugins
        if (typeof get(navigationItem, `schema.formControlId`) === "string") {
            control = this.props.controls.find(controlPlugin => {
                return controlPlugin.matchesId(navigationItem.schema.formControlId);
            });
            if (control === undefined) {
                control = this.sectionControl;
            }
        }
        control.updateProps({
            index: 0,
            type: ControlType.section,
            required: false,
            label: navigationItem.text || this.untitled,
            invalidMessage: "",
            component: this.controlComponents[ControlType.section],
            schema: navigationItem.schema,
            schemaDictionary: this.state.schemaDictionary,
            controls: {
                button: this.buttonControl,
                array: this.arrayControl,
                linkedData: this.linkedDataControl,
                checkbox: this.checkboxControl,
                display: this.displayControl,
                textarea: this.textareaControl,
                select: this.selectControl,
                section: this.sectionControl,
                sectionLink: this.sectionLinkControl,
                numberField: this.numberFieldControl,
            },
            controlPlugins: this.props.controls,
            controlComponents: this.controlComponents,
            onChange: this.handleOnChange,
            onUpdateSection: this.handleUpdateActiveSection,
            data: navigationItem.data,
            schemaLocation: navigationItem.schemaLocation,
            default: get(navigationItem, "schema.default"),
            disabled: navigationItem.disabled,
            dataLocation: this.state.navigationDictionary[0][
                this.state.activeDictionaryId
            ][0][navigationItem.self].relativeDataLocation,
            navigationConfigId: navigationItem.self,
            dictionaryId: this.state.activeDictionaryId,
            dataDictionary: this.state.dataDictionary,
            navigation: this.state.navigationDictionary[0][
                this.state.activeDictionaryId
            ][0],
            untitled: this.untitled,
            validationErrors: this.state.validationErrors[this.state.activeDictionaryId],
            displayValidationBrowserDefault: this.props.displayValidationBrowserDefault,
            displayValidationInline: this.props.displayValidationInline,
            messageSystem: this.props.messageSystem,
            strings: this.strings,
            messageSystemOptions: this.state.options,
            categories: this.props.categories || {},
        });
        return control.render();
    }
}
Form.displayName = "Form";
Form.defaultProps = {
    controls: [],
    displayValidationBrowserDefault: true,
};
export default manageJss(styles)(Form);
