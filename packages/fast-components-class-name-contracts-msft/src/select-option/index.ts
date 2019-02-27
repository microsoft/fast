import { ListboxItemClassNameContract as BaseListboxItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the context menu item component
 */
export interface SelectOptionClassNameContract extends BaseListboxItemClassNameContract {
    /**
     * The root of the select option component
     */
    selectOption?: string;

    /**
     * The disabled modifier
     */
    selectOption__disabled?: string;

    /**
     * The selected modifier
     */
    selectOption__selected?: string;

    /**
     * Select option content region
     */
    selectOption_contentRegion?: string;
}
