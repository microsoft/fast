import * as React from "react";
import * as ReactDOM from "react-dom";
import { cloneDeep, get, set, unset } from "lodash-es";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { getExample } from "@microsoft/fast-permutator";
import Form from "../src";
import {
    IChildOptionItem,
    IFormAttributeSettingsMappingToPropertyNames,
    IFormComponentMappingToPropertyNamesProps,
    IFormOrderByPropertyNamesProps,
    IFormProps
} from "../src/form/form.props";
import * as testComponents from "./components";

export type componentDataOnChange = (e: React.ChangeEvent<HTMLFormElement>) => void;

export interface IAppState {
    currentControlledComponent: any;
    currentControlledComponentSchema: any;
    currentControlledComponentData: any;
    currentControlledComponentConfig?: IFormComponentMappingToPropertyNamesProps;
    currentControlledComponentOrderByPropertyNames?: IFormOrderByPropertyNamesProps;
    currentControlledComponentAttributeAssignment?: IFormAttributeSettingsMappingToPropertyNames;
    controlledOnChange: componentDataOnChange;
    currentUncontrolledComponent: any;
    currentUncontrolledComponentSchema: any;
    currentUncontrolledComponentData: any;
    currentUncontrolledComponentConfig?: IFormComponentMappingToPropertyNamesProps;
    currentUncontrolledComponentOrderByPropertyNames?: IFormOrderByPropertyNamesProps;
    currentUncontrolledComponentAttributeAssignment?: IFormAttributeSettingsMappingToPropertyNames;
    uncontrolledOnChange: componentDataOnChange;
    showExtendedControls: boolean;
    dataLocation: string;
    schemaLocation: string;
}

export interface IOption {
    currentComponentSchema: any;
    currentComponentData: any;
    currentComponent: JSX.Element;
}

export interface IGroupItem {
    items: any;
    type: string;
}

const designSystemDefaults: any = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4"
};

export default class App extends React.Component<{}, IAppState> {

    /**
     * These are the children that can be added
     */
    private childOptions: IChildOptionItem[];

