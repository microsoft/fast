import React from "react";
import ControlPluginUtilities, {
    ControlPluginUtilitiesProps,
} from "./plugin.control.utilities";
import SingleLineControlTemplate from "./template.control.single-line";

export class SingleLineControlPlugin extends ControlPluginUtilities<
    ControlPluginUtilitiesProps
> {
    public render(): JSX.Element {
        return <SingleLineControlTemplate {...this.props} {...this.config} />;
    }
}
