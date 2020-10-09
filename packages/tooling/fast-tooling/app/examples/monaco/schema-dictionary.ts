import { linkedDataSchema } from "../../../src";
import { ReservedElementMappingKeyword } from "../../../src/data-utilities/types";

export default {
    div: {
        $id: "div",
        id: "div",
        type: "object",
        [ReservedElementMappingKeyword.mapsToTagName]: "div",
        properties: {
            foo: {
                title: "Foo",
                type: "string",
            },
            bar: {
                title: "Bar",
                type: "boolean",
            },
            Slot: {
                [ReservedElementMappingKeyword.mapsToSlot]: "",
                ...linkedDataSchema,
            },
        },
    },
    span: {
        $id: "span",
        id: "span",
        type: "object",
        [ReservedElementMappingKeyword.mapsToTagName]: "span",
        properties: {
            Slot: {
                [ReservedElementMappingKeyword.mapsToSlot]: "",
                ...linkedDataSchema,
            },
        },
    },
    text: {
        $id: "text",
        id: "text",
        type: "string",
    },
};
