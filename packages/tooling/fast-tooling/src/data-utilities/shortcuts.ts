import {
    CustomMessageIncomingOutgoing,
    MessageSystem,
    MessageSystemType,
} from "../message-system";
import { KeyConfig, ShortcutAction, ShortcutActionConfig } from "./shortcut-action";

export type shortcutMessageSystemAction = "initialize";
export type shortcutMessageSystemId = "shortcuts";
export type shortcutMessageSystemListenerType = "keypress";

export interface ShortcutMessageOutgoing extends CustomMessageIncomingOutgoing {
    id: shortcutMessageSystemId;
    action: shortcutMessageSystemAction;
    eventListener: () => void;
    eventListenerType: shortcutMessageSystemListenerType;
    shortcuts: ShortcutActionConfig[];
}

export interface ShortcutsConfig {
    /**
     * The message system
     * used for sending and receiving shortcuts to the message system
     */
    messageSystem: MessageSystem;

    /**
     * Shortcut actions
     */
    actions?: ShortcutAction[];
}

export class Shortcuts {
    private messageSystem: MessageSystem;
    private messageSystemConfig: { onMessage: (e: MessageEvent) => void };
    private registeredShortcutActions: ShortcutAction[] = [];

    constructor(config: ShortcutsConfig) {
        if (config.messageSystem !== undefined) {
            this.messageSystemConfig = {
                onMessage: this.handleMessageSystem,
            };
            config.messageSystem.add(this.messageSystemConfig);
        }

        this.messageSystem = config.messageSystem;

        if (config.actions) {
            this.registeredShortcutActions = config.actions;
        }
    }

    /**
     * Destroy this before dereferencing the validator
     * or this will not be garbage collected
     */
    public destroy(): void {
        this.messageSystem.remove(this.messageSystemConfig);
    }

    /**
     * The listener to attach to HTML elements
     */
    private listener = (e: KeyboardEvent): void => {
        this.registeredShortcutActions.forEach((action: ShortcutAction) => {
            return action.runAction(this.getKeyConfigs(e));
        });
    };

    /**
     * The utility that returns KeyConfigs from a keyboard event
     */
    private getKeyConfigs = (e: KeyboardEvent): KeyConfig[] => {
        const modifierKeys = [];
        const specificKeys = [];

        if (e.metaKey) {
            modifierKeys.push({
                metaKey: true,
            });
        }

        if (e.ctrlKey) {
            modifierKeys.push({
                ctrlKey: true,
            });
        }

        if (e.shiftKey) {
            modifierKeys.push({
                shiftKey: true,
            });
        }

        if (e.altKey) {
            modifierKeys.push({
                altKey: true,
            });
        }

        if (typeof e.key === "string") {
            specificKeys.push({
                value: e.key,
            });
        }

        return [...modifierKeys, ...specificKeys];
    };

    /**
     * Handles messages from the message system
     */
    private handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                this.messageSystem.postMessage({
                    type: MessageSystemType.custom,
                    action: "initialize",
                    id: "shortcuts",
                    eventListener: this.listener,
                    eventListenerType: "keypress",
                    shortcuts: this.registeredShortcutActions.map(shortcutAction => {
                        return {
                            name: shortcutAction.name,
                            keys: shortcutAction.keys,
                            action: shortcutAction.runAction,
                        };
                    }),
                } as ShortcutMessageOutgoing);
                break;
        }
    };
}
