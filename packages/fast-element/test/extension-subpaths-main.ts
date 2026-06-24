// This fixture deliberately imports via bare `@microsoft/fast-element/*`
// specifiers so it resolves to the BUILT package (dist), exercising the public
// `exports` map exactly as a consumer would. Do NOT combine it in a single test
// with the source-resolved entries (main.ts / declarative-main.ts) when they
// share a runtime singleton (Schema/schemaRegistry, ArrayObserver, the
// observable engine) — that loads two copies of the module and breaks identity
// and enable() state. Pull all such symbols from one side or the other.
export { ArrayObserver } from "@microsoft/fast-element/arrays.js";
export {
    AttributeMap,
    attributeMap,
} from "@microsoft/fast-element/attribute-map.js";
export {
    ObserverMap,
    observerMap,
} from "@microsoft/fast-element/observer-map.js";
export {
    FASTElementDefinition,
    fastElementRegistry,
} from "@microsoft/fast-element/registry.js";
export { Schema } from "@microsoft/fast-element/schema.js";
