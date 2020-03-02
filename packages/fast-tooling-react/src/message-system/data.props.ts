export interface Parent {
    /**
     * The id of the parent data blob in the dictionary
     */
    id: string;

    /**
     * The data location of the parent data blob in the dictionary
     */
    dataLocation: string;
}

export interface LinkedData {
    /**
     * The id of the linked data blob in the dictionary
     */
    id: string;
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
