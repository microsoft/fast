import {
    CustomMessageIncomingOutgoing,
    MessageSystem,
    MessageSystemType,
} from "../message-system";
import { ShortcutAction, ShortcutActionConfig } from "./shortcut-action";

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

export interface IdentifiedAction {
    /**
     * The action to run
     * throws an error if no action has been identified
     */
    run: () => void;

    /**
     * The error message
     * if no action has been identified
     */
    error: string | null;
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
     * Runs a specific action
     */
    public action = (id: string): IdentifiedAction => {
        const action = this.registeredShortcutActions.find((action: ShortcutAction) => {
            return action.id === id;
        });

        if (action) {
            return {
                run: action.invoke,
                error: null,
            };
        }

        const errorMsg = `No action with id: ${id} is available`;

        return {
            run: () => {
                throw new Error(errorMsg);
            },
            error: errorMsg,
        };
    };

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
            if (action.matches(e)) {
                action.invoke();
            }
        });
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
                            action: shortcutAction.invoke,
                        };
                    }),
                } as ShortcutMessageOutgoing);
                break;
        }
    };
}
