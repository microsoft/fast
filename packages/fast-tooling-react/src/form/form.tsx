import ajv, { Ajv, ErrorObject, ValidateFunction } from "ajv";
import {
    BreadcrumbItemEventHandler,
    FormChildOptionItem,
    FormClassNameContract,
    FormLocation,
    FormProps,
    FormState,
} from "./form.props";
import { cloneDeep, get, set, unset } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import FormSection from "./form-section";
import React from "react";
import styles from "./form.style";
import {
    getActiveComponentAndSection,
    isDifferentSchema,
    isModifiedSchema,
    isRootLocation,
} from "./utilities";
import { mapPluginsToSchema } from "./utilities";
import Navigation, { NavigationItem } from "./utilities/navigation";
import { BreadcrumbItem, getBreadcrumbs } from "./utilities/breadcrumb";
import {
    ArrayControlConfig,
    ChildrenControlConfig,
    CommonControlConfig,
    ControlConfig,
    ControlContext,
    ControlType,
    ListControlConfig,
    NumberFieldTypeControlConfig,
    OnChangeConfig,
    SectionLinkControlConfig,
    StandardControlPlugin,
    TextareaControlConfig,
    UpdateSectionConfig,
} from "./templates";
import {
    ArrayControl,
    ButtonControl,
    CheckboxControl,
    ChildrenControl,
    DisplayControl,
    NumberFieldControl,
    SectionLinkControl,
    SelectControl,
    TextareaControl,
} from "./controls";
import { SingleLineControlPlugin } from "./templates/plugin.control.single-line";

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
        if (state.schema !== props.schema) {
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
     * The validator
     */
    private validator: Ajv;

    /**
     * The default form controls
     */
    private selectControl: StandardControlPlugin;
    private displayControl: StandardControlPlugin;
    private sectionLinkControl: StandardControlPlugin;
    private checkboxControl: SingleLineControlPlugin;
    private numberFieldControl: StandardControlPlugin;
    private textareaControl: StandardControlPlugin;
    private arrayControl: StandardControlPlugin;
    private childrenControl: StandardControlPlugin;
    private buttonControl: StandardControlPlugin;

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
        this.validator = new ajv({ schemaId: "auto", allErrors: true });
        this.rootSchema = mapPluginsToSchema(
            this.props.schema,
            this.props.data,
            this.props.plugins
        );
        const navigationInstance: Navigation = new Navigation({
            dataLocation: typeof dataLocation === "string" ? dataLocation : "",
            data: this.props.data,
            schema: this.props.schema,
            childOptions: this.props.childOptions ? this.props.childOptions : [],
        });

        if (
            typeof this.props.onSchemaChange === "function" &&
            isModifiedSchema(this.rootSchema, this.props.schema)
        ) {
            this.props.onSchemaChange(this.rootSchema);
        }

        this.updateControls();

        this.state = {
            titleProps:
                this.rootSchema && this.rootSchema.title
                    ? this.rootSchema.title
                    : this.untitled,
            activeDataLocation:
                props.location && typeof props.location === "string"
                    ? props.location
                    : "",
            schema: this.props.schema,
            navigationInstance,
            navigation: navigationInstance.get(),
            validationErrors: this.getValidationErrors(props),
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
        if (hasCustomControlPlugins) {
            const controlPlugin: StandardControlPlugin = this.props.controlPlugins.find(
                (control: StandardControlPlugin): boolean => {
                    return control.matchesType(type);
                }
            );

            if (controlPlugin !== undefined) {
                return controlPlugin;
            }
        }

        switch (type) {
            case ControlType.select:
                return new StandardControlPlugin({
                    type: ControlType.select,
                    control: (config: ListControlConfig): React.ReactNode => {
                        return <SelectControl {...config} />;
                    },
                });
            case ControlType.array:
                return new StandardControlPlugin({
                    context: ControlContext.fill,
                    type: ControlType.array,
                    control: (config: ArrayControlConfig): React.ReactNode => {
                        return <ArrayControl {...config} />;
                    },
                });
            case ControlType.children:
                return new StandardControlPlugin({
                    context: ControlContext.fill,
                    type: ControlType.children,
                    control: (config: ChildrenControlConfig): React.ReactNode => {
                        return <ChildrenControl {...config} />;
                    },
                });
            case ControlType.numberField:
                return new StandardControlPlugin({
                    type: ControlType.numberField,
                    control: (config: NumberFieldTypeControlConfig): React.ReactNode => {
                        return <NumberFieldControl {...config} />;
                    },
                });
            case ControlType.checkbox:
                return new SingleLineControlPlugin({
                    type: ControlType.checkbox,
                    control: (config: CommonControlConfig): React.ReactNode => {
                        return <CheckboxControl {...config} />;
                    },
                });
            case ControlType.sectionLink:
                return new StandardControlPlugin({
                    type: ControlType.sectionLink,
                    control: (config: SectionLinkControlConfig): React.ReactNode => {
                        return <SectionLinkControl {...config} />;
                    },
                });
            case ControlType.textarea:
                return new StandardControlPlugin({
                    type: ControlType.textarea,
                    control: (config: TextareaControlConfig): React.ReactNode => {
                        return <TextareaControl {...config} />;
                    },
                });
            case ControlType.display:
                return new StandardControlPlugin({
                    type: ControlType.display,
                    control: (config: ControlConfig): React.ReactNode => {
                        return <DisplayControl {...config} />;
                    },
                });
            case ControlType.button:
                return new StandardControlPlugin({
                    type: ControlType.button,
                    control: (config: ControlConfig): React.ReactNode => {
                        return <ButtonControl {...config} />;
                    },
                });
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
    }

    private getClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.form", "");

        if (typeof this.props.className === "string") {
            classNames = `${classNames} ${this.props.className}`;
        }

        return classNames;
    }

    /**
     * Gets the validation errors
     */
    private getValidationErrors(props: FormProps): ErrorObject[] | void {
        this.validator.removeSchema(this.rootSchema.id);
        const validate: ValidateFunction = this.validator.compile(this.rootSchema);
        const isValid: boolean | PromiseLike<any> = validate(props.data);

        if (!!!isValid) {
            return validate.errors;
        }
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
        const updatedSchema: any = mapPluginsToSchema(
            props.schema,
            props.data,
            props.plugins
        );

        if (isModifiedSchema(this.rootSchema, updatedSchema)) {
            // The schema must be set before any other state updates occur so that
            // the correct schema is used for state navigation
            this.rootSchema = updatedSchema;

            if (typeof props.onSchemaChange === "function") {
                props.onSchemaChange(this.rootSchema);
            }
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
            validationErrors: this.getValidationErrors(props),
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
        const lastNavigationItem: NavigationItem = this.state.navigation[
            this.state.navigation.length - 1
        ];
        const currentSchema: any = mapPluginsToSchema(
            lastNavigationItem.schema,
            this.props.data,
            this.props.plugins
        );

        return (
            <FormSection
                schema={get(
                    currentSchema,
                    lastNavigationItem.schemaLocation,
                    currentSchema
                )}
                controls={{
                    button: this.buttonControl,
                    array: this.arrayControl,
                    checkbox: this.checkboxControl,
                    children: this.childrenControl,
                    display: this.displayControl,
                    textarea: this.textareaControl,
                    select: this.selectControl,
                    sectionLink: this.sectionLinkControl,
                    numberField: this.numberFieldControl,
                }}
                controlPlugins={this.props.controlPlugins}
                onChange={this.handleOnChange}
                onUpdateSection={this.handleUpdateActiveSection}
                data={this.getData("data", "props")}
                schemaLocation={lastNavigationItem.schemaLocation}
                default={lastNavigationItem.default}
                disabled={currentSchema.disabled}
                dataLocation={this.state.activeDataLocation}
                untitled={this.untitled}
                childOptions={this.props.childOptions}
                validationErrors={this.state.validationErrors}
                displayValidationBrowserDefault={
                    this.props.displayValidationBrowserDefault
                }
                displayValidationInline={this.props.displayValidationInline}
            />
        );
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
