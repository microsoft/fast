import { ContextMenuItemClassNameContract as BaseContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the context menu item component
 */
export interface ContextMenuItemClassNameContract
    extends BaseContextMenuItemClassNameContract {
    /**
     * The context menu item content region
     */
    contextMenuItem_contentRegion?: string;
}
