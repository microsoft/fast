import {
    MessageSystem,
    Register,
    MessageSystemType,
    DataDictionary,
    SchemaDictionary,
    MessageSystemValidationTypeAction,
    Validation,
    TreeNavigationConfigDictionary,
} from "../message-system";
import ajv, { ErrorObject, ValidateFunction } from "ajv";

export interface AjvMapperConfig {
    /**
     * The message system
     * used for sending and receiving validation to the message system
     */
    messageSystem: MessageSystem;
}

export class AjvMapper {
    /**
     * Dictionary of Ajv validators. One validator per unique schema key.
     * @type {{ [key: string]: ajv.Ajv }}
     */
    private ajvDictionary: { [key: string]: ajv.Ajv } = {};

    /**
     * Dictionary of Ajv validate functions. This is compiled schema cache. One per unique schema key.
     * @type {{ [key: string]: ValidateFunction }}
     */
    private validateFunctionDictionary: { [key: string]: ValidateFunction } = {};

    private navigationDictionary: TreeNavigationConfigDictionary;
    private validation: Validation = {};
    private messageSystem: MessageSystem;
    // private ajv = new Ajv();

    constructor(config: AjvMapperConfig) {
        if (config.messageSystem !== undefined) {
            config.messageSystem.add({
                onMessage: this.handleMessageSystem,
            });
        }

        this.messageSystem = config.messageSystem;
    }

    private handleMessageSystem(e: MessageEvent): void {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                this.removeAllCachedValidation();

                this.navigationDictionary = e.data.navigationDictionary;
                this.validation[e.data.dictionaryId] = this.validateData(
                    e.data.dataDictionary[e.data.dictionaryId],
                    e.data.schemaDictionary[e.data.schemaId]
                );

                // this.messageSystem.postMessage({
                //     type: MessageSystemType.validation,
                //     action: MessageSystemValidationTypeAction.update,
                //     validationErrors: this.validation[e.data.dictionaryId],
                //     dictionaryId: e.data.dictionaryId,
                // });

                break;
            case MessageSystemType.data:
                this.dataDictionary = e.data.dataDictionary;
                this.validation[e.data.dictionaryId] = this.validateData(
                    e.data.dataDictionary[e.data.dictionaryId],
                    this.schemaDictionary[e.data.schemaId]
                );

                break;
            // case MessageSystemType.validation:
            //     if (e.data.action === MessageSystemValidationTypeAction.update) {

            //     }

            //     break;
        }
    }

    /**
     * Validate data against given schema.
     */
    private validateData(schema: any, data: any): boolean | PromiseLike<any> {
        const schemaRefKey: string = schema.id;

        if (!this.validateFunctionDictionary[schemaRefKey]) {
            this.ajvDictionary[schemaRefKey] = new ajv({
                schemaId: "auto",
                allErrors: true,
            });
            this.validateFunctionDictionary[schemaRefKey] = this.ajvDictionary[
                schemaRefKey
            ].compile(schema);
        }

        return this.validateFunctionDictionary[schemaRefKey](data) || false;
    }

    /**
     * Get array of validation error objects for the given schema and data.
     */
    private getValidationErrors(schema: any, data: any): ErrorObject[] {
        let validationErrors: ErrorObject[] = [];

        if (!!!this.validateData(schema, data)) {
            const schemaRefKey: string = schema.id;
            this.validateFunctionDictionary[schemaRefKey](data);
            validationErrors = this.validateFunctionDictionary[schemaRefKey].errors;
        }

        return validationErrors;
    }

    /**
     * Function to empty validation cache.
     */
    private removeAllCachedValidation(): void {
        this.ajvDictionary = {};
        this.validateFunctionDictionary = {};
    }
}
