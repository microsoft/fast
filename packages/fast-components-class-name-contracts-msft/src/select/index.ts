import { SelectClassNameContract as BaseSelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the select component
 */
export interface SelectClassNameContract extends BaseSelectClassNameContract {
    /**
     * The glyph shown in the select toggle button
     */
    select_toggleGlyph?: string;

    /**
     * The select toggle button
     */
    select_button?: string;

    /**
     * The select toggle button content region
     */
    select_button_contentRegion?: string;

    /**
     * The display text container
     */
    select_button_displayText?: string;
}
