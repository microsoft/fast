import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEnd,
    keyHome,
    keyPageDown,
    keyPageUp,
    keyTab,
} from "@microsoft/fast-web-utilities";
import { AttachedBehaviorHTMLDirective, ExecutionContext } from "..";
import type { Behavior } from "../observation/behavior";
import type { CaptureType } from "./template";

/**
 * The options used to configure focusgroups
 * @public
 */
export interface FocusgroupBehaviorOptions {
    wrap?: "both" | "horizontal" | "none" | "vertical";
    direction?: "both" | "horizontal" | "vertical";
    extend?: boolean;
    bubble?: boolean;
}

export type DirectionGuide = {
    up: {
        index: number;
        overlap?: number;
        offset?: number;
    };
    right: {
        index: number;
        overlap?: number;
        offset?: number;
    };
    down: {
        index: number;
        overlap?: number;
        offset?: number;
    };
    left: {
        index: number;
        overlap?: number;
        offset?: number;
    };
    top: {
        index: number;
        overlap?: number;
        offset?: number;
    };
    bottom: {
        index: number;
        overlap?: number;
        offset?: number;
    };
};

/**
 * Focusgroup behavior
 * Handles keyboard arrowing inside a focusgroup
 * @public
 */
export class FocusgroupBehavior implements Behavior {
    private source: any;

    public constructor(
        private target: HTMLElement,
        private options: FocusgroupBehaviorOptions
    ) {
        this.options = Object.assign(
            {},
            {
                wrap: "both",
                direction: "both",
                extend: true,
                bubble: false,
            },
            options
        );
        this.target = target;
    }

    private focusItems: HTMLElement[];

    private positions: DirectionGuide[];

    private firstElement: {
        node: HTMLElement;
        fromStart: number;
        index: number;
    };

    private lastElement: {
        node: HTMLElement;
        fromEnd: number;
        index: number;
    };

    /**
     * Gets the elements under the focusgroup that are focusable
     * @param node - root node to find focusable items under
     * @returns - an array of html elements that are focusable to arrow between
     * @public
     */
    public getFocusItems(node: HTMLElement = this.target): HTMLElement[] {
        const isFocusElement = (node): boolean =>
            !![
                HTMLAnchorElement,
                HTMLInputElement,
                HTMLSelectElement,
                HTMLTextAreaElement,
                HTMLButtonElement,
            ].find(type => node instanceof type);
        const getFocused = (node: Element | Element[]): Array<HTMLElement> =>
            Array.isArray(node)
                ? (node.map(getFocused).filter(el => el !== null) as any).flat()
                : node.hasAttribute("tabindex") || isFocusElement(node)
                ? node
                : node.children.length > 0 && this.options.extend
                ? (getFocused(Array.from(node.children)) as any).flat()
                : node instanceof HTMLSlotElement && this.options.extend
                ? (Array.from(node.assignedElements())
                      .map(getFocused)
                      .filter(el => el !== null) as any).flat()
                : null;
        const getIndex = (node: HTMLElement): number =>
            parseInt(node.getAttribute("tabindex") || "-1");
        return getFocused(Array.from(node.children))
            .sort((a: HTMLElement, b: HTMLElement) => getIndex(a) - getIndex(b))
            .map((item: HTMLElement, index: number) => {
                let tabindex = "-1";
                if (index === 0) {
                    tabindex = "0";
                    item.focus();
                }
                item.setAttribute("tabindex", tabindex);
                return item;
            });
    }

    /**
     * Initializes position data for keyboard navigation
     * @public
     */
    public handleFocus(): void {
        this.setPositions(this.options.wrap);
        this.target.removeAttribute("tabindex");
        this.target.removeEventListener("focus", this.handleFocus);
    }

    /**
     * Behavior bind implementation
     * @param source - source class
     * @param context - execution context
     * @public
     */
    public bind(source: any, context: ExecutionContext): void {
        this.source = source;
        this.target.setAttribute("tabindex", "0");
        this.target.addEventListener("focus", this.handleFocus.bind(this));
        this.target.addEventListener("keydown", this.handleKeydown.bind(this));
    }

