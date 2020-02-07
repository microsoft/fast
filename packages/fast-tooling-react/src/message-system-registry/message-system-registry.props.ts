import { DataDictionary } from "../message-system/data.props";
import { SchemaDictionary } from "../message-system/schema.props";

export interface Register {
    onMessage: OnMessageCallback;
}

export type OnMessageCallback = (e: MessageEvent) => void;

export interface MessageSystemRegistryConfig {
    /**
     * The message system web worker
     */
    messageSystem: void | Worker;

    /**
     * The initial data to map to the message system
     */
    data: DataDictionary<unknown>;

    /**
     * The schema to map to the message system
     */
    schemas: SchemaDictionary;
}
