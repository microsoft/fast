import { Form, Viewer } from "../../src";
import { FormProps } from "../../src/form/form.props";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import React from "react";
import {
    getDataFromSchema,
    MessageSystem,
    MessageSystemType,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import FancyButton from "./web-components/fancy-button";
import { webComponentSchemas } from "./web-components/index";
import fancyButtonSchema from "./web-components/fancy-button.schema";

export type componentDataOnChange = (e: React.ChangeEvent<HTMLFormElement>) => void;

export interface WebComponentTestPageState {
    data: any;
    navigation: any;
    width: number;
    height: number;
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

class WebComponentTestPage extends React.Component<{}, WebComponentTestPageState> {
    constructor(props: {}) {
        super(props);

        if ((window as any).Worker) {
            fastMessageSystem = new MessageSystem({
                webWorker: "message-system.js",
                dataDictionary: [
                    {
                        foo: {
                            schemaId: fancyButtonSchema.id,
                            data: {},
                        },
                    },
                    "foo",
                ],
                schemaDictionary: this.generateSchemaDictionary(),
            });
            fastMessageSystem.add({ onMessage: this.handleMessageSystem });
        }

        this.state = {
            data: {},
            navigation: void 0,
            height: 500,
            width: 500,
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
                        </div>
                        <Viewer
                            messageSystem={fastMessageSystem}
                            iframeSrc={"/web-components/content"}
                            responsive={true}
                            onUpdateHeight={this.handleViewerUpdateHeight}
                            onUpdateWidth={this.handleViewerUpdateWidth}
                            height={this.state.height}
                            width={this.state.width}
                        />
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

    private generateSchemaDictionary(): SchemaDictionary {
        const schemaDictionary: SchemaDictionary = {};

        Object.keys(webComponentSchemas).forEach((webComponentSchemasKey: string) => {
            schemaDictionary[webComponentSchemas[webComponentSchemasKey].schema.id] =
                webComponentSchemas[webComponentSchemasKey].schema;
        });

        return schemaDictionary;
    }

    private coerceFormProps(): FormProps {
        const formProps: FormProps = {
            messageSystem: fastMessageSystem,
        };

        return formProps;
    }

    private handleViewerUpdateHeight = (height: number): void => {
        this.setState({ height });
    };

    private handleViewerUpdateWidth = (width: number): void => {
        this.setState({ width });
    };

    private handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                if (e.data.dataDictionary && e.data.navigationDictionary) {
                    this.setState({
                        data: e.data.dataDictionary,
                        navigation: e.data.navigationDictionary,
                    });
                }
            case MessageSystemType.data:
                if (e.data.dataDictionary) {
                    this.setState({
                        data: e.data.dataDictionary,
                    });
                }
            case MessageSystemType.navigation:
                if (e.data.navigationDictionary) {
                    this.setState({
                        navigation: e.data.navigationDictionary,
                    });
                }
        }
    };

    private handleComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const data: any = !!webComponentSchemas[e.target.value].data
            ? webComponentSchemas[e.target.value].data
            : getDataFromSchema(webComponentSchemas[e.target.value].schema);

        if ((window as any).Worker && fastMessageSystem) {
            fastMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                data: [
                    {
                        foo: {
                            schemaId: webComponentSchemas[e.target.value].schema.id,
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
        return Object.keys(webComponentSchemas).map(
            (webComponentSchemasKey: any, index: number) => {
                return (
                    <option key={index}>
                        {webComponentSchemas[webComponentSchemasKey].schema.id}
                    </option>
                );
            }
        );
    }
}

export { WebComponentTestPage };
