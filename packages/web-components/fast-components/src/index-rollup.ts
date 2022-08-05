// TODO: Is exporting Foundation still necessary with the updated API's?
// export * from "@microsoft/fast-element";
import { allComponents } from "./custom-elements.js";
import { provideFASTDesignSystem } from "./fast-design-system.js";

export * from "./index.js";

/**
 * The global FAST Design System.
 * @remarks
 * Only available if the components are added through a script tag
 * rather than a module/build system.
 */
export const FASTDesignSystem = provideFASTDesignSystem().register(allComponents);
