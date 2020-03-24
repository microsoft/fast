export interface Validation {
    [dictionaryId: string]: ValidationErrors[];
}

export interface ValidationErrors {
    dataLocation: string;
    invalidMessage: string;
}
