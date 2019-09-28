import React from "react";
import AbstractControlPlugin, {
    AbstractControlPluginProps,
} from "./plugin.control.abstract";
import SingleLineControlTemplate from "./template.control.single-line";

/* tslint:disable */
export interface SingleLineControlPluginProps extends AbstractControlPluginProps {}

export class SingleLineControlPlugin extends AbstractControlPlugin<
    SingleLineControlPluginProps
> {
    public render(): React.ReactNode {
        return <SingleLineControlTemplate {...this.props} {...this.config} />;
    }
}
