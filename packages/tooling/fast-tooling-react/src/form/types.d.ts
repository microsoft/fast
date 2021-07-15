/// <reference types="react" />
export interface FormChildOptionItem {
    /**
     * The name of the component
     */
    name?: string;
    /**
     * The React component
     */
    component: React.ComponentType;
    /**
     * The JSON schema for the component
     */
    schema: any;
}
export interface AttributeSettingsCommon {
    /**
     * The list of property names to change the attribute
     */
    propertyNames: string[];
}
export interface TextareaAttributeRows extends AttributeSettingsCommon {
    /**
     * The value to set the attribute to
     */
    value: number;
}
export interface TextareaAttributeSettingsMappingToPropertyNames {
    /**
     * The rows attribute
     */
    rows: TextareaAttributeRows[];
}
/**
 * The configuration for the mapping of attribute settings to property names
 */
export interface FormAttributeSettingsMappingToPropertyNames {
    /**
     * The textarea component
     */
    textarea: TextareaAttributeSettingsMappingToPropertyNames;
}
export declare type AttributeSettingsMappingToPropertyNames = TextareaAttributeSettingsMappingToPropertyNames;
