import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import * as fastComponentDefinitions from "../definitions/fast-components";
import * as nativeElementDefinitions from "../definitions/native";
import {
    fastComponentExtendedDefinitions,
    nativeElementExtendedDefinitions,
} from "../definitions";

const fastComponentSchemas: { [key: string]: any } = {};
const nativeElementSchemas: { [key: string]: any } = {};
const fastComponentExtendedSchemas: { [key: string]: any } = {};
const nativeElementExtendedSchemas: { [key: string]: any } = {};

function mapToJSONSchemas(
    definitions: { [key: string]: WebComponentDefinition },
    schemas: { [key: string]: any }
): void {
    Object.entries(definitions).forEach(
        ([, definition]: [string, WebComponentDefinition]) => {
            mapWebComponentDefinitionToJSONSchema(definition).forEach(
                (definitionTagItem: any) => {
                    const jsonSchema = definitionTagItem;
                    schemas[jsonSchema.$id] = jsonSchema;
                }
            );
        }
    );
}

mapToJSONSchemas(fastComponentDefinitions, fastComponentSchemas);
mapToJSONSchemas(nativeElementDefinitions, nativeElementSchemas);
mapToJSONSchemas(fastComponentExtendedDefinitions, fastComponentExtendedSchemas);
mapToJSONSchemas(nativeElementExtendedDefinitions, nativeElementExtendedSchemas);

export {
    fastComponentSchemas,
    nativeElementSchemas,
    fastComponentExtendedSchemas,
    nativeElementExtendedSchemas,
};
