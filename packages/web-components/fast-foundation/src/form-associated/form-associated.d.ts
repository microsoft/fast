import type { Constructable, FASTElement } from "@microsoft/fast-element";
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
/**
 * @alpha
 */
export declare const supportsElementInternals: boolean;
/**
 * Base class for providing Custom Element Form Association.
 *
 * @alpha
 */
export interface FormAssociated extends Omit<ElementInternals, "labels"> {
    dirtyValue: boolean;
    disabled: boolean;
    readonly elementInternals: ElementInternals | null;
    readonly formAssociated: boolean;
    initialValue: string;
    readonly labels: ReadonlyArray<Node[]>;
    name: string;
    required: boolean;
    value: string;
    attachProxy(): void;
    detachProxy(): void;
    disabledChanged?(previous: boolean, next: boolean): void;
    formDisabledCallback?(disabled: boolean): void;
    formResetCallback(): void;
    initialValueChanged?(previous: any, next: any): void;
    nameChanged?(previous: any, next: any): void;
    requiredChanged(prev: boolean, next: boolean): void;
    stopPropagation(e: Event): void;
    validate(): void;
    valueChanged(previous: any, next: any): void;
}
/**
 * Avaiable types for the `proxy` property.
 * @alpha
 */
export declare type ProxyElement =
    | HTMLSelectElement
    | HTMLTextAreaElement
    | HTMLInputElement;
/**
 * Identifies a class as having a proxy element and optional submethods related
 * to the proxy element.
 *
 * @alpha
 */
export interface FormAssociatedProxy {
    proxy: ProxyElement;
    disabledChanged?(previous: boolean, next: boolean): void;
    formDisabledCallback?(disabled: boolean): void;
    formResetCallback?(): void;
    initialValueChanged?(previous: any, next: any): void;
    valueChanged?(previous: any, next: any): void;
    nameChanged?(previous: any, next: any): void;
}
/**
 * Combined type to describe a Form-associated element.
 *
 * @alpha
 */
export declare type FormAssociatedElement = FormAssociated &
    FASTElement &
    HTMLElement &
    FormAssociatedProxy;
/**
 * Combined type to describe a Constructable Form-Associated type.
 *
 * @alpha
 */
export declare type ConstructableFormAssociated = Constructable<
    HTMLElement & FASTElement
>;
/**
 * Base function for providing Custom Element Form Association.
 *
 * @alpha
 */
export declare function FormAssociated<T extends ConstructableFormAssociated>(
    BaseCtor: T
): T;
export {};
