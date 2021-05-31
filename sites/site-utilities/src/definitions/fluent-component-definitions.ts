import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";
import { ElementByTagName } from "@microsoft/fast-tooling";

const fluentComponentDefinitions = {};

Object.keys(fastComponentDefinitions).forEach((fastComponentDefinitionKey: string) => {
    const updatedTags = fastComponentDefinitions[fastComponentDefinitionKey].tags.map(
        (tag: ElementByTagName) => {
            return {
                ...tag,
                name: tag.name.replace("fast", "fluent"),
                description: tag.description.replace("FAST", "Fluent"),
            };
        }
    );
    fluentComponentDefinitions[fastComponentDefinitionKey.replace("fast", "fluent")] = {
        ...fastComponentDefinitions[fastComponentDefinitionKey],
        tags: updatedTags,
    };
});

export default fluentComponentDefinitions;
