import { observable } from "@microsoft/fast-element";
import { FormAssociatedCSSLayout } from "./css-layout.form-associated";
import {
    alignContentOptions,
    alignItemsOptions,
    CSSLayoutCSSPropertyName,
    flexDirectionOptions,
    flexWrapOptions,
    justifyContentOptions,
    ObservableFlexboxCSSPropertyName,
} from "./css-layout.css-properties";

/**
 * A CSSLayout Custom HTML Element.
 *
 * @public
 */
export class CSSLayout extends FormAssociatedCSSLayout {
    /**
     * When true the css-layout controls are visible
     * @internal
     */
    @observable
    public flexEnabled: boolean = false;

    /**
     * The string options for the flex-direction CSS property
     * @internal
     */
    public flexDirectionOptions: string[] = flexDirectionOptions;

    /**
     * The string options for the justify-content CSS property
     * @internal
     */
    public justifyContentOptions: string[] = justifyContentOptions;

    /**
     * The string options for the align-content CSS property
     * @internal
     */
    public alignContentOptions: string[] = alignContentOptions;

    /**
     * The string options for the align-items CSS property
     * @internal
     */
    public alignItemsOptions: string[] = alignItemsOptions;

    /**
     * The string options for the flex-wrap CSS property
     * @internal
     */
    public flexWrapOptions: string[] = flexWrapOptions;

    /**
     * The flex-direction CSS property value
     * @internal
     */
    @observable
    public flexDirectionValue: string = "";
    public flexDirectionName: string = "flex-direction";

    /**
     * The justify-content CSS property value
     * @internal
     */
    @observable
    public justifyContentValue: string = "";
    public justifyContentName: string = "justify-content";

    /**
     * The align-content CSS property value
     * @internal
     */
    @observable
    public alignContentValue: string = "";
    public alignContentName: string = "align-content";

    /**
     * The align-items CSS property value
     * @internal
     */
    @observable
    public alignItemsValue: string = "";
    public alignItemsName: string = "align-items";

    /**
     * The row gap CSS property value
     * @internal
     */
    @observable
    public rowGapValue: string = "";
    public rowGapName: string = "row-gap";

    /**
     * The column gap CSS property value
     * @internal
     */
    @observable
    public columnGapValue: string = "";
    public columnGapName: string = "column-gap";

    /**
     * The flex-wrap CSS property value
     * @internal
     */
    @observable
    public flexWrapValue: string = "";
    public flexWrapName: string = "flex-wrap";

    /**
     * The onChange provided, set this to trigger CSS updates
     * in a data dictionary format
     *
     * @param config
     */

    public onChange: (config: { [key: string]: string }) => void = (config: {
        [key: string]: string;
        /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    }): void => {};

    /**
     * The change event handler for the css-layout controls
     *
     * @param cssPropertyName The CSS property name
     * @param e The change event object
     * @internal
     */
    public handleCSSChange(
        observablePropertyName: ObservableFlexboxCSSPropertyName,
        e: Event
    ): void {
        const cssPropertyValue = (e.composedPath()[0] as HTMLSelectElement).value;

        if (cssPropertyValue) {
            this[observablePropertyName] = cssPropertyValue;
        } else {
            this[observablePropertyName] = "";
        }

        this.value = this.convertCSSLayoutValuesToString();

        this.onChange(this.getCSSLayoutDictionary());
        this.$emit("change");
    }

    /**
     * Handles the css-layout controls being enabled
     * @internal
     */
    public handleToggleCSSLayout(): void {
        if (this.flexEnabled) {
            this.resetCSSLayoutValues();
        }

        this.flexEnabled = !this.flexEnabled;

        this.value = this.convertCSSLayoutValuesToString();

        this.onChange(this.getCSSLayoutDictionary());
        this.$emit("change");
    }

    /**
     * Resets the css-layout CSS property values
     * @internal
     */
    private resetCSSLayoutValues(): void {
        this.flexDirectionValue = "";
        this.justifyContentValue = "";
        this.alignContentValue = "";
        this.alignItemsValue = "";
        this.columnGapValue = "";
        this.rowGapValue = "";
        this.flexWrapValue = "";
    }

    /**
     * Convert CSSLayout object to a string
     * @returns A string that can be used as inline CSS
     */
    private convertCSSLayoutValuesToString(): string {
        return Object.entries(this.getCSSLayoutDictionary())
            .map(
                ([propertyName, propertyValue]: [
                    CSSLayoutCSSPropertyName,
                    string
                ]): string => {
                    if (propertyValue) {
                        return `${propertyName}: ${propertyValue};`;
                    }

                    return "";
                }
            )
            .reduce((previousValue: string, currentValue: string): string => {
                if (currentValue) {
                    return `${previousValue} ${currentValue}`;
                }

                return previousValue;
            }, "")
            .trimStart();
    }

    private getCSSLayoutDictionary(): Partial<Record<CSSLayoutCSSPropertyName, string>> {
        return {
            display: this.flexEnabled ? "flex" : "",
            [this.flexDirectionName]: this.flexDirectionValue,
            [this.justifyContentName]: this.justifyContentValue,
            [this.alignContentName]: this.alignContentValue,
            [this.alignItemsName]: this.alignItemsValue,
            [this.rowGapName]: this.rowGapValue ? `${this.rowGapValue}px` : "",
            [this.columnGapName]: this.columnGapValue ? `${this.columnGapValue}px` : "",
            [this.flexWrapName]: this.flexWrapValue,
        };
    }
}
