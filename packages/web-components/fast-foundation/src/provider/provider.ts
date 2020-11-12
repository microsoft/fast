import { ElementStyles, ElementViewTemplate, FASTElement } from "@microsoft/fast-element";
import { Configuration } from "../configuration/configuration";

/**
 * Event detail object used while resolving the nearest FASTProvider
 * for an element.
 */
interface ResolveProviderEventDetail {
    fastProvider: FASTProvider | null;
}

export interface Provider extends FASTElement {
    /**
     * The configuration object the Provider should use
     */
    readonly configuration: Configuration;

    /**
     * The nearest parent provider element, or null if no parent FASTProvider exists.
     */
    readonly parentProvider: Provider | null;

    /**
     * Resolves a template for an element instance.
     * @param el The element instance to resolve a template for.
     */
    resolveTemplateFor(el: FASTElement): ElementViewTemplate | null;

    /**
     * Resolves styles for an element instance.
     * @param el The element instance to resolve styles for.
     */
    resolveStylesFor(el: FASTElement): ElementStyles | null;
}

export class FASTProvider extends FASTElement implements Provider {
    /** {@inheritdoc Provider.configuration} */
    public readonly configuration: Configuration;

    /** {@implements Provider.parentProvider} */
    public get parentProvider(): Provider | null {
        return this._parentProvider;
    }

    /** {@inheritdoc Provider.resolveTemplateFor} */
    public static resolveProviderFor(el: Element): Provider | null {
        const event = new CustomEvent<ResolveProviderEventDetail>(
            FASTProvider.resolveProviderEventName,
            { detail: { fastProvider: null }, bubbles: true, composed: true }
        );

        el.dispatchEvent(event);
        return event.detail.fastProvider;
    }

    /** {@inheritdoc Provider.resolveTemplateFor} */
    public resolveTemplateFor(el: FASTElement): ElementViewTemplate | null {
        return null;
    }

    /** {@inheritdoc Provider.resolveStylesFor} */
    public resolveStylesFor(el: FASTElement): ElementStyles | null {
        return null;
    }

    /**
     * Event name for resolving FASTProvider.
     */
    private static readonly resolveProviderEventName = "resolve-fast-provider";

    /**
     * Private storage for parent FASTProvider.
     */
    private _parentProvider: Provider | null = null;

    /**
     * Event handler for resolving a FASTProvider.
     * @param e The resolve provider event object
     */
    private resolveProviderHandler(e: CustomEvent<ResolveProviderEventDetail>): void {
        e.stopImmediatePropagation();
        e.detail.fastProvider = this;
    }

    /**
     * Invoked when element is connected to the DOM.
     */
    public connectedCallback() {
        this._parentProvider = FASTProvider.resolveProviderFor(this);
        this.addEventListener(
            FASTProvider.resolveProviderEventName,
            this.resolveProviderHandler
        );

        super.connectedCallback();
    }

    public disconnectedCallback() {
        this._parentProvider = null;
        this.removeEventListener(
            FASTProvider.resolveProviderEventName,
            this.resolveProviderHandler
        );

        super.disconnectedCallback();
    }
}
