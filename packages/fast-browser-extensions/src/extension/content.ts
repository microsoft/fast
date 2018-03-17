import { IContextMenuItem } from "./contextMenu";
import { menuItemClickEvent } from "./config";

/**
 * Subscribe to messages from background scripts
 */
chrome.runtime.onMessage.addListener((menuItem: IContextMenuItem, sender, sendResponse) => {
    const e = new CustomEvent(menuItemClickEvent, { detail: menuItem });
    window.dispatchEvent(e);
});
