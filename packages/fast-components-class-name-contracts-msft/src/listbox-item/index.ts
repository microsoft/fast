import { ListboxClassNameContract as BaseListboxItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the context menu item component
 */
export interface ListboxItemClassNameContract extends BaseListboxItemClassNameContract {
    /**
     * The listbox item content region
     */
    listboxItem_contentRegion?: string;

    /**
     * The listbox item glyph
     */
    listboxItem_glyph?: string;
}
