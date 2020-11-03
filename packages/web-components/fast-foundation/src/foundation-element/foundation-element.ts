import {
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
    observable,
} from "@microsoft/fast-element";
import { Configuration, DIConfiguration, unprefix } from "../configuration";

/**
 * Defines a foundation element class that:
 * 1. Connects the element to Configuration
 * 2. Allows resolving the element template from the instance or Configuration
 * 3. Allows resolving the element styles from the instance or Configuration
 *
 * @alpha
 */
export class FoundationElement extends FASTElement {
    @DIConfiguration
    private configuration: Configuration;

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
        return this.configuration.getDefaultTemplateFor(
            unprefix(this.tagName).toLowerCase()
        );
    }

    /**
     * Resolves styles for the element instance
     */
    protected resolveStyles(): ElementStyles | null {
        return this.configuration.getDefaultStylesFor(
            unprefix(this.tagName).toLowerCase()
        );
    }
}
