import { SchemaDictionary } from "@microsoft/fast-tooling";
import textSchema from "./text.schema";
import {
    fastComponentSchemas,
    fluentComponentSchemas,
    nativeElementSchemas,
} from "./definition-mapper";

const schemaDictionary: SchemaDictionary = {
    ...fastComponentSchemas,
    ...fluentComponentSchemas,
    ...nativeElementSchemas,
    [textSchema.id]: textSchema,
};

export * from "./definition-mapper";
export { textSchema, schemaDictionary };
