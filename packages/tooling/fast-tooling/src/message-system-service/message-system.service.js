/**
 * This abstract class are for services that
 * use the MessageSystem to register and de-register themselves
 */
export class MessageSystemService {
    constructor() {
        this.registeredActions = [];
        /**
         * Returns an action with a specific ID that can be run
         */
        this.action = id => {
            const action = this.registeredActions.find(action => {
                return action.id === id;
            });
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
    /**
     * Destroy this before dereferencing the validator
     * or this will not be garbage collected
     */
    destroy() {
        this.messageSystem.remove(this.messageSystemConfig);
    }
    /**
     * Register this service with the message system
     * This should be called during construction
     */
    registerMessageSystem(config) {
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
}
