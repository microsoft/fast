import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { componentDefinitions } from "@microsoft/site-utilities";
import {
    fastDesignSystemProviderDefinition,
    fastDesignSystemProviderId,
} from "./fast-design-system-provider.definition";

const webComponentSchemas: { [key: string]: any } = {};

function mapToJSONSchemas(): void {
    Object.entries({
        ...componentDefinitions,
        [fastDesignSystemProviderId]: fastDesignSystemProviderDefinition,
    }).forEach(([, definition]: [string, WebComponentDefinition]) => {
        const jsonSchema = mapWebComponentDefinitionToJSONSchema(definition)[0];
        webComponentSchemas[jsonSchema.$id] = jsonSchema;
    });
}

mapToJSONSchemas();

export { webComponentSchemas };
