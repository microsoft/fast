import { MessageSystem } from "src/message-system";
import { MessageSystemUtilityAction } from "./message-system-utility-action";

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

export interface MessageSystemUtilityUtilityConfig<C> {
    /**
     * The message system
     * used for sending and receiving shortcuts to the message system
     */
    messageSystem: MessageSystem;

    /**
     * Shortcut actions
     */
    actions?: MessageSystemUtilityAction<C, unknown>[];
}

/**
 * This abstract class are for utilities that
 * use the MessageSystem to register and de-register themselves
 */
export abstract class MessageSystemUtility<C> {
    public messageSystem: MessageSystem;
    private messageSystemConfig: { onMessage: (e: MessageEvent) => void };
    protected registeredActions: MessageSystemUtilityAction<C, unknown>[] = [];

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
    public registerMessageSystem(config: MessageSystemUtilityUtilityConfig<C>): void {
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
     * Returns an action with a specific ID that can be run
     */
    public action = (id: string): IdentifiedAction => {
        const action = this.registeredActions.find(
            (action: MessageSystemUtilityAction<C, unknown>) => {
                return action.id === id;
            }
        );

        if (action) {
            return {
                run: action.getAction(),
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
