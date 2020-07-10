import React from "react";
import { MessageSystemType } from "@microsoft/fast-tooling";
import { ViewerCustomAction } from "../../../src";

interface ViewerContentState {
    message: string;
}

class ViewerContent extends React.Component<{}, ViewerContentState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            message: "Hello world",
        };

        window.addEventListener("message", this.handlePostMessage);
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <pre>{this.state.message}</pre>
                <button onClick={this.handleReset}>reset</button>
            </React.Fragment>
        );
    }

    private handleReset = (): void => {
        window.postMessage(
            {
                type: MessageSystemType.custom,
                action: ViewerCustomAction.call,
                value: "reset",
            },
            "*"
        );
    };

    private handlePostMessage = (e: MessageEvent): void => {
        if (e.origin === location.origin && typeof e.data === "string") {
            try {
                this.setState({
                    message: JSON.stringify(JSON.parse(e.data), null, 2),
                });
            } catch (e) {}
        }
    };
}

export default ViewerContent;
