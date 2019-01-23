import * as React from "react";
import * as ReactDOM from "react-dom";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { getExample } from "@microsoft/fast-permutator";
import { ChildOptionItem } from "@microsoft/fast-data-utilities-react";
import Form, { mapDataToComponent } from "../src";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormComponentMappingToPropertyNamesProps,
    FormOrderByPropertyNamesProps,
    FormProps,
} from "../src/form/form.props";
import * as testConfigs from "./configs";
import { background300, foreground300 } from "../src/form/form.constants.style";

export type componentDataOnChange = (e: React.ChangeEvent<HTMLFormElement>) => void;

export interface AppState {
    schema: any;
    data: any;
    config?: FormComponentMappingToPropertyNamesProps;
    orderByPropertyNames?: FormOrderByPropertyNamesProps;
    attributeAssignment?: FormAttributeSettingsMappingToPropertyNames;
    onChange: componentDataOnChange;
    showExtendedControls: boolean;
    dataLocation: string;
    schemaLocation: string;
}

export interface Option {
    Schema: any;
    Data: any;
}

export interface GroupItem {
    items: any;
    type: string;
}

const designSystemDefaults: any = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
};

export default class App extends React.Component<{}, AppState> {
    /**
     * These are the children that can be added
     */
    private childOptions: ChildOptionItem[];

    constructor(props: {}) {
        super(props);

        this.childOptions = this.getChildOptions();
        this.onChange = this.onChange.bind(this);

        this.state = {
            schema: testConfigs.textField.schema,
            data: getExample(testConfigs.textField.schema),
            orderByPropertyNames: void 0,
            attributeAssignment: void 0,
            onChange: this.onChange,
            showExtendedControls: false,
            schemaLocation: void 0,
            dataLocation: void 0,
        };
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={designSystemDefaults}>
                <div
                    style={{
                        fontFamily:
                            "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                >
                    <div
                        style={{
                            width: "250px",
                            minHeight: "100vh",
                            padding: "0 0 0 10px",
                            boxSizing: "border-box",
                            color: foreground300,
                            background: background300,
                            float: "left",
                        }}
                    >
                        <Form {...this.coerceFormProps()} />
                    </div>
                    <div
                        style={{
                            float: "left",
                            marginLeft: "8px",
                        }}
                    >
                        <div>
                            <select onChange={this.handleComponentUpdate}>
                                {this.getComponentOptions()}
                            </select>
                        </div>
                        <pre
                            style={{
                                padding: "12px",
                                background: "rgb(244, 245, 246)",
                                borderRadius: "4px",
                            }}
                        >
                            {JSON.stringify(this.state.data, null, 2)}
                        </pre>
                    </div>
                </div>
            </DesignSystemProvider>
        );
    }

    /**
     * Gets the child options for the schema form
     */
    private getChildOptions(): ChildOptionItem[] {
        const childOptions: ChildOptionItem[] = [];
        const groups: GroupItem[] = [
            {
                items: testConfigs,
                type: "components",
            },
        ];

        for (const group of groups) {
            Object.keys(group.items).map(
                (itemName: any, key: number): void => {
                    if (typeof testConfigs[itemName].schema !== "undefined") {
                        const childObj: ChildOptionItem = {
                            name: testConfigs[itemName].schema.title || "Untitled",
                            component: testConfigs[itemName].component,
                            schema: testConfigs[itemName].schema,
                        };

                        childOptions.push(childObj);
                    }
                }
            );
        }

        return childOptions;
    }

    private coerceFormProps(): FormProps {
        const formProps: FormProps = {
            schema: this.state.schema,
            data: this.state.data,
            onChange: this.state.onChange,
            childOptions: this.childOptions,
            componentMappingToPropertyNames: this.state.config,
            attributeSettingsMappingToPropertyNames: this.state.attributeAssignment,
            orderByPropertyNames: this.state.orderByPropertyNames,
        };

        if (
            typeof this.state.dataLocation !== "undefined" &&
            typeof this.state.schemaLocation !== "undefined"
        ) {
            formProps.location = {
                dataLocation: this.state.dataLocation,
                schemaLocation: this.state.schemaLocation,
                onChange: this.handleLocationOnChange,
            };
        }

        return formProps;
    }

    /**
     * Handles the change in location
     */
    private handleLocationOnChange = (
        schemaLocation: string,
        dataLocation: string
    ): void => {
        this.setState({
            schemaLocation,
            dataLocation,
        });
    };

    /**
     * The app on change event
     */
    private onChange = (data: any): void => {
        this.setState({
            data,
        });
    };

    private handleComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const exampleData: any = getExample(testConfigs[e.target.value].schema);

        this.setState({
            schema: testConfigs[e.target.value].schema,
            config: testConfigs[e.target.value].config,
            data: exampleData,
            orderByPropertyNames: testConfigs[e.target.value].weight,
            attributeAssignment: testConfigs[e.target.value].attributeAssignment,
        });
    };

    private getComponentOptions(): JSX.Element[] {
        return Object.keys(testConfigs).map((testComponentKey: any, index: number) => {
            return <option key={index}>{testConfigs[testComponentKey].schema.id}</option>;
        });
    }
}

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);
document.body.setAttribute("style", "margin: 0");

/**
 * Primary render function for app. Called on store updates
 */
ReactDOM.render(<App />, document.getElementById("root"));
