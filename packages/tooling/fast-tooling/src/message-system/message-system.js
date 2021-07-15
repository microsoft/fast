import { MessageSystemType } from "./types";
import { defaultHistoryLimit } from "./history";
/**
 * The registration used for the message system
 */
export default class MessageSystem {
    constructor(config) {
        /**
         * The list of items registered to the message system registry
         */
        this.register = new Set();
        /**
         * The onmessage handler for the message system
         */
        this.onMessage = e => {
            this.register.forEach(registeredItem => {
                registeredItem.onMessage(e);
            });
        };
        if (window.Worker) {
            this.worker =
                typeof config.webWorker === "string"
                    ? new Worker(config.webWorker)
                    : config.webWorker;
            this.worker.onmessage = this.onMessage;
            this.historyLimit =
                typeof config.historyLimit === "number"
                    ? config.historyLimit
                    : defaultHistoryLimit;
            if (Array.isArray(config.dataDictionary) && config.schemaDictionary) {
                this.worker.postMessage({
                    type: MessageSystemType.initialize,
                    data: config.dataDictionary,
                    schemaDictionary: config.schemaDictionary,
                });
            }
        }
    }
    /**
     * Add an item to the register
     */
    add(config) {
        this.register.add(config);
    }
    /**
     * Remove an item from the register
     */
    remove(config) {
        this.register.delete(config);
    }
    /**
     * Sends an initialization message
     */
    initialize(config) {
        if (window.Worker) {
            this.historyLimit =
                typeof config.historyLimit === "number"
                    ? config.historyLimit
                    : this.historyLimit;
            this.worker.postMessage({
                type: MessageSystemType.initialize,
                dataDictionary: config.dataDictionary,
                data: config.data,
                schemaDictionary: config.schemaDictionary,
                historyLimit: this.historyLimit,
            });
        }
    }
    /**
     * Post a message
     */
    postMessage(message) {
        if (window.Worker && this.worker) {
            this.worker.postMessage(message);
        }
    }
    /**
     * Get a registered items config
     */
    getConfigById(id) {
        let config = null;
        this.register.forEach(value => {
            if (value.id === id) {
                config = value.config;
            }
        });
        return config;
    }
}
