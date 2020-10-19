import {
    fastComponentSchemas,
    nativeElementExtendedSchemas,
    textSchema,
} from "@microsoft/site-utilities";

export const schemaDictionary = {
    ...fastComponentSchemas,
    ...nativeElementExtendedSchemas,
    [textSchema.$id]: textSchema,
};
