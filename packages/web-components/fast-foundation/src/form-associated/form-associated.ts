import { attr, DOM, emptyArray, FASTElement, observable } from "@microsoft/fast-element";
import { keyCodeEnter } from "@microsoft/fast-web-utilities";

/**
 * This file enables typing support for ElementInternals APIs.
 * It is largely taken from https://github.com/microsoft/TSJS-lib-generator/pull/818/files.
 *
 * When TypeScript adds support for these APIs we can delete this file.
 */

interface ValidityStateFlags {
    badInput?: boolean;
    customError?: boolean;
    patternMismatch?: boolean;
    rangeOverflow?: boolean;
    rangeUnderflow?: boolean;
    stepMismatch?: boolean;
    tooLong?: boolean;
    tooShort?: boolean;
    typeMismatch?: boolean;
    valueMissing?: boolean;
}

/**
 * Source:
 * https://html.spec.whatwg.org/multipage/custom-elements.html#elementinternals
 */
interface ElementInternals {
    /**
     * Returns the form owner of internals target element.
     */
    readonly form: HTMLFormElement | null;
    /**
     * Returns a NodeList of all the label elements that internals target element is associated with.
     */
    readonly labels: NodeList;
    /**
     * Returns the error message that would be shown to the user if internals target element was to be checked for validity.
     */
    readonly validationMessage: string;
    /**
     * Returns the ValidityState object for internals target element.
     */
    readonly validity: ValidityState;
    /**
     * Returns true if internals target element will be validated when the form is submitted; false otherwise.
     */
    readonly willValidate: boolean;
    /**
     * Returns true if internals target element has no validity problems; false otherwise. Fires an invalid event at the element in the latter case.
     */
    checkValidity(): boolean;
    /**
     * Returns true if internals target element has no validity problems; otherwise,
     * returns false, fires an invalid event at the element, and (if the event isn't canceled) reports the problem to the user.
     */
    reportValidity(): boolean;
    /**
     * Sets both the state and submission value of internals target element to value.
     *
     * While "null" isn't enumerated as a argument type (here)[https://html.spec.whatwg.org/multipage/custom-elements.html#the-elementinternals-interface],
     * In practice it appears to remove the value from the form data on submission. Adding it as a valid type here
     * becuase that capability is required for checkbox and radio types
     */
    setFormValue(
        value: File | string | FormData | null,
        state?: File | string | FormData | null
    ): void;
    /**
     * Marks internals target element as suffering from the constraints indicated by the flags argument,
     * and sets the element's validation message to message.
     * If anchor is specified, the user agent might use
     * it to indicate problems with the constraints of internals target
     * element when the form owner is validated interactively or reportValidity() is called.
     */
    setValidity(flags: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
}

declare let ElementInternals: {
    prototype: ElementInternals;
    new (): ElementInternals;
};

interface HTMLElement {
    attachInternals?(): ElementInternals;
}

const proxySlotName = "form-associated-proxy";

/**
 * @alpha
 */
export const supportsElementInternals = "ElementInternals" in window;

/**
 * Base class for providing Custom Element Form Association.
 *
 * @alpha
 */
export abstract class FormAssociated<
    T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> extends FASTElement {
    /**
     * Must evaluate to true to enable elementInternals.
     * Feature detects API support and resolve respectively
     *
     * @internal
     */
    public static get formAssociated(): boolean {
        return supportsElementInternals;
    }

    /**
     * Returns the validity state of the element
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
            // Labels associated by wrapping the element: <label><custom-element></custom-element></label>
            const parentLabels = this.proxy.labels;
            // Labels associated using the `for` attribute
            const forLabels = Array.from(
                (this.proxy.getRootNode() as HTMLDocument | ShadowRoot).querySelectorAll(
                    `[for='${this.id}']`
                )
            );

            const labels = parentLabels
                ? forLabels.concat(Array.from(parentLabels))
                : forLabels;

            return Object.freeze(labels);
        } else {
            return emptyArray;
        }
    }

    /**
     * Track whether the value has been changed from the initial value
     */
    private dirtyValue: boolean = false;

    /**
     * Stores a reference to the slot element that holds the proxy
     * element when it is appended.
     */
    private proxySlot: HTMLSlotElement | void;

    /**
     * The value of the element to be associated with the form.
     */
    @observable
    public value: string;

    /**
     * Invoked when the `value` property changes
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `valueChanged` method
     * They must be sure to invoke `super.valueChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    protected valueChanged(previous: string, next: string) {
        this.dirtyValue = true;

        this.setFormValue(this.value);
    }

    /**
     * The initial value of the form. This value sets the `value` property
     * only when the `value` property has not been explicitly set.
     *
     * @remarks
     * HTML Attribute: value
     */
    @attr({ mode: "fromView", attribute: "value" })
    protected initialValue: string = "";

    /**
     * Invoked when the `initialValue` property changes
     *
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `initialValueChanged` method
     * They must be sure to invoke `super.initialValueChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    protected initialValueChanged(previous: string, next: string) {
        // If the value is clean and the component is connected to the DOM
        // then set value equal to the attribute value.
        if (!this.dirtyValue && this.$fastController.isConnected) {
            this.value = this.initialValue;
            this.dirtyValue = false;
        }
    }

    /**
     * Sets the element's disabled state. A disabled element will not be included during form submission.
     *
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * Invoked when the `disabled` property changes
     *
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `disabledChanged` method
     * They must be sure to invoke `super.disabledChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    protected disabledChanged(previous: boolean, next: boolean): void {
        DOM.queueUpdate(() => this.classList.toggle("disabled", this.disabled));
    }

    /**
     * The name of the element. This element's value will be surfaced during form submission under the provided name.
     *
     * @remarks
     * HTML Attribute: name
     */
    @attr
    public name: string;

    /**
     * Require the field to be completed prior to form submission.
     *
     * @remarks
     * HTML Attribute: required
     */
    @attr({ mode: "boolean" })
    public required: boolean = false;

    /**
     * Invoked when the `required` property changes
     *
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `requiredChanged` method
     * They must be sure to invoke `super.requiredChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    protected requiredChanged(): void {
        DOM.queueUpdate(() => this.classList.toggle("required", this.required));
    }

    /**
     * The proxy element - this element serves as the communication layer with the parent form
     * when form association is not supported by the browser.
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

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.value = this.initialValue;
        this.dirtyValue = false;

        if (!supportsElementInternals) {
            this.attachProxy();
        }
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        this.proxyEventsToBlock.forEach(name =>
            this.proxy.removeEventListener(name, this.stopPropagation)
        );
    }

    /**
     * Return the current validity of the element.
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
     * @param flags - Validity flags
     * @param message - Optional message to supply
     * @param anchor - Optional element used by UA to display an interactive validation UI
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
     * Invoked when a connected component's form or fieldset has it's disabled
     * state changed.
     * @param disabled - the disabled value of the form / fieldset
     */
    public formDisabledCallback(disabled: boolean): void {
        this.disabled = disabled;
    }

    private proxyInitialized: boolean = false;

    /**
     * Attach the proxy element to the DOM
     */
    protected attachProxy() {
        if (!this.proxyInitialized) {
            this.proxyInitialized = true;
            this.proxy.style.display = "none";
            this.proxyEventsToBlock.forEach(name =>
                this.proxy.addEventListener(name, this.stopPropagation)
            );

            // These are typically mapped to the proxy during
            // property change callbacks, but during initialization
            // on the initial call of the callback, the proxy is
            // still undefined. We should find a better way to address this.
            this.proxy.disabled = this.disabled;
            this.proxy.required = this.required;
            if (typeof this.name === "string") {
                this.proxy.name = this.name;
            }

            if (typeof this.value === "string") {
                this.proxy.value = this.value;
            }

            this.proxy.setAttribute("slot", proxySlotName);

            this.proxySlot = document.createElement("slot");
            this.proxySlot.setAttribute("name", proxySlotName);
        }

        this.shadowRoot?.appendChild(this.proxySlot as HTMLSlotElement);
        this.appendChild(this.proxy);
    }

    /**
     * Detach the proxy element from the DOM
     */
    protected detachProxy() {
        this.removeChild(this.proxy);
        this.shadowRoot?.removeChild(this.proxySlot as HTMLSlotElement);
    }

    /**
     * Associates the provided value (and optional state) with the parent form.
     * @param value - The value to set
     * @param state - The state object provided to during session restores and when autofilling.
     */
    protected setFormValue(
        value: File | string | FormData | null,
        state?: File | string | FormData | null
    ): void {
        if (supportsElementInternals && this.elementInternals) {
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
     * @param e - Event object
     */
    private stopPropagation(e: Event): void {
        e.stopPropagation();
    }

    public attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
    ): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy[name] = `${this[name]}`;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
}
