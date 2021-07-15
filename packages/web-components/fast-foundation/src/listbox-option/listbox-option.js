var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, observable, Observable } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { FoundationElement } from "../foundation-element";
/**
 * Determines if the element is a {@link (ListboxOption:class)}
 *
 * @param element - the element to test.
 * @public
 */
export function isListboxOption(el) {
    return (
        isHTMLElement(el) &&
        (el.getAttribute("role") === "option" || el instanceof HTMLOptionElement)
    );
}
/**
 * An Option Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#option | ARIA option }.
 *
 * @public
 */
export class ListboxOption extends FoundationElement {
    constructor(text, value, defaultSelected, selected) {
        super();
        /**
         * The defaultSelected state of the option.
         * @public
         */
        this.defaultSelected = false;
        /**
         * Tracks whether the "selected" property has been changed.
         * @internal
         */
        this.dirtySelected = false;
        /**
         * The checked state of the control.
         *
         * @public
         */
        this.selected = this.defaultSelected;
        /**
         * Track whether the value has been changed from the initial value
         */
        this.dirtyValue = false;
        this.initialValue = this.initialValue || "";
        if (text) {
            this.textContent = text;
        }
        if (value) {
            this.initialValue = value;
        }
        if (defaultSelected) {
            this.defaultSelected = defaultSelected;
        }
        if (selected) {
            this.selected = selected;
        }
        this.proxy = new Option(
            `${this.textContent}`,
            this.initialValue,
            this.defaultSelected,
            this.selected
        );
        this.proxy.disabled = this.disabled;
    }
    defaultSelectedChanged() {
        if (!this.dirtySelected) {
            this.selected = this.defaultSelected;
            if (this.proxy instanceof HTMLOptionElement) {
                this.proxy.selected = this.defaultSelected;
            }
        }
    }
    disabledChanged(prev, next) {
        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy.disabled = this.disabled;
        }
    }
    selectedAttributeChanged() {
        this.defaultSelected = this.selectedAttribute;
        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy.defaultSelected = this.defaultSelected;
        }
    }
    selectedChanged() {
        if (this.$fastController.isConnected) {
            if (!this.dirtySelected) {
                this.dirtySelected = true;
            }
            if (this.proxy instanceof HTMLOptionElement) {
                this.proxy.selected = this.selected;
            }
        }
    }
    initialValueChanged(previous, next) {
        // If the value is clean and the component is connected to the DOM
        // then set value equal to the attribute value.
        if (!this.dirtyValue) {
            this.value = this.initialValue;
            this.dirtyValue = false;
        }
    }
    get label() {
        return this.value ? this.value : this.textContent ? this.textContent : "";
    }
    get text() {
        return this.textContent;
    }
    set value(next) {
        this._value = next;
        this.dirtyValue = true;
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = next;
        }
        Observable.notify(this, "value");
    }
    get value() {
        Observable.track(this, "value");
        return this._value ? this._value : this.text;
    }
    get form() {
        return this.proxy ? this.proxy.form : null;
    }
}
__decorate([observable], ListboxOption.prototype, "defaultSelected", void 0);
__decorate([attr({ mode: "boolean" })], ListboxOption.prototype, "disabled", void 0);
__decorate(
    [attr({ attribute: "selected", mode: "boolean" })],
    ListboxOption.prototype,
    "selectedAttribute",
    void 0
);
__decorate([observable], ListboxOption.prototype, "selected", void 0);
__decorate(
    [attr({ attribute: "value", mode: "fromView" })],
    ListboxOption.prototype,
    "initialValue",
    void 0
);
applyMixins(ListboxOption, StartEnd);
