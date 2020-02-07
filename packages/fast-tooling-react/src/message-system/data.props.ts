export interface Parent {
    /**
     * The id of the parent data blob in the dictionary
     */
    id: string;
}

export interface Children {
    /**
     * The id of the children data blob in the dictionary
     * that is linked from within the data
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
