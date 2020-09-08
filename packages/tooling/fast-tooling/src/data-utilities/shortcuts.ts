import {
    CustomMessageIncomingOutgoing,
    MessageSystemType,
} from "../message-system";
import { ShortcutAction, ShortcutActionCallbackConfig } from "./shortcut-action";
import { RegisteredUtility } from "./registered-utility";

export type shortcutMessageSystemAction = "initialize";
export type shortcutMessageSystemId = "shortcuts";
export type shortcutMessageSystemListenerType = "keypress";

export interface ShortcutMessageOutgoing extends CustomMessageIncomingOutgoing {
    id: shortcutMessageSystemId;
    action: shortcutMessageSystemAction;
    eventListener: () => void;
    eventListenerType: shortcutMessageSystemListenerType;
    shortcuts: ShortcutActionCallbackConfig[];
}

export class Shortcuts extends RegisteredUtility<ShortcutActionCallbackConfig> {
    constructor(config) {
        super();

        this.registerMessageSystem(config);
    }

    /**
     * The listener to attach to HTML elements
     */
    private listener = (e: KeyboardEvent): void => {
        this.registeredActions.forEach((action: ShortcutAction) => {
            if (action.matches(e)) {
                action.invoke();
            }
        });
    };
    
    /**
     * Handles messages from the message system
     */
    handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                this.messageSystem.postMessage({
                    type: MessageSystemType.custom,
                    action: "initialize",
                    id: "shortcuts",
                    eventListener: this.listener,
                    eventListenerType: "keypress",
                    shortcuts: this.registeredActions.map((shortcutAction: ShortcutAction) => {
                        return {
                            name: shortcutAction.name,
                            keys: shortcutAction.keys,
                        };
                    }),
                } as ShortcutMessageOutgoing);
                break;
        }
    };
}
