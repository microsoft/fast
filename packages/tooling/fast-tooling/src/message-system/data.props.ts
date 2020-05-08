export interface Parent {
    /**
     * The id of the parent data blob in the dictionary
     */
    id: string;

    /**
     * The data location of the data within the parent data blob
     */
    dataLocation: string;
}

export interface LinkedData {
    /**
     * The id of the linked data blob in the dictionary
     */
    id: string;
}

export interface LinkedDataPromise {
    /**
     * The JSON schema id for validating the data blob
     */
    schemaId: string;

    /**
     * The data blob
     */
    data: unknown;

    /**
     * The data location this promised linked data should go
     */
    linkedDataLocation?: string;

    /**
     * The linked data to add to this piece of linked data
     */
    linkedData?: LinkedDataPromise[];
}

export interface Data<T> {
    /**
     * The JSON schema id for validating the data blob
     */
    schemaId: string;

    /**
     * The parent in the data dictionary
     */
    parent?: Parent;

    /**
     * The data blob
     */
    data: T;

    /**
     * The data location for the linked data
     */
    linkedDataLocation?: string;

    /**
     * The linked data to add to this piece of linked data
     */
    linkedData?: LinkedDataPromise[];
}

export interface DataDictionary<T> {
    /**
     * The dictionary of data items
     */
    0: { [key: string]: Data<T> };

    /**
     * The root level data blob
     */
    1: string;
}

export interface LinkedDataDictionaryConfig {
    /**
     * The array of linked data
     */
    linkedData: Data<unknown>[];

    /**
     * The root dictionary ID
     */
    dictionaryId: string;

    /**
     * The root data location
     */
    dataLocation: string;
}

export interface LinkedDataDictionaryUpdate {
    /**
     * The data dictionary
     */
    dataDictionary: DataDictionary<unknown>;

    /**
     * The IDs to be added to the dictionaryId at the data location
     */
    linkedDataIds: LinkedData[];
}

export interface ResolveDataDictionary {
    /**
     * The new data dictionary
     */
    dataDictionary: { [key: string]: Data<unknown> };
}
