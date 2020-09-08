export interface MessageSystemUtilityActionCallbackConfig {
    /**
     * The unique identifier
     */
    id: string;
}

export interface MessageSystemUtilityActionConfig
    extends MessageSystemUtilityActionCallbackConfig {
    /**
     * The action to take when the keycodes have been pressed
     */
    action: () => void;
}

/**
 * This abstract class is for actions intended to be part
 * of a registered class
 * 
 * It takes two generics, C, an object which is added to the
 * MessageSystemUtilityActionCallbackConfig,
 * and M, a generic used for matching
 * the action to some specific parameters
 */
export abstract class MessageSystemUtilityAction<C, M> {
    private action: (config: C | MessageSystemUtilityActionCallbackConfig) => void;
    public id: string;

    constructor(config: MessageSystemUtilityActionConfig) {
        this.id = config.id;
        this.action = config.action;
    }

    /**
     * Gets the action to be called
     */
    public getAction = (
        config: C | MessageSystemUtilityActionCallbackConfig
    ): (() => void) => {
        return () => {
            this.action({
                ...config,
                id: this.id,
            });
        };
    };

    /**
     * Tests to see if this matches a given condition
     */
    abstract matches(config: M): boolean;
}
