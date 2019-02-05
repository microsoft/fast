import FormItemCommon from "./form-item";
import {
    FormAttributeSettingsMappingToPropertyNames,
    FormComponentMappingToPropertyNamesProps,
    FormLocation,
} from "./form.props";
import { InitialOneOfAnyOfState, updateActiveSection } from "./form-section.props";
import { ChildOptionItem } from "@microsoft/fast-data-utilities-react";

export interface FormControlProps extends FormItemCommon {
    location?: FormLocation;
    propertyName: string;
    schema: any;
    untitled: string;
    schemaLocation: string;
    childOptions: ChildOptionItem[];
    attributeSettingsMappingToPropertyNames?: FormAttributeSettingsMappingToPropertyNames;
    componentMappingToPropertyNames?: FormComponentMappingToPropertyNamesProps;
    onUpdateActiveSection: updateActiveSection;
}

/* tslint:disable-next-line */
export interface FormControlState extends InitialOneOfAnyOfState {}
