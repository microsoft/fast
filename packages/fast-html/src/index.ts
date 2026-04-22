import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    type AttributeMapConfig,
    ObserverMap,
    type ObserverMapConfig,
    type ObserverMapPathEntry,
    type ObserverMapPathNode,
    RenderableFASTElement,
    type ResolvedStringsAndValues,
    TemplateElement,
    TemplateParser,
} from "./components/index.js";
