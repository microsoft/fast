/// <reference types="react" />
import { CombiningKeyword } from "@microsoft/fast-tooling";
import { FormStrings } from "../form.props";
import { SectionControlConfig } from "../templates";
/**
 * Section class name contract
 */
export interface SectionControlClassNameContract {
    sectionControl: string;
    sectionControl__disabled: string;
    sectionControl_category: string;
    sectionControl_category__expanded: string;
    sectionControl_categoryTitle: string;
    sectionControl_categoryTitleRegion: string;
    sectionControl_categoryExpandTrigger: string;
    sectionControl_categoryContentRegion: string;
}
export interface InitialOneOfAnyOfState {
    /**
     * The current schema
     */
    schema: any;
    /**
     * Whether there is a oneOf/anyOf at the root level
     */
    oneOfAnyOf: OneOfAnyOf | null;
}
export interface OneOfAnyOf {
    /**
     * The type (oneOf/anyOf)
     */
    type: CombiningKeyword;
    /**
     * The active index
     */
    activeIndex: number;
}
export interface CategoryState {
    /**
     * The expanded state for this category
     */
    expanded: boolean;
}
export interface SectionControlState extends InitialOneOfAnyOfState {
    /**
     * The category states matching the category array for this object
     */
    categories: CategoryState[];
}
export declare type SectionControlProps = SectionControlConfig;
export interface FormControlParameters {
    /**
     * The schema property
     */
    schema: any;
    /**
     * The index
     */
    index: number;
    /**
     * The location of the data via lodash path syntax
     */
    dataLocation: string;
    /**
     * The navigation id
     */
    navigationId: string;
    /**
     * The location of the schema via lodash path syntax
     */
    schemaLocation: string;
    /**
     * The property name
     */
    propertyName: string;
    /**
     * The required status of this property
     */
    isRequired: boolean;
    /**
     * The disabled status of this property
     */
    isDisabled: boolean;
    /**
     * The title, to be used as a label or as a breadcrumb
     */
    title: string;
    /**
     * The invalid message for this property
     */
    invalidMessage: string;
    strings: FormStrings;
}
export interface FormControlItem {
    /**
     * The property name
     */
    propertyName: string;
    /**
     * The rendered control
     */
    render: React.ReactNode;
}
export interface FormControlsWithConfigOptions {
    /**
     * Form items which conform to a section
     */
    items: FormControlItem[];
}
export interface OptionalToggleConfig {
    schema: any;
    onChange: (propertyLocation: string, value: any) => void;
    dataLocation: string;
    data: any;
    dataCache: any;
}
export interface SchemaSubsectionConfig {
    oneOfAnyOf: any;
    objectProperty: string;
    dataLocation: string;
    schemaLocation: string;
    state: any;
    props: any;
}
