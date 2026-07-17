// This fixture imports via bare `@microsoft/fast-element/*` specifiers so it
// resolves to the built package (dist), exercising the public `exports` map as
// a consumer would. The source entries (main.ts, declarative-main.ts) resolve to
// src instead, so importing the same singleton-bearing module (such as
// Schema/schemaRegistry, ArrayObserver, or the observable engine) from both
// sides loads two copies and breaks identity and enable() state. Import any such
// shared symbol from one side only.
export { ArrayObserver } from "@microsoft/fast-element/arrays.js";
export {
    AttributeMap,
    attributeMap,
} from "@microsoft/fast-element/attribute-map.js";
export { Observable } from "@microsoft/fast-element/observable.js";
export {
    ObserverMap,
    observerMap,
} from "@microsoft/fast-element/observer-map.js";
export {
    FASTElementDefinition,
    fastElementRegistry,
} from "@microsoft/fast-element/registry.js";
export { Schema } from "@microsoft/fast-element/schema.js";
