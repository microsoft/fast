import React from "react";
import {
    AbstractControlTemplateProps,
    ControlConfig,
} from "./template.control.abstract.props";

export interface AbstractControlPluginProps {
    control: (config: ControlConfig) => React.ReactNode;
}

export default abstract class AbstractControlPlugin<
    C extends AbstractControlPluginProps
> {
    public props: C;
    public config: AbstractControlTemplateProps;

    constructor(props: C) {
        this.props = Object.assign({}, props);
    }

    public updateConfig(config: AbstractControlTemplateProps): void {
        this.config = Object.assign({}, config);
    }

    public updateProps(props: C): void {
        this.props = Object.assign({}, props);
    }

    public render(): React.ReactNode {
        return null;
    }
}
