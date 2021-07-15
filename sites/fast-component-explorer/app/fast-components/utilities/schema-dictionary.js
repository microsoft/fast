import {
    fastComponentSchemas,
    nativeElementExtendedSchemas,
    textSchema,
} from "@microsoft/site-utilities";
export const schemaDictionary = Object.assign(
    Object.assign(Object.assign({}, fastComponentSchemas), nativeElementExtendedSchemas),
    { [textSchema.$id]: textSchema }
);
