import React from "react";
// TODO: Update this to "../../src" when the validation task is complete #1725
import { CSSPropertyEditor } from "../../src/css-property-editor";

interface CSSPropertyEditorTestPageState {
    css: any;
}

class CSSPropertyEditorTestPage extends React.Component<
    {},
    CSSPropertyEditorTestPageState
> {
    constructor(props: {}) {
        super(props);

        this.state = {
            css: {
                margin: "10px",
                padding: "20px",
            },
        };
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <CSSPropertyEditor data={this.state.css} onChange={this.handleOnChange} />
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

export { CSSPropertyEditorTestPage };
