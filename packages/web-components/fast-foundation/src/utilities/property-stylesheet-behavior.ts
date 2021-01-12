import {
    Behavior,
    ElementStyles,
    FASTElement,
    Observable,
} from "@microsoft/fast-element";

/**
 * A behavior to add or remove a stylesheet from an element based on a property. The behavior ensures that
 * styles are applied while the property matches and that styles are not applied if the property does
 * not match.
 *
 * @public
 */
export class PropertyStyleSheetBehavior implements Behavior {
    /**
     * Constructs a {@link PropertyStyleSheetBehavior} instance.
     * @param propertyName - The property name to operate from.
     * @param value - The property value to operate from.
     * @param styles - The styles to coordinate with the property.
     */
    constructor(
        private propertyName: string,
        private value: any,
        private styles: ElementStyles
    ) {}

    /**
     * Binds the behavior to the element.
     * @param elementInstance - The element for which the property is applied.
     */
    public bind(elementInstance: FASTElement) {
        Observable.getNotifier(elementInstance).subscribe(this, this.propertyName);
    }

    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     * @internal
     */
    public unbind(source: typeof FASTElement & HTMLElement) {
        Observable.getNotifier(source).unsubscribe(this, this.propertyName);
        (source as any).$fastController.removeStyles(this.styles);
    }

    /**
     * Change event for the provided element.
     * @param source - the element for which to attach or detach styles.
     * @internal
     */
    public handleChange(source: FASTElement, key) {
        if (source[key] === this.value) {
            source.$fastController.addStyles(this.styles);
        } else {
            source.$fastController.removeStyles(this.styles);
        }
    }
}

/**
 * Behavior that will conditionally apply a stylesheet based on the elements
 * appearance property
 *
 * @param value - The value of the appearance property
 * @param styles - The styles to be applied when condition matches
 *
 * @public
 */
export function appearanceBehavior(value: string, styles: ElementStyles) {
    return new PropertyStyleSheetBehavior("appearance", value, styles);
}
