import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    ObserverMap,
    RenderableFASTElement,
    type TemplateConverterPlugin,
    type TemplateConverterResult,
    TemplateElement,
    ViewTemplateConverter,
} from "./components/index.js";
