import React from "react";
import {
    ControlConfig,
    ControlTemplateUtilitiesProps,
} from "./template.control.utilities.props";

export interface ControlPluginUtilitiesProps {
    control: (config: ControlConfig) => React.ReactNode;
}

export default abstract class ControlPluginUtilities<
    C extends ControlPluginUtilitiesProps
> {
    /**
     * props are the properties for the control template component
     * these are passed to the plugin via the Form
     */
    public props: ControlTemplateUtilitiesProps;

    /**
     * config are the configuration options supplied to the plugin at intialization,
     * this including the control and any other user configurations
     */
    public config: C;

    constructor(config: C) {
        this.updateConfig(config);
    }

    public updateConfig(config: C): void {
        this.config = Object.assign({}, config);
    }

    public updateProps(props: ControlTemplateUtilitiesProps): void {
        this.props = Object.assign({}, props);
    }

    public abstract render(): React.ReactNode;
}
