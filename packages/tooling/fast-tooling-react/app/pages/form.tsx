import * as testConfigs from "./form/";
import { AlignControl, Form } from "../../src";
import { ControlConfig, StandardControlPlugin, TextAlignControl } from "../../src";
import CSSControl from "../../src/form/custom-controls/control.css";
import { properties } from "@microsoft/fast-tooling/dist/esm/css-data";
import { FormProps } from "../../src/form/form.props";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
} from "../../src/form/types";
import React from "react";
import {
    AjvMapper,
    getDataFromSchema,
    MessageSystem,
    MessageSystemType,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import {
    accentColorName,
    L1ColorName,
    L4ColorName,
    textColorName,
    L3FillColorName,
    errorColorName,
    FloatingColorName,
} from "../../src/style";
import { CSSPropertiesDictionary } from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";

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
    cssPropertyOverrides: boolean;
}

export interface GroupItem {
    items: any;
    type: string;
}

export interface DataSet {
    displayName: string;
    data: any;
}

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

const CSSpropertyOverrides = {
    [accentColorName]: "blue",
    [L1ColorName]: "white",
    [L4ColorName]: "lightgray",
    [textColorName]: "black",
    [L3FillColorName]: "white",
    [errorColorName]: "green",
    [FloatingColorName]: "purple",
};

let fastMessageSystem: MessageSystem;
let ajvMapper: AjvMapper;

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
            new StandardControlPlugin({
                id: testConfigs.customControl.schema.properties.css.formControlId,
                control: (config: ControlConfig): React.ReactNode => {
                    return (
                        <CSSControl
                            css={(properties as unknown) as CSSPropertiesDictionary}
                            {...config}
                        />
                    );
                },
            }),
        ];

        const exampleData: any = getDataFromSchema(testConfigs.customControl.schema);

        if ((window as any).Worker) {
            fastMessageSystem = new MessageSystem({
                webWorker: "message-system.js",
                dataDictionary: [
                    {
                        foo: {
                            schemaId: testConfigs.customControl.schema.id,
                            data: exampleData,
                        },
                    },
                    "foo",
                ],
                schemaDictionary: this.generateSchemaDictionary(),
            });
            ajvMapper = new AjvMapper({
                messageSystem: fastMessageSystem,
            });
            fastMessageSystem.add({ onMessage: this.handleMessageSystem });
        }

        this.state = {
            schema: testConfigs.customControl.schema,
            data: exampleData,
            navigation: void 0,
            showExtendedControls: false,
            inlineErrors: void 0,
            defaultBrowserErrors: void 0,
            dataSet: dataSets[0].data,
            cssPropertyOverrides: false,
        };
    }

    public render(): JSX.Element {
        return (
            <div style={this.state.cssPropertyOverrides ? CSSpropertyOverrides : {}}>
                <div
                    style={{
                        width: "300px",
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
                            id={"useCSSOverrides"}
                            type={"checkbox"}
                            value={this.state.cssPropertyOverrides.toString()}
                            onChange={this.handleCSSOverrideUpdate}
                        />
                        <label htmlFor={"useCSSOverrides"}>
                            Show CSS property overrides
                        </label>
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

    private generateSchemaDictionary(): SchemaDictionary {
        const schemaDictionary: SchemaDictionary = {};

        Object.keys(testConfigs).forEach((testConfigKey: string) => {
            schemaDictionary[testConfigs[testConfigKey].schema.id] =
                testConfigs[testConfigKey].schema;
        });

        return schemaDictionary;
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
            Object.keys(group.items).map((itemName: any, key: number): void => {
                if (typeof testConfigs[itemName].schema !== "undefined") {
                    const childObj: FormChildOptionItem = {
                        name: testConfigs[itemName].schema.title || "Untitled",
                        component: testConfigs[itemName].component,
                        schema: testConfigs[itemName].schema,
                    };

                    childOptions.push(childObj);
                }
            });
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
            messageSystem: fastMessageSystem,
            controls: this.controlPlugins,
            categories: {
                category: {
                    "": [
                        {
                            title: "String & Boolean",
                            dataLocations: ["string", "boolean"],
                        },
                        {
                            title: "Empty",
                            dataLocations: [],
                        },
                        {
                            title: "No match",
                            dataLocations: ["foo", "bar"],
                        },
                        {
                            title: "Advanced",
                            dataLocations: ["array", "object"],
                            expandByDefault: false,
                        },
                    ],
                    object: [
                        {
                            title: "Test",
                            dataLocations: ["object.string"],
                        },
                    ],
                },
            },
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
                        navigation: e.data.navigation,
                    });
                }
        }
    };

    private handleCSSOverrideUpdate = (): void => {
        this.setState({
            cssPropertyOverrides: !this.state.cssPropertyOverrides,
        });
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

        if ((window as any).Worker && fastMessageSystem) {
            fastMessageSystem.postMessage({
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
                schemaDictionary: this.generateSchemaDictionary(),
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
