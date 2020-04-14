import { AutoSuggestClassNameContract as BaseAutoSuggestClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the select component
 */
export interface AutoSuggestClassNameContract extends BaseAutoSuggestClassNameContract {
    /**
     * The glyph shown in the select toggle button
     */
    select_toggleGlyph?: string;
}
