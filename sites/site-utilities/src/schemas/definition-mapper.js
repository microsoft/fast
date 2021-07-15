import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";
import {
    fastComponentExtendedDefinitions,
    nativeElementDefinitions,
    nativeElementExtendedDefinitions,
} from "../definitions";
const fastComponentSchemas = {};
const nativeElementSchemas = {};
const fastComponentExtendedSchemas = {};
const nativeElementExtendedSchemas = {};
function mapToJSONSchemas(definitions, schemas) {
    Object.entries(definitions).forEach(([, definition]) => {
        mapWebComponentDefinitionToJSONSchema(definition).forEach(definitionTagItem => {
            const jsonSchema = definitionTagItem;
            schemas[jsonSchema.$id] = jsonSchema;
        });
    });
}
mapToJSONSchemas(fastComponentDefinitions, fastComponentSchemas);
mapToJSONSchemas(nativeElementDefinitions, nativeElementSchemas);
mapToJSONSchemas(fastComponentExtendedDefinitions, fastComponentExtendedSchemas);
mapToJSONSchemas(nativeElementExtendedDefinitions, nativeElementExtendedSchemas);
/**
 * Map the formControlId to all property names for use by the <Form /> component
 */
Object.entries(fastComponentExtendedSchemas).forEach(([schemaKey]) => {
    Object.keys(fastComponentExtendedSchemas[schemaKey].properties).forEach(
        propertyKey => {
            fastComponentExtendedSchemas[schemaKey].properties[propertyKey][
                "formControlId"
            ] = propertyKey;
        }
    );
});
Object.entries(nativeElementExtendedSchemas).forEach(([schemaKey]) => {
    Object.keys(nativeElementExtendedSchemas[schemaKey].properties).forEach(
        propertyKey => {
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
