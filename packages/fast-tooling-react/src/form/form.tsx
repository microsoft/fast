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
    ControlConfig,
    ControlType,
    SingleLineControlPlugin,
    StandardControlPlugin,
} from "./templates";
import { ControlContext, LinkedDataActionType, OnChangeConfig } from "./templates/types";
import { BreadcrumbItem, getDictionaryBreadcrumbs } from "./utilities";
import {
    BreadcrumbItemEventHandler,
    ControlPluginConfig,
    FormClassNameContract,
    FormProps,
    FormState,
} from "./form.props";
import { cloneDeep, get } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import React from "react";
import styles from "./form.style";
import { classNames } from "@microsoft/fast-web-utilities";
import {
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
    Register,
    TreeNavigationItem,
} from "@microsoft/fast-tooling";

/**
 * Schema form component definition
 * @extends React.Component
 */
class Form extends React.Component<
    FormProps & ManagedClasses<FormClassNameContract>,
    FormState
> {
    public static displayName: string = "Form";

    public static defaultProps: Partial<FormProps> = {
        controls: [],
        displayValidationBrowserDefault: true,
    };

    /**
     * The default untitled string
     */
    private untitled: string;

    /**
     * The default form controls
     */
    private selectControl: StandardControlPlugin;
    private displayControl: StandardControlPlugin;
    private linkedDataControl: StandardControlPlugin;
    private sectionLinkControl: StandardControlPlugin;
    private sectionControl: BareControlPlugin;
    private checkboxControl: SingleLineControlPlugin;
    private numberFieldControl: StandardControlPlugin;
    private textareaControl: StandardControlPlugin;
    private arrayControl: StandardControlPlugin;
    private buttonControl: StandardControlPlugin;

    /**
     * The default form components as a dictionary
     * by type
     */
    private controlComponents: {
        [key: string]: React.ComponentClass | React.FunctionComponent;
    } = {};

    private messageSystemConfig: Register;

    constructor(props: FormProps & ManagedClasses<FormClassNameContract>) {
        super(props);

        this.untitled = "Untitled";

        this.updateControls();

        this.messageSystemConfig = {
            onMessage: this.handleMessageSystem,
        };

        if (props.messageSystem !== undefined) {
            props.messageSystem.add(this.messageSystemConfig);
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
        };
    }

    public render(): React.ReactNode {
        return (
            <div className={classNames(this.props.managedClasses.form)}>
                {this.renderForm()}
            </div>
        );
    }

    public componentWillUnmount(): void {
        if (this.props.messageSystem !== undefined) {
            this.props.messageSystem.remove(this.messageSystemConfig);
        }
    }

    private renderForm(): React.ReactNode {
        return this.state.navigationDictionary ? (
            <form onSubmit={this.handleSubmit}>
                {this.renderBreadcrumbs()}
                {this.renderSection()}
            </form>
        ) : null;
    }

    /**
     * Handle messages from the message system
     */
    private handleMessageSystem = (e: MessageEvent): void => {
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
                });
                break;
            case MessageSystemType.data:
                this.setState({
                    data: e.data.data,
                    dataDictionary: e.data.dataDictionary,
                    navigation: e.data.navigation,
                    navigationDictionary: e.data.navigationDictionary,
                });
                break;
            case MessageSystemType.navigation:
                this.setState({
                    activeDictionaryId: e.data.activeDictionaryId,
                    activeNavigationConfigId: e.data.activeNavigationConfigId,
                });
                break;
            case MessageSystemType.validation:
                this.setState({
                    validationErrors: {
                        ...this.state.validationErrors,
                        [e.data.dictionaryId]: e.data.validationErrors,
                    },
                });
                break;
        }
    };

    /**
     * Find all type controls passed and use them in
     * place of the default controls
     */
    private findControlPlugin(
        hasCustomControlPlugins: boolean,
        type: ControlType
    ): StandardControlPlugin {
        const controlPluginConfig: ControlPluginConfig = this.getComponentByType(type);

        if (hasCustomControlPlugins) {
            const controlPlugin: StandardControlPlugin = this.props.controls.find(
                (control: StandardControlPlugin): boolean => {
                    return control.matchesType(type);
                }
            );

            if (controlPlugin !== undefined) {
                this.controlComponents[type] =
                    controlPlugin.config.component !== undefined
                        ? controlPlugin.config.component
                        : controlPluginConfig.component;

                return controlPlugin;
            }

            const allControlsPlugin: StandardControlPlugin = this.props.controls.find(
                (control: StandardControlPlugin): boolean => {
                    return control.matchesAllTypes();
                }
            );

            if (allControlsPlugin !== undefined) {
                this.controlComponents[type] =
                    allControlsPlugin.config.component !== undefined
                        ? allControlsPlugin.config.component
                        : controlPluginConfig.component;

                return allControlsPlugin;
            }
        }

        this.controlComponents[type] = controlPluginConfig.component;

        return new controlPluginConfig.plugin({
            ...controlPluginConfig,
            type,
            control: (config: ControlConfig): React.ReactNode => {
                return <controlPluginConfig.component {...config} />;
            },
        });
    }

    private getComponentByType(type: ControlType): ControlPluginConfig {
        switch (type) {
            case ControlType.select:
                return {
                    plugin: StandardControlPlugin,
                    component: SelectControl,
                    context: ControlContext.default,
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
                    context: ControlContext.default,
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
                    context: ControlContext.default,
                };
            case ControlType.textarea:
                return {
                    plugin: StandardControlPlugin,
                    component: TextareaControl,
                    context: ControlContext.default,
                };
            case ControlType.display:
                return {
                    plugin: StandardControlPlugin,
                    component: DisplayControl,
                    context: ControlContext.default,
                };
            case ControlType.button:
                return {
                    plugin: StandardControlPlugin,
                    component: ButtonControl,
                    context: ControlContext.default,
                };
            default:
                return {
                    plugin: BareControlPlugin,
                    component: SectionControl,
                    context: ControlContext.default,
                };
        }
    }

    private updateControls(): void {
        const hasCustomControlPlugins: boolean = Array.isArray(this.props.controls);

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
    private renderBreadcrumbs(): JSX.Element {
        const breadcrumbs: BreadcrumbItem[] = getDictionaryBreadcrumbs(
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

    private renderBreadcrumbItems(items: BreadcrumbItem[]): React.ReactNode {
        return items.map(
            (item: BreadcrumbItem, index: number): JSX.Element => {
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
            }
        );
    }

    /**
     * Render the section to be shown
     */
    private renderSection(): React.ReactNode {
        let control: BareControlPlugin = this.sectionControl;
        const navigationItem: TreeNavigationItem = this.state.navigationDictionary[0][
            this.state.activeDictionaryId
        ][0][this.state.activeNavigationConfigId];

        // Check to see if there is any associated `formControlId`
        // then check for the id within the passed controlPlugins
        if (typeof get(navigationItem, `schema.formControlId`) === "string") {
            control = this.props.controls.find((controlPlugin: StandardControlPlugin) => {
                return controlPlugin.matchesId(
                    (navigationItem.schema as any).formControlId
                );
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
        });

        return control.render();
    }

    private handleBreadcrumbClick = (
        dictionaryId: string,
        navigationConfigId: string
    ): BreadcrumbItemEventHandler => {
        return (e: React.MouseEvent): void => {
            e.preventDefault();

            this.handleUpdateActiveSection(dictionaryId, navigationConfigId);
        };
    };

    private handleOnChange = (config: OnChangeConfig): void => {
        if (this.props.messageSystem) {
            if (config.isLinkedData) {
                if (config.linkedDataAction === LinkedDataActionType.add) {
                    this.props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.addLinkedData,
                        dataLocation: config.dataLocation,
                        linkedData: config.value,
                    });
                } else if (config.linkedDataAction === LinkedDataActionType.reorder) {
                    this.props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.reorderLinkedData,
                        dataLocation: config.dataLocation,
                        linkedData: config.value,
                    });
                } else if (config.linkedDataAction === LinkedDataActionType.remove) {
                    this.props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.removeLinkedData,
                        dataLocation: config.dataLocation,
                        linkedData: config.value,
                    });
                }
            } else if (config.isArray) {
                const updatedData: any = cloneDeep(
                    get(this.state.data, config.dataLocation)
                );
                let newArray: any[];

                if (typeof config.index !== "undefined") {
                    newArray = updatedData.filter((item: any, itemIndex: number) => {
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
                });
            } else {
                if (config.value === undefined) {
                    this.props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.remove,
                        dataLocation: config.dataLocation,
                    });
                } else {
                    this.props.messageSystem.postMessage({
                        type: MessageSystemType.data,
                        action: MessageSystemDataTypeAction.update,
                        dataLocation: config.dataLocation,
                        data: config.value,
                    });
                }
            }
        }
    };

    /**
     * Handles the form submit
     */
    private handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
    };

    /**
     * Handles an update to the active section and component
     */
    private handleUpdateActiveSection = (
        dictionaryId: string,
        navigationConfigId?: string
    ): void => {
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
}

export { FormClassNameContract };
export default manageJss(styles)(Form);
