import React from "react";
import { CSSControlConfig } from "./css.template.control.standard.props";

export interface CSSControlPluginUtilitiesCommon {
    /**
     * Names of the CSS properties this plugin affects
     */
    propertyNames: string[];

    /**
     * The id of this plugin
     */
    id: string;
}

export interface CSSControlPluginUtilitiesProps extends CSSControlPluginUtilitiesCommon {
    /**
     * The control provided.
     */
    control: (config: CSSControlConfig) => React.ReactNode;
}

/**
 * These are the plugin utilities for a CSS custom control.
 */
export default abstract class CSSControlPluginUtilities<
    C extends CSSControlPluginUtilitiesProps
> {
    /**
     * config are the configuration options supplied to the plugin at intialization,
     * this including the control and any other user configurations
     */
    public config: C;

    /**
     * props are the properties for the control template component
     * these are passed to the plugin via the Form
     */
    public props: CSSControlConfig;

    constructor(config: C) {
        this.updateConfig(config);
    }

    public updateConfig(config: C): void {
        this.config = Object.assign({}, config, {
            id: Array.isArray(config.id)
                ? config.id
                : config.id !== undefined
                ? [config.id]
                : [],
        });
    }

    public updateProps(props: CSSControlConfig): void {
        this.props = Object.assign({}, props);
    }
}
