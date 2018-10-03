/**
 * Class names under a given object keys
 */
export type ClassNames<T> = {
    [className in keyof T]?: string;
};

/**
 * Allow any string to be used in addition to class names
 * intended to support the use of Nested at-rules:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
 *
 * Note: If TypeScript updated to use RegExp this can be improved
 * to more strictly check for Nested at-rules:
 * https://github.com/Microsoft/TypeScript/issues/6579
 */
export interface INestedAtRules {
    [key: string]: string;
}

/**
 * The interface for class names passed as props
 */
export interface IManagedClasses<T> {
    managedClasses?: ClassNames<T> & INestedAtRules;
}
