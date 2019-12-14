import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    ChildrenControl,
    DisplayControl,
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
    OnChangeConfig,
    SingleLineControlPlugin,
    StandardControlPlugin,
    UpdateSectionConfig,
} from "./templates";
import { ControlContext } from "./templates/types";
import { BreadcrumbItem, getBreadcrumbs } from "./utilities/breadcrumb";
import {
    BreadcrumbItemEventHandler,
    ControlPluginConfig,
    FormClassNameContract,
    FormLocation,
    FormProps,
    FormState,
} from "./form.props";
import { FormChildOptionItem } from "./types";
import Navigation, { NavigationItem } from "./utilities/navigation";
import { cloneDeep, get, set, unset } from "lodash-es";
import {
    getActiveComponentAndSection,
    isDifferentSchema,
    isModifiedSchema,
    isRootLocation,
} from "./utilities";
import {
    getValidationErrors,
    removeAllCachedValidation,
} from "../utilities/ajv-validation";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";

import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import React from "react";
import stringify from "fast-json-stable-stringify";
import styles from "./form.style";

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
        displayValidationBrowserDefault: true,
    };

    public static getDerivedStateFromProps(
        props: FormProps,
        state: FormState
    ): Partial<FormState> {
        if (stringify(state.schema) !== stringify(props.schema)) {
            const navigationInstance: Navigation = new Navigation({
                dataLocation: "",
                schema: props.schema,
                data: props.data,
                childOptions: props.childOptions ? props.childOptions : [],
            });
            const updatedState: Partial<FormState> = {
                titleProps:
                    props.schema && props.schema.title ? props.schema.title : "Untitled",
                activeDataLocation: "",
                navigationInstance,
                schema: props.schema,
                navigation: navigationInstance.get(),
            };

            return updatedState;
        }

        return null;
    }

    /**
     * The default untitled string
     */
    private untitled: string;

    /**
     * The default form controls
     */
    private selectControl: StandardControlPlugin;
    private displayControl: StandardControlPlugin;
    private sectionLinkControl: StandardControlPlugin;
    private sectionControl: BareControlPlugin;
    private checkboxControl: SingleLineControlPlugin;
    private numberFieldControl: StandardControlPlugin;
    private textareaControl: StandardControlPlugin;
    private arrayControl: StandardControlPlugin;
    private childrenControl: StandardControlPlugin;
    private buttonControl: StandardControlPlugin;

    /**
     * The default form components as a dictionary
     * by type
     */
    private controlComponents: {
        [key: string]: React.ComponentClass | React.FunctionComponent;
    } = {};

    /**
     * The schema
     */
    private _rootSchema: any;
    get rootSchema(): any {
        return this._rootSchema;
    }
    set rootSchema(updatedSchema: any) {
        this._rootSchema = updatedSchema;
    }
    constructor(props: FormProps & ManagedClasses<FormClassNameContract>) {
        super(props);

        const dataLocation: string | void = get(this.props, "location.dataLocation");

        this.untitled = "Untitled";
        this.rootSchema = this.props.schema;
        const navigationInstance: Navigation = new Navigation({
            dataLocation: typeof dataLocation === "string" ? dataLocation : "",
            data: this.props.data,
            schema: this.props.schema,
            childOptions: this.props.childOptions ? this.props.childOptions : [],
        });

        this.updateControls();

        this.state = {
            titleProps:
                this.rootSchema && this.rootSchema.title
                    ? this.rootSchema.title
                    : this.untitled,
            activeDataLocation:
                props.location && props.location.dataLocation
                    ? props.location.dataLocation
                    : "",
            schema: this.props.schema,
            navigationInstance,
            navigation: navigationInstance.get(),
            validationErrors: getValidationErrors(
                this.rootSchema,
                this.getDataForValidation(props)
            ),
        };
    }

    public render(): JSX.Element {
        return (
            <div className={this.getClassNames()}>
                <form onSubmit={this.handleSubmit}>
                    {this.renderBreadcrumbs()}
                    {this.renderSection()}
                </form>
            </div>
        );
    }

    /**
     * React lifecycle hook
     */
    public componentDidUpdate(prevProps: FormProps): void {
        if (prevProps.controlPlugins !== this.props.controlPlugins) {
            this.updateControls();
        }

        const state: Partial<FormState> = this.updateStateForNewProps(
            this.props,
            prevProps.data !== this.props.data,
            isDifferentSchema(prevProps.schema, this.props.schema),
            prevProps.location !== this.props.location
        );

        if (state) {
            this.setState(state as FormState);
        }
    }

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
            const controlPlugin: StandardControlPlugin = this.props.controlPlugins.find(
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

            const allControlsPlugin: StandardControlPlugin = this.props.controlPlugins.find(
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
            case ControlType.children:
                return {
                    plugin: StandardControlPlugin,
                    component: ChildrenControl,
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
        const hasCustomControlPlugins: boolean = Array.isArray(this.props.controlPlugins);

        this.selectControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.select
        );
        this.arrayControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.array
        );
        this.childrenControl = this.findControlPlugin(
            hasCustomControlPlugins,
            ControlType.children
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

    private getClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.form", "");

        if (typeof this.props.className === "string") {
            classNames = `${classNames} ${this.props.className}`;
        }

        return classNames;
    }

    /**
     * Update the state when a new schema is given
     */
    private updateStateForNewProps(
        props: FormProps,
        updateData: boolean,
        updateSchema: boolean,
        updateLocation: boolean
    ): Partial<FormState> {
        let state: Partial<FormState> = Object.assign(
            {},
            {
                activeDataLocation: updateSchema ? "" : this.state.activeDataLocation,
            }
        );

        if (isDifferentSchema(this.rootSchema, props.schema)) {
            // Clean cache for validation if root schema is changed to free memory.
            removeAllCachedValidation();

            // The schema must be set before any other state updates occur so that
            // the correct schema is used for state navigation
            this.rootSchema = props.schema;

            state.validationErrors = getValidationErrors(
                this.rootSchema,
                this.getDataForValidation(props)
            );
        }

        if (!updateSchema && updateData) {
            state = this.getStateForUpdatedData(props, state);
        }

        if (updateLocation) {
            state = Object.assign(
                {},
                state,
                this.getStateWithUpdatedLocation(props, state)
            );
        }

        if (updateData || updateSchema || updateLocation) {
            return state;
        }
    }

    /**
     * Gets the updated state object due to updated data
     */
    private getStateForUpdatedData(
        props: FormProps,
        state: Partial<FormState>
    ): Partial<FormState> {
        const updatedState: Partial<FormState> = {
            validationErrors: getValidationErrors(
                this.rootSchema,
                this.getDataForValidation(props)
            ),
        };

        this.state.navigationInstance.updateData(
            props.data,
            (navigation: NavigationItem[]) => {
                updatedState.navigation = navigation;
            }
        );

        return Object.assign({}, state, updatedState);
    }

    /**
     * Gets the data to use for validation against the JSON schema
     */
    private getDataForValidation(props: FormProps): any {
        return typeof props._UNSAFE_validationData !== "undefined"
            ? props._UNSAFE_validationData
            : props.data;
    }

    /**
     * Gets the state with updated location
     */
    private getStateWithUpdatedLocation(
        props: FormProps,
        state: Partial<FormState>
    ): Partial<FormState> {
        const dataLocation: string = get(props, "location.dataLocation");
        const location: FormLocation = props.location
            ? {
                  dataLocation: props.location.dataLocation,
                  onChange: props.location.onChange,
              }
            : void 0;
        const locationState: Partial<FormState> = {
            activeDataLocation:
                props.location && props.location.dataLocation
                    ? props.location.dataLocation
                    : "",
            location,
        };

        if (typeof dataLocation !== "undefined") {
            this.state.navigationInstance.updateDataLocation(
                dataLocation,
                (updatedNavigation: NavigationItem[]) => {
                    locationState.navigation = updatedNavigation;
                }
            );
        }

        return Object.assign({}, state, locationState);
    }

    /**
     * Generates the breadcrumb navigation
     */
    private renderBreadcrumbs(): JSX.Element {
        const breadcrumbs: BreadcrumbItem[] = getBreadcrumbs(
            this.state.navigation,
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

    private getData(propKey: string, location: string): any {
        return isRootLocation(this.state.activeDataLocation)
            ? this[location][propKey]
            : get(this[location][propKey], this.state.activeDataLocation);
    }

    /**
     * Render the section to be shown
     */
    private renderSection(): React.ReactNode {
        let control: BareControlPlugin = this.sectionControl;
        const lastNavigationItem: NavigationItem = this.state.navigation[
            this.state.navigation.length - 1
        ];

        const sectionSchema: any = get(
            lastNavigationItem.schema,
            lastNavigationItem.schemaLocation,
            lastNavigationItem.schema
        );

        // Check to see if there is any associated `formControlId`
        // then check for the id within the passed controlPlugins
        if (typeof sectionSchema.formControlId === "string") {
            control = this.props.controlPlugins.find(
                (controlPlugin: StandardControlPlugin) => {
                    return controlPlugin.matchesId(sectionSchema.formControlId);
                }
            );
        }

        control.updateProps({
            index: 0,
            type: ControlType.section,
            required: false,
            label: sectionSchema.title || this.untitled,
            invalidMessage: "",
            component: this.controlComponents[ControlType.section],
            schema: sectionSchema,
            controls: {
                button: this.buttonControl,
                array: this.arrayControl,
                checkbox: this.checkboxControl,
                children: this.childrenControl,
                display: this.displayControl,
                textarea: this.textareaControl,
                select: this.selectControl,
                section: this.sectionControl,
                sectionLink: this.sectionLinkControl,
                numberField: this.numberFieldControl,
            },
            controlPlugins: this.props.controlPlugins,
            controlComponents: this.controlComponents,
            onChange: this.handleOnChange,
            onUpdateSection: this.handleUpdateActiveSection,
            data: this.getData("data", "props"),
            schemaLocation: lastNavigationItem.schemaLocation,
            default: lastNavigationItem.default,
            disabled: get(lastNavigationItem, "schema.disabled"),
            dataLocation: this.state.activeDataLocation,
            untitled: this.untitled,
            childOptions: this.props.childOptions,
            validationErrors: this.state.validationErrors,
            displayValidationBrowserDefault: this.props.displayValidationBrowserDefault,
            displayValidationInline: this.props.displayValidationInline,
        });

        return control.render();
    }

    private handleBreadcrumbClick = (
        schemaLocation: string,
        dataLocation: string,
        schema: any
    ): BreadcrumbItemEventHandler => {
        return (e: React.MouseEvent): void => {
            e.preventDefault();

            this.handleUpdateActiveSection({ schemaLocation, dataLocation, schema });
        };
    };

    private handleOnChange = (config: OnChangeConfig): void => {
        let obj: any = cloneDeep(this.props.data);
        const currentData: any =
            config.dataLocation === "" ? obj : get(obj, config.dataLocation);

        if (config.isArray) {
            let newArray: any[];

            if (typeof config.index !== "undefined") {
                newArray = currentData.filter((item: any, itemIndex: number) => {
                    return itemIndex !== config.index;
                });
            } else {
                newArray = currentData;
                newArray.push(config.value);
            }

            config.dataLocation === ""
                ? (obj = newArray)
                : set(obj, config.dataLocation, newArray);
        } else {
            if (typeof config.value === "undefined") {
                config.dataLocation === ""
                    ? (obj = void 0)
                    : unset(obj, config.dataLocation);
            } else {
                config.dataLocation === ""
                    ? (obj = config.value)
                    : set(obj, config.dataLocation, config.value);
            }
        }

        this.props.onChange(obj);
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
    private handleUpdateActiveSection = (config: UpdateSectionConfig): void => {
        if (this.props.location && this.props.location.onChange) {
            this.props.location.onChange(config.dataLocation);
        } else {
            const state: Partial<FormState> = getActiveComponentAndSection(
                config.schemaLocation,
                config.dataLocation,
                config.schema
            );

            this.state.navigationInstance.updateDataLocation(
                config.dataLocation,
                (updatedNavigation: NavigationItem[]) => {
                    state.navigation = updatedNavigation;
                }
            );

            this.setState(state as FormState);
        }
    };
}

export { FormChildOptionItem, FormClassNameContract };
export default manageJss(styles)(Form);
