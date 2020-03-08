import { attr, emptyArray, FastElement } from "@microsoft/fast-element";
import { keyCodeEnter } from "@microsoft/fast-web-utilities";

export const supportsElementInternals = "ElementInternals" in window;

/**
 * Disable member ordering to keep property callbacks
 * grouped with property declaration
 */
export abstract class FormAssociated<
    T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> extends FastElement {
    /**
     * Must evaluate to true to enable elementInternals.
     * Feature detects API support and resolve respectively
     */
    public static get formAssociated(): boolean {
        return supportsElementInternals;
    }

    /**
     * Returns the validty state of the element
     */
    public get validity(): ValidityState {
        return supportsElementInternals
            ? this.elementInternals.validity
            : this.proxy.validity;
    }

    /**
     * Retrieve a reference to the associated form.
     * Returns null if not associated to any form.
     */
    public get form(): HTMLFormElement | null {
        return supportsElementInternals ? this.elementInternals.form : this.proxy.form;
    }

    /**
     * Retrieve the localized validation message,
     * or custom validation message if set.
     */
    public get validationMessage(): string {
        return supportsElementInternals
            ? this.elementInternals.validationMessage
            : this.proxy.validationMessage;
    }

    /**
     * Whether the element will be validated when the
     * form is submitted
     */
    public get willValidate(): boolean {
        return supportsElementInternals
            ? this.elementInternals.willValidate
            : this.proxy.willValidate;
    }

    /**
     * A reference to all associated label elements
     */
    public get labels(): ReadonlyArray<Node> {
        if (supportsElementInternals) {
            return Object.freeze(Array.from(this.elementInternals.labels));
        } else if (
            this.proxy instanceof HTMLElement &&
            this.proxy.ownerDocument &&
            this.id
        ) {
            // Labels associated by wraping the element: <label><custom-element></custom-element></label>
            const parentLabels = this.proxy.labels;
            // Labels associated using the `for` attribute
            const forLabels = Array.from(
                (this.proxy.getRootNode() as HTMLDocument | ShadowRoot).querySelectorAll(
                    `[for='${this.id}']`
                )
            );

            const labels = !!parentLabels
                ? forLabels.concat(Array.from(parentLabels))
                : forLabels;

            return Object.freeze(labels);
        } else {
            return emptyArray;
        }
    }

    /**
     * The value of the element to be associated with the form
     */
    @attr
    public value: string = "";

    @attr
    public disabled: boolean = false;
    private disabledChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.disabled = this.disabled === ("" as any); // TODO: https://github.com/microsoft/fast-dna/issues/2742
        }
    }

    @attr
    public name: string;
    private nameChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.name = this.name;
        }
    }

    /**
     * Require the field prior to form submission
     */
    @attr
    public required: boolean = false;
    private requiredChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.required = this.required === ("" as any); // TODO: https://github.com/microsoft/fast-dna/issues/2742
        }
    }

    /**
     * The proxy element provided by
     */
    protected abstract proxy: T;

    /**
     * The element internals object. Will only exist
     * in browsers supporting the attachInternals API
     */
    protected elementInternals: ElementInternals;

    /**
     * These are events that are still fired by the proxy
     * element based on user / programmatic interaction.
     *
     * The proxy implementation should be transparent to
     * the app author, so block these events from emitting.
     */
    private proxyEventsToBlock = ["change", "click"];

    constructor() {
        super();

        if (supportsElementInternals) {
            this.elementInternals = (this as any).attachInternals();
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        if (!supportsElementInternals) {
            this.proxy.style.display = "none";
            this.appendChild(this.proxy);

            this.proxyEventsToBlock.forEach(name =>
                this.proxy.addEventListener(name, this.stopPropagation)
            );

            // These are typically mapped to the proxy during
            // property change callbacks, but during initialization
            // on the intial call of the callback, the proxy is
            // still undefined. We should find a better way to address this.
            this.proxy.disabled = this.disabled === ("" as any); // TODO: https://github.com/microsoft/fast-dna/issues/2742
            this.proxy.required = this.required === ("" as any); // TODO: https://github.com/microsoft/fast-dna/issues/2742
            if (typeof this.name === "string") {
                this.proxy.name = this.name;
            }
            if (typeof this.value === "string") {
                this.proxy.value = this.value;
            }
        }
    }

    public disconnectedCallback(): void {
        this.proxyEventsToBlock.forEach(name =>
            this.proxy.removeEventListener(name, this.stopPropagation)
        );
        this.removeChild(this.proxy);
    }

    /**
     * Return the current validity of the element
     */
    public checkValidity(): boolean {
        return supportsElementInternals
            ? this.elementInternals.checkValidity()
            : this.proxy.checkValidity();
    }

    /**
     * Return the current validity of the element.
     * If false, fires an invalid event at the element.
     */
    public reportValidity(): boolean {
        return supportsElementInternals
            ? this.elementInternals.reportValidity()
            : this.proxy.reportValidity();
    }

    /**
     * Set the validity of the control. In cases when the elementInternals object is not
     * available (and the proxy element is used to report validity), this function will
     * do nothing unless a message is provided, at which point the setCustomValidity method
     * of the proxy element will be invoked with the provided message.
     * @param flags Validity flags
     * @param message Optional message to supply
     * @param anchor Optional element used by UA to display an interactive validation UI
     */
    public setValidity(
        flags: ValidityStateFlags,
        message?: string,
        anchor?: HTMLElement
    ): void {
        if (supportsElementInternals) {
            this.elementInternals.setValidity(flags, message, anchor);
        } else if (typeof message === "string") {
            this.proxy.setCustomValidity(message);
        }
    }

    /**
     *
     * @param value The value to set
     * @param state The state object provided to during session restores and when autofilling.
     */
    protected setFormValue(
        value: File | string | FormData | null,
        state?: File | string | FormData | null
    ): void {
        if (supportsElementInternals) {
            this.elementInternals.setFormValue(value, state);
        }
    }

    protected keypressHandler(e: KeyboardEvent): void {
        switch (e.keyCode) {
            case keyCodeEnter:
                if (this.form instanceof HTMLFormElement) {
                    // Match native behavior
                    this.form.submit();
                }

                break;
        }
    }

    /**
     * Used to stop propagation of proxy element events
     * @param e Event object
     */
    private stopPropagation(e: Event): void {
        e.stopPropagation();
    }
}
