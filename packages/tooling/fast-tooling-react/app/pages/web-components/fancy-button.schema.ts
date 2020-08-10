import { linkedDataSchema, ReservedElementMappingKeyword } from "@microsoft/fast-tooling";

export default {
    $schema: "https://json-schema.org/schema#",
    title: "Fancy button",
    [ReservedElementMappingKeyword.mapsToTagName]: "fancy-button",
    description: "A test component's schema definition.",
    type: "object",
    id: "fancyButton",
    properties: {
        children: {
            title: "Default slot",
            [ReservedElementMappingKeyword.mapsToSlot]: "",
            ...linkedDataSchema,
        },
    },
};
