import React from "react";
import ControlPluginUtilities, {
    ControlPluginUtilitiesProps,
} from "./plugin.control.utilities";
import BareControlTemplate from "./template.control.bare";

export class BareControlPlugin extends ControlPluginUtilities<
    ControlPluginUtilitiesProps
> {
    public render(): React.ReactNode {
        return <BareControlTemplate {...this.props} {...this.config} />;
    }
}
