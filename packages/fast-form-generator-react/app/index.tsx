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
    currentComponentSchema: any;
    currentComponentData: any;
    currentComponentConfig?: IFormComponentMappingToPropertyNamesProps;
    currentComponentOrderByPropertyNames?: IFormOrderByPropertyNamesProps;
    currentComponentAttributeAssignment?: IFormAttributeSettingsMappingToPropertyNames;
    currentComponent: any;
    onChange: componentDataOnChange;
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
    brandColor: "#0078D4",
    lightGrey: "#EEEEEE",
    navigationBarHeight: 48,
    categoryItemComponentMinWidth: 80
};

export default class App extends React.Component<{}, IAppState> {

    /**
     * These are the children that can be added
     */
    private childOptions: IChildOptionItem[];

    /**
     * The schema form attribute settings mapping configuration
     */
    private attributeSettingsMappingToPropertyNames: IFormAttributeSettingsMappingToPropertyNames;

    constructor(props: {}) {
        super(props);

        this.childOptions = this.getChildOptions();
        this.onChange = this.onChange.bind(this);

        this.state = {
            currentComponent: testComponents.arrays.component,
            currentComponentSchema: testComponents.arrays.schema,
            currentComponentData: getExample(testComponents.arrays.schema),
            currentComponentOrderByPropertyNames: void(0),
            currentComponentAttributeAssignment: void(0),
            onChange: this.onChange,
            showExtendedControls: false,
            schemaLocation: void(0),
            dataLocation: void(0)
        };
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={designSystemDefaults}>
                <div>
                    <div
                        style={{width: "300px", height: "100vh", background: "rgb(244, 245, 246)", float: "left"}}
                    >
                        <Form {...this.coerceFormProps()} />
                    </div>
                    <div>
                        <div>
                            <select onChange={this.handleComponentUpdate}>
                                {this.getComponentOptions()}
                            </select>
                        </div>
                        <this.state.currentComponent
                            {...this.state.currentComponentData}
                        />
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

    private coerceFormProps(): IFormProps {
        const formProps: IFormProps = {
            schema: this.state.currentComponentSchema,
            data: this.state.currentComponentData,
            onChange: this.state.onChange,
            childOptions: this.childOptions,
            componentMappingToPropertyNames: this.state.currentComponentConfig,
            attributeSettingsMappingToPropertyNames: this.state.currentComponentAttributeAssignment,
            orderByPropertyNames: this.state.currentComponentOrderByPropertyNames
        };

        if (typeof this.state.dataLocation !== "undefined" && typeof this.state.schemaLocation !== "undefined") {
            formProps.location = {
                dataLocation: this.state.dataLocation,
                schemaLocation: this.state.schemaLocation,
                onChange: this.handleLocationOnChange
            };
        }

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
    private onChange = (data: any): void => {
        this.setState({
            currentComponentData: data
        });
    }

    private handleComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            currentComponent: testComponents[e.target.value].component,
            currentComponentSchema: testComponents[e.target.value].schema,
            currentComponentConfig: testComponents[e.target.value].config,
            currentComponentData: getExample(testComponents[e.target.value].schema),
            currentComponentOrderByPropertyNames: testComponents[e.target.value].weight,
            currentComponentAttributeAssignment: testComponents[e.target.value].attributeAssignment
        });
    }

    private getComponentById(schema: any): JSX.Element {
        const schemaIdItems: string[] = schema.id.split("/");
        const componentNameHyphenated: string = schemaIdItems[schemaIdItems.length - 1];
        const componentNameUnderscored: string = componentNameHyphenated.replace(/-/g, "_");
        /* tslint:disable-next-line*/
        const componentNameCamelCased: string = componentNameHyphenated.replace(/-(.)/g, (letter: string): string => letter.toUpperCase()).replace(/-/g, "");

        const Component: any = testComponents[componentNameCamelCased].component;
        const ComponentProps: any = {
            managedClasses: {}
        };
        ComponentProps.managedClasses[componentNameUnderscored] = componentNameHyphenated;

        return <Component {...Object.assign({}, ComponentProps, getExample(schema))} />;
    }

    private getComponentOptions(): JSX.Element[] {
        return Object.keys(testComponents).map((testComponentKey: any, index: number) => {
            return (
                <option key={index}>{testComponents[testComponentKey].schema.id}</option>
            );
        });
    }

    /**
     * Handles the change to a different component
     */
    private handleChangeComponent = (option: IOption): void => {
        this.setState({
            currentComponentSchema: option.currentComponentSchema,
            currentComponentData: option.currentComponentData,
            currentComponent: option.currentComponent
        });
    }
}

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

/**
 * Primary render function for app. Called on store updates
 */
ReactDOM.render(
    <App />,
    document.getElementById("root")
);
