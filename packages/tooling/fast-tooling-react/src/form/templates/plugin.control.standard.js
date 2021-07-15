import React from "react";
import ControlPluginUtilities from "./plugin.control.utilities";
import StandardControlTemplate from "./template.control.standard";
export class StandardControlPlugin extends ControlPluginUtilities {
    render() {
        return <StandardControlTemplate {...this.props} {...this.config} />;
    }
}
