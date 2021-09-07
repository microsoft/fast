import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";
import {
    fastComponentExtendedDefinitions,
    fluentUIComponentDefinitions,
    fluentUIComponentExtendedDefinitions,
    nativeElementDefinitions,
    nativeElementExtendedDefinitions,
} from "../definitions";

const fastComponentSchemas: { [key: string]: any } = {};
const fluentUIComponentSchemas: { [key: string]: any } = {};
const nativeElementSchemas: { [key: string]: any } = {};
const fastComponentExtendedSchemas: { [key: string]: any } = {};
const fluentUIComponentExtendedSchemas: { [key: string]: any } = {};
const nativeElementExtendedSchemas: { [key: string]: any } = {};

const headingAlias: string = "Heading level";
const alias: { [key: string]: string } = {
    h1: `${headingAlias} 1`,
    h2: `${headingAlias} 2`,
    h3: `${headingAlias} 3`,
    h4: `${headingAlias} 4`,
    h5: `${headingAlias} 5`,
    h6: `${headingAlias} 6`,
    p: "Paragraph",
    hr: "Thematic Break (Horizontal Rule)",
    ol: "Ordered list",
    ul: "Unordered list",
    li: "List item",
    div: "Container",
    a: "Hyperlink",
};

function mapToJSONSchemas(
    definitions: { [key: string]: WebComponentDefinition },
    schemas: { [key: string]: any },
    libraryName?: string
): void {
    Object.entries(definitions).forEach(
        ([, definition]: [string, WebComponentDefinition]) => {
            mapWebComponentDefinitionToJSONSchema(definition).forEach(
                (definitionTagItem: any) => {
                    const jsonSchema = definitionTagItem;
                    schemas[jsonSchema.$id] = {
                        ...jsonSchema,
                        ...(alias[jsonSchema.$id]
                            ? {
                                  alias: alias[jsonSchema.$id],
                              }
                            : {}),
                    };

                    if (libraryName) {
                        schemas[jsonSchema.$id].title = `${
                            schemas[jsonSchema.$id].title
                        } (${libraryName})`;
                    }
                }
            );
        }
    );
}

const fastLibraryName = "FAST";
const fluentUILibraryName = "Fluent UI";

mapToJSONSchemas(fastComponentDefinitions, fastComponentSchemas, fastLibraryName);
mapToJSONSchemas(
    fluentUIComponentDefinitions,
    fluentUIComponentSchemas,
    fluentUILibraryName
);
mapToJSONSchemas(nativeElementDefinitions, nativeElementSchemas);
mapToJSONSchemas(
    fastComponentExtendedDefinitions,
    fastComponentExtendedSchemas,
    fastLibraryName
);
mapToJSONSchemas(
    fluentUIComponentExtendedDefinitions,
    fluentUIComponentExtendedSchemas,
    fluentUILibraryName
);
mapToJSONSchemas(nativeElementExtendedDefinitions, nativeElementExtendedSchemas);

/**
 * Map the formControlId to all property names for use by the <Form /> component
 */
Object.entries(fluentUIComponentExtendedSchemas).forEach(([schemaKey]: [string, any]) => {
    Object.keys(fluentUIComponentExtendedSchemas[schemaKey].properties).forEach(
        (propertyKey: string) => {
            fluentUIComponentExtendedSchemas[schemaKey].properties[propertyKey][
                "formControlId"
            ] = propertyKey;
        }
    );
});
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
    fluentUIComponentSchemas,
    nativeElementSchemas,
    fastComponentExtendedSchemas,
    fluentUIComponentExtendedSchemas,
    nativeElementExtendedSchemas,
};
