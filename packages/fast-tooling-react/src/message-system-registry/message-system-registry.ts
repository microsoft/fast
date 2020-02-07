import { MessageSystemType } from "../message-system/message-system.props";
import { MessageSystemRegistryConfig, Register } from "./message-system-registry.props";

/**
 * The registration used for the message system
 */
export default class MessageSystemRegistry {
    /**
     * The list of items registered to the message system registry
     */
    private register: Set<Register> = new Set();

    constructor(config: MessageSystemRegistryConfig) {
        if (config.messageSystem) {
            config.messageSystem.onmessage = this.onMessage;

            config.messageSystem.postMessage({
                type: MessageSystemType.initialize,
                data: config.data,
                schemas: config.schemas,
            });
        }
    }

    /**
     * Add an item to the register
     */
    public add(config: Register): void {
        this.register.add(config);
    }

    /**
     * Remove an item from the register
     */
    public remove(config: Register): void {
        this.register.delete(config);
    }

    /**
     * The onmessage handler for the message system
     */
    private onMessage = (e: MessageEvent): void => {
        this.register.forEach((registeredItem: Register) => {
            registeredItem.onMessage(e);
        });
    };
}
