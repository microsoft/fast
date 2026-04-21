import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    type AttributeMapConfig,
    type AttributeMapOptions,
    attributeMap,
    ObserverMap,
    type ObserverMapConfig,
    type ObserverMapOptions,
    type ObserverMapPathEntry,
    type ObserverMapPathNode,
    observerMap,
    type ResolvedStringsAndValues,
    TemplateElement,
    TemplateParser,
} from "./components/index.js";
