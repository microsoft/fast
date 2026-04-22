import { FAST } from "@microsoft/fast-element";
import { debugMessages } from "./debug.js";

FAST.addMessages(debugMessages);

export {
    type ResolvedStringsAndValues,
    TemplateElement,
    TemplateParser,
} from "./components/index.js";
