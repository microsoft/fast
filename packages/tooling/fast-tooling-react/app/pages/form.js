import * as testConfigs from "./form/";
import { AlignControl, Form } from "../../src";
import { StandardControlPlugin, TextAlignControl } from "../../src";
import CSSControl from "../../src/form/custom-controls/control.css";
import { properties as allCSSProperties } from "@microsoft/fast-tooling/dist/esm/css-data";
import React from "react";
import {
    AjvMapper,
    getDataFromSchema,
    MessageSystem,
    MessageSystemType,
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
import { ControlContext } from "../../src/form/templates/types";
import { CSSStandardControlPlugin } from "../../src/form/custom-controls/css";
import { DesignSystem } from "@microsoft/fast-foundation";
import {
    fastCheckbox,
    fastNumberField,
    fastOption,
    fastSelect,
    fastTextField,
} from "@microsoft/fast-components";
import { fastToolingColorPicker } from "@microsoft/fast-tooling/dist/esm/web-components";
DesignSystem.getOrCreate().register(
    fastCheckbox(),
    fastNumberField(),
    fastOption(),
    fastSelect(),
    fastTextField(),
    fastToolingColorPicker({ prefix: "fast-tooling" })
);
const properties = {
    "border-width": allCSSProperties["border-width"],
    "border-style": allCSSProperties["border-style"],
    "border-color": allCSSProperties["border-color"],
    "outline-offset": allCSSProperties["outline-offset"],
    "animation-delay": allCSSProperties["animation-delay"],
};
const dataSets = [
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
let fastMessageSystem;
let ajvMapper;
class FormTestPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleMessageSystem = e => {
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
                            dataDictionary: e.data.dataDictionary,
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
        this.handleCSSOverrideUpdate = () => {
            this.setState({
                cssPropertyOverrides: !this.state.cssPropertyOverrides,
            });
        };
        this.handleDataSetUpdate = e => {
            this.setState({
                data: dataSets[parseInt(e.target.value, 10)].data,
            });
        };
        this.handleShowInlineErrors = e => {
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
        this.handleShowBrowserErrors = e => {
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
        this.handleComponentUpdate = e => {
            const data = !!testConfigs[e.target.value].data
                ? testConfigs[e.target.value].data
                : testConfigs[e.target.value].schema.id ===
                  testConfigs.allControlTypes.schema.id
                ? this.state.dataSet
                : getDataFromSchema(testConfigs[e.target.value].schema);
            if (window.Worker && fastMessageSystem) {
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
        this.childOptions = this.getChildOptions();
        this.controlPlugins = [
            new StandardControlPlugin({
                id: testConfigs.customControl.schema.properties.textAlign.formControlId,
                control: config => {
                    return <TextAlignControl {...config} />;
                },
            }),
            new StandardControlPlugin({
                id: testConfigs.customControl.schema.properties.align.formControlId,
                control: config => {
                    return <AlignControl {...config} />;
                },
            }),
            new StandardControlPlugin({
                id: testConfigs.controlPluginCss.schema.properties.css.formControlId,
                context: ControlContext.fill,
                control: config => {
                    return (
                        <CSSControl
                            css={properties}
                            {...config}
                            key={`${config.dictionaryId}::${config.dataLocation}`}
                        />
                    );
                },
            }),
            new StandardControlPlugin({
                id:
                    testConfigs.controlPluginCssWithOverrides.schema.properties
                        .cssWithOverrides.formControlId,
                control: config => {
                    return (
                        <CSSControl
                            css={properties}
                            key={`${config.dictionaryId}::${config.dataLocation}`}
                            cssControls={[
                                new CSSStandardControlPlugin({
                                    id: "foo",
                                    propertyNames: ["align-content", "align-items"],
                                    control: config => {
                                        const handleChange = propertyName => {
                                            return e => {
                                                config.onChange({
                                                    [propertyName]: e.target.value,
                                                });
                                            };
                                        };
                                        return (
                                            <div>
                                                <div>
                                                    <label htmlFor={"align-content"}>
                                                        align-content
                                                    </label>
                                                    <br />
                                                    <input
                                                        id={"align-content"}
                                                        onChange={handleChange(
                                                            "align-content"
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={"align-items"}>
                                                        align-items
                                                    </label>
                                                    <br />
                                                    <input
                                                        id={"align-items"}
                                                        onChange={handleChange(
                                                            "align-items"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    },
                                }),
                            ]}
                            {...config}
                        />
                    );
                },
            }),
        ];
        const exampleData = getDataFromSchema(testConfigs.controlPluginCss.schema);
        if (window.Worker) {
            fastMessageSystem = new MessageSystem({
                webWorker: "message-system.js",
                dataDictionary: [
                    {
                        foo: {
                            schemaId: testConfigs.controlPluginCss.schema.id,
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
            schema: testConfigs.controlPluginCss.schema,
            data: exampleData,
            dataDictionary: [
                {
                    foo: {
                        schemaId: testConfigs.controlPluginCss.schema.id,
                        data: exampleData,
                    },
                },
                "foo",
            ],
            navigation: void 0,
            showExtendedControls: false,
            inlineErrors: void 0,
            defaultBrowserErrors: void 0,
            dataSet: dataSets[0].data,
            cssPropertyOverrides: false,
        };
    }
    render() {
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
                        <select
                            onChange={this.handleComponentUpdate}
                            defaultValue={testConfigs.controlPluginCss.schema.id}
                        >
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
                    <h2>Data Dictionary</h2>
                    <pre
                        style={{
                            padding: "12px",
                            background: "rgb(244, 245, 246)",
                            borderRadius: "4px",
                        }}
                    >
                        {JSON.stringify(this.state.dataDictionary, null, 2)}
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
    renderDataSetComponentOptions() {
        if (this.state.schema.id === testConfigs.allControlTypes.schema.id) {
            return (
                <select onChange={this.handleDataSetUpdate}>
                    {this.getComponentDataSets()}
                </select>
            );
        }
    }
    generateSchemaDictionary() {
        const schemaDictionary = {};
        Object.keys(testConfigs).forEach(testConfigKey => {
            schemaDictionary[testConfigs[testConfigKey].schema.id] =
                testConfigs[testConfigKey].schema;
        });
        return schemaDictionary;
    }
    /**
     * Gets the child options for the schema form
     */
    getChildOptions() {
        const childOptions = [];
        const groups = [
            {
                items: testConfigs,
                type: "components",
            },
        ];
        for (const group of groups) {
            Object.keys(group.items).map((itemName, key) => {
                if (typeof testConfigs[itemName].schema !== "undefined") {
                    const childObj = {
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
    getComponentDataSets() {
        return dataSets.map((dataSet, index) => {
            return (
                <option key={index} value={index}>
                    {dataSet.displayName}
                </option>
            );
        });
    }
    coerceFormProps() {
        const formProps = {
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
    getComponentOptions() {
        return Object.keys(testConfigs).map((testComponentKey, index) => {
            return <option key={index}>{testConfigs[testComponentKey].schema.id}</option>;
        });
    }
}
export { FormTestPage };
