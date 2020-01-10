import React from "react";
import { PluginUIState } from "./plugin-ui.state";
import { Paragraph } from "@microsoft/fast-components-react-msft";
import { stringById } from "./strings";
import { isPluginMessageEvent, PluginMessageData } from "../messaging/common";
import { isSetUIStateMessage } from "../messaging/canvas";
import { SET_UI_STATE } from "src/messaging/canvas";

/**
 * At this point, this is essentially a controlled component.
 * State will be controlled by the main application and serilaized
 * state will be passed to this component to be parsed, set, and rendered
 *
 * There may be some local state we want to track that doesn't concern the primary application,
 * but for now we'll keep all of the app logic in one place and merely make this component
 * reflect that external state.
 */
export class PluginUI extends React.Component<{}, PluginUIState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            activeNodeType: null,
            fills: [],
            activeFill: null,
            strokes: [],
            activeStroke: null,
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

            if (isSetUIStateMessage(message)) {
                this.setState(message.value);
            }
        }
    };
}
