import { FAST } from "../platform.js";
import { ensureHydrationRuntime } from "../hydration/runtime.js";
import { debugMessages } from "./debug.js";

let declarativeRuntimeInstalled = false;

/**
 * Installs the declarative runtime: ensures hydration support is
 * available and registers declarative-specific debug messages.
 * @internal
 */
export function ensureDeclarativeRuntime(): void {
    if (declarativeRuntimeInstalled) {
        return;
    }

    ensureHydrationRuntime();
    FAST.addMessages(debugMessages);
    declarativeRuntimeInstalled = true;
}