    /**
     * Behavior unbind implementation
     * @public
     */
    public unbind(): void {
        this.target.removeEventListener("keydown", this.handleKeydown);
        this.target.removeEventListener("focus", this.handleFocus);
    }

    /**
     * Sets positioning data for arrowing
     * @param wrap - should wrap vertical, horizontal, both or none
     * @public
     */
    public setPositions(wrap): void {
        this.focusItems = this.getFocusItems();
        type dataStruct = {
            x: number;
            y: number;
            x2: number;
            y2: number;
            fromStart: number;
            fromEnd: number;
            context?: any;
        };
        this.positions = this.focusItems
            .map(
                (child: HTMLElement, index: number): dataStruct => {
                    const overlap = (a, b, axis = "x"): number =>
                        Math.min(a[`${axis}2`], b[`${axis}2`]) -
                        Math.max(a[axis], b[axis]);
                    const offset = (a, b, axis = "x"): number =>
                        a[axis] > b[axis]
                            ? b[`${axis}2`] - a[axis]
                            : b[axis] - a[`${axis}2`];
                    const {
                        offsetWidth,
                        offsetHeight,
                        offsetLeft: x,
                        offsetTop: y,
                    } = child;
                    const data: dataStruct = {
                        x,
                        y,
                        x2: x + offsetWidth,
                        y2: y + offsetHeight,
                        fromStart: Math.hypot(x, y),
                        fromEnd: Math.hypot(x + offsetWidth, y + offsetWidth),
                    };

                    if (
                        !this.firstElement ||
                        this.firstElement.fromStart > data.fromStart
                    ) {
                        this.firstElement = {
                            node: child,
                            fromStart: data.fromStart,
                            index,
                        };
                    }

                    if (!this.lastElement || this.lastElement.fromEnd < data.fromEnd) {
                        this.lastElement = {
                            node: child,
                            fromEnd: data.fromEnd,
                            index,
                        };
                    }
                    const getClosestPoint = (a: number[], b: number[]): number =>
                        Math.min(
                            ...(a.map(c => b.map(d => Math.abs(d - c))) as any).flat()
                        );
                    data.context = compare => ({
                        x: {
                            overlap: overlap(data, compare, "y"),
                            offset: offset(data, compare),
                            direction: data.x < compare.x ? "right" : "left",
                        },
                        y: {
                            overlap: overlap(data, compare),
                            offset: offset(data, compare, "y"),
                            direction: data.y < compare.y ? "down" : "up",
                        },
                        distance: Math.hypot(
                            getClosestPoint([data.x, data.x2], [compare.x, compare.x2]),
                            getClosestPoint([data.y, data.y2], [compare.y, compare.y2])
                        ),
                    });
                    return data;
                }
            )
            .map((child: dataStruct, index: number, areas: dataStruct[]) =>
                areas.reduce(
                    (directions: DirectionGuide, child2: dataStruct, ci: number) => {
                        if (ci !== index) {
                            const context = child.context(child2);
                            ["x", "y"].forEach(axis => {
                                const { overlap, offset, direction } = context[axis];
                                if (overlap > 0) {
                                    const sides = [
                                        ["left", "right"],
                                        ["up", "down"],
                                    ];
                                    const opSide = (dir: string): string =>
                                        sides
                                            .find(a => !!a.find(b => b === dir))
                                            ?.filter(a => a !== dir)[0] || "up";
                                    const opposite = opSide(direction);
                                    const dside = directions[direction];
                                    const oside = directions[opposite];
                                    if (
                                        // is not set yet
                                        dside.offset === undefined ||
                                        // child is the same direction and previous was opposite
                                        dside.direction === opposite ||
                                        // child is closer than previous
                                        Math.abs(offset) <= Math.abs(dside.offset) ||
                                        // child is same distance but has more overlap
                                        (Math.abs(offset) === Math.abs(dside.offset) &&
                                            overlap > dside.overlap)
                                    ) {
                                        directions[direction] = Object.assign(
                                            {},
                                            { index: ci },
                                            context[axis]
                                        );
                                    }
                                    if (
                                        // wrapping is enabled
                                        (this.options.wrap === "both" ||
                                            (axis === "x" &&
                                                this.options.wrap === "horizontal") ||
                                            (axis === "y" &&
                                                this.options.wrap === "vertical")) &&
                                        // no opposite side yet
                                        (oside.offset === undefined ||
                                            // current is in opposite direction
                                            (oside.direction === direction &&
                                                // child is farther away
                                                (Math.abs(oside.offset) <
                                                    Math.abs(offset) ||
                                                    // same distance but more overlap
                                                    (Math.abs(oside.offset) ===
                                                        Math.abs(offset) &&
                                                        oside.overlap < overlap))))
                                    ) {
                                        directions[opposite] = Object.assign(
                                            {},
                                            { index: ci },
                                            context[axis]
                                        );
                                    }

                                    if (
                                        direction === "up" &&
                                        (directions.top.offset === undefined ||
                                            Math.abs(offset) >
                                                Math.abs(directions.top.offset))
                                    ) {
                                        directions.top = Object.assign(
                                            {},
                                            { index: ci },
                                            context[axis]
                                        );
                                    }

                                    if (
                                        direction === "down" &&
                                        (directions.bottom.offset === undefined ||
                                            Math.abs(offset) >
                                                Math.abs(directions.bottom.offset))
                                    ) {
                                        directions.bottom = Object.assign(
                                            {},
                                            { index: ci },
                                            context[axis]
                                        );
                                    }
                                }
                            });
                        }
                        return directions;
                    },
                    {
                        up: { index },
                        right: { index },
                        down: { index },
                        left: { index },
                        top: { index },
                        bottom: { index },
                    }
                )
            );
    }

