import { Form, Viewer } from "../../src";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import React from "react";
import {
    getDataFromSchema,
    MessageSystem,
    MessageSystemType,
} from "@microsoft/fast-tooling";
import { webComponentSchemas } from "./web-components/index";
import fancyButtonSchema from "./web-components/fancy-button.schema";
const designSystemDefaults = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
};
let fastMessageSystem;
class WebComponentTestPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleViewerUpdateHeight = height => {
            this.setState({ height });
        };
        this.handleViewerUpdateWidth = width => {
            this.setState({ width });
        };
        this.handleMessageSystem = e => {
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
        this.handleComponentUpdate = e => {
            const data = !!webComponentSchemas[e.target.value].data
                ? webComponentSchemas[e.target.value].data
                : getDataFromSchema(webComponentSchemas[e.target.value].schema);
            if (window.Worker && fastMessageSystem) {
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
        if (window.Worker) {
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
    render() {
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
    generateSchemaDictionary() {
        const schemaDictionary = {};
        Object.keys(webComponentSchemas).forEach(webComponentSchemasKey => {
            schemaDictionary[webComponentSchemas[webComponentSchemasKey].schema.id] =
                webComponentSchemas[webComponentSchemasKey].schema;
        });
        return schemaDictionary;
    }
    coerceFormProps() {
        const formProps = {
            messageSystem: fastMessageSystem,
        };
        return formProps;
    }
    getComponentOptions() {
        return Object.keys(webComponentSchemas).map((webComponentSchemasKey, index) => {
            return (
                <option key={index}>
                    {webComponentSchemas[webComponentSchemasKey].schema.id}
                </option>
            );
        });
    }
}
export { WebComponentTestPage };
