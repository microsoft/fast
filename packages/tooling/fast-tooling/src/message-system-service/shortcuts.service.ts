import { CustomMessage, MessageSystemType } from "../message-system";
import {
    ShortcutsAction,
    ShortcutsActionCallbackConfig,
} from "./shortcuts.service-action";
import { MessageSystemService } from "./message-system.service";

export type shortcutMessageSystemAction = "initialize";
export type shortcutMessageSystemId = "shortcuts";
export type shortcutMessageSystemListenerType = "keypress";

export type shortcutMessageId = "fast-tooling::shortcuts-service";

export interface ShortcutOptions {
    originatorId: shortcutMessageId;
}

export interface ShortCutOptionsConfig {
    options: ShortcutOptions;
}

export interface ShortcutMessageOutgoing extends CustomMessage<{}, {}> {
    id: shortcutMessageSystemId;
    action: shortcutMessageSystemAction;
    eventListener: (e: KeyboardEvent) => void;
    eventListenerType: shortcutMessageSystemListenerType;
    shortcuts: ShortcutsActionCallbackConfig[];
}

export class Shortcuts extends MessageSystemService<ShortcutsActionCallbackConfig> {
    constructor(config) {
        super();

        this.registerMessageSystem(config);
    }

    /**
     * The listener to attach to HTML elements
     */
    private listener = (e: KeyboardEvent): void => {
        this.registeredActions.forEach((action: ShortcutsAction) => {
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
                    shortcuts: this.registeredActions.map(
                        (shortcutAction: ShortcutsAction) => {
                            return {
                                name: shortcutAction.name,
                                keys: shortcutAction.keys,
                            };
                        }
                    ),
                    options: {
                        originatorId: "fast-tooling::shortcuts-service",
                    },
                } as ShortcutMessageOutgoing);
                break;
        }
    };

    getActionConfig = (id: string): ShortcutsActionCallbackConfig => {
        this.registeredActions.forEach((action: ShortcutsAction) => {
            if (action.id === id) {
                return {
                    name: action.name,
                    keys: action.keys,
                };
            }
        });

        return {
            error: `No such action found.`,
        };
    };
}
