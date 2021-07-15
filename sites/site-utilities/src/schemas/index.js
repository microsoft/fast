import textSchema from "./text.schema";
import { fastComponentSchemas, nativeElementSchemas } from "./definition-mapper";
const schemaDictionary = Object.assign(
    Object.assign(Object.assign({}, fastComponentSchemas), nativeElementSchemas),
    { [textSchema.id]: textSchema }
);
export * from "./definition-mapper";
export { textSchema, schemaDictionary };
