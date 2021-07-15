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
    config: C;
    /**
     * props are the properties for the control template component
     * these are passed to the plugin via the Form
     */
    props: CSSControlConfig;
    constructor(config: C);
    updateConfig(config: C): void;
    updateProps(props: CSSControlConfig): void;
}
