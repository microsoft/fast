import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    type AttributeMapConfig,
    type HydrationLifecycleCallbacks,
    ObserverMap,
    type ObserverMapConfig,
    type ObserverMapPathEntry,
    type ObserverMapPathNode,
    RenderableFASTElement,
    TemplateElement,
} from "./components/index.js";
