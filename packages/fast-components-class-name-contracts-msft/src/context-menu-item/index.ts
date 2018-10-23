import { ContextMenuItemClassNameContract as BaseContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the button component
 */
export interface ContextMenuItemClassNameContract
    extends BaseContextMenuItemClassNameContract {
    /**
     * The button content region
     */
    contextMenuItem_contentRegion?: string;
}
