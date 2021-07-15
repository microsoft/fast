import React from "react";
import ControlPluginUtilities, {
    ControlPluginUtilitiesProps,
} from "./plugin.control.utilities";
import { ControlContext } from "./types";
export interface StandardControlPluginProps extends ControlPluginUtilitiesProps {
    /**
     * The context of the control, used for affecting
     * positioning and layout
     */
    context?: ControlContext;
}
export declare class StandardControlPlugin extends ControlPluginUtilities<
    StandardControlPluginProps
> {
    render(): React.ReactNode;
}
