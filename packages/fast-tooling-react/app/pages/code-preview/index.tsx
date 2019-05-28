import React from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import * as testConfigs from "../form/";
import {
    CodePreview,
    CodePreviewChildOption,
    mapDataToCodePreview,
} from "../../../src/data-utilities/mapping";
import exampleData from "./examples.data";

export interface CodePreviewTestPageState {
    data: CodePreview;
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
            data: {
                componentName: exampleData[0].componentName,
                childOptions: codePreviewChildOptions,
                data: exampleData[0].componentData,
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
                        {mapDataToCodePreview(this.state.data)}
                    </pre>
                    `
                </div>
            </DesignSystemProvider>
        );
    }

    private handleComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            data: {
                componentName: exampleData[e.target.selectedIndex].componentName,
                childOptions: codePreviewChildOptions,
                data: exampleData[e.target.selectedIndex].componentData,
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
