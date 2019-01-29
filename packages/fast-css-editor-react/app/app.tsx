import * as React from "react";
import CSSEditor, { CSSPosition, CSSSpacing } from "../src";

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

    /**
     * Important: Update these components when adding new components
     */

    private editorComponents: EditorComponentOptions[];
    /**
     * Important: Update these callbacks when adding new components
     */
    private updateCallbacks: string[];

    constructor(props: {}) {
        super(props);

        this.state = {
            data: {},
            activeIndex: 0,
        };

        this.editorComponents = [
            {
                displayName: "CSS Editor",
                component: CSSEditor,
            },
            {
                displayName: "CSS Position",
                component: CSSPosition,
            },
            {
                displayName: "CSS Spacing",
                component: CSSSpacing,
            },
        ];
        this.updateCallbacks = ["onChange", "onSpacingUpdate", "onPositionUpdate"];
    }

    public render(): JSX.Element {
        return (
            <div
                style={{
                    fontFamily:
                        "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
            >
                <div
                    style={{
                        minWidth: "250px",
                        minHeight: "100vh",
                        padding: "0 0 0 10px",
                        boxSizing: "border-box",
                        color: designSystemDefaults.foregroundColor,
                        background: designSystemDefaults.backgroundColor,
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

        this.updateCallbacks.forEach(
            (updateCallback: string): any => {
                callbacks[updateCallback] = this.handleComponentOnChange;
            }
        );

        return React.createElement(
            this.editorComponents[this.state.activeIndex].component as any,
            {
                ...this.state.data,
                ...callbacks,
            }
        );
    }

    private renderOptions(): React.ReactNode {
        return this.editorComponents.map(
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
