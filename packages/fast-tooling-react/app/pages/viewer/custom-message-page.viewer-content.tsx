import React from "react";
import { ViewerMessageTarget, ViewerMessageType } from "../../../src/viewer";

interface CustomMessagePageViewerContentState {
    message: any;
}

class CustomMessagePageViewerContent extends React.Component<
    {},
    CustomMessagePageViewerContentState
> {
    constructor(props: {}) {
        super(props);

        this.state = {
            message: "",
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                <input onChange={this.handleChange} value={this.state.message} />
            </div>
        );
    }

    public componentDidMount(): void {
        if (window) {
            window.addEventListener("message", this.handleMessage);
        }
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (window) {
            window.postMessage(
                JSON.stringify({
                    type: ViewerMessageType.custom,
                    target: ViewerMessageTarget.viewer,
                    data: e.target.value,
                }),
                "*"
            );
        }
    };

    private handleMessage = (e: MessageEvent): void => {
        if (typeof e.data === "string") {
            this.setState({
                message: JSON.parse(e.data),
            });
        }
    };
}

export default CustomMessagePageViewerContent;
