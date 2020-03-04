import { MessageSystemType } from "./types";
import { MessageSystemConfig, Register } from "./message-system.props";
import { MessageSystemIncoming } from "./message-system.utilities.props";

/**
 * The registration used for the message system
 */
export default class MessageSystem {
    /**
     * The list of items registered to the message system registry
     */
    private register: Set<Register> = new Set();

    /**
     * The web worker
     */
    private worker: void | Worker;

    constructor(config: MessageSystemConfig) {
        if ((window as any).Worker) {
            this.worker = new Worker(config.webWorker);
            this.worker.onmessage = this.onMessage;

            this.worker.postMessage({
                type: MessageSystemType.initialize,
                data: config.dataDictionary,
                schemaDictionary: config.schemaDictionary,
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
     * Post a message
     */
    public postMessage(message: MessageSystemIncoming): void {
        if ((window as any).Worker && this.worker) {
            this.worker.postMessage(message);
        }
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
