import React from "react";
import { CustomViewerMessage, Viewer } from "../../../src";

export interface PageState {
    height: number;
    width: number;
    message: boolean;
    customMessage: any;
}

class CustomMessagePage extends React.Component<{}, PageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            height: 800,
            width: 800,
            message: true,
            customMessage: void 0,
        };
    }

    public render(): JSX.Element {
        return (
            <div style={{ width: "100%", height: "calc(100vh - 200px)" }}>
                <button onClick={this.handleMessageClick(true)}>message "true"</button>
                <button onClick={this.handleMessageClick(false)}>message "false"</button>
                <span>recieved message: {this.state.customMessage}</span>
                <Viewer
                    height={this.state.height}
                    width={this.state.width}
                    iframeSrc={"/viewer/custom-message/content"}
                    responsive={true}
                    onUpdateHeight={this.handleUpdatedHeight}
                    onUpdateWidth={this.handleUpdatedWidth}
                    iframePostMessage={this.state.message}
                    onMessage={this.handleMessage}
                />
            </div>
        );
    }

    private handleMessageClick(
        message: boolean
    ): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.setState({
                message,
            });
        };
    }

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
