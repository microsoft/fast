// TODO: Is exporting Foundation still necessary with the updated API's?
// export * from "@microsoft/fast-element";
import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "./custom-elements";

export * from "./index";

/**
 * TODO rename this to FASTDesignSystem when {@link @FASTDesignSystem} interface is removed.
 */
export const fastDesignSystem = DesignSystem.getOrCreate().register(
    ...Object.values(allComponents).map(definition => definition())
);
