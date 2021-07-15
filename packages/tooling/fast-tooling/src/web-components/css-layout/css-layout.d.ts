import { FormAssociatedCSSLayout } from "./css-layout.form-associated";
import { ObservableFlexboxCSSPropertyName } from "./css-layout.css-properties";
/**
 * A CSSLayout Custom HTML Element.
 *
 * @public
 */
export declare class CSSLayout extends FormAssociatedCSSLayout {
    /**
     * When true the css-layout controls are visible
     * @internal
     */
    flexEnabled: boolean;
    /**
     * The string options for the flex-direction CSS property
     * @internal
     */
    flexDirectionOptions: string[];
    /**
     * The string options for the justify-content CSS property
     * @internal
     */
    justifyContentOptions: string[];
    /**
     * The string options for the align-content CSS property
     * @internal
     */
    alignContentOptions: string[];
    /**
     * The string options for the align-items CSS property
     * @internal
     */
    alignItemsOptions: string[];
    /**
     * The string options for the flex-wrap CSS property
     * @internal
     */
    flexWrapOptions: string[];
    /**
     * The flex-direction CSS property value
     * @internal
     */
    flexDirectionValue: string;
    flexDirectionName: string;
    /**
     * The justify-content CSS property value
     * @internal
     */
    justifyContentValue: string;
    justifyContentName: string;
    /**
     * The align-content CSS property value
     * @internal
     */
    alignContentValue: string;
    alignContentName: string;
    /**
     * The align-items CSS property value
     * @internal
     */
    alignItemsValue: string;
    alignItemsName: string;
    /**
     * The row gap CSS property value
     * @internal
     */
    rowGapValue: string;
    rowGapName: string;
    /**
     * The column gap CSS property value
     * @internal
     */
    columnGapValue: string;
    columnGapName: string;
    /**
     * The flex-wrap CSS property value
     * @internal
     */
    flexWrapValue: string;
    flexWrapName: string;
    valueChanged(previous: string, next: string): void;
    /**
     * The onChange provided, set this to trigger CSS updates
     * in a data dictionary format
     *
     * @param config
     */
    onChange: (config: { [key: string]: string }) => void;
    /**
     * The change event handler for the css-layout controls
     *
     * @param cssPropertyName The CSS property name
     * @param e The change event object
     * @internal
     */
    handleCSSChange(
        observablePropertyName: ObservableFlexboxCSSPropertyName,
        e: Event
    ): void;
    /**
     * Handles the css-layout controls being enabled
     * @internal
     */
    handleToggleCSSLayout(): void;
    /**
     * Resets the css-layout CSS property values
     * @internal
     */
    private resetCSSLayoutValues;
    /**
     * Removes the 'px' from an CSS value
     * @returns
     */
    private resolvePxValue;
    /**
     * Convert CSSLayout object to a string
     * @returns A string that can be used as inline CSS
     */
    private convertCSSLayoutValuesToString;
    private getCSSLayoutDictionary;
}
