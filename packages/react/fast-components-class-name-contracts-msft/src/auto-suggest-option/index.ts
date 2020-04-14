import { ListboxItemClassNameContract as BaseListboxItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the auto suggest option component
 */
export interface AutoSuggestOptionClassNameContract
    extends BaseListboxItemClassNameContract {
    /**
     * The root of the auto suggest option component
     */
    autoSuggestOption?: string;

    /**
     * The disabled modifier
     */
    autoSuggestOption__disabled?: string;

    /**
     * The selected modifier
     */
    autoSuggestOption__selected?: string;

    /**
     * The auto suggest option content region
     */
    autoSuggestOption_contentRegion?: string;
}
