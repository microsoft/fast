import { getApiSupport, APIName } from '../';

export default class ContextMenuApi {
    /**
     * Remove a context menu by id
     */
    remove(menuId: string) {
        switch (getApiSupport()) {
            case APIName.chrome:
                chrome.contextMenus.remove(menuId);
                break;
            case APIName.browser:
                browser.contextMenus.remove(menuId);
                break;
        }
    }

    /**
     * Create a context menu item
     */
    create(createProperties: chrome.contextMenus.CreateProperties, callback?: () => void): string {
        switch (getApiSupport()) {
            case APIName.chrome:
                return chrome.contextMenus.create(createProperties, callback) as any;
            case APIName.browser:
                return chrome.contextMenus.create(createProperties, callback) as any;
        }
    } 
}
