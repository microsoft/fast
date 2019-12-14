import * as testConfigs from "./form/";

import { AlignControl, Form } from "../../src";
import { ControlConfig, StandardControlPlugin, TextAlignControl } from "../../src";
import {
    FormComponentMappingToPropertyNamesProps,
    FormLocation,
    FormOrderByPropertyNamesProps,
    FormProps,
} from "../../src/form/form.props";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
} from "../../src/form/types";

import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import React from "react";
import { getDataFromSchema } from "../../src/data-utilities";

export type componentDataOnChange = (e: React.ChangeEvent<HTMLFormElement>) => void;

export interface FormTestPageState {
    schema: any;
    data: any;
    config?: FormComponentMappingToPropertyNamesProps;
    orderByPropertyNames?: FormOrderByPropertyNamesProps;
    attributeAssignment?: FormAttributeSettingsMappingToPropertyNames;
    onChange: componentDataOnChange;
    showExtendedControls: boolean;
    dataLocation: string;
    controlled: ControlledState;
    defaultBrowserErrors?: boolean;
    inlineErrors?: boolean;
    dataSet?: any;
}

export interface GroupItem {
    items: any;
    type: string;
}

export interface DataSet {
    displayName: string;
    data: any;
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

const dataSets: DataSet[] = [
    {
        displayName: "Data set 1 (all defined)",
        data: {
            textarea: "alpha",
            "section-link": {},
            checkbox: true,
            button: null,
            array: ["foo", "bar"],
            "number-field": 42,
            select: "foo",
        },
    },
    {
        displayName: "Data set 2 (select defined)",
        data: {
            textarea: "beta",
            "section-link": {},
            display: "foobar",
            checkbox: false,
            "number-field": 24,
            select: "bar",
        },
    },
    {
        displayName: "Data set 3 (none defined)",
        data: {},
    },
];

class FormTestPage extends React.Component<{}, FormTestPageState> {
    /**
     * These are the children that can be added
     */
    private childOptions: FormChildOptionItem[];

    /**
     * The custom control plugins used in the form
     */
    private controlPlugins: StandardControlPlugin[];

    constructor(props: {}) {
        super(props);

        this.childOptions = this.getChildOptions();

        this.controlPlugins = [
            new StandardControlPlugin({
                id: testConfigs.customControl.schema.properties.textAlign.formControlId,
                control: (config: ControlConfig): React.ReactNode => {
                    return <TextAlignControl {...config} />;
                },
            }),
            new StandardControlPlugin({
                id: testConfigs.customControl.schema.properties.align.formControlId,
                control: (config: ControlConfig): React.ReactNode => {
                    return <AlignControl {...config} />;
                },
            }),
        ];

        const exampleData: any = getDataFromSchema(testConfigs.textField.schema);

        this.state = {
            schema: testConfigs.textField.schema,
            data: exampleData,
            onChange: this.onChange,
            showExtendedControls: false,
            dataLocation: "",
            controlled: ControlledState.uncontrolled,
            inlineErrors: void 0,
            defaultBrowserErrors: void 0,
            dataSet: dataSets[0].data,
        };
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={designSystemDefaults}>
                <div>
                    <div
                        style={{
                            width: "250px",
                            height: "100vh",
                            float: "left",
                            fontFamily:
                                "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
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
                            {this.renderDataSetComponentOptions()}
                            <br />
                            <br />
                            <input
                                id={"showInlineErrors"}
                                type="checkbox"
                                value={(!!this.state.inlineErrors).toString()}
                                onChange={this.handleShowInlineErrors}
                            />
                            <label htmlFor={"showInlineErrors"}>Show inline errors</label>
                            <br />
                            <input
                                id={"showBrowserErrors"}
                                type="checkbox"
                                value={(!!this.state.defaultBrowserErrors).toString()}
                                onChange={this.handleShowBrowserErrors}
                            />
                            <label htmlFor={"showBrowserErrors"}>
                                Show default browser errors
                            </label>
                            <br />
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

    private renderDataSetComponentOptions(): React.ReactNode {
        if (this.state.schema.id === testConfigs.allControlTypes.schema.id) {
            return (
                <select onChange={this.handleDataSetUpdate}>
                    {this.getComponentDataSets()}
                </select>
            );
        }
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

    private getComponentDataSets(): React.ReactNode {
        return dataSets.map((dataSet: DataSet, index: number) => {
            return (
                <option key={index} value={index}>
                    {dataSet.displayName}
                </option>
            );
        });
    }

    private coerceFormProps(): FormProps {
        const formProps: FormProps = {
            schema: this.state.schema,
            data: this.state.data,
            onChange: this.state.onChange,
            childOptions: this.childOptions,
            controlPlugins: this.controlPlugins,
        };

        if (typeof this.state.defaultBrowserErrors === "boolean") {
            formProps.displayValidationBrowserDefault = this.state.defaultBrowserErrors;
        }

        if (typeof this.state.inlineErrors === "boolean") {
            formProps.displayValidationInline = this.state.inlineErrors;
        }

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

    private handleDataSetUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            data: dataSets[parseInt(e.target.value, 10)].data,
        });
    };

    private handleShowInlineErrors = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.value === "true") {
            this.setState({
                inlineErrors: false,
            });
        } else {
            this.setState({
                inlineErrors: true,
            });
        }
    };

    private handleShowBrowserErrors = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.value === "true") {
            this.setState({
                defaultBrowserErrors: false,
            });
        } else {
            this.setState({
                defaultBrowserErrors: true,
            });
        }
    };

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
        const data: any = !!testConfigs[e.target.value].data
            ? testConfigs[e.target.value].data
            : testConfigs[e.target.value].schema.id ===
              testConfigs.allControlTypes.schema.id
                ? this.state.dataSet
                : getDataFromSchema(testConfigs[e.target.value].schema);

        this.setState({
            schema: testConfigs[e.target.value].schema,
            config: testConfigs[e.target.value].config,
            data,
        });
    };

    private getComponentOptions(): JSX.Element[] {
        return Object.keys(testConfigs).map((testComponentKey: any, index: number) => {
            return <option key={index}>{testConfigs[testComponentKey].schema.id}</option>;
        });
    }
}

export { FormTestPage };
