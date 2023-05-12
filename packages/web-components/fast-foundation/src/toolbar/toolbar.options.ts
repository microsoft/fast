import { Orientation } from "@microsoft/fast-web-utilities";
import type { ValuesOf } from "../utilities/index.js";
import type { StartEndOptions } from "../patterns/start-end.js";
import type { FASTToolbar } from "./toolbar.js";

/**
 * Toolbar configuration options
 * @public
 */
export type ToolbarOptions = StartEndOptions<FASTToolbar>;

/**
 * The orientation of the {@link @microsoft/fast-foundation#(FASTToolbar:class)} component
 * @public
 */
export const ToolbarOrientation = Orientation;

/**
 * The types for the Toolbar component
 * @public
 */
export type ToolbarOrientation = ValuesOf<typeof ToolbarOrientation>;
