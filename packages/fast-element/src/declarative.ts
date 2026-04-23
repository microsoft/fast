import { debugMessages } from "./declarative/debug.js";
import { FAST } from "./platform.js";
import "./templating/install-hydratable-view-templates.js";

FAST.addMessages(debugMessages);

export type {
    AttributeMapConfig,
    CachedPathMap,
    ElementOptions,
    ElementOptionsDictionary,
    HydrationLifecycleCallbacks,
    JSONSchema,
    ObserverMapConfig,
    ObserverMapPathEntry,
    ObserverMapPathNode,
    ResolvedStringsAndValues,
} from "./declarative/index.js";
export {
    AttributeMap,
    AttributeMapOption,
    ObserverMap,
    ObserverMapOption,
    Schema,
    schemaRegistry,
    TemplateElement,
    TemplateParser,
} from "./declarative/index.js";