    /**
     * keydown handler for the parent element
     * @param event - keyboard event
     * @returns - should bubble
     * @public
     */
    public handleKeydown(event: KeyboardEvent): boolean {
        const { target } = event;
        if (!this.focusItems.find(item => item === target)) {
            if (event.key === keyTab) {
                event.preventDefault();
                this.focusItems.find(e => e.getAttribute("tabindex") == "0")?.focus();
                return false;
            }
            return true;
        }
        const current: number = this.focusItems.findIndex(
            (item: HTMLElement) => parseInt(item.getAttribute("tabindex") || "-1") >= 0
        );
        const position = this.positions[current];
        const moveToIndex = (next): boolean => {
            if (this.options.bubble === false) {
                event.preventDefault();
            }
            this.focusItems[current].setAttribute("tabindex", "-1");
            this.focusItems[next].setAttribute("tabindex", "0");
            this.focusItems[next].focus();
            if (next !== current) {
                this.source.$emit("focuschanged");
            }
            return !!this.options.bubble;
        };

        switch (event.key) {
            case keyArrowUp:
                return moveToIndex(position.up.index);
            case keyArrowRight:
                return moveToIndex(position.right.index);
            case keyArrowDown:
                return moveToIndex(position.down.index);
            case keyArrowLeft:
                return moveToIndex(position.left.index);
            case keyHome:
                return moveToIndex(this.firstElement.index);
            case keyEnd:
                return moveToIndex(this.lastElement.index);
            case keyPageDown:
                return moveToIndex(position.bottom.index);
            case keyPageUp:
                return moveToIndex(position.top.index);
        }

        return true;
    }
}

/**
 * A directive that adds keyboard interactions for focusable elements
 * @param options - Wrap options
 * @public
 */
export function focusgroup<T = any>(options: FocusgroupBehaviorOptions): CaptureType<T> {
    return new AttachedBehaviorHTMLDirective(
        "fast-focusgroup",
        FocusgroupBehavior,
        options
    );
}
