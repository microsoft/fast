var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { observable } from "@microsoft/fast-element";
import { mapCSSInlineStyleToCSSPropertyDictionary } from "../../data-utilities/mapping.mdn-data";
import { FormAssociatedCSSLayout } from "./css-layout.form-associated";
import {
    alignContentOptions,
    alignItemsOptions,
    flexDirectionOptions,
    flexWrapOptions,
    justifyContentOptions,
} from "./css-layout.css-properties";
/**
 * A CSSLayout Custom HTML Element.
 *
 * @public
 */
export class CSSLayout extends FormAssociatedCSSLayout {
    constructor() {
        super(...arguments);
        /**
         * When true the css-layout controls are visible
         * @internal
         */
        this.flexEnabled = false;
        /**
         * The string options for the flex-direction CSS property
         * @internal
         */
        this.flexDirectionOptions = flexDirectionOptions;
        /**
         * The string options for the justify-content CSS property
         * @internal
         */
        this.justifyContentOptions = justifyContentOptions;
        /**
         * The string options for the align-content CSS property
         * @internal
         */
        this.alignContentOptions = alignContentOptions;
        /**
         * The string options for the align-items CSS property
         * @internal
         */
        this.alignItemsOptions = alignItemsOptions;
        /**
         * The string options for the flex-wrap CSS property
         * @internal
         */
        this.flexWrapOptions = flexWrapOptions;
        /**
         * The flex-direction CSS property value
         * @internal
         */
        this.flexDirectionValue = "";
        this.flexDirectionName = "flex-direction";
        /**
         * The justify-content CSS property value
         * @internal
         */
        this.justifyContentValue = "";
        this.justifyContentName = "justify-content";
        /**
         * The align-content CSS property value
         * @internal
         */
        this.alignContentValue = "";
        this.alignContentName = "align-content";
        /**
         * The align-items CSS property value
         * @internal
         */
        this.alignItemsValue = "";
        this.alignItemsName = "align-items";
        /**
         * The row gap CSS property value
         * @internal
         */
        this.rowGapValue = "";
        this.rowGapName = "row-gap";
        /**
         * The column gap CSS property value
         * @internal
         */
        this.columnGapValue = "";
        this.columnGapName = "column-gap";
        /**
         * The flex-wrap CSS property value
         * @internal
         */
        this.flexWrapValue = "";
        this.flexWrapName = "flex-wrap";
        /**
         * The onChange provided, set this to trigger CSS updates
         * in a data dictionary format
         *
         * @param config
         */
        this.onChange = config => {};
    }
    valueChanged(previous, next) {
        super.valueChanged(previous, next);
        const cssPropertyDictionary = mapCSSInlineStyleToCSSPropertyDictionary(next);
        this.flexEnabled = cssPropertyDictionary["display"] === "flex";
        this.flexDirectionValue = cssPropertyDictionary[this.flexDirectionName] || "";
        this.justifyContentValue = cssPropertyDictionary[this.justifyContentName] || "";
        this.alignContentValue = cssPropertyDictionary[this.alignContentName] || "";
        this.alignItemsValue = cssPropertyDictionary[this.alignItemsName] || "";
        this.columnGapValue = this.resolvePxValue(
            cssPropertyDictionary[this.columnGapName]
        );
        this.rowGapValue = this.resolvePxValue(cssPropertyDictionary[this.rowGapName]);
        this.flexWrapValue = cssPropertyDictionary[this.flexWrapName] || "";
    }
    /**
     * The change event handler for the css-layout controls
     *
     * @param cssPropertyName The CSS property name
     * @param e The change event object
     * @internal
     */
    handleCSSChange(observablePropertyName, e) {
        const cssPropertyValue = e.composedPath()[0].value;
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
    handleToggleCSSLayout() {
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
    resetCSSLayoutValues() {
        this.flexDirectionValue = "";
        this.justifyContentValue = "";
        this.alignContentValue = "";
        this.alignItemsValue = "";
        this.columnGapValue = "";
        this.rowGapValue = "";
        this.flexWrapValue = "";
    }
    /**
     * Removes the 'px' from an CSS value
     * @returns
     */
    resolvePxValue(value) {
        if (value && value.endsWith("px")) {
            return value.replace("px", "");
        }
        return "";
    }
    /**
     * Convert CSSLayout object to a string
     * @returns A string that can be used as inline CSS
     */
    convertCSSLayoutValuesToString() {
        return Object.entries(this.getCSSLayoutDictionary())
            .map(([propertyName, propertyValue]) => {
                if (propertyValue) {
                    return `${propertyName}: ${propertyValue};`;
                }
                return "";
            })
            .reduce((previousValue, currentValue) => {
                if (currentValue) {
                    return `${previousValue} ${currentValue}`;
                }
                return previousValue;
            }, "")
            .trimStart();
    }
    getCSSLayoutDictionary() {
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
__decorate([observable], CSSLayout.prototype, "flexEnabled", void 0);
__decorate([observable], CSSLayout.prototype, "flexDirectionValue", void 0);
__decorate([observable], CSSLayout.prototype, "justifyContentValue", void 0);
__decorate([observable], CSSLayout.prototype, "alignContentValue", void 0);
__decorate([observable], CSSLayout.prototype, "alignItemsValue", void 0);
__decorate([observable], CSSLayout.prototype, "rowGapValue", void 0);
__decorate([observable], CSSLayout.prototype, "columnGapValue", void 0);
__decorate([observable], CSSLayout.prototype, "flexWrapValue", void 0);
