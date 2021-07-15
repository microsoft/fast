import { XOR } from "../data-utilities/type.utilities";
import { Initialize, MessageSystemConfig, Register } from "./message-system.props";
import { MessageSystemIncoming } from "./message-system.utilities.props";
/**
 * The registration used for the message system
 */
export default class MessageSystem<C = {}> {
    /**
     * The list of items registered to the message system registry
     */
    private register;
    /**
     * The web worker
     */
    private worker;
    /**
     * The history limit
     */
    private historyLimit;
    constructor(config: MessageSystemConfig);
    /**
     * Add an item to the register
     */
    add(config: Register<C>): void;
    /**
     * Remove an item from the register
     */
    remove(config: Register<C>): void;
    /**
     * Sends an initialization message
     */
    initialize(config: Initialize): void;
    /**
     * Post a message
     */
    postMessage(message: MessageSystemIncoming): void;
    /**
     * The onmessage handler for the message system
     */
    private onMessage;
    /**
     * Get a registered items config
     */
    getConfigById(id: string): XOR<null, C>;
}
