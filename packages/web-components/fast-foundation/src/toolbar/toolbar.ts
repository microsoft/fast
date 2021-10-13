import { attr, FASTElement, observable, Observable } from "@microsoft/fast-element";
import { ArrowKeys, Direction, limit, Orientation } from "@microsoft/fast-web-utilities";
import { isFocusable } from "tabbable";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd, StartEndOptions } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { getDirection } from "../utilities/direction";

/**
 * Toolbar configuration options
 * @public
 */
export type ToolbarOptions = FoundationElementDefinition & StartEndOptions;

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
 * @public
 */
export class Toolbar extends FoundationElement {
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
        this.focusableElements = this.allSlottedItems.reduce(
            Toolbar.reduceFocusableItems,
            []
        );
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
    ) {
        const isRoleRadio = element.getAttribute("role") === "radio";
        const isFocusableFastElement =
            element.$fastController?.definition.shadowOptions?.delegatesFocus;
        const hasFocusableShadow = Array.from(
            element.shadowRoot?.querySelectorAll("*") ?? []
        ).some(x => isFocusable(x));

        if (
            isFocusable(element) ||
            isRoleRadio ||
            isFocusableFastElement ||
            hasFocusableShadow
        ) {
            elements.push(element);
            return elements;
        }

        if (element.childElementCount) {
            return elements.concat(
                Array.from(element.children).reduce(Toolbar.reduceFocusableItems, [])
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
    public ariaLabelledby: string;

    /**
     * The label surfaced to assistive technologies.
     *
     * @public
     * @remarks
     * HTML Attribute: aria-label
     */
    @attr({ attribute: "aria-label" })
    public ariaLabel: string;
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
export interface Toolbar extends StartEnd, DelegatesARIAToolbar {}
applyMixins(Toolbar, StartEnd, DelegatesARIAToolbar);
