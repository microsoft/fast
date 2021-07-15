import { MessageSystem } from "../message-system";
export declare const ajvValidationId = "fast-tooling::ajv-validation-service";
export interface AjvMapperConfig {
    /**
     * The message system
     * used for sending and receiving validation to the message system
     */
    messageSystem: MessageSystem;
}
export declare class AjvMapper {
    private activeDictionaryId;
    private navigationDictionary;
    private validation;
    private schemaDictionary;
    private messageSystem;
    private messageSystemConfig;
    private ajv;
    constructor(config: AjvMapperConfig);
    /**
     * Destroy this before dereferencing the validator
     * or this will not be garbage collected
     */
    destroy(): void;
    /**
     * Handles messages from the message system
     */
    private handleMessageSystem;
    /**
     * Normalize the dataPaths provided by Ajv to the dataLocation path syntax
     */
    private normalizeAjvDataPath;
    /**
     * Validate the data against multiple schemas
     * and return the first valid index or if none
     * are valid, return -1
     */
    private findValidSchema;
    /**
     * Validates the data
     */
    private validateData;
}
