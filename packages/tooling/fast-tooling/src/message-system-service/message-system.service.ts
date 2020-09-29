import { MessageSystem } from "../message-system";
import { MessageSystemServiceAction } from "./message-system.service-action";

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

export interface ActionNotFound {
    /**
     * The error when the action can't be found
     */
    error: string;
}

export interface MessageSystemServiceConfig<C> {
    /**
     * The message system
     * used for sending and receiving shortcuts to the message system
     */
    messageSystem: MessageSystem;

    /**
     * Shortcut actions
     */
    actions?: MessageSystemServiceAction<C, unknown>[];
}

/**
 * This abstract class are for utilities that
 * use the MessageSystem to register and de-register themselves
 */
export abstract class MessageSystemService<C> {
    public messageSystem: MessageSystem;
    private messageSystemConfig: { onMessage: (e: MessageEvent) => void };
    protected registeredActions: MessageSystemServiceAction<C, unknown>[] = [];

    /**
     * Destroy this before dereferencing the validator
     * or this will not be garbage collected
     */
    public destroy(): void {
        this.messageSystem.remove(this.messageSystemConfig);
    }

    /**
     * Register this utility with the message system
     * This should be called during construction
     */
    public registerMessageSystem(config: MessageSystemServiceConfig<C>): void {
        if (config.messageSystem !== undefined) {
            this.messageSystemConfig = {
                onMessage: this.handleMessageSystem,
            };
            config.messageSystem.add(this.messageSystemConfig);
        }

        this.messageSystem = config.messageSystem;

        if (config.actions) {
            this.registeredActions = config.actions;
        }
    }

    /**
     * The utility should always handle incoming messages
     * from the message system
     */
    abstract handleMessageSystem(e: MessageEvent): void;

    /**
     * The utility should get any config to be passed to
     * the registered actions
     */
    abstract getActionConfig(id: string): C;

    /**
     * Returns an action with a specific ID that can be run
     */
    public action = (id: string): IdentifiedAction => {
        const action = this.registeredActions.find(
            (action: MessageSystemServiceAction<C, unknown>) => {
                return action.id === id;
            }
        );

        if (action) {
            return {
                run: action.getAction(this.getActionConfig(id)),
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
}
