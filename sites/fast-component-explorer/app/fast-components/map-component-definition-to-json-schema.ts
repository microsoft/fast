import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import * as componentDefinitions from "./configs/component-definitions";

const webComponentSchemas: { [key: string]: any } = {};

function mapToJSONSchemas(): void {
    Object.entries(componentDefinitions).forEach(
        ([, definition]: [string, WebComponentDefinition]) => {
            const jsonSchema = mapWebComponentDefinitionToJSONSchema(definition)[0];
            webComponentSchemas[jsonSchema.$id] = jsonSchema;
        }
    );
}

mapToJSONSchemas();

export { webComponentSchemas };
