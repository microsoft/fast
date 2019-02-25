import * as React from "react";
import * as ReactDOM from "react-dom";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { FormPlugin, FormPluginProps } from "../src";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
    FormComponentMappingToPropertyNamesProps,
    FormLocation,
    FormOrderByPropertyNamesProps,
    FormProps,
} from "../src/form/form.props";
import * as testConfigs from "./configs";
import { StringUpdateSchemaPlugin } from "./configs/plugin/plugin";
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
    controlled: ControlledState;
}

export interface Option {
    Schema: any;
    Data: any;
}

export interface GroupItem {
    items: any;
    type: string;
}

enum ControlledState {
    controlled = "controlled",
    uncontrolled = "uncontrolled",
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
    private childOptions: FormChildOptionItem[];

    /**
     * The plugins initialized for the mapPluginsToForm mapper
     */
    private plugins: Array<FormPlugin<FormPluginProps>>;

    constructor(props: {}) {
        super(props);

        this.childOptions = this.getChildOptions();
        this.onChange = this.onChange.bind(this);

        this.plugins = [
            new StringUpdateSchemaPlugin({
                id: "plugins/pluginModifiedString",
            }),
        ];

        const exampleData: any = getExample(testConfigs.textField.schema);

        this.state = {
            schema: testConfigs.textField.schema,
            data: exampleData,
            orderByPropertyNames: void 0,
            attributeAssignment: void 0,
            onChange: this.onChange,
            showExtendedControls: false,
            dataLocation: "",
            controlled: ControlledState.uncontrolled,
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
                            height: "100vh",
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
                            <button
                                onClick={this.handleUpdateControlledState(
                                    ControlledState.controlled
                                )}
                                style={this.getStyle(ControlledState.controlled)}
                            >
                                Controlled
                            </button>
                            <button
                                onClick={this.handleUpdateControlledState(
                                    ControlledState.uncontrolled
                                )}
                                style={this.getStyle(ControlledState.uncontrolled)}
                            >
                                Uncontrolled
                            </button>
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
    private getChildOptions(): FormChildOptionItem[] {
        const childOptions: FormChildOptionItem[] = [];
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
                        const childObj: FormChildOptionItem = {
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
            plugins: this.plugins,
            onSchemaChange: this.handleSchemaChange,
            childOptions: this.childOptions,
            componentMappingToPropertyNames: this.state.config,
            attributeSettingsMappingToPropertyNames: this.state.attributeAssignment,
            orderByPropertyNames: this.state.orderByPropertyNames,
        };

        if (this.state.controlled === ControlledState.uncontrolled) {
            return formProps;
        } else {
            const location: FormLocation = {
                dataLocation: this.state.dataLocation,
                onChange: this.handleLocationOnChange,
            };

            return {
                ...formProps,
                location,
            };
        }
    }

    /**
     * Handles the change in schema
     */
    private handleSchemaChange = (schema: any): void => {
        this.setState({
            schema,
        });
    };

    /**
     * Handles the change in location
     */
    private handleLocationOnChange = (dataLocation: string): void => {
        this.setState({
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

    private getStyle(controlledState: ControlledState): any {
        if (controlledState === this.state.controlled) {
            return {
                background: "#414141",
                color: "white",
            };
        }
    }

    private handleUpdateControlledState = (
        controlledState: ControlledState
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.setState({
                controlled: controlledState,
            });
        };
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
