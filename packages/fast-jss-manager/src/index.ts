import * as CSS from "csstype";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
export { ManagedClasses };

/**
 * Define a static CSS Rule
 */
export type CSSStaticRule = CSS.Properties | string;

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
export interface CSSRules<T> {
    [rule: string]: CSSRules<T> | CSSRuleResolver<T> | CSSStaticRule;
}

/**
 * A stylesheet supplied to a JSS manager
 * @param T - This is the stylesheet contract, which is an enumeration of all keys available on
 * the JSS style object.
 * @param C - This describes the design system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export type ComponentStyles<T, C> =
    | ComponentStyleSheet<T, C>
    | ComponentStyleSheetResolver<T, C>;

/**
 * A function that resolves to a static JSS stylesheet
 * @param T - This is the stylesheet contract, which is an enumeration of all keys available on
 * the JSS style object.
 * @param C - This describes the design system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export type ComponentStyleSheetResolver<T, C> = (config: C) => ComponentStyleSheet<T, C>;

/**
 * Allow any string to be used in addition to class names
 * intended to support the use of Nested at-rules:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
 *
 * Note: If TypeScript updated to use RegExp this can be improved
 * to more strictly check for Nested at-rules:
 * https://github.com/Microsoft/TypeScript/issues/6579
 */
export interface NestedAtRules<C> {
    [key: string]: CSSRules<C>;
}

/**
 * Describes a JSS style object.
 * @param T - This is the stylesheet contract, which is an enumeration of all keys available on
 * the JSS style object.
 * @param C - This describes the design system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export type ComponentClassNameStyleSheet<T, C> = { [P in keyof T]: CSSRules<C> };

export type ComponentStyleSheet<T, C> = ComponentClassNameStyleSheet<T, C> &
    NestedAtRules<C>;
