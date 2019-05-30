import React from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import * as testConfigs from "../form/";
import {
    CodePreviewChildOption,
    MapCodePreviewConfig,
    mapDataToCodePreview,
} from "../../../src/data-utilities/mapping";
import exampleData, { childOptions } from "./examples.data";

export interface CodePreviewTestPageState {
    config: MapCodePreviewConfig;
}

const codePreviewChildOptions: CodePreviewChildOption[] = [
    {
        name: "TextField",
        schema: testConfigs.textField.schema,
    },
    {
        name: "Children",
        schema: testConfigs.children.schema,
    },
];

const designSystemDefaults: any = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
};

class CodePreviewTestPage extends React.Component<{}, CodePreviewTestPageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            config: {
                childOptions,
                data: exampleData[0].config.data,
            },
        };
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={designSystemDefaults}>
                <div>
                    <div>
                        <select onChange={this.handleComponentUpdate}>
                            {this.getComponentOptions()}
                        </select>
                        <br />
                    </div>
                    <pre
                        style={{
                            padding: "12px",
                            background: "rgb(244, 245, 246)",
                            borderRadius: "4px",
                        }}
                    >
                        {mapDataToCodePreview(this.state.config)}
                    </pre>
                    `
                </div>
            </DesignSystemProvider>
        );
    }

    private handleComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            config: {
                childOptions,
                data: exampleData[e.target.selectedIndex].config.data,
            },
        });
    };

    private getComponentOptions(): JSX.Element[] {
        return Object.keys(exampleData).map((testComponentKey: any, index: number) => {
            return <option key={index}>{exampleData[index].exampleName}</option>;
        });
    }
}

export { CodePreviewTestPage };
