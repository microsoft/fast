import { CommonFormControlProps } from "./control.props";

/**
 * SectionLink class name contract
 */
export interface SectionLinkFormControlClassNameContract {
    sectionLinkFormControl?: string;
    sectionLinkFormControl_anchor?: string;
    sectionLinkFormControl_anchor__invalid?: string;
    sectionLinkFormControl_badge?: string;
    sectionLinkFormControl_controlRegion?: string;
    sectionLinkFormControl_defaultValueIndicator?: string;
    sectionLinkFormControl_invalidMessage?: string;
    sectionLinkFormControl_softRemove?: string;
    sectionLinkFormControl_softRemoveInput?: string;
}

/**
 * SectionLink state interface
 */
export interface SectionLinkFormControlProps extends CommonFormControlProps {
    /**
     * The schema location
     */
    schemaLocation: string;

    /**
     * The update section callback
     */
    onUpdateSection: (schemaLocation: string, dataLocation: string) => void;
}
