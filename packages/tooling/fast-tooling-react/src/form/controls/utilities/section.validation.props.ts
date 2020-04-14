import { ValidationError } from "@microsoft/fast-tooling";

export interface SectionValidationClassNameContract {
    sectionValidation?: string;
    sectionValidation_controlRegion?: string;
    sectionValidation_message?: string;
    sectionValidation_expandTrigger?: string;
    sectionValidation_expandTrigger__active?: string;
    sectionValidation_errorList?: string;
    sectionValidation_errorListItem?: string;
    sectionValidation_errorListItemDetails?: string;
}

export interface SectionValidationProps {
    /**
     * The invalid message for this property
     */
    invalidMessage: string;

    /**
     * The validation errors
     */
    validationErrors: ValidationError[];

    /**
     * The location of the data using lodash path syntax
     */
    dataLocation: string;
}

export interface SectionValidationState {
    /**
     * The expanded state for showing the validation errors
     */
    expanded: boolean;
}
