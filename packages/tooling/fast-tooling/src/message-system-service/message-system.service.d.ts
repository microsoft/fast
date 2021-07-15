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
export declare abstract class MessageSystemService<A, C = {}> {
    messageSystem: MessageSystem;
    private messageSystemConfig;
    protected registeredActions: MessageSystemServiceAction<A, unknown>[];
    /**
     * Destroy this before dereferencing the validator
     * or this will not be garbage collected
     */
    destroy(): void;
    /**
     * Register this service with the message system
     * This should be called during construction
     */
    registerMessageSystem(config: MessageSystemServiceConfig<A, C>): void;
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
    action: (id: string) => IdentifiedAction;
}
