import { MessageSystemType } from "../message-system";
import { DataDictionary } from "../message-system";
import { Parent } from "../";
import {
    MessageSystemService,
    MessageSystemServiceConfig,
} from "./message-system.service";
import { MonacoAdapterActionCallbackConfig } from "./monaco-adapter.service-action";
export declare type actionCallback = () => void;
export interface ExtendedParent extends Parent {
    /**
     * The current dictionary ID this parent refers to
     */
    currentId: string;
    /**
     * The linked data index in the parent
     */
    linkedDataIndex: number;
}
export declare const monacoAdapterId: string;
export declare function findDictionaryIdParents(
    dictionaryId: string,
    dataDictionary: DataDictionary<unknown>,
    parents?: ExtendedParent[]
): ExtendedParent[];
export declare function findUpdatedDictionaryId(
    parents: ExtendedParent[],
    dataDictionary: DataDictionary<unknown>,
    dictionaryId?: string
): string;
export declare class MonacoAdapter extends MessageSystemService<
    MonacoAdapterActionCallbackConfig,
    {}
> {
    private monacoModelValue;
    private schemaDictionary;
    private dataDictionary;
    private dictionaryId;
    constructor(config: MessageSystemServiceConfig<MonacoAdapterActionCallbackConfig>);
    /**
     * Handles messages from the message system
     */
    handleMessageSystem: (e: MessageEvent) => void;
    /**
     * Gets the action config
     */
    getActionConfig: (
        messageSystemType: MessageSystemType
    ) => MonacoAdapterActionCallbackConfig;
    /**
     * Adds all config options to registered actions
     */
    private addConfigToActions;
    /**
     * Retrieve the Monaco Model value
     */
    private getMonacoModelValue;
    /**
     * Determine the dictionary id
     */
    private updateDictionaryIdAndNavigationConfigIdFromDataDictionary;
    /**
     * Update the Monaco Model value
     */
    private updateMonacoModelValue;
}
