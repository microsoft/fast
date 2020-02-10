import * as testConfigs from "./form/";
import { AlignControl, Form } from "../../src";
import { ControlConfig, StandardControlPlugin, TextAlignControl } from "../../src";
import { FormProps } from "../../src/form/form.props";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
} from "../../src/form/types";

import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import React from "react";
import { getDataFromSchema } from "../../src/data-utilities";
import {
    MessageSystemDataTypeAction,
    MessageSystemType,
} from "../../src/message-system/message-system.props";
import { MessageSystemRegistry } from "../../src/message-system-registry";

export type componentDataOnChange = (e: React.ChangeEvent<HTMLFormElement>) => void;

export interface FormTestPageState {
    schema: any;
    data: any;
    navigation: any;
    attributeAssignment?: FormAttributeSettingsMappingToPropertyNames;
    showExtendedControls: boolean;
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

let fastMessageSystemWebWorker: Worker | void;
let fastMessageSystemRegistry: MessageSystemRegistry;

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

        if ((window as any).Worker) {
            fastMessageSystemWebWorker = new Worker("message-system.js");
            fastMessageSystemRegistry = new MessageSystemRegistry({
                messageSystem: fastMessageSystemWebWorker,
                data: [
                    {
                        foo: {
                            schemaId: testConfigs.textField.schema.id,
                            data: exampleData,
                        },
                    },
                    "foo",
                ],
                schemas: {
                    [testConfigs.textField.schema.id]: testConfigs.textField.schema,
                },
            });
            fastMessageSystemRegistry.add({ onMessage: this.handleMessageSystem });
        }

        this.state = {
            schema: testConfigs.textField.schema,
            data: exampleData,
            navigation: void 0,
            showExtendedControls: false,
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
                        <h2>Data</h2>
                        <pre
                            style={{
                                padding: "12px",
                                background: "rgb(244, 245, 246)",
                                borderRadius: "4px",
                            }}
                        >
                            {JSON.stringify(this.state.data, null, 2)}
                        </pre>
                        <h2>Navigation</h2>
                        <pre
                            style={{
                                padding: "12px",
                                background: "rgb(244, 245, 246)",
                                borderRadius: "4px",
                            }}
                        >
                            {JSON.stringify(this.state.navigation, null, 2)}
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
            messageSystem: fastMessageSystemWebWorker,
            messageSystemRegistry: fastMessageSystemRegistry,
            controls: this.controlPlugins,
        };

        if (typeof this.state.defaultBrowserErrors === "boolean") {
            formProps.displayValidationBrowserDefault = this.state.defaultBrowserErrors;
        }

        if (typeof this.state.inlineErrors === "boolean") {
            formProps.displayValidationInline = this.state.inlineErrors;
        }

        return formProps;
    }

    private handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                if (e.data.data && e.data.navigation) {
                    this.setState({
                        data: e.data.data,
                        navigation: e.data.navigation,
                    });
                }
            case MessageSystemType.data:
                if (e.data.data) {
                    this.setState({
                        data: e.data.data,
                    });
                }
            case MessageSystemType.navigation:
                if (e.data.navigation) {
                    this.setState({
                        data: e.data.navigation,
                    });
                }
        }
    };

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

    private handleComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const data: any = !!testConfigs[e.target.value].data
            ? testConfigs[e.target.value].data
            : testConfigs[e.target.value].schema.id ===
              testConfigs.allControlTypes.schema.id
                ? this.state.dataSet
                : getDataFromSchema(testConfigs[e.target.value].schema);

        if ((window as any).Worker && fastMessageSystemWebWorker) {
            fastMessageSystemWebWorker.postMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        foo: {
                            schemaId: testConfigs[e.target.value].schema.id,
                            data,
                        },
                    },
                    "foo",
                ],
                schemas: {
                    [testConfigs[e.target.value].schema.id]:
                        testConfigs[e.target.value].schema,
                },
            });
        }
    };

    private getComponentOptions(): JSX.Element[] {
        return Object.keys(testConfigs).map((testComponentKey: any, index: number) => {
            return <option key={index}>{testConfigs[testComponentKey].schema.id}</option>;
        });
    }
}

export { FormTestPage };
