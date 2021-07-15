import React from "react";
import ControlPluginUtilities from "./plugin.control.utilities";
import BareControlTemplate from "./template.control.bare";
export class BareControlPlugin extends ControlPluginUtilities {
    render() {
        return <BareControlTemplate {...this.props} {...this.config} />;
    }
}
