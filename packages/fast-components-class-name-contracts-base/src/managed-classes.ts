/**
 * The interface for class names passed as props
 *
 * Allows any string to be used in addition to class names
 * intended to support the use of Nested at-rules:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
 *
 * Note: If TypeScript updated to use RegExp this can be improved
 * to more strictly check for Nested at-rules:
 * https://github.com/Microsoft/TypeScript/issues/6579
 */
export interface ManagedClasses<T> {
    managedClasses?: { [className in keyof T]?: string };
}
