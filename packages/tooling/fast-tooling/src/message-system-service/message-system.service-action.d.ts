export interface MessageSystemServiceActionCallbackConfig {
    /**
     * The unique identifier
     */
    id: string;
}
export interface MessageSystemServiceActionConfig<TCallback>
    extends MessageSystemServiceActionCallbackConfig {
    /**
     * The action to take when the keycodes have been pressed
     */
    action: (config: TCallback) => void;
}
/**
 * This abstract class is for actions intended to be part
 * of a registered class
 *
 * It takes two generics, C, an object which is added to the
 * MessageSystemServiceActionCallbackConfig,
 * and M, a generic used for matching
 * the action to some specific parameters
 */
export declare abstract class MessageSystemServiceAction<TCallback = {}, TMatch = {}> {
    private action;
    id: string;
    constructor(config: MessageSystemServiceActionConfig<TCallback>);
    /**
     * Gets the action to be called
     */
    getAction: (config: TCallback) => () => void;
    /**
     * Tests to see if this matches a given condition
     */
    abstract matches(config: TMatch): boolean;
}
