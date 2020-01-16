import { ErrorObject } from "ajv";

export interface FormSectionValidationClassNameContract {
    formSectionValidation?: string;
    formSectionValidation_controlRegion?: string;
    formSectionValidation_message?: string;
    formSectionValidation_expandTrigger?: string;
    formSectionValidation_expandTrigger__active?: string;
    formSectionValidation_errorList?: string;
    formSectionValidation_errorListItem?: string;
    formSectionValidation_errorListItemDetails?: string;
}

export interface FormSectionValidationProps {
    /**
     * The invalid message for this property
     */
    invalidMessage: string;

    /**
     * The validation errors
     */
    validationErrors: ErrorObject[];

    /**
     * The location of the data using lodash path syntax
     */
    dataLocation: string;
}

export interface FormSectionValidationState {
    /**
     * The expanded state for showing the validation errors
     */
    expanded: boolean;
}
