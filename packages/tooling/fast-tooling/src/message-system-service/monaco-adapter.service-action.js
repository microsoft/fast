import { MessageSystemServiceAction } from "./message-system.service-action";
/**
 * Actions for the monaco adapter
 */
export class MonacoAdapterAction extends MessageSystemServiceAction {
    constructor(config) {
        super(config);
        /**
         * Invokes the action
         */
        this.invoke = () => {
            this.getAction({
                getMonacoModelValue: this.getMonacoModelValue,
                updateMonacoModelValue: this.updateMonacoModelValue,
                messageSystemType: this.messageSystemType,
            })();
        };
        this.matches = type => {
            return this.messageSystemType === type;
        };
        this.messageSystemType = config.messageSystemType;
    }
    /**
     * Retrieve callbacks from parent adapter
     */
    addConfig(config) {
        this.getMonacoModelValue = config.getMonacoModelValue;
        this.updateMonacoModelValue = config.updateMonacoModelValue;
        this.messageSystemType = config.messageSystemType;
    }
    /**
     * Retrieve the message system type for this action
     */
    getMessageSystemType() {
        return this.messageSystemType;
    }
}
