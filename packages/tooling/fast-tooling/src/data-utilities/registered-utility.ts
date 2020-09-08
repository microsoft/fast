import { MessageSystem } from "src/message-system";
import { RegisteredAction } from "./registered-action";

export interface IdentifiedAction<C> {
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

export interface RegisteredUtilityConfig<C> {
    /**
     * The message system
     * used for sending and receiving shortcuts to the message system
     */
    messageSystem: MessageSystem;

    /**
     * Shortcut actions
     */
    actions?: RegisteredAction<C, unknown>[];
}

/**
 * This abstract class are for utilities that
 * use the MessageSystem to register and de-register themselves
 */
export abstract class RegisteredUtility<C> {
    public messageSystem: MessageSystem;
    private messageSystemConfig: { onMessage: (e: MessageEvent) => void };
    protected registeredActions: RegisteredAction<C, unknown>[] = [];

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
    public registerMessageSystem(config: RegisteredUtilityConfig<C>): void {
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
     * Runs a specific action
     */
    public action = (id: string): IdentifiedAction<C> => {
        const action = this.registeredActions.find((action: RegisteredAction<C, unknown>) => {
            return action.id === id;
        });

        if (action) {
            return {
                run: action.getAction({
                    id: action.id,
                }),
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