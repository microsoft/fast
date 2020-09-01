import { ControlTemplateUtilitiesProps, StandardControlPlugin } from "../../templates";
import { AttributeSettingsMappingToPropertyNames } from "../../types";
import { Controls } from "./types";

export interface ControlSwitchProps
    extends Omit<ControlTemplateUtilitiesProps, "component"> {
    /**
     * The name of the property
     */
    propertyName: string;

    /**
     * Control plugins
     */
    controls: Controls;

    /**
     * The custom control plugins which will be used
     * instead of the default control plugins
     */
    controlPlugins?: StandardControlPlugin[];

    /**
     * A component dictionary to be used by type
     */
    controlComponents: { [key: string]: React.ComponentClass | React.FunctionComponent };

    /**
     * The schema to be used
     */
    schema: any;

    /**
     * The untitled string for missing titles
     */
    untitled: string;

    /**
     * The schema location (lodash path syntax)
     */
    schemaLocation: string;

    /**
     * The additional attributes mapped to a property name
     */
    attributeSettingsMappingToPropertyNames?: AttributeSettingsMappingToPropertyNames;

    /**
     * Allow soft remove
     * defaults to true
     */
    softRemove?: boolean;
}
