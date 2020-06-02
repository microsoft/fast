import React from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { ModularForm, ModularNavigation } from "../../src";
import { FormProps } from "../../src/form/form.props";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
} from "../../src/form/types";
import * as testConfigs from "./form/";
import {
    DataDictionary,
    getDataFromSchema,
    MessageSystem,
    MessageSystemType,
    SchemaDictionary,
} from "@microsoft/fast-tooling";

export type componentDataOnChange = (e: React.ChangeEvent<HTMLFormElement>) => void;

export interface FormTestPageState {
    schema: any;
    data: any;
    dataDictionary: DataDictionary<unknown>;
    navigation: any;
    attributeAssignment?: FormAttributeSettingsMappingToPropertyNames;
    showExtendedControls: boolean;
    dataLocation: string;
    defaultBrowserErrors?: boolean;
    inlineErrors?: boolean;
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

let fastMessageSystem: MessageSystem;

class FormAndNavigationTestPage extends React.Component<{}, FormTestPageState> {
    /**
     * These are the children that can be added
     */
    private childOptions: FormChildOptionItem[];

    constructor(props: {}) {
        super(props);

        this.childOptions = this.getChildOptions();

        const exampleData: any = getDataFromSchema(testConfigs.textField.schema);

        if ((window as any).Worker) {
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

    public render(): JSX.Element {
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

    private renderNavigation(): React.ReactNode {
        return <ModularNavigation messageSystem={fastMessageSystem} />;
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

    private coerceFormProps(): FormProps {
        const formProps: FormProps = {
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

    private handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                if (e.data.data && e.data.navigation) {
                    this.setState({
                        data: e.data.data,
                        dataDictionary: e.data.dataDictionary,
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
                        data: e.data.navigation,
                        dataDictionary: e.data.dataDictionary,
                    });
                }
        }
    };

    private handleComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const data: any = !!testConfigs[e.target.value].data
            ? testConfigs[e.target.value].data
            : getDataFromSchema(testConfigs[e.target.value].schema);

        if ((window as any).Worker && fastMessageSystem) {
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

    private getComponentOptions(): JSX.Element[] {
        return Object.keys(testConfigs).map((testComponentKey: any, index: number) => {
            return <option key={index}>{testConfigs[testComponentKey].schema.id}</option>;
        });
    }
}

export { FormAndNavigationTestPage };
