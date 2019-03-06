import React from "react";
import components from "./components";
import { Viewer, ViewerMessage } from "../../../src";

export interface PageState {
    height: number;
    width: number;
    componentProps: any;
}

class UpdatePropsPage extends React.Component<{}, PageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            componentProps: {
                textValue: "Hello",
                children: {
                    id: "example",
                    props: {
                        textValue: "Hello",
                    },
                },
            },
            height: 800,
            width: 800,
        };
    }

    public render(): JSX.Element {
        return (
            <div style={{ width: "100%", height: "calc(100vh - 200px)" }}>
                {this.state.componentProps.textValue || "Undefined"}
                <div>
                    <input
                        type="text"
                        onChange={this.handleTextUpdate}
                        value={this.state.componentProps.textValue}
                    />
                </div>
                <Viewer
                    height={this.state.height}
                    width={this.state.width}
                    iframeSrc={"/viewer/update-props/content"}
                    viewerContentProps={this.getContentProps()}
                    responsive={true}
                    onUpdateHeight={this.handleUpdatedHeight}
                    onUpdateWidth={this.handleUpdatedWidth}
                    onUpdateContentProps={this.handleUpdateContentProps}
                />
            </div>
        );
    }

    private handleTextUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            componentProps: {
                textValue: e.target.value,
                children: {
                    id: "example",
                    props: {
                        textValue: e.target.value,
                    },
                },
            },
        });
    };

    private handleUpdateContentProps = (message: ViewerMessage): void => {
        if (typeof message.props !== "undefined") {
            this.setState({
                componentProps: message.props.props,
            });
        }
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

    private getContentProps(): any {
        return [
            {
                id: components[0].schema.id,
                props: this.state.componentProps,
            },
        ];
    }
}

export default UpdatePropsPage;
