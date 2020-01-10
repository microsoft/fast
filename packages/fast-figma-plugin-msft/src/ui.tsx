/**
 * This file is responsible for rendering the plugin dialog / UI. This script is executed
 * within an iframe so it has limited access to the Figma document, and must rely on mostMessage APIs
 * to communicate with the parent script.
 */
import React from "react";
import ReactDOM from "react-dom";
import { Paragraph } from "@microsoft/fast-components-react-msft";
import { stringById } from "./strings";
import { isPluginMessageEvent, PluginMessageData } from "./messaging/common";
import { SET_ACTIVE_NODE_TYPE, SetActiveNodeTypeEvent } from "./messaging/canvas";

// Import with require so the dependency doesn't get tree-shaken
// tslint:disable-next-line
const styles = require("./global.css");

const root: HTMLDivElement = document.createElement("div");
document.body.appendChild(root);

interface PluginMessageEvent extends MessageEvent {
    data: {
        pluginMessage: any; // TODO
        pluginId: string;
    };
}

interface PluginUIState {
    activeNodeType: NodeType | null;
}

class PluginUI extends React.Component<{}, PluginUIState> {
    /**
     * Register a message handler to a message event ID.
     * When a message from the canvas is recieved that matches
     * the ID, the callback will be invoked
     */
    private messageHandlers: {
        [key: string]: (message: PluginMessageData<any>) => void;
    } = {
        [SET_ACTIVE_NODE_TYPE]: (message: SetActiveNodeTypeEvent): void =>
            this.setState({ activeNodeType: message.value }),
    };

    constructor(props: {}) {
        super(props);

        this.state = {
            activeNodeType: null,
        };

        // Register message listener to react to messages from main.ts
        window.onmessage = this.handleOnMessage;
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.state.activeNodeType === null ? (
                    this.renderNoValidSelection()
                ) : (
                    <p>{this.state.activeNodeType}</p>
                )}
            </div>
        );
    }

    public renderNoValidSelection(): JSX.Element {
        return <Paragraph>{stringById("noValidElementSelected")}</Paragraph>;
    }

    private handleOnMessage = (e: MessageEvent): void => {
        if (!isPluginMessageEvent(e)) {
            return; // Exit if the MessageEvent should not be handled by our UI
        } else {
            const message: PluginMessageData<any> = JSON.parse(e.data.pluginMessage);

            if (typeof this.messageHandlers[message.type] === "function") {
                this.messageHandlers[message.type](message);
            }
        }
    };
}

// Render UI
ReactDOM.render(<PluginUI />, root);
