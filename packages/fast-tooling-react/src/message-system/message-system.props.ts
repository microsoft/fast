import { DataDictionary } from "../message-system/data.props";
import { SchemaDictionary } from "../message-system/schema.props";

export interface Register {
    onMessage: OnMessageCallback;
}

export type OnMessageCallback = (e: MessageEvent) => void;

export interface MessageSystemConfig {
    /**
     * The message system web worker location
     */
    webWorker: string;

    /**
     * The initial data to map to the message system
     */
    dataDictionary: DataDictionary<unknown>;

    /**
     * The schema to map to the message system
     */
    schemaDictionary: SchemaDictionary;
}
