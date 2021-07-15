import React from "react";
import ControlPluginUtilities from "./plugin.control.utilities";
import SingleLineControlTemplate from "./template.control.single-line";
export class SingleLineControlPlugin extends ControlPluginUtilities {
    render() {
        return <SingleLineControlTemplate {...this.props} {...this.config} />;
    }
}
