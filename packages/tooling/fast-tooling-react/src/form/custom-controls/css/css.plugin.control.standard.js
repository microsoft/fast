import React from "react";
import CSSControlPluginUtilities from "./css.plugin.control.utilities";
import CSSStandardControlTemplate from "./css.template.control.standard";
export default class CSSStandardControlPlugin extends CSSControlPluginUtilities {
    render() {
        return (
            <CSSStandardControlTemplate
                key={this.config.id}
                {...this.config}
                {...this.props}
            />
        );
    }
    matches(propertyName) {
        return this.config.propertyNames.includes(propertyName);
    }
    getPropertyNames() {
        return this.config.propertyNames;
    }
}
