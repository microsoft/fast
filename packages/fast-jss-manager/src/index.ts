import * as CSS from "csstype";
import { ClassNames, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
export { ClassNames, IManagedClasses };

/**
 * Define a static CSS Rule
 */
export type ICSSStaticRule =  CSS.Properties | string;

/**
 * Type definition for a function that resolves to a CSS property value. It optionally expects a config object.
 * @param T - This describes the design system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export type CSSRuleResolver<T> = (config?: T) => string;

/**
 * Definition of a set of css properties for any given HTML class.
 * @param T - This describes the design system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export interface ICSSRules<T> {
    [rule: string]: ICSSRules<T> | CSSRuleResolver<T> | ICSSStaticRule;
}

/**
 * A stylesheet supplied to a JSS manager
 * @param T - This is the stylesheet contract, which is an enumeration of all keys available on
 * the JSS style object.
 * @param C - This describes the design system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export type ComponentStyles<T, C> = ComponentStyleSheet<T, C> | ComponentStyleSheetResolver<T, C>;

/**
 * A function that resolves to a static JSS stylesheet
 * @param T - This is the stylesheet contract, which is an enumeration of all keys available on
 * the JSS style object.
 * @param C - This describes the design system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export type ComponentStyleSheetResolver<T, C> = (config: C) => ComponentStyleSheet<T, C>;

/**
 * Describes a JSS style object.
 * @param T - This is the stylesheet contract, which is an enumeration of all keys available on
 * the JSS style object.
 * @param C - This describes the design system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export type ComponentStyleSheet<T, C> = {
    [P in keyof T]: ICSSRules<C>;
};
