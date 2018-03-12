import ContextMenuApi from './ContextMenuApi';
import TabsApi from './TabsApi';
import RuntimeApi from './RuntimeApi';

class ExtensionApi {
    contextMenus = new ContextMenuApi();
    tabs = new TabsApi();
    runtime = new RuntimeApi();
}

export default new ExtensionApi();

/**
 * Describe the browser-level API objects
 */
export enum APIName {
    chrome = 'chrome',
    browser = 'browser'
}

export function getApiSupport(): APIName {
    for (let key in APIName) {
        if (key in window) {
            return APIName[key] as APIName;
        }
    }
}