    constructor(props: {}) {
        super(props);

        this.childOptions = this.getChildOptions();
        this.controlledOnChange = this.controlledOnChange.bind(this);
        this.uncontrolledOnChange = this.uncontrolledOnChange.bind(this);

        this.state = {
            currentControlledComponent: testComponents.textField.component,
            currentControlledComponentSchema: testComponents.textField.schema,
            currentControlledComponentData: getExample(testComponents.textField.schema),
            currentControlledComponentOrderByPropertyNames: void(0),
            currentControlledComponentAttributeAssignment: void(0),
            currentUncontrolledComponent: testComponents.textField.component,
            currentUncontrolledComponentSchema: testComponents.textField.schema,
            currentUncontrolledComponentData: getExample(testComponents.textField.schema),
            currentUncontrolledComponentOrderByPropertyNames: void(0),
            currentUncontrolledComponentAttributeAssignment: void(0),
            controlledOnChange: this.controlledOnChange,
            uncontrolledOnChange: this.uncontrolledOnChange,
            showExtendedControls: false,
            schemaLocation: "",
            dataLocation: ""
        };
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={designSystemDefaults}>
                <div style={{float: "left", width: "50%"}}>
                    <div>
                        <div
                            style={{width: "300px", minHeight: "100vh", padding: "0 8px", background: "rgb(244, 245, 246)", float: "left", display: "inline-block"}}
                        >
                            <Form {...this.coerceControlledFormProps()} />
                        </div>
                        <div style={{display: "inline-block"}}>
                            <h2>Controlled</h2>
                            <div>
                                <select onChange={this.handleControlledComponentUpdate}>
                                    {this.getComponentOptions()}
                                </select>
                            </div>
                            <this.state.currentControlledComponent
                                {...this.state.currentControlledComponentData}
                            />
                        </div>
                    </div>
                </div>
                <div style={{float: "left", width: "50%"}}>
                    <div>
                        <div
                            style={{width: "300px", minHeight: "100vh", padding: "0 8px", background: "rgb(244, 245, 246)", float: "left", display: "inline-block"}}
                        >
                            <Form {...this.coerceUncontrolledFormProps()} />
                        </div>
                        <div style={{display: "inline-block"}}>
                            <h2>Uncontrolled</h2>
                            <div>
                                <select onChange={this.handleUncontrolledComponentUpdate}>
                                    {this.getComponentOptions()}
                                </select>
                            </div>
                            <this.state.currentUncontrolledComponent
                                {...this.state.currentUncontrolledComponentData}
                            />
                        </div>
                    </div>
                </div>
            </DesignSystemProvider>
        );
    }

    /**
     * Gets the child options for the schema form
     */
    private getChildOptions(): IChildOptionItem[] {
        const childOptions: IChildOptionItem[] = [];
        const groups: IGroupItem[] = [
            {
                items: testComponents,
                type: "components"
            }
        ];

        for (const group of groups) {
            Object.keys(group.items).map((itemName: any, key: number): void => {
                if (typeof testComponents[itemName].schema !== "undefined") {
                    const childObj: IChildOptionItem = {
                        name: testComponents[itemName].schema.title || "Untitled",
                        component: testComponents[itemName].component,
                        schema: testComponents[itemName].schema
                    };

                    childOptions.push(childObj);
                }
            });
        }

        return childOptions;
    }

    private coerceControlledFormProps(): IFormProps {
        const formProps: IFormProps = {
            schema: this.state.currentControlledComponentSchema,
            data: this.state.currentControlledComponentData,
            onChange: this.state.controlledOnChange,
            childOptions: this.childOptions,
            componentMappingToPropertyNames: this.state.currentControlledComponentConfig,
            attributeSettingsMappingToPropertyNames: this.state.currentControlledComponentAttributeAssignment,
            orderByPropertyNames: this.state.currentControlledComponentOrderByPropertyNames,
            location: {
                dataLocation: this.state.dataLocation,
                schemaLocation: this.state.schemaLocation,
                onChange: this.handleLocationOnChange
            }
        };

        return formProps;
    }

    private coerceUncontrolledFormProps(): IFormProps {
        const formProps: IFormProps = {
            schema: this.state.currentUncontrolledComponentSchema,
            data: this.state.currentUncontrolledComponentData,
            onChange: this.state.uncontrolledOnChange,
            childOptions: this.childOptions,
            componentMappingToPropertyNames: this.state.currentUncontrolledComponentConfig,
            attributeSettingsMappingToPropertyNames: this.state.currentUncontrolledComponentAttributeAssignment,
            orderByPropertyNames: this.state.currentUncontrolledComponentOrderByPropertyNames
        };

        return formProps;
    }

    /**
     * Handles the change in location
     */
    private handleLocationOnChange = (schemaLocation: string, dataLocation: string): void => {
        this.setState({
            schemaLocation,
            dataLocation
        });
    }

    /**
     * The app on change event
     */
    private controlledOnChange = (data: any): void => {
        this.setState({
            currentControlledComponentData: data
        });
    }

    /**
     * The app on change event
     */
    private uncontrolledOnChange = (data: any): void => {
        this.setState({
            currentUncontrolledComponentData: data
        });
    }

    private handleControlledComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            currentControlledComponent: testComponents[e.target.value].component,
            currentControlledComponentSchema: testComponents[e.target.value].schema,
            currentControlledComponentConfig: testComponents[e.target.value].config,
            currentControlledComponentData: getExample(testComponents[e.target.value].schema),
            currentControlledComponentOrderByPropertyNames: testComponents[e.target.value].weight,
            currentControlledComponentAttributeAssignment: testComponents[e.target.value].attributeAssignment,
            dataLocation: "",
            schemaLocation: ""
        });
    }

    private handleUncontrolledComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            currentUncontrolledComponent: testComponents[e.target.value].component,
            currentUncontrolledComponentSchema: testComponents[e.target.value].schema,
            currentUncontrolledComponentConfig: testComponents[e.target.value].config,
            currentUncontrolledComponentData: getExample(testComponents[e.target.value].schema),
            currentUncontrolledComponentOrderByPropertyNames: testComponents[e.target.value].weight,
            currentUncontrolledComponentAttributeAssignment: testComponents[e.target.value].attributeAssignment
        });
    }

    private getComponentOptions(): JSX.Element[] {
        return Object.keys(testComponents).map((testComponentKey: any, index: number) => {
            return (
                <option key={index}>{testComponents[testComponentKey].schema.id}</option>
            );
        });
    }
}

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);
const bodyStyle: HTMLElement = document.createElement("style");
bodyStyle.innerHTML = "body {padding: 0; margin: 0;}";
document.body.appendChild(bodyStyle);

/**
 * Primary render function for app. Called on store updates
 */
ReactDOM.render(
    <App />,
    document.getElementById("root")
);
