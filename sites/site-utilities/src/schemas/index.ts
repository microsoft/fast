import { SchemaDictionary } from "@microsoft/fast-tooling";
import textSchema from "./text.schema";
import { fastComponentSchemas, nativeElementSchemas } from "./definition-mapper";

const schemaDictionary: SchemaDictionary = {
    ...fastComponentSchemas,
    ...nativeElementSchemas,
    [textSchema.id]: textSchema,
};

export * from "./definition-mapper";
export { textSchema, schemaDictionary };
