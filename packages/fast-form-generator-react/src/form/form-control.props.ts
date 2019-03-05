import FormItemCommon from "./form-item";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
    FormComponentMappingToPropertyNamesProps,
} from "./form.props";
import { InitialOneOfAnyOfState, updateActiveSection } from "./form-section.props";

export interface FormControlProps extends FormItemCommon {
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
     * The specialized components mapping to property names
     */
    componentMappingToPropertyNames?: FormComponentMappingToPropertyNamesProps;

    /**
     * The section update callback
     */
    onUpdateActiveSection: updateActiveSection;
}

/* tslint:disable-next-line */
export interface FormControlState extends InitialOneOfAnyOfState {}
