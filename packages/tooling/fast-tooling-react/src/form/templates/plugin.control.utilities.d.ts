import React from "react";
import {
    ControlConfig,
    ControlTemplateUtilitiesProps,
} from "./template.control.utilities.props";
import { ControlType } from "./index";
export interface ControlPluginUtilitiesProps {
    /**
     * The control to be used as a form element to change data
     */
    control: (config: ControlConfig) => React.ReactNode;
    /**
     * The id(s) in the schema corresponding
     * to the `formControlId` property
     */
    id?: string | string[];
    /**
     * The type corresponds to the typical control type
     * used
     */
    type?: ControlType;
    /**
     * The component used as the control
     */
    component?: React.ComponentClass | React.FunctionComponent;
}
export default abstract class ControlPluginUtilities<
    C extends ControlPluginUtilitiesProps
> {
    /**
     * props are the properties for the control template component
     * these are passed to the plugin via the Form
     */
    props: ControlTemplateUtilitiesProps;
    /**
     * config are the configuration options supplied to the plugin at intialization,
     * this including the control and any other user configurations
     */
    config: C;
    constructor(config: C);
    /**
     * Determines if there is a match for the IDs set for the plugin
     * and a provided ID
     */
    matchesId(id: string): boolean;
    /**
     * Determines if there is a match for the type set for the plugin
     */
    matchesType(type: ControlType): boolean;
    /**
     * Determines if there is a match to any control
     */
    matchesAllTypes(): boolean;
    updateConfig(config: C): void;
    updateProps(props: ControlTemplateUtilitiesProps): void;
    abstract render(): React.ReactNode;
}
