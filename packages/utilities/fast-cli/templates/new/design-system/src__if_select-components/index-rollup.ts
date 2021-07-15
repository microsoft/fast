import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "./custom-elements";

export * from "./index";

export const fastDesignSystem = DesignSystem.getOrCreate().register(
    ...Object.values(allComponents).map(definition => definition())
);
