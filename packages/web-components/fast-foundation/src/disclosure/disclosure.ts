import { attr, FASTElement } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end.js";
import type { StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * Disclosure configuration options
 * @public
 */
export type DisclosureOptions = StartEndOptions<FASTDisclosure>;

/**
 * A Disclosure Custom HTML Element.
 * Based largely on the {@link https://w3c.github.io/aria-practices/#disclosure | disclosure element }.
 *
 * @slot start - Content which can be provided before the summary content
 * @slot end - Content which can be provided after the summary content
 * @slot title - The summary content
 * @slot - The default slot for the disclosure content
 * @fires toggle - fires a toggle event when the summary is toggled
 *
 * @public
 */
export class FASTDisclosure extends FASTElement {
    /**
     * Determines if the element should show the extra content or not.
     *
     * @public
     */
    @attr({ mode: "boolean" })
    public expanded: boolean = false;

    /**
     * Invoker title
     *
     * @public
     */
    @attr
    public summary: string;

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
     * Toggle the current(expanded/collapsed) state.
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
     * Update the aria attr and fire `toggle` event
     */
    protected onToggle() {
        this.expanded = this.details.open;
        this.$emit("toggle");
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface FASTDisclosure extends StartEnd {}
applyMixins(FASTDisclosure, StartEnd);
