import { MessageSystem } from "../message-system";
import { Register } from "../message-system/message-system.props";
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

export interface MessageSystemServiceConfig<A, C = {}> {
    /**
     * The id for the service
     */
    id?: string;

    /**
     * The message system
     * used for sending and receiving shortcuts to the message system
     */
    messageSystem: MessageSystem;

    /**
     * Shortcut actions
     */
    actions?: MessageSystemServiceAction<A, unknown>[];

    /**
     * Any additional configurations for this service
     */
    config?: C;
}

/**
 * This abstract class are for services that
 * use the MessageSystem to register and de-register themselves
 */
export abstract class MessageSystemService<A, C = {}> {
    public messageSystem: MessageSystem;
    private messageSystemConfig: Register;
    protected registeredActions: MessageSystemServiceAction<A, unknown>[] = [];

    /**
     * Destroy this before dereferencing the validator
     * or this will not be garbage collected
     */
    public destroy(): void {
        this.messageSystem.remove(this.messageSystemConfig);
    }

    /**
     * Register this service with the message system
     * This should be called during construction
     */
    public registerMessageSystem(config: MessageSystemServiceConfig<A, C>): void {
        if (config.messageSystem !== undefined) {
            this.messageSystemConfig = {
                id: config.id,
                onMessage: this.handleMessageSystem,
                config: config.config,
            };
            config.messageSystem.add(this.messageSystemConfig);
        }

        this.messageSystem = config.messageSystem;

        if (config.actions) {
            this.registeredActions = config.actions;
        }
    }

    /**
     * The service should always handle incoming messages
     * from the message system
     */
    abstract handleMessageSystem(e: MessageEvent): void;

    /**
     * The service should get any config to be passed to
     * the registered actions
     */
    abstract getActionConfig(id: string): A;

    /**
     * Returns an action with a specific ID that can be run
     */
    public action = (id: string): IdentifiedAction => {
        const action = this.registeredActions.find(
            (action: MessageSystemServiceAction<A, unknown>) => {
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
