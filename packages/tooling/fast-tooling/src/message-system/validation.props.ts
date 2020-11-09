import { CustomMessage } from "./message-system.utilities.props";

export interface Validation {
    [dictionaryId: string]: ValidationError[];
}

export interface ValidationError {
    dataLocation: string;
    invalidMessage: string;
}

export enum SchemaSetValidationAction {
    request = "request",
    response = "response",
}

/**
 * Custom message requesting validation against a set of schemas
 */
export interface SchemaSetValidationMessageRequest extends CustomMessage<{}, {}> {
    action: SchemaSetValidationAction.request;
    /**
     * The unique ID for the validation request
     */
    id: string;

    /**
     * The available schemas
     */
    schemas: any[];

    /**
     *
     */
    data: any;
}

/**
 * Custom message with requested validation against a set of schemas
 * with the index of the first schema to be valid against the data
 */
export interface SchemaSetValidationMessageResponse extends CustomMessage<{}, {}> {
    action: SchemaSetValidationAction.response;
    /**
     * The unique ID for the validation request
     */
    id: string;

    /**
     * The index of the first sub schema that was valid against the data
     * if no sub schem was valid against the data, this will be -1
     */
    index: number;
}
