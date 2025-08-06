import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    RenderableFASTElement,
    TemplateElement,
    ObserverMap,
} from "./components/index.js";
