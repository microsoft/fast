import { installHydratableViewTemplates } from "../templating/install-hydratable-view-templates.js";

/**
 * Installs FAST element hydration support.
 * @public
 */
export function installElementHydration(): void {
    installHydratableViewTemplates();
}

installElementHydration();
