import { Direction } from "@microsoft/fast-web-utilities";
/**
 * a method to determine the current localization direction of the view
 * @param rootNode - the HTMLElement to begin the query from, usually "this" when used in a component controller
 * @public
 */
export declare const getDirection: (rootNode: HTMLElement) => Direction;
