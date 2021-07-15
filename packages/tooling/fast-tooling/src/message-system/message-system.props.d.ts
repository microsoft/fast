import { DataDictionary } from "./data.props";
import { SchemaDictionary } from "./schema.props";
import { InitializeMessageIncoming } from "./message-system.utilities.props";
export interface Register<C = {}> {
    /**
     * The id of the registered item
     */
    id?: string;
    /**
     * The onMessage function called against a registered item
     */
    onMessage: OnMessageCallback;
    /**
     * Any other configuration options associated with this registered item
     */
    config?: C;
}
export declare type OnMessageCallback = (e: MessageEvent) => void;
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
export declare type Initialize = Omit<InitializeMessageIncoming, "type">;
