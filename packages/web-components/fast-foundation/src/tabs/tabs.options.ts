import { Orientation } from "@microsoft/fast-web-utilities";
import type { StartEndOptions } from "../patterns/start-end.js";
import type { ValuesOf } from "../utilities/index.js";
import type { FASTTabs } from "./tabs.js";

/**
 * Tabs option configuration options
 * @public
 */
export type TabsOptions = StartEndOptions<FASTTabs>;

/**
 * The orientation of the {@link @microsoft/fast-foundation#(FASTTabs:class)} component
 * @public
 */
export const TabsOrientation = Orientation;

/**
 * The types for the Tabs component
 * @public
 */
export type TabsOrientation = ValuesOf<typeof TabsOrientation>;
