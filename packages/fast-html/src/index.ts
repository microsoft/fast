import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    type AttributeMapConfig,
    ObserverMap,
    type ObserverMapConfig,
    TemplateElement,
} from "./components/index.js";
