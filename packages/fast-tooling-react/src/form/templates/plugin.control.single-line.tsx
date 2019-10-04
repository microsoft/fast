import React from "react";
import ControlPluginUtilities, {
    ControlPluginUtilitiesProps,
} from "./plugin.control.utilities";
import SingleLineControlTemplate from "./template.control.single-line";

/* tslint:disable */
export interface SingleLineControlPluginProps extends ControlPluginUtilitiesProps {}

export class SingleLineControlPlugin extends ControlPluginUtilities<
    SingleLineControlPluginProps
> {
    public render(): React.ReactNode {
        return <SingleLineControlTemplate {...this.props} {...this.config} />;
    }
}
