/**
 * This abstract class is for actions intended to be part
 * of a registered class
 *
 * It takes two generics, C, an object which is added to the
 * MessageSystemServiceActionCallbackConfig,
 * and M, a generic used for matching
 * the action to some specific parameters
 */
export class MessageSystemServiceAction {
    constructor(config) {
        /**
         * Gets the action to be called
         */
        this.getAction = config => {
            return () => {
                this.action(Object.assign(Object.assign({}, config), { id: this.id }));
            };
        };
        this.id = config.id;
        this.action = config.action;
    }
}
