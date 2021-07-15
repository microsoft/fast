import {
    Data,
    DataDictionary,
    LinkedDataDictionaryConfig,
    LinkedDataDictionaryUpdate,
} from "./data.props";
export declare function getLinkedDataDictionary(
    config: LinkedDataDictionaryConfig
): LinkedDataDictionaryUpdate;
/**
 * Gets linked data from a data dictionary
 * that can be used to add to an existing data dictionary
 * via the Message System
 */
export declare function getLinkedData(
    dataDictionary: DataDictionary<unknown>,
    dictionaryIds: string[]
): Data<unknown>[];
/**
 * Gets a list of linked data ids from a single dictionary id
 */
export declare function getLinkedDataList(
    dataDictionary: DataDictionary<unknown>,
    dictionaryId: string
): string[];
