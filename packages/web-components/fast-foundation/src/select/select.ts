import { attr, DOM, observable, volatile } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/index";
import { Listbox } from "../listbox";
import { Option, OptionRole } from "../option";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { SelectPositioning } from "./select.options";

/**
 * A Select Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#select | ARIA select }.
 *
 * @public
 */
export class Select extends Listbox {
    protected proxy: HTMLSelectElement = document.createElement("select");
    /**
     * The open attribute.
     *
     * @internal
     */
    @attr({ attribute: "open", mode: "boolean" })
    public open: boolean = false;
    protected openChanged() {
        this.ariaExpanded = this.open ? "true" : "false";
        if (this.open) {
            this.setPositioning();
        }
    }

    /**
     *  Reflects the placement for the listbox when the select is open.
     *
     * @public
     */
    @attr
    public positioning: SelectPositioning = SelectPositioning.below;

    /**
     * Calculate and apply listbox positioning based on available viewport space.
     *
     * @param force - direction to force the listbox to display
     * @public
     */
    public setPositioning(force?: SelectPositioning): void {
        if (force) {
            this.positioning = force;
        }

        const currentBox = this.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const availableBottom = viewportHeight - currentBox.bottom;
        this.positioning =
            currentBox.top > availableBottom
                ? SelectPositioning.above
                : SelectPositioning.below;

        if (currentBox.top > availableBottom) {
            this.positioning = SelectPositioning.above;
            this.maxHeight = ~~currentBox.top;
        } else {
            this.positioning = SelectPositioning.below;
            this.maxHeight = ~~availableBottom;
        }
    }

    /**
     * The max height for the listbox when opened.
     *
     * @internal
     */
    @observable
    public maxHeight: number = 0;

    /**
     * The value displayed on the button.
     *
     * @public
     */
    @volatile
    public get displayValue(): string {
        if (this.firstSelectedOption) {
            return this.firstSelectedOption.textContent || this.firstSelectedOption.value;
        }
        return "";
    }

    /**
     * Sets the value when the options are changed.
     *
     * @param prev - The previous value
     * @param next - the new value
     * @internal
     */
    protected selectedOptionsChanged(prev: Option[] = [], next: Option[] = []): void {
        super.selectedOptionsChanged(prev, next);
        if (this.$fastController.isConnected) {
            this.value = `${
                this.firstSelectedOption.value || this.firstSelectedOption.textContent
            }`;
        }
    }

    /**
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        // do nothing if the select is disabled
        if (this.disabled) {
            return;
        }

        super.clickHandler(e);

        if (this.open) {
            const captured = (e.target as HTMLElement).closest(
                `[role=${OptionRole.option}]`
            ) as Option;
            if (captured && captured.disabled) {
                return;
            }
        }

        this.open = !this.open;

        return true;
    }

    public focusoutHandler(e: FocusEvent): boolean | void {
        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (this.isSameNode(focusTarget)) {
            DOM.queueUpdate(() => this.focus());
            return;
        }

        if (!this.options.includes(focusTarget as Option)) {
            this.open = false;
        }
    }

    public keydownHandler(e: KeyboardEvent): boolean | void {
        super.keydownHandler(e);

        const keyCode: string = e.key || `${e.key.charCodeAt(0)}`;

        if (keyCode === " " || keyCode === "Enter") {
            this.open = !this.open;
        }

        if (keyCode === "Escape") {
            this.open = false;
        }

        return true;
    }

    @observable
    public value: string;

    public connectedCallback() {
        super.connectedCallback();
        DOM.queueUpdate(() => {
            if (this.proxy instanceof HTMLElement) {
                this.options.forEach(o => {
                    const opt = o.proxy;
                    this.proxy.add(opt);
                });
            }
        });
    }
}

/**
 * Handles proxy element interaction for form association.
 *
 * @public
 */
class FormAssociatedSelect extends FormAssociated<HTMLSelectElement> {
    protected proxy: HTMLSelectElement = document.createElement("select");

    protected updateForm(previous, next): void {
        const value = this.value;
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = value;
        }
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA select role.
 *
 * @public
 */
class DelegatesARIASelect extends ARIAGlobalStatesAndProperties {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    @observable
    public ariaExpanded: "true" | "false" | undefined;

    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-disabled}
     * @public
     * @remarks
     * HTML Attribute: aria-disabled
     */
    @attr({ attribute: "aria-disabled", mode: "fromView" })
    public ariaDisabled: "true" | "false";
}

/**
 * @internal
 */
export interface Select extends FormAssociatedSelect, StartEnd, DelegatesARIASelect {}
applyMixins(Select, FormAssociatedSelect, StartEnd, DelegatesARIASelect);
