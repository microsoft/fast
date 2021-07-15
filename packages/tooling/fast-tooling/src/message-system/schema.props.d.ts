export interface SchemaDictionary {
    /**
     * The key must be the JSON schema id as the id is what is used
     * to look up schemas in the tooling
     */
    [key: string]: any;
}
