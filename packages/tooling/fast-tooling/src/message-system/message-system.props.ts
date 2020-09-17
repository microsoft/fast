import { DataDictionary } from "./data.props";
import { SchemaDictionary } from "./schema.props";
import { InitializeMessageIncoming } from "./message-system.utilities.props";

export interface Register {
    onMessage: OnMessageCallback;
}

export type OnMessageCallback = (e: MessageEvent) => void;

export interface MessageSystemConfig {
    /**
     * The message system web worker location
     */
    webWorker: string | Worker;

    /**
     * The initial data to map to the message system
     */
    dataDictionary?: DataDictionary<unknown>;

    /**
     * The schema to map to the message system
     */
    schemaDictionary?: SchemaDictionary;

    /**
     * The limit on the number of history items
     */
    historyLimit?: number;
}

export type Initialize = Omit<InitializeMessageIncoming, "type">;
