import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    ObserverMap,
    type ResolvedStringsAndValues,
    TemplateElement,
    TemplateParser,
} from "./components/index.js";
