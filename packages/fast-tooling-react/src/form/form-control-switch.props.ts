import { CommonFormControlProps } from "./controls/control.props";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
} from "./form.props";
import { InitialOneOfAnyOfState, updateActiveSection } from "./form-section.props";

export interface FormControlSwitchProps extends CommonFormControlProps {
    /**
     * The name of the property
     */
    propertyName: string;

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
     * The section update callback
     */
    onUpdateActiveSection: updateActiveSection;

    /**
     * Allow soft remove
     * defaults to true
     */
    softRemove?: boolean;
}
