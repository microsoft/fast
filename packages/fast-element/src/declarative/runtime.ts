import { FAST } from "../platform.js";
import { debugMessages } from "./debug.js";

let declarativeRuntimeInstalled = false;

/**
 * Installs the declarative runtime debug messages.
 * @internal
 */
export function ensureDeclarativeRuntime(): void {
    if (declarativeRuntimeInstalled) {
        return;
    }

    FAST.addMessages(debugMessages);
    declarativeRuntimeInstalled = true;
}
