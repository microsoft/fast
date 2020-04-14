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
    public props: ControlTemplateUtilitiesProps;

    /**
     * config are the configuration options supplied to the plugin at intialization,
     * this including the control and any other user configurations
     */
    public config: C;

    constructor(config: C) {
        this.updateConfig(config);
    }

    /**
     * Determines if there is a match for the IDs set for the plugin
     * and a provided ID
     */
    public matchesId(id: string): boolean {
        return this.config.id.indexOf(id) !== -1;
    }

    /**
     * Determines if there is a match for the type set for the plugin
     */
    public matchesType(type: ControlType): boolean {
        return this.config.type === type;
    }

    /**
     * Determines if there is a match to any control
     */
    public matchesAllTypes(): boolean {
        return this.config.type === undefined && this.config.id.length === 0;
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

    public updateProps(props: ControlTemplateUtilitiesProps): void {
        this.props = Object.assign({}, props);
    }

    public abstract render(): React.ReactNode;
}
