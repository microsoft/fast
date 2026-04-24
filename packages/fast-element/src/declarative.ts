import { debugMessages } from "./declarative/debug.js";
import { registerFAST } from "./platform.js";

registerFAST().addMessages(debugMessages);

export * from "./declarative/index.js";
