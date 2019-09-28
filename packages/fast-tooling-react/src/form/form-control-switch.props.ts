import { ControlTemplateUtilitiesProps } from "./templates";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
} from "./form.props";
import { Controls } from "./form-section.props";

export interface FormControlSwitchProps extends ControlTemplateUtilitiesProps {
    /**
     * The name of the property
     */
    propertyName: string;

    /**
     * Control plugins
     */
    controls: Controls;

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
     * The possible child options
     */
    childOptions: FormChildOptionItem[];

    /**
     * The additional attributes mapped to a property name
     */
    attributeSettingsMappingToPropertyNames?: FormAttributeSettingsMappingToPropertyNames;

    /**
     * Allow soft remove
     * defaults to true
     */
    softRemove?: boolean;
}
