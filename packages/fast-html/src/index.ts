import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    type AttributeMapConfig,
    declarativeTemplate,
    ObserverMap,
    type ObserverMapConfig,
    type ObserverMapPathEntry,
    type ObserverMapPathNode,
    TemplateElement,
} from "./components/index.js";
