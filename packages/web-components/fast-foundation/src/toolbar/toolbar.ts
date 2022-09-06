import { attr, FASTElement, observable, Observable } from "@microsoft/fast-element";
import { ArrowKeys, Direction, limit, Orientation } from "@microsoft/fast-web-utilities";
import { isFocusable } from "tabbable";
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index.js";
import type { StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";
import { getDirection } from "../utilities/direction.js";

/**
 * Toolbar configuration options
 * @public
 */
export type ToolbarOptions = StartEndOptions;

/**
 * A map for directionality derived from keyboard input strings,
 * visual orientation, and text direction.
 *
 * @internal
 */
const ToolbarArrowKeyMap = Object.freeze({
    [ArrowKeys.ArrowUp]: {
        [Orientation.vertical]: -1,
    },
    [ArrowKeys.ArrowDown]: {
        [Orientation.vertical]: 1,
    },
    [ArrowKeys.ArrowLeft]: {
        [Orientation.horizontal]: {
            [Direction.ltr]: -1,
            [Direction.rtl]: 1,
        },
    },
    [ArrowKeys.ArrowRight]: {
        [Orientation.horizontal]: {
            [Direction.ltr]: 1,
            [Direction.rtl]: -1,
        },
    },
});

/**
 * A Toolbar Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#Toolbar|ARIA Toolbar}.
 *
 * @slot start - Content which can be provided before the slotted items
 * @slot end - Content which can be provided after the slotted items
 * @slot - The default slot for slotted items
 * @slot label - The toolbar label
 * @csspart control - The element containing the items, start and end slots
 *
 * @public
 */
export class FASTToolbar extends FASTElement {
    /**
     * The internal index of the currently focused element.
     *
     * @internal
     */
    private _activeIndex: number = 0;

    /**
     * The index of the currently focused element, clamped between 0 and the last element.
     *
     * @internal
     */
    get activeIndex(): number {
        Observable.track(this, "activeIndex");
        return this._activeIndex;
    }

    set activeIndex(value: number) {
        if (this.$fastController.isConnected) {
            this._activeIndex = limit(0, this.focusableElements.length - 1, value);
            Observable.notify(this, "activeIndex");
        }
    }

    /**
     * The text direction of the toolbar.
     *
     * @internal
     */
    @observable
    public direction: Direction = Direction.ltr;

    /**
     * The collection of focusable toolbar controls.
     *
     * @internal
     */
    private focusableElements: HTMLElement[];

    /**
     * The orientation of the toolbar.
     *
     * @public
     * @remarks
     * HTML Attribute: `orientation`
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedItems: HTMLElement[];
    protected slottedItemsChanged(): void {
        if (this.$fastController.isConnected) {
            this.reduceFocusableElements();
        }
    }

    /**
     * The elements in the label slot.
     *
     * @internal
     */
    @observable
    public slottedLabel: HTMLElement[];

    /**
     * Set the activeIndex when a focusable element in the toolbar is clicked.
     *
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        const activeIndex = this.focusableElements?.indexOf(e.target as HTMLElement);
        if (activeIndex > -1 && this.activeIndex !== activeIndex) {
            this.setFocusedElement(activeIndex);
        }

        return true;
    }

    @observable
    public childItems: Element[];
    protected childItemsChanged(prev: undefined | Element[], next: Element[]): void {
        if (this.$fastController.isConnected) {
            this.reduceFocusableElements();
        }
    }

    /**
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback();
        this.direction = getDirection(this);
    }

    /**
     * When the toolbar receives focus, set the currently active element as focused.
     *
     * @internal
     */
    public focusinHandler(e: FocusEvent): boolean | void {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || this.contains(relatedTarget)) {
            return;
        }

        this.setFocusedElement();
    }

    /**
     * Determines a value that can be used to iterate a list with the arrow keys.
     *
     * @param this - An element with an orientation and direction
     * @param key - The event key value
     * @internal
     */
    private getDirectionalIncrementer(key: string): number {
        return (
            ToolbarArrowKeyMap[key]?.[this.orientation]?.[this.direction] ??
            ToolbarArrowKeyMap[key]?.[this.orientation] ??
            0
        );
    }

    /**
     * Handle keyboard events for the toolbar.
     *
     * @internal
     */
    public keydownHandler(e: KeyboardEvent): boolean | void {
        const key = e.key;

        if (!(key in ArrowKeys) || e.defaultPrevented || e.shiftKey) {
            return true;
        }

        const incrementer = this.getDirectionalIncrementer(key);
        if (!incrementer) {
            return !(e.target as HTMLElement).closest("[role=radiogroup]");
        }

        const nextIndex = this.activeIndex + incrementer;
        if (this.focusableElements[nextIndex]) {
            e.preventDefault();
        }

        this.setFocusedElement(nextIndex);

        return true;
    }

    /**
     * get all the slotted elements
     * @internal
     */
    protected get allSlottedItems(): (HTMLElement | Node)[] {
        return [
            ...this.start.assignedElements(),
            ...this.slottedItems,
            ...this.end.assignedElements(),
        ];
    }

    /**
     * Prepare the slotted elements which can be focusable.
     *
     * @internal
     */
    protected reduceFocusableElements(): void {
        const previousFocusedElement = this.focusableElements?.[this.activeIndex];

        this.focusableElements = this.allSlottedItems.reduce(
            FASTToolbar.reduceFocusableItems,
            []
        );

        // If the previously active item is still focusable, adjust the active index to the
        // index of that item.
        const adjustedActiveIndex = this.focusableElements.indexOf(
            previousFocusedElement
        );
        this.activeIndex = Math.max(0, adjustedActiveIndex);

        this.setFocusableElements();
    }

    /**
     * Set the activeIndex and focus the corresponding control.
     *
     * @param activeIndex - The new index to set
     * @internal
     */
    private setFocusedElement(activeIndex: number = this.activeIndex): void {
        this.activeIndex = activeIndex;
        this.setFocusableElements();
        this.focusableElements[this.activeIndex]?.focus();
    }

    /**
     * Reduce a collection to only its focusable elements.
     *
     * @param elements - Collection of elements to reduce
     * @param element - The current element
     *
     * @internal
     */
    private static reduceFocusableItems(
        elements: HTMLElement[],
        element: FASTElement & HTMLElement
    ): HTMLElement[] {
        const isRoleRadio = element.getAttribute("role") === "radio";
        const isFocusableFastElement =
            element.$fastController?.definition.shadowOptions?.delegatesFocus;
        const hasFocusableShadow = Array.from(
            element.shadowRoot?.querySelectorAll("*") ?? []
        ).some(x => isFocusable(x));

        if (
            !element.hasAttribute("disabled") &&
            !element.hasAttribute("hidden") &&
            (isFocusable(element) ||
                isRoleRadio ||
                isFocusableFastElement ||
                hasFocusableShadow)
        ) {
            elements.push(element);
            return elements;
        }

        if (element.childElementCount) {
            return elements.concat(
                Array.from(element.children).reduce(FASTToolbar.reduceFocusableItems, [])
            );
        }

        return elements;
    }

    /**
     * @internal
     */
    private setFocusableElements(): void {
        if (this.$fastController.isConnected && this.focusableElements.length > 0) {
            this.focusableElements.forEach((element, index) => {
                element.tabIndex = this.activeIndex === index ? 0 : -1;
            });
        }
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA toolbar role
 *
 * @public
 */
export class DelegatesARIAToolbar {
    /**
     * The id of the element labeling the toolbar.
     * @public
     * @remarks
     * HTML Attribute: aria-labelledby
     */
    @attr({ attribute: "aria-labelledby" })
    public ariaLabelledby: string | null;

    /**
     * The label surfaced to assistive technologies.
     *
     * @public
     * @remarks
     * HTML Attribute: aria-label
     */
    @attr({ attribute: "aria-label" })
    public ariaLabel: string | null;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIAToolbar extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIAToolbar, ARIAGlobalStatesAndProperties);

/**
 * @internal
 */
export interface FASTToolbar extends StartEnd, DelegatesARIAToolbar {}
applyMixins(FASTToolbar, StartEnd, DelegatesARIAToolbar);
