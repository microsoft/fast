import React from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { ModularForm, ModularNavigation } from "../../src";
import * as testConfigs from "./form/";
import {
    getDataFromSchema,
    MessageSystem,
    MessageSystemType,
} from "@microsoft/fast-tooling";
const designSystemDefaults = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
};
let fastMessageSystem;
class FormAndNavigationTestPage extends React.Component {
    constructor(props) {
        super(props);
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
        this.handleMessageSystem = e => {
            switch (e.data.type) {
                case MessageSystemType.initialize:
                    if (e.data.data && e.data.navigation) {
                        this.setState({
                            data: e.data.data,
                            dataDictionary: e.data.dataDictionary,
                            navigation: e.data.navigation,
                        });
                    }
                    break;
                case MessageSystemType.data:
                    if (e.data.data) {
                        this.setState({
                            data: e.data.data,
                            dataDictionary: e.data.dataDictionary,
                        });
                    }
                    break;
                case MessageSystemType.navigation:
                    if (e.data.navigation) {
                        this.setState({
                            data: e.data.navigation,
                            dataDictionary: e.data.dataDictionary,
                        });
                    }
                    break;
            }
        };
        this.handleComponentUpdate = e => {
            const data = !!testConfigs[e.target.value].data
                ? testConfigs[e.target.value].data
                : getDataFromSchema(testConfigs[e.target.value].schema);
            if (window.Worker && fastMessageSystem) {
                fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    data: [
                        {
                            "": {
                                schemaId: testConfigs[e.target.value].schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    schemaDictionary: this.generateSchemaDictionary(),
                });
            }
        };
        this.childOptions = this.getChildOptions();
        const exampleData = getDataFromSchema(testConfigs.textField.schema);
        if (window.Worker) {
            fastMessageSystem = new MessageSystem({
                webWorker: "message-system.js",
                dataDictionary: [
                    {
                        "": {
                            schemaId: testConfigs.textField.schema.id,
                            data: exampleData,
                        },
                    },
                    "",
                ],
                schemaDictionary: this.generateSchemaDictionary(),
            });
            fastMessageSystem.add({ onMessage: this.handleMessageSystem });
        }
        this.state = {
            schema: testConfigs.textField.schema,
            data: exampleData,
            dataDictionary: [
                {
                    "": {
                        schemaId: testConfigs.textField.schema.id,
                        data: exampleData,
                    },
                },
                "",
            ],
            navigation: void 0,
            showExtendedControls: false,
            dataLocation: "",
            inlineErrors: void 0,
            defaultBrowserErrors: void 0,
        };
    }
    render() {
        return (
            <DesignSystemProvider designSystem={designSystemDefaults}>
                <div>
                    <div
                        style={{
                            width: "300px",
                            height: "100vh",
                            float: "left",
                            fontFamily:
                                "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
                        }}
                    >
                        {this.renderNavigation()}
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
                            {JSON.stringify(this.state.dataDictionary, null, 2)}
                        </pre>
                        <pre>{this.state.dataLocation}</pre>
                    </div>
                    <div
                        style={{
                            width: "300px",
                            height: "100vh",
                            float: "left",
                            fontFamily:
                                "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
                        }}
                    >
                        <ModularForm {...this.coerceFormProps()} />
                    </div>
                </div>
            </DesignSystemProvider>
        );
    }
    renderNavigation() {
        return <ModularNavigation messageSystem={fastMessageSystem} />;
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
    coerceFormProps() {
        const formProps = {
            messageSystem: fastMessageSystem,
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
export { FormAndNavigationTestPage };
