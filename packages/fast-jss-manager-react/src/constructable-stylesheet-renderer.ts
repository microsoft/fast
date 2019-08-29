import { CSSOMRule, HTMLElementWithStyleMap, JssValue, Rule, StyleSheet, toCssValue } from "jss";

declare global {

    /** Extending CSSStyleSheet interface. */
    interface CSSStyleSheet {

        /** The unique sheet identifier. */
        identifier: number;

        /** The meta information. */
        meta: string;

        /** The order index. */
        index: number;

        /**
         * Add styles to the stylesheet.
         * @param content - The CSS content
         */
        replaceSync(content: string): void;
    }

    /** Extending Document interface. */
    interface Document {

        /** The adopted style sheet property. */
        adoptedStyleSheets: CSSStyleSheet[];
    }
}

/** The CSSRuleTypes. */
const CSSRuleTypes: any = {
    STYLE_RULE: 1,
    KEYFRAMES_RULE: 7
}

/** All CSSStyleSheets map. */
let allCssStyleSheets: any = {};

/** The index start. */
let startIndex: number = null;

/** The index end. */
let endIndex: number = null;

/** Used for creating unique identifier per CSSStyleSheet. */
let renderedInstanceCount: number = 0;

/**
 * Add stylesheet to all stylesheets map.
 * @param cssStyleSheet - The CSSStyleSheet
 */
function addToMap(cssStyleSheet: CSSStyleSheet): void {

    if (startIndex === null) {
        startIndex = cssStyleSheet.index;
        endIndex = cssStyleSheet.index;
    }

    if (cssStyleSheet.index < endIndex) {
        endIndex = cssStyleSheet.index;
    }

    if (allCssStyleSheets[cssStyleSheet.index]) {
        allCssStyleSheets[cssStyleSheet.index].push(cssStyleSheet);
    } else {
        allCssStyleSheets[cssStyleSheet.index] = [cssStyleSheet];
    }
}

/**
 * Remove stylesheet from all stylesheets map.
 * @param cssStyleSheet - The CSSStyleSheet
 */
function removeFromMap(cssStyleSheet: CSSStyleSheet): void {

    const sheets: CSSStyleSheet[] = allCssStyleSheets[cssStyleSheet.index];

    if (sheets) {
        const length: number = sheets.length;

        for (let i: number = 0; i < length; i++) {
            if (sheets[i] && sheets[i].identifier === cssStyleSheet.identifier) {
                sheets[i] = null;
            }
        }
    }
}

/**
 * Returns array of stylesheets based on their index. The stylesheets are ordered from smallest to highest index.
 * @return CSSStyleSheet array
 */
function getAllStyleSheets(): CSSStyleSheet[] {

    const result: CSSStyleSheet[] = [];

    for (let i: number = endIndex; i <= startIndex; i++) {
        const sheets: CSSStyleSheet[] = allCssStyleSheets[i];

        if (sheets) {
            const sheetsLength: number = sheets.length;

            for (let j: number = 0; j < sheetsLength; j++) {
                if (sheets[j]) {
                    result.push(sheets[j]);
                }
            }
        }
    }

    return result;
}

/**
 * Provides functionality to add/remove stylesheet to Document's Adopted Stylesheets.
 * See Constructable StyleSheet spec https://wicg.github.io/construct-stylesheets/
 */
export class ConstructableStyleSheetRenderer {

    /** Reset state. This is used by the unit tests. */
    public static reset(): void {
        document.adoptedStyleSheets = [];
        allCssStyleSheets = {};
        startIndex = null;
        endIndex = null;
        renderedInstanceCount = 0;
    }

    /** The CSSStyleSheet instance. */
    private cssStyleSheet: CSSStyleSheet;

    /** The unique identifier for the CSSStyleSheet instance. */
    private identifier: number;

    /**
     * The constructor.
     * @param sheet - The StyleSheet object.
     */
    public constructor(readonly sheet: StyleSheet) {
        this.identifier = renderedInstanceCount++;
    }

    /**
     * Add the stylesheet to document's Adopted Stylesheets.
     * @param cssStyleSheet - The stylesheet override. Used in testing.
     */
    public attach(cssStyleSheet: CSSStyleSheet = null): void {
        this.cssStyleSheet = cssStyleSheet ? cssStyleSheet : new CSSStyleSheet();
        this.cssStyleSheet.identifier = this.identifier;
        this.cssStyleSheet.meta = this.sheet.options.meta;
        this.cssStyleSheet.index = this.sheet.options.index;
        this.cssStyleSheet.replaceSync(this.sheet.toString());

        addToMap(this.cssStyleSheet);

        document.adoptedStyleSheets = getAllStyleSheets();
    }

    /** Remove the stylesheet from document's Adopted Stylesheets. */
    public detach(): void {
        removeFromMap(this.cssStyleSheet);
        document.adoptedStyleSheets = getAllStyleSheets();
    }

    /** The deploy noop method for the completeness. */
    public deploy(): void {
        // noop
    }

    /**
     * Apply the given style property/value to the CSSRule.
     * @param cssRule - The CSSRule object
     * @param prop - The style property name
     * @param value - The style property value
     * @returns True when successfully applied, otherwise false
     */
    public setProperty(cssRule: HTMLElementWithStyleMap | CSSStyleRule | CSSKeyframeRule, prop: string, value: JssValue): boolean {
        try {
            let cssValue: string = value;

            if (Array.isArray(value)) {
                cssValue = toCssValue(value, true);

                if (value[value.length - 1] === '!important') {
                    cssRule.style.setProperty(prop, cssValue, 'important')
                    return true
                }
            }

            cssRule.style.setProperty(prop, cssValue)
        } catch (err) {
            return false;
        }

        return true;
    }

