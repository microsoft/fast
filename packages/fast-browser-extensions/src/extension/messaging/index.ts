import { IContextMenus, IContextMenuItem } from "../contextMenu";
import { extensionId, menuItemClickEvent } from "../config";

export type CREATE_MENUS_MESSAGE = "MESSAGE::CREATE_MENUS";
export const CREATE_MENUS_MESSAGE: CREATE_MENUS_MESSAGE = "MESSAGE::CREATE_MENUS";

/**
 * Message to create a new menu system
 */
export interface ICreateMessage {
    /**
     * The type of message
     */
    type: CREATE_MENUS_MESSAGE;

    /**
     * The message data
     */
    data: IContextMenus;
}

/**
 * Aggregate all message types into one type
 */
export type CreateMessage = ICreateMessage;

/**
 * Supported themes
 */
export const themes: string[] = ["Theme default", "Theme alt"];

/**
 * Supported regions
 */
export const regions: string[] = [
    "Arabic",
    "Hebrew",
    "Armenian",
    "Chinese-simplified",
    "Chinese-traditional",
    "Cyrillic",
    "East-european",
    "Georgian",
    "Greek",
    "Indian",
    "Japanese",
    "Korean",
    "Thai",
    "Vietnamese",
    "West-european"
];

/**
 * Subscribe to menu item click events
 */
export function onMenuItemClick(callback: (e: Event) => void): void {
    window.addEventListener(menuItemClickEvent, callback);
}

/**
 * Communicates from a client to the browser extension that a new menu system should be created
 */
export function createContextMenus(config: IContextMenus): void {
    const data: ICreateMessage = {
        type: CREATE_MENUS_MESSAGE,
        data: config
    };

    // TODO #160: create x-browser version of this using extension api
    chrome.runtime.sendMessage(extensionId, data);
}
