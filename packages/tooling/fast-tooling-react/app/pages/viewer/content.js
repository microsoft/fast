import React from "react";
import { MessageSystemType } from "@microsoft/fast-tooling";
import { ViewerCustomAction } from "../../../src";
class ViewerContent extends React.Component {
    constructor(props) {
        super(props);
        this.handleReset = () => {
            window.postMessage(
                {
                    type: MessageSystemType.custom,
                    action: ViewerCustomAction.call,
                    value: "reset",
                },
                "*"
            );
        };
        this.handlePostMessage = e => {
            if (e.origin === location.origin && typeof e.data === "string") {
                try {
                    this.setState({
                        message: JSON.stringify(JSON.parse(e.data), null, 2),
                    });
                } catch (e) {}
            }
        };
        this.state = {
            message: "Hello world",
        };
        window.addEventListener("message", this.handlePostMessage);
    }
    render() {
        return (
            <React.Fragment>
                <pre>{this.state.message}</pre>
                <button onClick={this.handleReset}>reset</button>
            </React.Fragment>
        );
    }
}
export default ViewerContent;
