import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";
import {
    fastComponentExtendedDefinitions,
    nativeElementDefinitions,
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

/**
 * Map the formControlId to all property names for use by the <Form /> component
 */
Object.entries(fastComponentExtendedSchemas).forEach(([schemaKey]: [string, any]) => {
    Object.keys(fastComponentExtendedSchemas[schemaKey].properties).forEach(
        (propertyKey: string) => {
            fastComponentExtendedSchemas[schemaKey].properties[propertyKey][
                "formControlId"
            ] = propertyKey;
        }
    );
});
Object.entries(nativeElementExtendedSchemas).forEach(([schemaKey]: [string, any]) => {
    Object.keys(nativeElementExtendedSchemas[schemaKey].properties).forEach(
        (propertyKey: string) => {
            nativeElementExtendedSchemas[schemaKey].properties[propertyKey][
                "formControlId"
            ] = propertyKey;
        }
    );
});

export {
    fastComponentSchemas,
    nativeElementSchemas,
    fastComponentExtendedSchemas,
    nativeElementExtendedSchemas,
};
