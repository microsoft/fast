import { Behavior, ElementStyles, FASTElement } from "@microsoft/fast-element";
/**
 * A behavior to add or remove a stylesheet from an element based on a property. The behavior ensures that
 * styles are applied while the property matches and that styles are not applied if the property does
 * not match.
 *
 * @public
 */
export declare class PropertyStyleSheetBehavior implements Behavior {
    private propertyName;
    private value;
    private styles;
    /**
     * Constructs a {@link PropertyStyleSheetBehavior} instance.
     * @param propertyName - The property name to operate from.
     * @param value - The property value to operate from.
     * @param styles - The styles to coordinate with the property.
     */
    constructor(propertyName: string, value: any, styles: ElementStyles);
    /**
     * Binds the behavior to the element.
     * @param elementInstance - The element for which the property is applied.
     */
    bind(elementInstance: FASTElement): void;
    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     * @internal
     */
    unbind(source: typeof FASTElement & HTMLElement): void;
    /**
     * Change event for the provided element.
     * @param source - the element for which to attach or detach styles.
     * @internal
     */
    handleChange(source: FASTElement, key: any): void;
}
