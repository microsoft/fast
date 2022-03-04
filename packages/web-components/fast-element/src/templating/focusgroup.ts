import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
} from "@microsoft/fast-web-utilities";
import { AttachedBehaviorHTMLDirective, ExecutionContext } from "..";
import type { Behavior } from "../observation/behavior";
import type { CaptureType } from "./template";

/**
 * The options used to configure focusgroups
 * @public
 */
export interface FocusgroupBehaviorOptions {
    wrap?: "none" | "both" | "vertical" | "horizontal";
}

/**
 * Focusgroup behavior
 * Handles keyboard arrowing inside a focusgroup
 * @public
 */
export class FocusgroupBehavior implements Behavior {
    public constructor(
        private target: HTMLElement,
        private options: FocusgroupBehaviorOptions
    ) {}

    private focusItems: HTMLElement[];

    private positions: {
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
    }[];

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
            ].find(type => {
                if (node instanceof type) {
                    node.setAttribute("tabindex", "-1");
                    return true;
                }
                return false;
            });
        const getFocused = (node: Element | Element[]): Array<HTMLElement> =>
            Array.isArray(node)
                ? (node.map(getFocused).filter(el => el !== null) as any).flat()
                : node.hasAttribute("tabindex") || isFocusElement(node)
                ? node
                : node.children.length > 0
                ? (getFocused(Array.from(node.children)) as any).flat()
                : null;
        return getFocused(Array.from(node.children))
            .sort((a: HTMLElement, b: HTMLElement) => {
                return (
                    parseInt(b.getAttribute("tabindex") as any) -
                    parseInt(a.getAttribute("tabindex") as any)
                );
            })
            .map((item, index) => {
                item.setAttribute("tabindex", index ? "-1" : "0");
                if (index === 0) {
                    (item as HTMLElement).focus();
                }
                return item as HTMLElement;
            });
    }

    /**
     * Behavior bind implementation
     * @param source - source class
     * @param context - execution context
     * @public
     */
    public bind(source: any, context: ExecutionContext): void {
        this.target.setAttribute("tabindex", "0");
        this.target.addEventListener("focus", e => {
            if (!this.positions) {
                this.setPositions(this.options.wrap);
            }
        });

        this.target.addEventListener("keydown", this.handleKeydown.bind(this));
    }

    /**
     * Behavior unbind implementation
     * @public
     */
    public unbind(): void {
        this.target.removeEventListener("keydown", this.handleKeydown);
    }

    /**
     * Sets positioning data for arrowing
     * @param wrap - should wrap vertical, horizontal, both or none
     * @public
     */
    public setPositions(wrap): void {
        this.focusItems = this.getFocusItems();

        const itemNav = this.focusItems
            .map((child: HTMLElement) => {
                const overlap = (a, b, axis = "x"): number =>
                    Math.min(a[`${axis}2`], b[`${axis}2`]) - Math.max(a[axis], b[axis]);
                const offset = (a, b, axis = "x"): number =>
                    a[axis] > b[axis] ? b[`${axis}2`] - a[axis] : b[axis] - a[`${axis}2`];
                const { offsetWidth, offsetHeight, offsetLeft: x, offsetTop: y } = child;
                type dataStruct = {
                    x: number;
                    y: number;
                    x2: number;
                    y2: number;
                    context?: any;
                };
                const data: dataStruct = {
                    x,
                    y,
                    x2: x + offsetWidth,
                    y2: y + offsetHeight,
                };
                data.context = compare => ({
                    x: {
                        overlap: overlap(data, compare, "y"),
                        offset: offset(data, compare),
                    },
                    y: {
                        overlap: overlap(data, compare),
                        offset: offset(data, compare, "y"),
                    },
                });
                return data;
            })
            .map((child, index, areas) =>
                areas.reduce(
                    (directions, child2, ci) => {
                        if (ci !== index) {
                            const context = child.context(child2);
                            ["x", "y"].forEach(axis => {
                                const { overlap, offset } = context[axis];
                                if (overlap > 0) {
                                    const sides = {
                                        x: { false: "left", true: "right" },
                                        y: { false: "up", true: "down" },
                                    };
                                    const side = sides[axis][offset >= 0];
                                    const opposite = sides[axis][offset < 0];
                                    const dside = directions[side];
                                    const oside = directions[opposite];
                                    if (
                                        !dside.offset ||
                                        sides[axis][dside.offset >= 0] !== side ||
                                        Math.abs(offset) < Math.abs(dside.offset) ||
                                        (Math.abs(offset) === Math.abs(dside.offset) &&
                                            overlap > dside.overlap)
                                    ) {
                                        directions[side] = Object.assign(
                                            {},
                                            { index: ci },
                                            context[axis]
                                        );
                                    }
                                    if (
                                        ((wrap === "both" ||
                                            (axis === "x" && wrap === "horizontal") ||
                                            (axis === "y" && wrap === "vertical")) &&
                                            !oside.offset) ||
                                        (opposite === sides[axis][oside.offset < 0] &&
                                            Math.abs(oside.offset) < Math.abs(offset))
                                    ) {
                                        directions[opposite] = Object.assign(
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
                    { up: { index }, right: { index }, down: { index }, left: { index } }
                )
            );

        this.positions = itemNav;
    }

    /**
     * keydown handler for the parent element
     * @param event - keyboard event
     * @returns - should bubble
     * @public
     */
    public handleKeydown(event: KeyboardEvent): boolean {
        const current = this.focusItems.findIndex(
            (item: HTMLElement) => parseInt(item.getAttribute("tabindex") || "-1") >= 0
        );
        const position = this.positions[current];
        const moveToIndex = (next): boolean => {
            event.preventDefault();
            this.focusItems[current].setAttribute("tabindex", "-1");
            this.focusItems[next].setAttribute("tabindex", "0");
            this.focusItems[next].focus();
            return true;
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
            default:
                return true;
        }
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
