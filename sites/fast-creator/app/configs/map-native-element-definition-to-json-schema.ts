import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import {
    WebComponentDefinition,
    WebComponentDefinitionTag,
} from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { nativeElementDefinitions } from "@microsoft/site-utilities";

const nativeElementSchemas: { [key: string]: any } = {};

function mapToJSONSchemas(): void {
    Object.entries(nativeElementDefinitions).forEach(
        ([, definition]: [string, WebComponentDefinition]) => {
            mapWebComponentDefinitionToJSONSchema(definition).forEach(
                (tag: WebComponentDefinitionTag, index: number) => {
                    const jsonSchema = mapWebComponentDefinitionToJSONSchema(definition)[
                        index
                    ];
                    nativeElementSchemas[jsonSchema.$id] = jsonSchema;
                }
            );
        }
    );
}

mapToJSONSchemas();

export { nativeElementSchemas };
