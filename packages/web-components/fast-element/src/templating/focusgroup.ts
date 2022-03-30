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
import { isTabbable } from "tabbable";
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
    autofocus?: boolean;
}

export type DirectionData = {
    index: number;
    horizontal?: {
        overlap?: number;
        offset?: number;
    };
    vertical?: {
        overlap?: number;
        offset?: number;
    };
    distance?: number;
    radians?: number;
};

export type DirectionGuide = {
    up: DirectionData;
    right: DirectionData;
    down: DirectionData;
    left: DirectionData;
    top: DirectionData;
    bottom: DirectionData;
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
                autofocus: true,
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
            isTabbable(node) ||
            !!node.$fastController?.definition.shadowOptions?.delegatesFocus ||
            node.hasAttribute("tabindex");
        const getFocused = (node: Element | Element[]): Array<HTMLElement> =>
            Array.isArray(node)
                ? (node.map(getFocused).filter(el => el !== null) as any).flat()
                : isFocusElement(node)
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
        console.log({
            positions: this.positions,
            focusItems: this.focusItems,
            target: this.target,
            tabindex: this.target.getAttribute("tabindex"),
            host: (this.target.parentNode as any).host,
            behaviors: (this.target.parentNode as any).host?.$fastController?.behaviors,
        });
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
        console.log({ source, context, tabindex: source.tabIndex });
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
                    const minDifference = (a: number[], b: number[]): number =>
                        Math.min(
                            ...(a.map(c => b.map(d => Math.abs(d - c))) as any).flat()
                        );
                    data.context = compare => {
                        const dx = minDifference(
                            [data.x, data.x2],
                            [compare.x, compare.x2]
                        );
                        const dy = minDifference(
                            [data.y, data.y2],
                            [compare.y, compare.y2]
                        );
                        const center = (d: any): any => ({
                            x: d.x + (d.x2 - d.x) / 2,
                            y: d.y + (d.y2 - d.y) / 2,
                        });
                        const dcenter = center(data);
                        const ccenter = center(compare);
                        return {
                            horizontal: {
                                overlap: overlap(data, compare, "y"),
                            },
                            vertical: {
                                overlap: overlap(data, compare),
                            },
                            distance: Math.hypot(dx, dy),
                            radians:
                                Math.atan2(dcenter.y - ccenter.y, dcenter.x - ccenter.x) /
                                Math.PI,
                        };
                    };
                    return data;
                }
            )
            .map((child: dataStruct, index: number, areas: dataStruct[]) =>
                areas.reduce(
                    (directions: DirectionGuide, child2: dataStruct, ci: number) => {
                        if (ci !== index) {
                            const context = Object.assign(
                                {},
                                { index: ci },
                                child.context(child2)
                            );
                            const sides = {
                                vertical: {
                                    up: {
                                        match: r => r > 0 && r < 1,
                                    },
                                    down: {
                                        match: r => r < 0 && r > -1,
                                    },
                                },
                                horizontal: {
                                    left: {
                                        match: r => Math.abs(r) < 0.5,
                                    },
                                    right: {
                                        match: r => Math.abs(r) > 0.5,
                                    },
                                },
                            };
                            for (const axisKey in sides) {
                                const axis = sides[axisKey];
                                for (const sideKey in axis) {
                                    const side = axis[sideKey];
                                    const dside = directions[sideKey];
                                    if (side.match(context.radians)) {
                                        if (
                                            dside.distance === undefined ||
                                            !side.match(dside.radians) ||
                                            dside.distance > context.distance
                                        ) {
                                            directions[sideKey] = context;
                                        }
                                        if (context.vertical.overlap > 0) {
                                            if (
                                                sideKey === "up" &&
                                                side.match(context.radians) &&
                                                (directions.top.distance === undefined ||
                                                    directions.top.distance <
                                                        context.distance)
                                            ) {
                                                directions.top = context;
                                            }
                                            if (
                                                sideKey === "down" &&
                                                (directions.bottom.distance ===
                                                    undefined ||
                                                    directions.bottom.distance <
                                                        context.distance)
                                            ) {
                                                directions.bottom = context;
                                            }
                                        }
                                    } else {
                                        if (
                                            (this.options.wrap === "both" ||
                                                this.options.wrap === axisKey) &&
                                            context[axisKey].overlap > 0 &&
                                            (directions[sideKey].distance === undefined ||
                                                (!side.match(
                                                    directions[sideKey].radians
                                                ) &&
                                                    directions[sideKey].distance <=
                                                        context.distance))
                                        ) {
                                            directions[sideKey] = context;
                                        }
                                    }
                                }
                            }
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
