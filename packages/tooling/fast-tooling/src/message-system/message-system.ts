import { uniqueId } from "lodash-es";
import { XOR } from "../data-utilities/type.utilities";
import { MessageSystemType } from "./types";
import { defaultHistoryLimit } from "./history";
import { Initialize, MessageSystemConfig, Register } from "./message-system.props";
import { MessageSystemIncoming } from "./message-system.utilities.props";

/**
 * The registration used for the message system
 */
export default class MessageSystem<C = {}> {
    /**
     * The list of items registered to the message system registry
     */
    private register: Set<Register<C>> = new Set();

    /**
     * The web worker
     */
    private worker: void | Worker;

    /**
     * The history limit
     */
    private historyLimit: number;

    /**
     * The message queue
     */
    private messageQueue: [{ [key: string]: MessageEvent }, string[]] = [{}, []];

    constructor(config: MessageSystemConfig) {
        if ((window as any).Worker) {
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
                this.postMessage({
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
    public add(config: Register<C>): void {
        this.register.add(config);
    }

    /**
     * Remove an item from the register
     */
    public remove(config: Register<C>): void {
        this.register.delete(config);
    }

    /**
     * Sends an initialization message
     */
    public initialize(config: Initialize): void {
        if ((window as any).Worker) {
            this.historyLimit =
                typeof config.historyLimit === "number"
                    ? config.historyLimit
                    : this.historyLimit;
            this.postMessage({
                type: MessageSystemType.initialize,
                dataDictionary: config.dataDictionary,
                data: config.data,
                schemaDictionary: config.schemaDictionary,
                historyLimit: this.historyLimit,
            });
        }
    }

    /**
     * Post a message to the message system web worker
     */
    public postMessage(message: MessageSystemIncoming): void {
        if ((window as any).Worker && this.worker) {
            const uuid: string = uniqueId();

            this.messageQueue[1].push(uuid);
            this.worker.postMessage([message, uuid]);
        }
    }

    /**
     * The onmessage handler for the message system which recieves a message
     * from the message system web worker and passes it to each registered item
     */
    private onMessage = (e: MessageEvent): void => {
        this.messageQueue[0][e.data[1]] = e;

        this.sendNextMessage();
    };

    /**
     * Fire the messages in the order they have been received when they are made available
     */
    private sendNextMessage = (): void => {
        const firstMessageId = this.messageQueue[1][0];
        const firstMessageInQueue = this.messageQueue[0][firstMessageId];

        if (firstMessageId && firstMessageInQueue) {
            const updatedEvent = new MessageEvent("message", {
                data: firstMessageInQueue.data[0],
                origin: firstMessageInQueue.origin,
                lastEventId: firstMessageInQueue.lastEventId,
                source: firstMessageInQueue.source,
            });
            this.register.forEach((registeredItem: Register) => {
                registeredItem.onMessage(updatedEvent);
            });
            this.clearNextMessage();
            this.sendNextMessage();
        }
    };

    /**
     * Clears the next message to be sent in the message queue
     */
    private clearNextMessage(): void {
        delete this.messageQueue[0][this.messageQueue[1][0]];
        this.messageQueue[1].shift();
    }

    /**
     * Get a registered items config
     */
    public getConfigById(id: string): XOR<null, C> {
        let config: XOR<null, C> = null;

        this.register.forEach((value: Register<C>) => {
            if (value.id === id) {
                config = value.config as XOR<null, C>;
            }
        });

        return config;
    }
}
