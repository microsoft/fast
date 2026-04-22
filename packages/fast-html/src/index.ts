import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    AttributeMap,
    type AttributeMapConfig,
    AttributeMapOption,
    type CachedPathMap,
    type ElementOptions,
    type ElementOptionsDictionary,
    type HydrationLifecycleCallbacks,
    type JSONSchema,
    ObserverMap,
    type ObserverMapConfig,
    type ObserverMapPathEntry,
    type ObserverMapPathNode,
    type ResolvedStringsAndValues,
    Schema,
    schemaRegistry,
    TemplateElement,
    TemplateParser,
} from "./components/index.js";