    /**
     * Get a style property value.
     * @param cssRule - The CSSRule
     * @param prop - The style property
     * @returns The style property value
     */
    public getPropertyValue(cssRule: HTMLElementWithStyleMap | CSSStyleRule | CSSKeyframeRule, prop: string): string {
        try {
            return cssRule.style.getPropertyValue(prop);
        } catch (err) {
            return "";
        }
    }

    /**
     * Remove a style property.
     * @param cssRule - The CSSRule
     * @param prop - The style property
     */
    public removeProperty(cssRule: HTMLElementWithStyleMap | CSSStyleRule | CSSKeyframeRule, prop: string): void {
        try {
            cssRule.style.removeProperty(prop)
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.warn(`[JSS] DOMException ${err.message} was thrown. Tried to remove property ${prop}`);
        }
    }

    /**
     * Set the selector.
     * @param cssRule - The CSSRule
     * @param selectorText - The selector text
     * @returns True when selector is set, otherwise false
     */
    public setSelector(cssRule: CSSStyleRule, selectorText: string): boolean {
        cssRule.selectorText = selectorText

        // Return false if setter was not successful. Currently only works in chrome.
        return cssRule.selectorText === selectorText
    }

    /**
     * Get the CSS Rule keyy.
     * @param cssRule - The CSSRule
     * @returns The rule key
     */
    public getKey(cssRule: CSSOMRule): string {
        if (cssRule.type === CSSRuleTypes.STYLE_RULE) {
            return cssRule.selectorText;
        }

        if (cssRule.type === CSSRuleTypes.KEYFRAMES_RULE) {
            const { name }: { name: string } = cssRule;
            if (name) {
                return `@keyframes ${name}`;
            }
        }

        const { cssText }: { cssText: string } = cssRule;
        return cssText.substr(0, cssText.indexOf('{') - 1);
    }

    /**
     * Insert a rule into CSSStyleSheet.
     * @param rule - The rule
     * @param index - The index
     * @returns CSSStyleRule on success, otherwise false
     */
    public insertRule(rule: Rule, index?: number): false | CSSStyleRule {
        const { cssRules }: { cssRules: CSSRuleList } = this.cssStyleSheet;
        const str: string = rule.toString()

        if (!index) {
            index = cssRules.length;
        }

        if (!str) {
            return false;
        }

        try {
            this.cssStyleSheet.insertRule(str, index)
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.warn(`[JSS] Can not insert an unsupported rule ${str}`);
            return false;
        }

        return cssRules[index] as CSSStyleRule;
    }

    /**
     * Delete a rule
     * @param cssRule - The CSS rule
     * @returns True on success, otherwise false
     */
    public deleteRule(cssRule: CSSStyleRule): boolean {
        const index: number = this.indexOf(cssRule);
        if (index === -1) {
            return false;
        }

        this.cssStyleSheet.deleteRule(index);
        return true;
    }

    /**
     * Generate a new CSS rule and replace the existing one.
     * @param cssRule - The CSS rule
     * @param rule - The rule
     * @returns CSSStyleRule on success, otherwise false
     */
    public replaceRule(cssRule: CSSStyleRule, rule: Rule): false | CSSStyleRule {
        const index: number = this.indexOf(cssRule);

        const newCssRule: false | CSSStyleRule = this.insertRule(rule, index);

        this.cssStyleSheet.deleteRule(index);

        return newCssRule;
    }

    /**
     * Returns the rule list.
     * @returns - The rule list
     */
    public getRules(): CSSRuleList {
        if (this.cssStyleSheet) {
            return this.cssStyleSheet.cssRules;
        }
    }

    /**
     * Get index of a CSS Rule.
     * @param cssRule - The CSS rule
     * @returns The rule index on success, otherwise -1
     */
    public indexOf(cssRule: CSSStyleRule): number {
        const { cssRules }: { cssRules: CSSRuleList } = this.cssStyleSheet;

        for (let index: number = 0; index < cssRules.length; index++) {
            if (cssRule === cssRules[index]) {
                return index;
            }
        }

        return -1;
    }

    /**
     * Gets a map of rule keys, where the property is an unescaped key and value is a potentially escaped one.
     * It is used to identify CSS rules and the corresponding JSS rules. As an identifier
     * for CSSStyleRule we normally use `selectorText`. Though if original selector text
     * contains escaped code points e.g. `:not(#\\20)`, CSSOM will compile it to `:not(# )`
     * and so CSS rule's `selectorText` won't match JSS rule selector.
     * https://www.w3.org/International/questions/qa-escapes#cssescapes
     * @param rules - The rules
     */
    public getUnescapedKeysMap(rules: Rule[]): any {
        const map: any = {};
        const length: number = rules.length;

        for (let i: number = 0; i < length; i++) {
            const rule: Rule = rules[i];

            if (rule.type !== "style") {
                continue
            }

            const { selector }: { selector: string } = rule;

            // Only unescape selector over CSSOM if it contains a back slash.
            if (selector && selector.indexOf('\\') !== -1) {

                if (this.cssStyleSheet) {

                    const { cssRules }: { cssRules: CSSRuleList } = this.cssStyleSheet;

                    if (cssRules) {
                        map[(cssRules[0] as CSSStyleRule).selectorText] = rule.key;
                    }
                }
            }
        }

        return map;
    }
}
