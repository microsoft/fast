export type {
    FASTElementExtension,
    TemplateLifecycleCallbacks,
} from "../components/fast-definitions.js";
export { type AttributeMapConfig, attributeMap } from "./attribute-map.js";
export type {
    ObserverMapConfig,
    ObserverMapPathEntry,
    ObserverMapPathNode,
} from "./observer-map.js";
export { observerMap } from "./observer-map.js";
export {
    type AccessCachedPath,
    type CachedPath,
    type CachedPathCommon,
    type CachedPathMap,
    type ChildrenMap,
    type DefaultCachedPath,
    type EventCachedPath,
    type JSONSchema,
    type JSONSchemaCommon,
    type JSONSchemaDefinition,
    type RegisterPathConfig,
    type RepeatCachedPath,
    Schema,
    schemaRegistry,
} from "./schema.js";
export { declarativeTemplate } from "./template.js";
export { type ResolvedStringsAndValues, TemplateParser } from "./template-parser.js";
