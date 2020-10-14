import { attr, FASTElement, observable } from "@microsoft/fast-element";

/**
 * An Option Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#option | ARIA menuitem }.
 *
 * @public
 */
export class Option extends FASTElement {
    /**
     * Tracks whether the "selected" property has been changed.
     */
    private dirtySelected: boolean = false;

    /**
     * The disabled state of the option.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        void 0;
    }

    /**
     * The selected attribute value. This sets the initial selected value.
     *
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    @attr({ attribute: "selected", mode: "boolean" })
    public selectedAttribute: boolean;
    private selectedAttributeChanged(): void {
        this.defaultSelected = this.selectedAttribute;
    }

    /**
     * The element's value to be included in form submission when checked.
     * @public
     */
    public value: string = "";
    public valueChanged(): void {
        void 0;
    }

    /**
     * The value attribute.
     * @public
     * @remarks
     * HTML Attribute: value
     */
    @attr({ attribute: "value", mode: "fromView" })
    public valueAttribute: string;

    /**
     * The defaultSelected state of the option.
     * @public
     */
    @observable
    public defaultSelected: boolean = false;
    private defaultSelectedChanged(): void {
        if (!this.dirtySelected) {
            // Setting this.selected will cause us to enter a dirty state,
            // but if we are clean when defaultSelected is changed, we want to
            // stay in a clean state, so reset this.dirtySelected
            this.selected = this.defaultSelected;
        }
    }

    /**
     * The checked state of the control.
     *
     * @public
     */
    @observable
    public selected: boolean = this.defaultSelected;
    private selectedChanged(oldValue, newValue): void {
        if (!this.dirtySelected) {
            this.dirtySelected = true;
        }

        this.classList.toggle("selected", oldValue !== newValue ? newValue : false);

        if (this.$fastController.isConnected) {
            this.$emit("change");
        }
    }

    @observable
    public focusable: boolean = false;

    public handleFocus = (e: Event): void => {
        if (e.target === e.currentTarget) {
            this.focusable = true;
        }
    };

    constructor() {
        super();
        this.addEventListener("focus", this.handleFocus);
        this.addEventListener("blur", this.handleBlur);
        // @focus="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
        // @blur="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
    }

    public handleBlur = (e: FocusEvent): void => {
        console.log(e.target, e.currentTarget);
        if (e.target !== e.currentTarget) {
            return;
        }

        this.focusable = false;
    };

    @observable
    public defaultSlottedNodes: Node[];

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
    }
}
