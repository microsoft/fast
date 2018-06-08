import * as React from "react";
import { cloneDeep, get, set, unset } from "lodash-es";
import {
    ComponentTree,
    IChildOptionItem,
    IComponentItem,
    IFormProps,
    IFormState,
    LocationOnChange
} from "./form.props";
import { IFormSectionProps } from "./form-section.props";
import {
    getActiveComponentAndSection,
    getBreadcrumbItems,
    getComponentTracker,
    getComponentTrackerByLocation,
    getDataCache,
    IBreadcrumbItem,
    isRootLocation
} from "./form.utilities";
import FormSection from "./form-section";
import styles from "./form.style";
import { IFormClassNameContract } from "../class-name-contracts/";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Schema form component definition
 * @extends React.Component
 */
class Form extends React.Component<IFormProps & IManagedClasses<IFormClassNameContract>, IFormState> {

    /**
     * The default untitled string
     */
    private untitled: string;

    /**
     * The root location to start the component tracker on
     */
    private rootComponentTrackerLocation: IComponentItem;

    constructor(props: IFormProps & IManagedClasses<IFormClassNameContract>) {
        super(props);

        this.untitled = "Untitled";
        this.rootComponentTrackerLocation = {
            dataLocation: "",
            schemaLocation: "",
            schema: this.props.schema
        };

        this.state = {
            titleProps: props.schema && props.schema.title ? props.schema.title : this.untitled,
            schema: this.props.schema,
            activeSchemaLocation: "",
            activeDataLocation: "",
            dataCache: this.props.data,
            componentTracker: typeof this.props.location !== "undefined" // Location has been passed
                ? getComponentTracker(
                    this.props.location.schemaLocation,
                    this.props.location.dataLocation,
                    this.props.schema,
                    [this.rootComponentTrackerLocation]
                )
                : [this.rootComponentTrackerLocation]
        };
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.className || null}>
                <form onSubmit={this.handleSubmit}>
                    <h2>{this.state.titleProps}</h2>
                    {this.generateBreadcrumbs()}
                    {this.generateSection()}
                </form>
            </div>
        );
    }

    /**
     * React lifecycle hook
     */
    public componentWillReceiveProps(nextProps: IFormProps): void {
        const state: Partial<IFormState> = this.updateStateForNewProps(
            nextProps,
            this.props.data !== nextProps.data,
            this.props.schema.id !== nextProps.schema.id,
            this.props.location !== nextProps.location
        );

        if (state) {
            this.setState((state as IFormState));
        }
    }

    /**
     * Update the state when a new schema is given
     */
    /* tslint:disable-next-line */
    private updateStateForNewProps(props: IFormProps, updateData: boolean, updateSchema: boolean, updateLocation: boolean): Partial<IFormState> {
        let state: Partial<IFormState> = {};
        this.rootComponentTrackerLocation = {
            dataLocation: "",
            schemaLocation: "",
            schema: props.schema
        };

        if (updateData) {
            state = this.getStateWithUpdatedDataCache(props, state);
        }

        if (updateSchema) {
            state = Object.assign({}, state, this.getStateWithUpdatedFormProps(props, state, this.rootComponentTrackerLocation));
        }

        if (updateLocation) {
            state = Object.assign({}, state, this.getStateWithUpdatedLocation(props, state, this.rootComponentTrackerLocation));
        }

        if (updateData || updateSchema || updateLocation) {
            return state;
        }
    }

    /**
     * Gets the state object with an updated data cache
     */
    private getStateWithUpdatedDataCache(props: IFormProps, state: Partial<IFormState>): Partial<IFormState> {
        const dataCache: any = typeof this.state !== "undefined" && typeof this.state.dataCache !== "undefined"
            ? this.state.dataCache
            : void(0);

        const schemaState: Partial<IFormState> = {
            dataCache: getDataCache(dataCache, props.data)
        };

        return Object.assign({}, state, schemaState);
    }

    /**
     * Gets the state object with updated locations, title and breadcrumbs
     */
    private getStateWithUpdatedFormProps(props: IFormProps, state: Partial<IFormState>, rootLocation: IComponentItem): Partial<IFormState> {
        const schemaState: Partial<IFormState> = {
            titleProps: props.schema && props.schema.title ? props.schema.title : this.untitled,
            schema: props.schema,
            activeSchemaLocation: "",
            activeDataLocation: "",
            dataCache: cloneDeep(props.data),
            componentTracker: getComponentTrackerByLocation(props, rootLocation)
        };

        return (Object.assign({}, state, schemaState) as Partial<IFormState>);
    }

    /**
     * Gets the state with updated location
     */
    private getStateWithUpdatedLocation(props: IFormProps, state: Partial<IFormState>, rootLocation: IComponentItem): Partial<IFormState> {
        const locationState: Partial<IFormState> = {
            activeSchemaLocation: props.location.schemaLocation,
            activeDataLocation: props.location.dataLocation,
            schema: props.schema,
            location: {
                dataLocation: props.location.dataLocation,
                schemaLocation: props.location.schemaLocation,
                onChange: props.location.onChange
            },
            componentTracker: getComponentTrackerByLocation(props, rootLocation)
        };

        return Object.assign({}, state, locationState);
    }

    private getUpdateLocationCallback(): LocationOnChange | undefined {
        return this.props.location && this.props.location.onChange ? this.props.location.onChange : void(0);
    }

    /**
     * Generates the breadcrumb navigation
     */
    private generateBreadcrumbs(): JSX.Element {
        let breadcrumbs: IBreadcrumbItem[];

        if (typeof this.state.componentTracker !== "undefined") {
            breadcrumbs = [];

            this.state.componentTracker.forEach((component: IComponentItem) => {
                breadcrumbs = breadcrumbs.concat(getBreadcrumbItems({
                    activeSchemaLocation: component.schemaLocation,
                    activeDataLocation: component.dataLocation,
                    schema: component.schema,
                    onUpdateActiveSection: this.handleUpdateActiveSection,
                    onUpdateLocation: this.getUpdateLocationCallback()
                }));
            });
        } else {
            breadcrumbs = getBreadcrumbItems({
                activeSchemaLocation: this.state.activeSchemaLocation,
                activeDataLocation: this.state.activeDataLocation,
                schema: this.props.schema,
                onUpdateActiveSection: this.handleUpdateActiveSection,
                onUpdateLocation: this.getUpdateLocationCallback()
            });
        }

        if (breadcrumbs.length > 1) {
            return <ul className={this.props.managedClasses.form_breadcrumbs}>{this.generateBreadcrumbItems(breadcrumbs)}</ul>;
        }
    }

    private generateBreadcrumbItems(items: IBreadcrumbItem[]): JSX.Element[] {
        return items.map((item: IBreadcrumbItem, index: number): JSX.Element => {
            if (index === items.length - 1) {
                return <li key={index}><span>{item.text}</span></li>;
            }

            return <li key={index}><a href={item.href} onClick={item.onClick}>{item.text}</a></li>;
        });
    }

    private getData(propKey: string, location: string): any {
        return isRootLocation(this.state.activeDataLocation)
            ? this[location][propKey]
            : get(this[location][propKey], this.state.activeDataLocation);
    }

    /**
     * Generate the section to be shown
     */
    private generateSection(): JSX.Element {
        const sectionProps: IFormSectionProps = {
            schema: isRootLocation(this.state.activeSchemaLocation)
                ? this.state.schema
                : get(this.state.schema, this.state.activeSchemaLocation) || this.state.schema,
            onChange: this.handleOnChange,
            onUpdateActiveSection: this.handleUpdateActiveSection,
            data: this.getData("data", "props"),
            dataCache: this.getData("dataCache", "state"),
            schemaLocation: this.state.activeSchemaLocation,
            dataLocation: this.state.activeDataLocation,
            untitled: this.untitled,
            childOptions: this.props.childOptions,
            location: this.props.location,
            componentMappingToPropertyNames: this.props.componentMappingToPropertyNames,
            attributeSettingsMappingToPropertyNames: this.props.attributeSettingsMappingToPropertyNames,
            orderByPropertyNames: this.props.orderByPropertyNames
        };

        return <FormSection {...sectionProps} />;
    }

    private handleOnChange = (location: string, data: any, isArray: boolean, index: number): void => {
        let obj: any = cloneDeep(this.props.data);
        const currentData: any = location === "" ? obj : get(obj, location);

        if (isArray) {
            let newArray: any[];

            if (typeof index !== "undefined") {
                newArray = currentData.filter((item: any, itemIndex: number) => {
                    return itemIndex !== index;
                });
            } else {
                newArray = currentData;
                newArray.push(data);
            }

            location === "" ? obj = newArray : set(obj, location, newArray);
        } else {
            if (typeof data === "undefined") {
                location === "" ? obj = void(0) : unset(obj, location);
            } else {
                location === "" ? obj = data : set(obj, location, data);
            }
        }

        if (obj && obj.children && Array.isArray(obj.children) && obj.children.length === 1) {
            obj.children = obj.children[0];
        }

        this.props.onChange(obj);
    }

    /**
     * Handles the form submit
     */
    private handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
    }

    /**
     * Handles an update to the active section and component
     */
    private handleUpdateActiveSection = (schemaLocation: string, dataLocation: string, schema: any): void => {
        const state: Partial<IFormState> = getActiveComponentAndSection(
            schemaLocation,
            dataLocation,
            schema
        );

        state.componentTracker = getComponentTracker(
            schemaLocation,
            dataLocation,
            schema,
            this.state.componentTracker
        );

        this.setState((state as IFormState));
    }
}

export default manageJss(styles)(Form);
