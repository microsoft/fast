import ajv, { ErrorObject, ValidateFunction } from "ajv";

import stringify from "fast-json-stable-stringify";

/**
 * Dictionary of Ajv validators. One validator per unique schema key.
 * @type {{ [key: string]: ajv.Ajv }}
 */
let ajvDictionary: { [key: string]: ajv.Ajv } = {};

/**
 * Dictionary of Ajv validate functions. This is compiled schema cache. One per unique schema key.
 * @type {{ [key: string]: ValidateFunction }}
 */
let validateFunctionDictionary: { [key: string]: ValidateFunction } = {};

/**
 * Validate data against given schema.
 * @method
 * @param schema {any} schema for the data to be validate against.
 * @param data {any} data object for validation.
 * @returns {boolean | PromiseLike<any>} Boolean if data is valid or promise like.
 */
export function validateData(schema: any, data: any): boolean | PromiseLike<any> {
    const schemaRefKey: string = stringify(schema);

    if (!validateFunctionDictionary[schemaRefKey]) {
        ajvDictionary[schemaRefKey] = new ajv({ schemaId: "auto", allErrors: true });
        validateFunctionDictionary[schemaRefKey] = ajvDictionary[schemaRefKey].compile(
            schema
        );
    }

    return validateFunctionDictionary[schemaRefKey](data) || false;
}

/**
 * Get array of validation error objects for the given schema and data.
 * @method
 * @param schema {any} schema for the data to be validate against.
 * @param data {any} data object for validation.
 * @returns {ErrorObject[]} Empty array if there is no validation errors, array of error objects otherwise.
 */
export function getValidationErrors(schema: any, data: any): ErrorObject[] {
    let validationErrors: ErrorObject[] = [];

    if (!!!validateData(schema, data)) {
        const schemaRefKey: string = stringify(schema);
        validationErrors = validateFunctionDictionary[schemaRefKey].errors;
    }

    return validationErrors;
}

/**
 * Function to empty validation cache.
 * @method
 */
export function removeAllCachedValidation(): void {
    ajvDictionary = {};
    validateFunctionDictionary = {};
}

/**
 * Remove cached validation for the given schema.
 * @method
 * @param schema {any} Schema for which cached validation objects will be removed.
 */
export function removeCachedSchemaValidation(schema: any): void {
    const schemaRefKey: string = stringify(schema);

    if (ajvDictionary[schemaRefKey]) {
        ajvDictionary[schemaRefKey] = null;
    }

    if (validateFunctionDictionary[schemaRefKey]) {
        validateFunctionDictionary[schemaRefKey] = null;
    }
}
