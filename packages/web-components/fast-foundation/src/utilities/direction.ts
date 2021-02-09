import { Direction } from "@microsoft/fast-web-utilities";

/**
 * a method to determine the current localization direction of the view
 * @param rootNode - the HTMLElement to begin the query from, usually "this" when used in a component controller
 * @public
 */

export const getDirection = (rootNode: HTMLElement): Direction => {
    const dirNode: HTMLElement | null = rootNode.closest("[dir]");
    return dirNode !== null && dirNode.dir === "rtl" ? Direction.rtl : Direction.ltr;
};
