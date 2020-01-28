import {
    FormOrderByPropertyNamesCategories,
    FormOrderByPropertyNamesProperties,
    FormOrderByPropertyNamesProps,
} from "../form.props";
import { SectionControlConfig } from "../templates";
import { CombiningKeyword } from "../../data-utilities/types";

/**
 * Section class name contract
 */
export interface SectionControlClassNameContract {
    sectionControl: string;
    sectionControl__disabled: string;
}

export interface InitialOneOfAnyOfState {
    /**
     * The current schema
     */
    schema: any;

    /**
     * Whether there is a oneOf/anyOf at the root level
     */
    oneOfAnyOf?: OneOfAnyOf;
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

/* tslint:disable-next-line */
export interface SectionControlState extends InitialOneOfAnyOfState {}

/* tslint:disable */
export interface SectionControlProps extends SectionControlConfig {}

export interface FormCategoryConfig {
    /**
     * The display name, used as a category label
     */
    title: string | null;

    /**
     * Category property keys
     */
    items: string[];

    /**
     * Expandable
     */
    expandable?: boolean;
}

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
}

export interface AssignedCategoryParams {
    /**
     * The category name
     */
    category: string;

    /**
     * The category weight, acts the same as z-index,
     * the larger the weight, the higher it is displayed
     */
    categoryWeight: number;

    /**
     * The item weight, similar to category weight will
     * display higher the larger the weight is
     */
    itemWeight: number;

    /**
     * Allows category to be expandable
     */
    expandable?: boolean;
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

export interface AssignedParamsByCategoryConfig {
    categoryProperties: string[];
    formControlParameter: FormControlParameters;
    category: FormOrderByPropertyNamesCategories;
    categoryProperty: FormOrderByPropertyNamesProperties;
    assignedItemWeight: number;
}
