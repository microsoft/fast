import { attr, FastElement } from "@microsoft/fast-element";
import { keyCodeEnter } from "@microsoft/fast-web-utilities";

/* tslint:disable:member-ordering */
export abstract class FormAssociated<
    T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> extends FastElement {
    /**
     * Must evalute to true to enable elementInternals.
     * Feature detects API support and resolve respectivly.
     */
    public static get formAssociated(): boolean {
        return "ElementInternals" in window;
    }

    /**
     * Returns the validty state of the element
     */
    public get validity(): ValidityState {
        return FormAssociated.formAssociated
            ? this.elementInternals.validity
            : this.proxy.validity;
    }

    /**
     * Retrieve a reference to the associated form.
     * Returns null if not assoicated to any form.
     */
    public get form(): HTMLFormElement | null {
        return FormAssociated.formAssociated
            ? this.elementInternals.form
            : this.proxy.form;
    }

    /**
     * Retrieve the localized validation message,
     * or custom validation messge if set.
     */
    public get validationMessage(): string {
        return FormAssociated.formAssociated
            ? this.elementInternals.validationMessage
            : this.proxy.validationMessage;
    }

    /**
     * Whether the element will be validated when the
     * form is submitted
     */
    public get willValidate(): boolean {
        return FormAssociated.formAssociated
            ? this.elementInternals.willValidate
            : this.proxy.willValidate;
    }

    /**
     * A reference to all associated label elements
     */
    public get labels(): Node[] {
        if (FormAssociated.formAssociated) {
            return Array.from(this.elementInternals.labels);
        } else if (
            this.proxy instanceof HTMLElement &&
            this.proxy.ownerDocument &&
            this.id
        ) {
            // Labels associated by wraping the element: <label><custom-element></custom-element></label>
            const parentLabels = this.proxy.labels;
            // Labels associated using the `for` attribute
            const forLabels = Array.from(
                this.proxy.ownerDocument.querySelectorAll(`[for='${this.id}']`)
            );

            return !!parentLabels
                ? forLabels.concat(Array.from(parentLabels))
                : forLabels;
        } else {
            return [];
        }
    }

    /**
     * The value of the element to be associated with the form
     */
    @attr
    public value: string = "";

    /**
     * Whether the element should be autofocused
     */
    @attr
    public autofocus: boolean; // Map to proxy element

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
     * element based on user / programatic interaction.
     *
     * The proxy implementation should be transparent to
     * the app author, so block these events from emitting.
     */
    private proxyEventsToBlock = ["change", "click"];

    constructor() {
        super();

        if (FormAssociated.formAssociated) {
            this.elementInternals = (this as any).attachInternals();
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.proxy instanceof HTMLElement) {
            this.proxy.style.display = "none";
            this.appendChild(this.proxy);

            this.proxyEventsToBlock.forEach(name =>
                this.proxy.addEventListener(name, this.stopPropogation)
            );

            // These are typically mapped to the proxy during
            // property change callbacks, but during initilization
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

        if (this.autofocus) {
            this.focus();
        }
    }

    public disconnectedCallback(): void {
        this.proxyEventsToBlock.forEach(name =>
            this.proxy.removeEventListener(name, this.stopPropogation)
        );
        this.removeChild(this.proxy);
    }

    /**
     * Return the current validity of the element
     */
    public checkValidity(): boolean {
        return FormAssociated.formAssociated
            ? this.elementInternals.checkValidity()
            : this.proxy.checkValidity();
    }

    /**
     * Return the current validity of the element.
     * If false, fires an invalid event at the element.
     */
    public reportValidity(): boolean {
        return FormAssociated.formAssociated
            ? this.elementInternals.reportValidity()
            : this.proxy.reportValidity();
    }

    /**
     * Set the validity of the control. In cases when the elementInternals object is not
     * availible (and the proxy element is used to report validity), this function will
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
        if (FormAssociated.formAssociated) {
            this.elementInternals.setValidity(flags, message, anchor);
        } else if (typeof message === "string") {
            this.proxy.setCustomValidity(message);
        }
    }

    /**
     *
     * @param value The value to set
     * @param state The state object provided to during sesson restores and when autofilling.
     */
    protected setFormValue(
        value: File | string | FormData | null,
        state?: File | string | FormData | null
    ): void {
        if (FormAssociated.formAssociated) {
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
     * Used to stop propogation of proxy element events
     * @param e Event object
     */
    private stopPropogation(e: Event): void {
        e.stopPropagation();
    }
}
/* tslint:enable:member-ordering */
