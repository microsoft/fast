import { debugMessages } from "./declarative/debug.js";
import { registerFAST } from "./platform.js";

registerFAST().addMessages(debugMessages);

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
