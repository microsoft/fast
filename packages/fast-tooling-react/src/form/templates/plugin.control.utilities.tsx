import React from "react";
import {
    ControlConfig,
    ControlTemplateUtilitiesProps,
} from "./template.control.utilities.props";

export interface ControlPluginUtilitiesProps {
    control: (config: ControlConfig) => React.ReactNode;
}

export default abstract class ControlPlugin<C extends ControlPluginUtilitiesProps> {
    public props: C;
    public config: ControlTemplateUtilitiesProps;

    constructor(props: C) {
        this.updateProps(props);
    }

    public updateConfig(config: ControlTemplateUtilitiesProps): void {
        this.config = Object.assign({}, config);
    }

    public updateProps(props: C): void {
        this.props = Object.assign({}, props);
    }

    public abstract render(): React.ReactNode;
}
