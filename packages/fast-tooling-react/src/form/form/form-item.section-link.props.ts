import FormItemCommon from "./form-item.props";

/**
 * SectionLink class name contract
 */
export interface FormItemSectionLinkClassNameContract {
    formItemSectionLink?: string;
    formItemSectionLink_anchor?: string;
    formItemSectionLink_anchor__invalid?: string;
    formItemSectionLink_badge?: string;
    formItemSectionLink_controlRegion?: string;
    formItemSectionLink_defaultValueIndicator?: string;
    formItemSectionLink_invalidMessage?: string;
    formItemSectionLink_softRemove?: string;
    formItemSectionLink_softRemoveInput?: string;
}

/**
 * SectionLink state interface
 */
export interface FormItemSectionLinkProps extends FormItemCommon {
    /**
     * The schema location
     */
    schemaLocation: string;

    /**
     * The update section callback
     */
    onUpdateSection: (schemaLocation: string, dataLocation: string) => void;
}
