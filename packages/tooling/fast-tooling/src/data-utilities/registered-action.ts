export interface RegisteredActionCallbackConfig {
    /**
     * The unique identifier
     */
    id: string;
}

export interface RegisteredActionConfig extends RegisteredActionCallbackConfig {
    /**
     * The action to take when the keycodes have been pressed
     */
    action: () => void;
}

/**
 * This abstract class is for actions intended to be part
 * of a registered class
 */
export abstract class RegisteredAction<C, M> {
    private action: (config: C | RegisteredActionCallbackConfig) => void;
    public id: string;

    constructor(config: RegisteredActionConfig) {
        this.id = config.id;
        this.action = config.action;
    }

    /**
     * Gets the action to be called
     */
    public getAction = (config: C | RegisteredActionCallbackConfig): () => void => {
        return () => {
            this.action({
                ...config,
                id: this.id
            });
        };
    };

    /**
     * Tests to see if this matches a given condition
     */
    abstract matches(config: M): boolean;
}
