import { ContextMenuItemConfig } from "./contextMenu";
import { menuItemClickEvent } from "./config";

/**
 * Subscribe to messages from background scripts
 */
chrome.runtime.onMessage.addListener(
    (menuItem: ContextMenuItemConfig, sender: any, sendResponse: any) => {
        const e: CustomEvent = new CustomEvent(menuItemClickEvent, {
            detail: menuItem
        });
        window.dispatchEvent(e);
    }
);
