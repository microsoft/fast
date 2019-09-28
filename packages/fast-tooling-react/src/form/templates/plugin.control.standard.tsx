import React from "react";
import AbstractControlPlugin, {
    AbstractControlPluginProps,
} from "./plugin.control.abstract";
import StandardControlTemplate from "./template.control.standard";
import { ControlContext } from "./template.control.standard.props";

export interface StandardControlPluginProps extends AbstractControlPluginProps {
    /**
     * The context of the control, used for affecting
     * positioning and layout
     */
    context?: ControlContext;
}

export class StandardControlPlugin extends AbstractControlPlugin<
    StandardControlPluginProps
> {
    public render(): React.ReactNode {
        return <StandardControlTemplate {...this.props} {...this.config} />;
    }
}
