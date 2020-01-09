import React from "react";
import { CustomViewerMessage, Viewer } from "../../../src";

export interface PageState {
    height: number;
    width: number;
    customMessage: any;
}

class CustomMessagePage extends React.Component<{}, PageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            height: 800,
            width: 800,
            customMessage: "",
        };
    }

    public render(): JSX.Element {
        return (
            <div style={{ width: "100%", height: "calc(100vh - 200px)" }}>
                <input onChange={this.handleChange} value={this.state.customMessage} />
                <Viewer
                    height={this.state.height}
                    width={this.state.width}
                    iframeSrc={"/viewer/custom-message/content"}
                    responsive={true}
                    onUpdateHeight={this.handleUpdatedHeight}
                    onUpdateWidth={this.handleUpdatedWidth}
                    iframePostMessage={this.state.customMessage}
                    onMessage={this.handleMessage}
                />
            </div>
        );
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            customMessage: e.target.value,
        });
    };

    private handleMessage = (message: CustomViewerMessage): void => {
        this.setState({
            customMessage: message.data,
        });
    };

    private handleUpdatedHeight = (height: number): void => {
        this.setState({
            height,
        });
    };

    private handleUpdatedWidth = (width: number): void => {
        this.setState({
            width,
        });
    };
}

export default CustomMessagePage;
