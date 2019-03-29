import React from "react";
import * as testData from "./data-utilities/";
import { ChildOptionItem, mapDataToComponent } from "../../src";
import childrenSchema from "../configs/children.schema.json";
import { childOptions, children } from "../configs/example.data";

interface DataUtilitiesTestPageState {
    activeDataKey: string;
}

class DataUtilitiesTestPage extends React.Component<{}, DataUtilitiesTestPageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            activeDataKey: Object.keys(testData)[0],
        };
    }

    public render(): React.ReactNode {
        return (
            <div>
                <select onChange={this.handleDataUpdate}>{this.getDataOptions()}</select>
                {this.renderComponent()}
            </div>
        );
    }

    private handleDataUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            activeDataKey: e.target.value,
        });
    };

    private renderComponent(): React.ReactNode {
        return React.createElement(
            testData[this.state.activeDataKey].component,
            mapDataToComponent(
                testData[this.state.activeDataKey].schema,
                testData[this.state.activeDataKey].data,
                this.getChildOptions(),
                testData[this.state.activeDataKey].plugins
            )
        );
    }

    private getDataOptions(): React.ReactNode {
        return Object.keys(testData).map((testDataKey: any, index: number) => {
            return <option key={index}>{testDataKey}</option>;
        });
    }

    private getChildOptions(): ChildOptionItem[] {
        return Object.keys(testData).map(
            (testDataKey: string): ChildOptionItem => {
                return {
                    component: testData[testDataKey].component,
                    schema: testData[testDataKey].schema,
                };
            }
        );
    }
}

export { DataUtilitiesTestPage };
