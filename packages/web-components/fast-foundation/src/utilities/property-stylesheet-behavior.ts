import {
    ElementStyles,
    FASTElement,
    HostBehavior,
    HostController,
    Observable,
} from "@microsoft/fast-element";

/**
 * A behavior to add or remove a stylesheet from an element based on a property. The behavior ensures that
 * styles are applied while the property matches and that styles are not applied if the property does
 * not match.
 *
 * @public
 */
export class PropertyStyleSheetBehavior implements HostBehavior {
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
    public addedCallback(controller: HostController) {
        Observable.getNotifier(controller.source).subscribe(this, this.propertyName);
        this.handleChange(controller.source, this.propertyName);
    }

    /**
     * Unbinds the behavior from the element.
     * @param source - The element for which the behavior is unbinding.
     */
    public removedCallback(controller: HostController) {
        Observable.getNotifier(controller.source).unsubscribe(this, this.propertyName);
        controller.removeStyles(this.styles);
    }

    /**
     * Change event for the provided element.
     * @param source - the element for which to attach or detach styles.
     * @param key - the key to lookup to know if the element already has the styles
     * @internal
     */
    public handleChange(source: FASTElement, key: string) {
        const controller = source.$fastController;

        if (source[key] === this.value) {
            controller.addStyles(this.styles);
        } else {
            controller.removeStyles(this.styles);
        }
    }
}
