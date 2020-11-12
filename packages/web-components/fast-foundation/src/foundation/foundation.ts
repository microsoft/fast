import {
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
    observable,
} from "@microsoft/fast-element";
import { FASTProvider, Provider } from "../provider";

/**
 * Defines a foundation element class that:
 * 1. Connects the element to the nearest FASTProvider
 * 2. Allows resolving the element template from the instance or the FASTProvider
 * 3. Allows resolving the element styles from the instance or the FASTProvider
 */
export abstract class FASTFoundation extends FASTElement {
    /**
     * The element's FASTProvider (if it exists)
     */
    public get $fastProvider(): Provider | null {
        return this._$fastProvider;
    }

    /**
     * Sets the template of the element instance. When undefined,
     * the element will attempt to resolve the template from
     * the $fastProvider
     */
    @observable
    public template: ElementViewTemplate | void | null;
    protected templateChanged(): void {
        if (this.template !== undefined) {
            this.$fastController.template = this.template;
        }
    }

    /**
     * Sets the default styles for the element instance. When undefined,
     * the element will attempt to resolve default styles from
     * the $fastProvider
     */
    @observable
    public styles: ElementStyles | void | null;
    protected stylesChanged(): void {
        if (this.styles !== undefined) {
            this.$fastController.styles = this.styles;
        }
    }

    /**
     * Resolves the template for the element instance.
     */
    protected resolveTemplate(): ElementViewTemplate | null {
        return this.$fastProvider?.resolveTemplateFor(this) || null;
    }

    /**
     * Resolves the default styles for the element instance
     */
    protected resolveStyles() {
        return this.$fastProvider?.resolveStylesFor(this) || null;
    }

    /**
     * Private storage for $fastProvider.
     */
    private _$fastProvider: Provider | null = null;

    /**
     * Invoked when element is connected to the DOM.
     */
    public connectedCallback() {
        this._$fastProvider = FASTProvider.resolveProviderFor(this);
        super.connectedCallback();
    }
}
