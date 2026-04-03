import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    ObserverMap,
    RenderableFASTElement,
    TemplateElement,
} from "./components/index.js";
