import {
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
    MessageSystemValidationTypeAction,
    NavigationConfigDictionary,
    Validation,
    ValidationErrors,
} from "../message-system";
import { normalizeDataLocationToDotNotation } from "./location";
import Ajv from "ajv";

export interface AjvMapperConfig {
    /**
     * The message system
     * used for sending and receiving validation to the message system
     */
    messageSystem: MessageSystem;
}

export class AjvMapper {
    private activeDictionaryId: string;
    private navigationDictionary: NavigationConfigDictionary;
    private validation: Validation = {};
    private messageSystem: MessageSystem;
    private messageSystemConfig: { onMessage: (e: MessageEvent) => void };
    private ajv: Ajv.Ajv = new Ajv({ schemaId: "auto", allErrors: true });

    constructor(config: AjvMapperConfig) {
        if (config.messageSystem !== undefined) {
            this.messageSystemConfig = {
                onMessage: this.handleMessageSystem,
            };
            config.messageSystem.add(this.messageSystemConfig);
        }

        this.messageSystem = config.messageSystem;
    }

    /**
     * Destroy this before dereferencing the validator
     * or this will not be garbage collected
     */
    public destroy(): void {
        this.messageSystem.remove(this.messageSystemConfig);
    }

    /**
     * Handles messages from the message system
     */
    private handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                this.activeDictionaryId = e.data.activeDictionaryId;
                this.navigationDictionary = e.data.navigationDictionary;
                this.validation[e.data.activeDictionaryId] = this.validateData(
                    this.navigationDictionary[0][e.data.activeDictionaryId][0][
                        this.navigationDictionary[0][e.data.activeDictionaryId][1]
                    ].data,
                    this.navigationDictionary[0][e.data.activeDictionaryId][0][
                        this.navigationDictionary[0][e.data.activeDictionaryId][1]
                    ].schema,
                    e.data.activeDictionaryId
                );

                this.messageSystem.postMessage({
                    type: MessageSystemType.validation,
                    action: MessageSystemValidationTypeAction.update,
                    validationErrors: this.validation[e.data.activeDictionaryId],
                    dictionaryId: e.data.activeDictionaryId,
                });

                break;
            case MessageSystemType.data:
                if (
                    e.data.action === MessageSystemDataTypeAction.add ||
                    e.data.action === MessageSystemDataTypeAction.duplicate ||
                    e.data.action === MessageSystemDataTypeAction.update ||
                    e.data.action === MessageSystemDataTypeAction.addLinkedData
                ) {
                    this.navigationDictionary = e.data.navigationDictionary;

                    if (e.data.action === MessageSystemDataTypeAction.addLinkedData) {
                        const linkedDataRootId: string = e.data.navigation[1];
                        this.validation[linkedDataRootId] = this.validateData(
                            e.data.navigation[0][linkedDataRootId].data,
                            e.data.navigation[0][linkedDataRootId].schema,
                            e.data.dictionaryId
                        );
                    } else {
                        this.validation[this.activeDictionaryId] = this.validateData(
                            this.navigationDictionary[0][this.activeDictionaryId][0][
                                this.navigationDictionary[0][this.activeDictionaryId][1]
                            ].data,
                            this.navigationDictionary[0][this.activeDictionaryId][0][
                                this.navigationDictionary[0][this.activeDictionaryId][1]
                            ].schema,
                            this.activeDictionaryId
                        );
                    }
                }

                break;
        }
    };

    /**
     * Normalize the dataPaths provided by Ajv to the dataLocation path syntax
     */
    private normalizeAjvDataPath(dataPath: string): string {
        return normalizeDataLocationToDotNotation(
            dataPath
                .replace(/(\[')/g, ".")
                .replace(/('\])/g, "")
                .replace(/^(\.+)/, "")
        );
    }

    /**
     * Validates the data
     */
    private validateData = (
        data: any,
        schema: any,
        dictionaryId: string
    ): ValidationErrors[] => {
        // if this data has never been validated against,
        // add the schema to ajv
        if (this.validation[dictionaryId] === undefined) {
            this.ajv.addSchema(schema, schema.id);
        }

        const ajvValidationObject = this.ajv.validate(schema.id, data);

        if (ajvValidationObject === true) {
            return [];
        } else {
            return this.ajv.errors.map((AjvError: Ajv.ErrorObject) => {
                return {
                    dataLocation: this.normalizeAjvDataPath(AjvError.dataPath),
                    invalidMessage: AjvError.message,
                };
            });
        }
    };
}
