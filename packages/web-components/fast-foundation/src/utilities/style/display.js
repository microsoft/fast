/**
 * A CSS fragment to set `display: none;` when the host is hidden using the [hidden] attribute.
 * @public
 */
export const hidden = `:host([hidden]){display:none}`;
/**
 * Applies a CSS display property.
 * Also adds CSS rules to not display the element when the [hidden] attribute is applied to the element.
 * @param display - The CSS display property value
 * @public
 */
export function display(displayValue) {
    return `${hidden}:host{display:${displayValue}}`;
}
