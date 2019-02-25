import React from "react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { editorComponents, updateCallbacks } from "./exports.constants";

export interface AppState {
    data: any;
    activeIndex: number;
}

export interface EditorComponentOptions {
    displayName: string;
    component: React.ComponentClass;
}

const designSystemDefaults: any = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4",
};

class App extends React.Component<{}, AppState> {
    public state: AppState;

    constructor(props: {}) {
        super(props);

        this.state = {
            data: {},
            activeIndex: 0,
        };
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={designSystemDefaults}>
                <div
                    style={{
                        fontFamily:
                            "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                >
                    <div
                        style={{
                            minWidth: "250px",
                            height: "100vh",
                            float: "left",
                        }}
                    >
                        {this.renderCSSEditorComponent()}
                    </div>
                    <div
                        style={{
                            float: "left",
                            marginLeft: "8px",
                        }}
                    >
                        <div>
                            <select onChange={this.handleComponentUpdate}>
                                {this.renderOptions()}
                            </select>
                        </div>
                        <pre
                            style={{
                                padding: "12px",
                                background: "rgb(244, 245, 246)",
                                borderRadius: "4px",
                            }}
                        >
                            {JSON.stringify(this.state.data, null, 2)}
                        </pre>
                        <div style={{ position: "relative" }}>
                            <div
                                style={{
                                    backgroundColor: "red",
                                    width: "50px",
                                    height: "50px",
                                    ...this.state.data,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </DesignSystemProvider>
        );
    }

    private handleComponentUpdate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({
            activeIndex: parseInt(e.target.value, 10),
            data: {},
        });
    };

    private handleComponentOnChange = (data: any): void => {
        this.setState({
            data,
        });
    };

    private renderCSSEditorComponent(): React.ReactNode {
        const callbacks: any = {};

        updateCallbacks.forEach(
            (updateCallback: string): any => {
                callbacks[updateCallback] = this.handleComponentOnChange;
            }
        );

        return React.createElement(
            editorComponents[this.state.activeIndex].component as any,
            {
                ...this.state.data,
                ...callbacks,
            }
        );
    }

    private renderOptions(): React.ReactNode {
        return editorComponents.map(
            (editorComponent: EditorComponentOptions, index: number) => {
                return (
                    <option key={index} value={index}>
                        {editorComponent.displayName}
                    </option>
                );
            }
        );
    }
}

export default App;
