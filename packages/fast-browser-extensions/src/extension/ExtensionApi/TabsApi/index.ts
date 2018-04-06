import { APIName, getApiSupport } from "../";

/**
 * Wrap tab api
 */
export default class TabsApi {
    /**
     * Tab query wrapper
     */
    public query(queryInfo: chrome.tabs.QueryInfo, callback?: (results: chrome.tabs.Tab[]) => void): void {
        switch (getApiSupport()) {
            case APIName.chrome:
                chrome.tabs.query(queryInfo, callback);
                break;
            case APIName.browser:
                browser.tabs.query(queryInfo).then(callback, (error: Error) => {
                    throw error;
                });
                break;

        }
    }

    /**
     * Tab sendMessage wrapper
     */
    public sendMessage(tabId: number, message: any): void {
        switch (getApiSupport()) {
            case APIName.chrome:
                chrome.tabs.sendMessage(tabId, message);
                break;
            case APIName.browser:
                browser.tabs.sendMessage(tabId, message);
                break;
        }
    }
}
