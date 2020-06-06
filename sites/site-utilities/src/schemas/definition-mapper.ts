import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import * as componentDefinitions from "../definitions/fast-components";
import * as nativeElementDefinitions from "../definitions/native";

const fastComponentSchemas: { [key: string]: any } = {};
const nativeElementSchemas: { [key: string]: any } = {};

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

mapToJSONSchemas(componentDefinitions, fastComponentSchemas);
mapToJSONSchemas(nativeElementDefinitions, nativeElementSchemas);

export { fastComponentSchemas, nativeElementSchemas };
