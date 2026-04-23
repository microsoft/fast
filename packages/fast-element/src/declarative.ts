import { debugMessages } from "./declarative/debug.js";
import { FAST } from "./platform.js";
import "./templating/install-hydratable-view-templates.js";

FAST.addMessages(debugMessages);

export * from "./declarative/index.js";
