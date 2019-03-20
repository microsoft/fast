import React from "react";
import { CSSEditor } from "../../src";

interface CSSEditorTestPageState {
    css: any;
}

class CSSEditorTestPage extends React.Component<{}, CSSEditorTestPageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            css: {},
        };
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <CSSEditor data={this.state.css} onUpdate={this.handleOnChange} />
                <pre>{JSON.stringify(this.state.css, null, 2)}</pre>
                <div style={this.state.css}>Hello world</div>
            </React.Fragment>
        );
    }

    private handleOnChange = (css: any): void => {
        this.setState({
            css,
        });
    };
}

export { CSSEditorTestPage };
