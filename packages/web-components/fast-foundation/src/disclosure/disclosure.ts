import { attr, FASTElement } from "@microsoft/fast-element";
/**
 * A Disclosure Custom HTML Element.
 * Based largely on the {@link https://w3c.github.io/aria-practices/#disclosure | disclosure element }.
 *
 * @public
 */
export class Disclosure extends FASTElement {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    @attr({ attribute: "aria-expanded" })
    public ariaExpanded: true | false;

    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     *
     * {@link https://www.w3.org/TR/wai-aria-1.1/#aria-controls}
     * @public
     * @remarks
     * HTML Attribute: aria-controls
     */
    @attr({ attribute: "aria-controls" })
    public ariaControls: string;

    /**
     * Determines if the element should show the extra content or not.
     *
     * @public
     */
    @attr({ mode: "boolean" })
    public expanded: boolean;

    /**
     * Invoker title
     *
     * @public
     */
    @attr
    public title: string;

    /**
     * @internal
     */
    public details: HTMLDetailsElement;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.setup();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.details.removeEventListener("toggle", this.onToggle);
    }

    constructor() {
        super();
        this.ariaExpanded = false;
        this.ariaControls = `disclosure-content-${this.uuid()}`;
    }

    /**
     * Show extra content.
     */
    public show(): void {
        this.details.open = true;
    }

    /**
     * Hide extra content.
     */
    public hide(): void {
        this.details.open = false;
    }

    /**
     * Toggle the current(expanded/closed) state.
     */
    public toggle(): void {
        this.details.open = !this.details.open;
    }

    /**
     * Register listener and set default disclosure mode
     */
    protected setup(): void {
        this.onToggle = this.onToggle.bind(this);
        this.details.addEventListener("toggle", this.onToggle);
        if (this.expanded) {
            this.show();
        }
    }

    /**
     * Toggle the current(expanded/closed) state.
     */
    protected onToggle() {
        this.expanded = this.details.open;
        this.ariaExpanded = this.expanded;
        this.$emit("toggle");
    }

    /**
     * Generate random UUID
     */
    private uuid = (): string => Math.random().toString(36).substr(2, 10);
}
