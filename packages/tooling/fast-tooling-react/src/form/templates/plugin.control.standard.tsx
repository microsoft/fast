import React from "react";
import ControlPluginUtilities, {
    ControlPluginUtilitiesProps,
} from "./plugin.control.utilities";
import StandardControlTemplate from "./template.control.standard";
import { ControlContext } from "./types";

export interface StandardControlPluginProps extends ControlPluginUtilitiesProps {
    /**
     * The context of the control, used for affecting
     * positioning and layout
     */
    context?: ControlContext;
}

export class StandardControlPlugin extends ControlPluginUtilities<
    StandardControlPluginProps
> {
    public render(): React.ReactNode {
        return <StandardControlTemplate {...this.props} {...this.config} />;
    }
}
