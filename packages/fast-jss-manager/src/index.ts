/**
 * Type definition for a function that resolves to a CSS property value. It optionally expects a config object.
 * @param Config - This describes the design-system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export type CSSRuleResolver<T> = (config?: T) => string;

/**
 * Definition of a set of css properties for any given HTML class.
 * @param T - This describes the design-system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export interface ICSSRules<T> {
    [rule: string]: ICSSRules<T> | CSSRuleResolver<T> | string;
}

/**
 * Describes a JSS style object.
 * @param Contract - This is the stylesheet contract, which is an enumeration of all keys available on
 * the JSS style object.
 * @param Config - This describes the design-system configuration values that will be available to all
 * property functions that resolve to a CSS value.
 */
export type ComponentStyles<Contract, Config> = {
    [P in keyof Contract]: ICSSRules<Config>;
};
